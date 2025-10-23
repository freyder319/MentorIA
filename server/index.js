// Minimal Express server using MCP (Model Context Protocol)
// All AI functionality handled by internal MCP agents

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { fetch } = require("undici");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const MCP = require("./mcp");
const A2AAgent = require("./a2a-agent");

// Ensure we always load the .env from the project root, even if run from a subfolder
const rootEnvPath = path.resolve(__dirname, "../.env");
const result = dotenv.config({ path: rootEnvPath });
if (result.error) {
  // Fallback to default lookup (in case user actually placed .env elsewhere)
  dotenv.config();
}
console.log("[ENV] Loaded .env from:", rootEnvPath);

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files from dist directory (Vite build output)
app.use(express.static(path.join(__dirname, "../dist")));

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MCP and A2A Agent
const mcp = new MCP();
const a2aAgent = new A2AAgent(mcp);

// Register agents with MCP
mcp.registerAgent("student-agent", {
  type: "student",
  capabilities: [
    "argument_analysis",
    "feedback_generation",
    "micro_challenges",
  ],
});

mcp.registerAgent("teacher-agent", {
  type: "teacher",
  capabilities: [
    "activity_generation",
    "inclusive_design",
    "adaptation_creation",
  ],
});

mcp.registerAgent("a2a-agent", {
  type: "a2a",
  capabilities: [
    "argument_analysis",
    "critical_thinking",
    "feedback_generation",
  ],
});

