// Minimal Express server to proxy chat requests to an OpenAI-compatible API
// Uses: OPENAI_API_KEY, OPENAI_BASE_URL (optional), OPENAI_MODEL

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fetch } = require('undici');
const path = require('path');
const { BedrockRuntimeClient, InvokeModelCommand, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

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
