// Minimal Express server to proxy chat requests to an OpenAI-compatible API
// Uses: OPENAI_API_KEY, OPENAI_BASE_URL (optional), OPENAI_MODEL

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fetch } = require('undici');
const path = require('path');
const { BedrockRuntimeClient, InvokeModelCommand, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
const { createClient } = require('@supabase/supabase-js');

// Ensure we always load the .env from the project root, even if run from a subfolder
const rootEnvPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: rootEnvPath });
if (result.error) {
  // Fallback to default lookup (in case user actually placed .env elsewhere)
  dotenv.config();
}
console.log('[ENV] Loaded .env from:', rootEnvPath);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Supabase server client (service role for server-side operations)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
let supabaseServer = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
  supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
} else {
  console.warn('[Supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE is not set. /api/activity-agent will be unavailable.');
}

// Create activity and guided plans per student for a class
app.post('/api/activity-agent', async (req, res) => {
  try {
    const {
      id_clase,
      titulo,
      objetivo,
      nivel_taxonomia,
      tipo_recurso,
      complejidad,
      contexto,
    } = req.body || {};

    // Basic validation
    if (!id_clase || !titulo || !objetivo || !nivel_taxonomia || !tipo_recurso || !complejidad) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['id_clase', 'titulo', 'objetivo', 'nivel_taxonomia', 'tipo_recurso', 'complejidad'],
      });
    }

    // If N8N webhook is configured, forward the request and return its response
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nUrl) {
      try {
        const resp = await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_clase,
            titulo,
            objetivo,
            nivel_taxonomia,
            tipo_recurso,
            complejidad,
            contexto: contexto || '',
          }),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          return res.status(resp.status).json({ error: 'n8n error', details: json });
        }
        return res.status(200).json(json);
      } catch (err) {
        console.error('[activity-agent][n8n proxy] error', err);
        return res.status(502).json({ error: 'Failed to reach n8n webhook' });
      }
    }

    if (!supabaseServer) {
      return res.status(500).json({ error: 'Supabase server credentials not configured' });
    }

    // 1) Insert actividad base
    const { data: actIns, error: actErr } = await supabaseServer
      .from('actividades')
      .insert({ id_clase, titulo, objetivo, nivel_taxonomia, tipo_recurso, complejidad })
      .select('id_actividad')
      .single();
    if (actErr) {
      console.error('[activity-agent] insert actividades error', actErr);
      return res.status(500).json({ error: 'Failed to create activity', details: String(actErr.message || actErr) });
    }
    const id_actividad = actIns.id_actividad;

    // 2) Fetch students in class
    const { data: enrolls, error: enrErr } = await supabaseServer
      .from('clase_estudiante')
      .select('id_estudiante')
      .eq('id_clase', id_clase);
    if (enrErr) {
      console.error('[activity-agent] select clase_estudiante error', enrErr);
      return res.status(500).json({ error: 'Failed to load class enrollments', details: String(enrErr.message || enrErr) });
    }
    const studentIds = (enrolls || []).map((r) => r.id_estudiante);

    // 3) Load learning styles for those students (two-step to avoid relation-name issues)
    let estiloPorEst = {};
    if (studentIds.length === 0) {
      // No students: create empty stats and return early with only the activity created
      return res.json({
        activity: { id_actividad, titulo },
        stats: { estudiantes: 0, planes_creados: 0 },
        por_estilo: {
          visual: { estudiantes: 0 },
          auditory: { estudiantes: 0 },
          kinesthetic: { estudiantes: 0 },
          desconocido: { estudiantes: 0 },
        },
      });
    }

    // Step 3a: perfiles -> id_estudiante, id_estilo_principal
    const { data: perfiles, error: perfErr } = await supabaseServer
      .from('perfil_aprendizaje_estudiante')
      .select('id_estudiante, id_estilo_principal')
      .in('id_estudiante', studentIds);
    if (perfErr) {
      console.error('[activity-agent] select perfil_aprendizaje_estudiante error', perfErr);
      return res.status(500).json({ error: 'Failed to load learning profiles', details: String(perfErr.message || perfErr) });
    }

    const estiloIds = Array.from(new Set((perfiles || []).map((p) => p.id_estilo_principal).filter(Boolean)));

    // Step 3b: estilos -> id_estilo, nombre
    let idToNombre = {};
    if (estiloIds.length > 0) {
      const { data: estilos, error: estErr } = await supabaseServer
        .from('estilos_aprendizaje')
        .select('id_estilo, nombre')
        .in('id_estilo', estiloIds);
      if (estErr) {
        console.error('[activity-agent] select estilos_aprendizaje error', estErr);
        return res.status(500).json({ error: 'Failed to load learning styles', details: String(estErr.message || estErr) });
      }
      idToNombre = Object.fromEntries((estilos || []).map((e) => [e.id_estilo, e.nombre]));
    }

    estiloPorEst = Object.fromEntries(studentIds.map((id) => [id, null]));
    for (const p of perfiles || []) {
      const nombre = idToNombre[p.id_estilo_principal] || null;
      estiloPorEst[p.id_estudiante] = nombre;
    }

    // 4) Initialize guided plan per student using RPC iniciar_plan_guiado
    let planesCreados = 0;
    const stats = { visual: 0, auditory: 0, kinesthetic: 0, desconocido: 0 };
    for (const sid of studentIds) {
      const estilo = estiloPorEst[sid] || null;
      const { data: planId, error: planErr } = await supabaseServer.rpc('iniciar_plan_guiado', {
        p_id_actividad: id_actividad,
        p_id_estudiante: sid,
        p_estilo: estilo,
      });
      if (planErr) {
        console.error('[activity-agent] rpc iniciar_plan_guiado error', { sid, planErr });
        return res.status(500).json({ error: 'Failed to initialize guided plan', details: String(planErr.message || planErr) });
      }
      planesCreados++;
      const key = estilo === 'visual' || estilo === 'auditory' || estilo === 'kinesthetic' ? estilo : 'desconocido';
      // @ts-ignore
      stats[key] = (stats[key] || 0) + 1;
    }

    // 5) Respond
    return res.json({
      activity: { id_actividad, titulo },
      stats: { estudiantes: studentIds.length, planes_creados: planesCreados },
      por_estilo: {
        visual: { estudiantes: stats.visual },
        auditory: { estudiantes: stats.auditory },
        kinesthetic: { estudiantes: stats.kinesthetic },
        desconocido: { estudiantes: stats.desconocido },
      },
    });
  } catch (err) {
    console.error('[activity-agent] unexpected error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    if ((process.env.PROVIDER || 'openai') === 'bedrock') {
      const region = process.env.AWS_REGION || 'us-east-1';
      const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v1:0';

      const systemMsg = messages.find((m) => m.role === 'system')?.content;
      const nonSystem = messages.filter((m) => m.role !== 'system');

      const client = new BedrockRuntimeClient({ region });

      // Use Converse API for AI21 Jamba models
      if (modelId.startsWith('ai21.')) {
        const convMessages = [];
        if (systemMsg) {
          convMessages.push({ role: 'system', content: [{ text: systemMsg }] });
        }
        for (const m of nonSystem) {
          const role = m.role === 'assistant' ? 'assistant' : 'user';
          convMessages.push({ role, content: [{ text: m.content }] });
        }
        try {
          const command = new ConverseCommand({
            modelId,
            messages: convMessages,
            inferenceConfig: { maxTokens: 512, temperature: 0.7 },
          });
          const response = await client.send(command);
          const content = response?.output?.message?.content?.[0]?.text || '';
          return res.json({ content });
        } catch (e) {
          console.error('[CHAT][Upstream error]', { provider: 'bedrock', api: 'converse', modelId, region, details: String(e) });
          return res.status(502).json({ error: 'Upstream error', details: String(e) });
        }
      }

      // Use Titan Text schema for Amazon Titan models
      if (modelId.startsWith('amazon.titan-')) {
        // Build a single prompt by concatenating conversation
        // You can customize this prompt template as needed
        const parts = [];
        if (systemMsg) parts.push(`System: ${systemMsg}`);
        for (const m of nonSystem) {
          const role = m.role === 'assistant' ? 'Assistant' : 'User';
          parts.push(`${role}: ${m.content}`);
        }
        parts.push('Assistant:');
        const inputText = parts.join('\n');

        const titanBody = {
          inputText,
          textGenerationConfig: {
            temperature: 0.7,
            maxTokenCount: 512,
            topP: 0.9,
            stopSequences: []
          }
        };

        try {
          const command = new InvokeModelCommand({
            modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(titanBody),
          });
          const response = await client.send(command);
          const json = JSON.parse(new TextDecoder().decode(response.body));
          const content = json?.results?.[0]?.outputText || '';
          return res.json({ content });
        } catch (e) {
          console.error('[CHAT][Upstream error]', { provider: 'bedrock', api: 'invoke', modelId, region, details: String(e) });
          return res.status(502).json({ error: 'Upstream error', details: String(e) });
        }
      }

      // Default to Anthropic Claude schema for other Bedrock models
      const convo = nonSystem.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: [{ type: 'text', text: m.content }],
      }));
      const body = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 512,
        temperature: 0.7,
        system: systemMsg,
        messages: convo,
      };

      try {
        const command = new InvokeModelCommand({
          modelId,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify(body),
        });
        const response = await client.send(command);
        const json = JSON.parse(new TextDecoder().decode(response.body));
        const content = json?.content?.[0]?.text || '';
        return res.json({ content });
      } catch (e) {
        console.error('[CHAT][Upstream error]', { provider: 'bedrock', modelId, region, details: String(e) });
        return res.status(502).json({ error: 'Upstream error', details: String(e) });
      }
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

      if (!apiKey) {
        console.error('[CHAT] Missing OPENAI_API_KEY. Check your .env at project root.');
        return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
      if (process.env.OPENAI_ORG_ID) headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;
      if (process.env.OPENAI_PROJECT) headers['OpenAI-Project'] = process.env.OPENAI_PROJECT;

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('[CHAT][Upstream error]', {
          status: response.status,
          baseUrl,
          model,
          details: text,
        });
        return res.status(response.status).json({ error: 'Upstream error', details: text });
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || '';
      return res.json({ content });
    }
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