mcp.registerAgent("analysis-agent", {
  type: "analysis",
  capabilities: ["deep_analysis", "progress_tracking", "metrics_calculation"],
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Supabase server client (service role for server-side operations)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
let supabaseServer = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
  supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
} else {
  console.warn(
    "[Supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE is not set. /api/activity-agent will be unavailable."
  );
}

// Create activity and guided plans per student for a class
app.post("/api/activity-agent", async (req, res) => {
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
    if (
      !id_clase ||
      !titulo ||
      !objetivo ||
      !nivel_taxonomia ||
      !tipo_recurso ||
      !complejidad
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "id_clase",
          "titulo",
          "objetivo",
          "nivel_taxonomia",
          "tipo_recurso",
          "complejidad",
        ],
      });
    }

    // If N8N webhook is configured, forward the request and return its response
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nUrl) {
      try {
        const resp = await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_clase,
            titulo,
            objetivo,
            nivel_taxonomia,
            tipo_recurso,
            complejidad,
            contexto: contexto || "",
          }),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          return res
            .status(resp.status)
            .json({ error: "n8n error", details: json });
        }
        return res.status(200).json(json);
      } catch (err) {
        console.error("[activity-agent][n8n proxy] error", err);
        return res.status(502).json({ error: "Failed to reach n8n webhook" });
      }
    }

    if (!supabaseServer) {
      return res
        .status(500)
        .json({ error: "Supabase server credentials not configured" });
    }

    // 1) Insert actividad base
    const { data: actIns, error: actErr } = await supabaseServer
      .from("actividades")
      .insert({
        id_clase,
        titulo,
        objetivo,
        nivel_taxonomia,
        tipo_recurso,
        complejidad,
      })
      .select("id_actividad")
      .single();
    if (actErr) {
      console.error("[activity-agent] insert actividades error", actErr);
      return res.status(500).json({
        error: "Failed to create activity",
        details: String(actErr.message || actErr),
      });
    }
    const id_actividad = actIns.id_actividad;

    // 2) Fetch students in class
    const { data: enrolls, error: enrErr } = await supabaseServer
      .from("clase_estudiante")
      .select("id_estudiante")
      .eq("id_clase", id_clase);
    if (enrErr) {
      console.error("[activity-agent] select clase_estudiante error", enrErr);
      return res.status(500).json({
        error: "Failed to load class enrollments",
        details: String(enrErr.message || enrErr),
      });
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
      .from("perfil_aprendizaje_estudiante")
      .select("id_estudiante, id_estilo_principal")
      .in("id_estudiante", studentIds);
    if (perfErr) {
      console.error(
        "[activity-agent] select perfil_aprendizaje_estudiante error",
        perfErr
      );
      return res.status(500).json({
        error: "Failed to load learning profiles",
        details: String(perfErr.message || perfErr),
      });
    }

    const estiloIds = Array.from(
      new Set(
        (perfiles || []).map((p) => p.id_estilo_principal).filter(Boolean)
      )
    );

    // Step 3b: estilos -> id_estilo, nombre
    let idToNombre = {};
    if (estiloIds.length > 0) {
      const { data: estilos, error: estErr } = await supabaseServer
        .from("estilos_aprendizaje")
        .select("id_estilo, nombre")
        .in("id_estilo", estiloIds);
      if (estErr) {
        console.error(
          "[activity-agent] select estilos_aprendizaje error",
          estErr
        );
        return res.status(500).json({
          error: "Failed to load learning styles",
          details: String(estErr.message || estErr),
        });
      }
      idToNombre = Object.fromEntries(
        (estilos || []).map((e) => [e.id_estilo, e.nombre])
      );
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
      const { data: planId, error: planErr } = await supabaseServer.rpc(
        "iniciar_plan_guiado",
        {
          p_id_actividad: id_actividad,
          p_id_estudiante: sid,
          p_estilo: estilo,
        }
      );
      if (planErr) {
        console.error("[activity-agent] rpc iniciar_plan_guiado error", {
          sid,
          planErr,
        });
        return res.status(500).json({
          error: "Failed to initialize guided plan",
          details: String(planErr.message || planErr),
        });
      }
      planesCreados++;
      const key =
        estilo === "visual" || estilo === "auditory" || estilo === "kinesthetic"
          ? estilo
          : "desconocido";
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
    console.error("[activity-agent] unexpected error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Modo demo - respuestas simuladas
    if ((process.env.PROVIDER || "openai") === "demo") {
      const lastMessage = messages[messages.length - 1]?.content || "";

      // Respuestas simuladas según el contenido
      let response = "Hola! Soy MentorIA en modo demo. ";

      if (
        lastMessage.toLowerCase().includes("argumento") ||
        lastMessage.toLowerCase().includes("creo que")
      ) {
        response +=
          "He detectado que quieres analizar un argumento. En modo demo, te sugiero: 1) Identificar tu tesis principal, 2) Listar 2-3 evidencias que la respalden, 3) Considerar contraargumentos. ¿Te gustaría que profundice en alguno de estos puntos?";
      } else if (
        lastMessage.toLowerCase().includes("actividad") ||
        lastMessage.toLowerCase().includes("ejercicio")
      ) {
        response +=
          "Para crear una actividad inclusiva, considera: 1) Objetivos claros, 2) Adaptaciones por estilo de aprendizaje (visual, auditivo, kinestésico), 3) Evaluación formativa. ¿Qué tema te interesa desarrollar?";
      } else {
        response +=
          "Puedo ayudarte con análisis de argumentos, creación de actividades inclusivas, y seguimiento de progreso cognitivo. ¿En qué te gustaría trabajar?";
      }

      return res.json({ content: response });
    }

    // Sistema socrático para MentorIA
    const systemPrompt = `Eres MentorIA, un asistente educativo especializado en desarrollar pensamiento crítico y análisis de argumentos.

REGLAS FUNDAMENTALES:
1. SIEMPRE responde la pregunta del estudiante de manera educativa y útil.
2. Si el estudiante pide "hazme", "resuélveme", "dame la respuesta", responde: "No puedo hacer tu tarea, pero puedo guiarte para que la hagas tú mismo. ¿Qué parte específica te gustaría explorar?"
3. Usa preguntas socráticas para profundizar el aprendizaje DESPUÉS de responder.
4. Detecta cuando el estudiante presenta un argumento y analiza su estructura.
5. Fomenta el pensamiento crítico y la reflexión profunda.

EJEMPLOS DE RESPUESTAS CORRECTAS:
- Pregunta: "¿Qué es una función?"
  Respuesta: "Una función es una relación entre dos conjuntos donde cada elemento del primer conjunto se relaciona con exactamente un elemento del segundo conjunto. En matemáticas, es como una 'máquina' que toma una entrada y produce una salida. ¿Te gustaría que exploremos algún ejemplo específico o tienes alguna aplicación en mente?"

- Pregunta: "Hazme el resumen"
  Respuesta: "No puedo hacer tu resumen, pero puedo guiarte para que lo hagas tú mismo. ¿Qué parte del tema te parece más importante? ¿Has identificado las ideas principales?"

OBJETIVO: Educar y desarrollar pensamiento independiente y crítico en el estudiante.`;

    // Ensure system message is present
    const systemMsg = messages.find((m) => m.role === "system")?.content || systemPrompt;
    const messagesWithSystem = messages.some(m => m.role === "system") 
      ? messages 
      : [{ role: "system", content: systemPrompt }, ...messages];

    // Use OpenAI API
      const apiKey = process.env.OPENAI_API_KEY;
      const baseUrl =
        process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

      if (!apiKey) {
        console.error(
          "[CHAT] Missing OPENAI_API_KEY. Check your .env at project root."
        );
        return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      if (process.env.OPENAI_ORG_ID)
        headers["OpenAI-Organization"] = process.env.OPENAI_ORG_ID;
      if (process.env.OPENAI_PROJECT)
        headers["OpenAI-Project"] = process.env.OPENAI_PROJECT;

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: messagesWithSystem,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("[CHAT][Upstream error]", {
          status: response.status,
          baseUrl,
          model,
          details: text,
        });
        return res
          .status(response.status)
          .json({ error: "Upstream error", details: text });
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || "";
      return res.json({ content });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/insights", async (req, res) => {
  try {
    const payload = req.body || {};

    // Store insights in Supabase if available
    if (supabaseServer && payload.studentText) {
      const { data, error } = await supabaseServer
        .from("interacciones_ia")
        .insert({
          id_estudiante: payload.studentId || null,
          rol: "Estudiante",
          mensaje: payload.studentText,
          estilo_aprendizaje: payload.learningStyle || null,
        });

      if (error) {
        console.error("[insights] Supabase insert error:", error);
      }
    }

    return res.status(200).json({ ok: true, received: payload });
  } catch (e) {
    console.error("[insights] Error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// New endpoint for argument analysis using A2A agent
app.post("/api/analyze-argument", async (req, res) => {
  try {
    const { studentText, sessionId, context } = req.body || {};

    if (!studentText) {
      return res.status(400).json({ error: "studentText is required" });
    }

    // Set context in MCP
    if (sessionId) {
      mcp.setContext(sessionId, {
        ...context,
        studentText: studentText,
        timestamp: Date.now(),
      });
    }

    // Use A2A agent to analyze the argument
    const analysis = await a2aAgent.analyzeArgument(studentText, {
      sessionId: sessionId || "default",
      ...context,
    });

    // Store analysis in Supabase if available
    if (supabaseServer && sessionId) {
      try {
        const { error } = await supabaseServer.from("interacciones_ia").insert({
          id_estudiante: context?.studentId || null,
          rol: "AgenteIA",
          mensaje: JSON.stringify(analysis),
          estilo_aprendizaje: context?.learningStyle || null,
        });

        if (error) {
          console.error("[analyze-argument] Supabase insert error:", error);
        }
      } catch (dbError) {
        console.error("[analyze-argument] Database error:", dbError);
      }
    }

    return res.status(200).json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error("[analyze-argument] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// New endpoint for generating inclusive activities
app.post("/api/generate-inclusive-activity", async (req, res) => {
  try {
    const {
      topic,
      objectives,
      learningStyles,
      inclusionNeeds,
      complexity,
      sessionId,
    } = req.body || {};

    if (!topic || !objectives) {
      return res.status(400).json({
        error: "topic and objectives are required",
      });
    }

    // Set context in MCP
    if (sessionId) {
      mcp.setContext(sessionId, {
        topic,
        objectives,
        learningStyles: learningStyles || [],
        inclusionNeeds: inclusionNeeds || [],
        complexity: complexity || "medium",
        timestamp: Date.now(),
      });
    }

    // Use MCP to communicate with teacher agent
    const response = await mcp.sendMessage(
      "system",
      "teacher-agent",
      {
        type: "generate_activity",
        requirements: {
          topic,
          objectives,
          learningStyles,
          inclusionNeeds,
          complexity,
        },
      },
      sessionId || "default"
    );

    if (!response.success) {
      return res.status(500).json({
        success: false,
        error: response.error,
      });
    }

    return res.status(200).json({
      success: true,
      activity: response.response.activity,
      adaptations: response.response.adaptations,
    });
  } catch (error) {
    console.error("[generate-inclusive-activity] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test endpoint for learning style detection
app.post("/api/test-learning-style", async (req, res) => {
  try {
    const { message, studentId } = req.body || {};

    if (!message || !studentId) {
      return res.status(400).json({
        error: "message and studentId are required",
      });
    }

    // Simulate student interaction
    const context = {
      studentId: studentId,
      sessionId: `test_${Date.now()}`,
    };

    // Use MCP to process student message
    const response = await mcp.sendMessage(
      "student",
      "student-agent",
      {
        message: message,
        context: context,
      },
      context.sessionId
    );

    return res.status(200).json({
      success: true,
      detectedStyle: response.response.learningStyle,
      analysis: response.response.analysis,
      suggestions: response.response.suggestions,
    });
  } catch (error) {
    console.error("[test-learning-style] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test endpoint for personalized resource generation
app.post("/api/test-personalized-resources", async (req, res) => {
  try {
    const { topic, studentId } = req.body || {};

    if (!topic || !studentId) {
      return res.status(400).json({
        error: "topic and studentId are required",
      });
    }

    const context = {
      studentId: studentId,
      sessionId: `test_${Date.now()}`,
    };

    // Use MCP to generate personalized activity
    const response = await mcp.sendMessage(
      "teacher",
      "teacher-agent",
      {
        message: `Generate activity about: ${topic}`,
        context: context,
      },
      context.sessionId
    );

    return res.status(200).json({
      success: true,
      activity: response.response.activity,
      adaptations: response.response.adaptations,
      studentLearningStyles: response.response.studentLearningStyles,
    });
  } catch (error) {
    console.error("[test-personalized-resources] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test endpoint for learning style detection
app.post("/api/test-learning-style", async (req, res) => {
  try {
    const { message, studentId } = req.body;

    if (!message || !studentId) {
      return res.status(400).json({
        error: "message and studentId are required",
      });
    }

    // Simulate student interaction through MCP
    const response = await mcp.sendMessage(
      "student",
      "student-agent",
      {
        message: message,
        context: { studentId: studentId },
      },
      `test_${Date.now()}`
    );

    return res.json({
      success: true,
      detectedStyle: response.response?.learningStyle,
      analysis: response.response?.analysis,
      suggestions: response.response?.suggestions,
    });
  } catch (error) {
    console.error("[test-learning-style] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// New endpoint for progress metrics
app.get("/api/progress-metrics/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    // Get progress from A2A agent
    const progress = a2aAgent.calculateProgress(sessionId);

    // Get additional metrics from Supabase if available
    let additionalMetrics = {};
    if (supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("interacciones_ia")
          .select("*")
          .eq("id_estudiante", sessionId)
          .order("fecha_hora", { ascending: false })
          .limit(10);

        if (!error && data) {
          additionalMetrics = {
            totalInteractions: data.length,
            recentActivity: data.slice(0, 5),
            learningStyle: data[0]?.estilo_aprendizaje || null,
          };
        }
      } catch (dbError) {
        console.error("[progress-metrics] Database error:", dbError);
      }
    }

    return res.status(200).json({
      success: true,
      progress: progress,
      metrics: additionalMetrics,
    });
  } catch (error) {
    console.error("[progress-metrics] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// New endpoint for class metrics
app.get("/api/class-metrics/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    const { timeframe = "weekly" } = req.query;

    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }

    // Get class metrics from Supabase if available
    let classMetrics = {
      classId: classId,
      totalStudents: 0,
      averageProgress: 0,
      distribution: {
        improving: 0,
        stable: 0,
        declining: 0,
      },
      topPerformers: [],
      needsAttention: [],
    };

    if (supabaseServer) {
      try {
        // Get students in class
        const { data: students, error: studentsError } = await supabaseServer
          .from("clase_estudiante")
          .select("id_estudiante")
          .eq("id_clase", classId);

        if (studentsError) {
          console.error(
            "[class-metrics] Error getting students:",
            studentsError
          );
        } else if (students && students.length > 0) {
          const studentIds = students.map((s) => s.id_estudiante);

          // Get recent interactions for these students
          const { data: interactions, error: interactionsError } =
            await supabaseServer
              .from("interacciones_ia")
              .select("id_estudiante, mensaje, fecha_hora")
              .in("id_estudiante", studentIds)
              .eq("rol", "Estudiante")
              .order("fecha_hora", { ascending: false })
              .limit(100);

          if (!interactionsError && interactions) {
            // Calculate metrics for each student
            const studentMetrics = {};

            interactions.forEach((interaction) => {
              const studentId = interaction.id_estudiante;
              if (!studentMetrics[studentId]) {
                studentMetrics[studentId] = {
                  interactions: [],
                  progress: 0,
                };
              }
              studentMetrics[studentId].interactions.push(interaction);
            });

            // Calculate progress for each student
            Object.keys(studentMetrics).forEach((studentId) => {
              const studentData = studentMetrics[studentId];
              // Simple progress calculation based on interaction count and recency
              const recentInteractions = studentData.interactions.filter(
                (i) => {
                  const interactionDate = new Date(i.fecha_hora);
                  const now = new Date();
                  const daysDiff =
                    (now - interactionDate) / (1000 * 60 * 60 * 24);
                  return daysDiff <= 7; // Last week
                }
              );

              studentData.progress = Math.min(
                recentInteractions.length / 10,
                1
              ); // Normalize to 0-1
            });

            // Calculate class metrics
            const progressValues = Object.values(studentMetrics).map(
              (s) => s.progress
            );
            classMetrics.totalStudents = Object.keys(studentMetrics).length;
            classMetrics.averageProgress =
              progressValues.reduce((sum, p) => sum + p, 0) /
              progressValues.length;

            // Distribution
            progressValues.forEach((progress) => {
              if (progress > 0.7) {
                classMetrics.distribution.improving++;
              } else if (progress > 0.4) {
                classMetrics.distribution.stable++;
              } else {
                classMetrics.distribution.declining++;
              }
            });

            // Top performers
            classMetrics.topPerformers = Object.entries(studentMetrics)
              .map(([studentId, data]) => ({
                studentId: studentId,
                name: `Estudiante ${studentId.slice(-4)}`, // Mock name
                progress: data.progress,
              }))
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 5);

            // Needs attention
            classMetrics.needsAttention = Object.entries(studentMetrics)
              .filter(([studentId, data]) => data.progress < 0.3)
              .map(([studentId, data]) => ({
                studentId: studentId,
                name: `Estudiante ${studentId.slice(-4)}`, // Mock name
                issues: ["Bajo progreso", "Pocas interacciones"],
              }));
          }
        }
      } catch (dbError) {
        console.error("[class-metrics] Database error:", dbError);
      }
    }

    return res.status(200).json({
      success: true,
      metrics: classMetrics,
    });
  } catch (error) {
    console.error("[class-metrics] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: process.env.OPENAI_MODEL || "gpt-4o-mini" });
});

// Endpoint para simular interacción de estudiante y guardar en Supabase
app.post("/api/simulate-student", async (req, res) => {
  try {
    console.log("[SIMULATE] Simulando interacción de estudiante...");

    if (!supabaseServer) {
      return res.status(500).json({
        success: false,
        error: "Supabase no está configurado",
      });
    }

    const { studentId, message, learningStyle } = req.body;

    // 1. Guardar interacción del estudiante
    const { data: interaction, error: interactionError } = await supabaseServer
      .from("interacciones_ia")
      .insert({
        id_estudiante: studentId || "09030705-486a-4509-bbce-07f9b14cd38c", // Ana Martínez
        rol: "Estudiante",
        mensaje:
          message || "Hola, necesito ayuda con el tema de cambio climático",
        estilo_aprendizaje: learningStyle || "visual",
      })
      .select();

    if (interactionError) {
      console.error(
        "[SIMULATE] Error guardando interacción:",
        interactionError
      );
      return res.status(500).json({
        success: false,
        error: "Error guardando interacción: " + interactionError.message,
      });
    }

    // 2. Simular respuesta del agente IA
    const agentResponse = `Hola! Te ayudo con el tema de cambio climático. Como tienes estilo de aprendizaje ${
      learningStyle || "visual"
    }, te sugiero crear un mapa conceptual con las causas y efectos. ¿Qué aspectos específicos te interesan más?`;

    const { data: agentInteraction, error: agentError } = await supabaseServer
      .from("interacciones_ia")
      .insert({
        id_estudiante: studentId || "09030705-486a-4509-bbce-07f9b14cd38c",
        rol: "AgenteIA",
        mensaje: agentResponse,
        estilo_aprendizaje: learningStyle || "visual",
      })
      .select();

    if (agentError) {
      console.error(
        "[SIMULATE] Error guardando respuesta del agente:",
        agentError
      );
    }

    // 3. Simular entrega de trabajo del estudiante
    const { data: entrega, error: entregaError } = await supabaseServer
      .from("entregas")
      .insert({
        id_actividad: "61928303-5a6b-4ac0-9ee5-2579da0d1513", // Actividad existente
        id_estudiante: studentId || "09030705-486a-4509-bbce-07f9b14cd38c",
        fecha_entrega: new Date().toISOString().split("T")[0],
        palabras: 250,
        fuentes_detectadas: 3,
        similitud_externa_pct: 15,
        razonamiento_original_pct: 85,
        texto_respuesta: `El cambio climático es un fenómeno global causado principalmente por las emisiones de gases de efecto invernadero. Las principales causas incluyen la quema de combustibles fósiles, la deforestación y las actividades industriales. Los efectos más notables son el aumento de la temperatura global, el derretimiento de los polos y el aumento del nivel del mar. Para mitigar estos efectos, es necesario implementar energías renovables, reducir las emisiones y promover prácticas sostenibles.`,
      })
      .select();

    if (entregaError) {
      console.error("[SIMULATE] Error guardando entrega:", entregaError);
    }

    // 4. Simular evaluación automática
    if (entrega && entrega.length > 0) {
      const { data: evaluacion, error: evalError } = await supabaseServer
        .from("evaluaciones")
        .insert({
          id_entrega: entrega[0].id_entrega,
          estructura_score: 4.2,
          evidencia_score: 3.8,
          critica_score: 4.0,
          creatividad_score: 3.5,
          rubrica_total: 3.9,
          nivel_desempeno: "Alto",
          retroalimentacion_resumen:
            "Excelente trabajo. Buena estructura argumentativa y uso de evidencias. Sugiero profundizar en soluciones específicas.",
        })
        .select();

      if (evalError) {
        console.error("[SIMULATE] Error guardando evaluación:", evalError);
      }
    }

    res.json({
      success: true,
      message: "Interacción simulada exitosamente",
      data: {
        interacciones: interaction,
        respuesta_agente: agentInteraction,
        entrega: entrega,
        estudiante: "Ana Martínez",
        estilo_aprendizaje: learningStyle || "visual",
      },
    });
  } catch (error) {
    console.error("[SIMULATE] Error general:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint para consultar las tablas de Supabase
app.get("/api/tables", async (_req, res) => {
  try {
    console.log("[TABLES] Consultando tablas de Supabase...");

    // Consultar tabla de interacciones de estudiantes
    if (!supabaseServer) {
      return res.status(500).json({
        success: false,
        error:
          "Supabase no está configurado. Verifica SUPABASE_URL y SUPABASE_SERVICE_ROLE en .env",
      });
    }

    const { data: interactions, error: interactionsError } =
      await supabaseServer
        .from("interacciones_ia")
        .select("*")
        .order("fecha_hora", { ascending: false })
        .limit(10);

    if (interactionsError) {
      console.error("[TABLES] Error en interacciones_ia:", interactionsError);
    }

    // Consultar tabla de estudiantes
    const { data: students, error: studentsError } = await supabaseServer
      .from("estudiantes")
      .select("*")
      .order("nombres", { ascending: true })
      .limit(10);

    if (studentsError) {
      console.error("[TABLES] Error en estudiantes:", studentsError);
    }

    // Consultar tabla de actividades
    const { data: activities, error: activitiesError } = await supabaseServer
      .from("actividades")
      .select("*")
      .order("titulo", { ascending: true })
      .limit(10);

    if (activitiesError) {
      console.error("[TABLES] Error en actividades:", activitiesError);
    }

    // Consultar tabla de entregas
    const { data: entregas, error: entregasError } = await supabaseServer
      .from("entregas")
      .select("*")
      .order("fecha_entrega", { ascending: false })
      .limit(10);

    if (entregasError) {
      console.error("[TABLES] Error en entregas:", entregasError);
    }

    res.json({
      success: true,
      tables: {
        interacciones_ia: {
          count: interactions?.length || 0,
          data: interactions || [],
          error: interactionsError?.message,
        },
        estudiantes: {
          count: students?.length || 0,
          data: students || [],
          error: studentsError?.message,
        },
        actividades: {
          count: activities?.length || 0,
          data: activities || [],
          error: activitiesError?.message,
        },
        entregas: {
          count: entregas?.length || 0,
          data: entregas || [],
          error: entregasError?.message,
        },
      },
    });
  } catch (error) {
    console.error("[TABLES] Error general:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 MentorIA server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
