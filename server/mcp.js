// Model Context Protocol (MCP) Implementation
// Handles communication between different AI agents and manages context

class MCP {
  constructor() {
    this.contexts = new Map();
    this.agents = new Map();
    this.messageQueue = [];
  }

  // Register an agent with the MCP
  registerAgent(agentId, agentConfig) {
    this.agents.set(agentId, {
      id: agentId,
      config: agentConfig,
      status: "active",
      lastActivity: Date.now(),
    });
    console.log(`[MCP] Agent ${agentId} registered`);
  }

  // Create or update context for a session
  setContext(sessionId, context) {
    this.contexts.set(sessionId, {
      ...context,
      lastUpdated: Date.now(),
      version: (this.contexts.get(sessionId)?.version || 0) + 1,
    });
  }

  // Get context for a session
  getContext(sessionId) {
    return this.contexts.get(sessionId);
  }

  // Send message between agents
  async sendMessage(fromAgentId, toAgentId, message, sessionId) {
    const messageId = `msg_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const messageObj = {
      id: messageId,
      from: fromAgentId,
      to: toAgentId,
      sessionId,
      content: message,
      timestamp: Date.now(),
      status: "pending",
    };

    this.messageQueue.push(messageObj);

    // Process message immediately
    return await this.processMessage(messageObj);
  }

  // Process a message in the queue
  async processMessage(messageObj) {
    try {
      const targetAgent = this.agents.get(messageObj.to);
      if (!targetAgent) {
        throw new Error(`Agent ${messageObj.to} not found`);
      }

      // Update message status
      messageObj.status = "processing";

      // Get current context
      const context = this.getContext(messageObj.sessionId);

      // Create agent communication payload
      const payload = {
        message: messageObj.content,
        context: context,
        metadata: {
          from: messageObj.from,
          sessionId: messageObj.sessionId,
          timestamp: messageObj.timestamp,
        },
      };

      // Simulate agent processing (in real implementation, this would call the actual agent)
      const response = await this.executeAgentAction(messageObj.to, payload);

      messageObj.status = "completed";
      messageObj.response = response;

      return {
        success: true,
        messageId: messageObj.id,
        response: response,
      };
    } catch (error) {
      messageObj.status = "failed";
      messageObj.error = error.message;

      return {
        success: false,
        messageId: messageObj.id,
        error: error.message,
      };
    }
  }

  // Execute action for a specific agent
  async executeAgentAction(agentId, payload) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Update agent activity
    agent.lastActivity = Date.now();

    // Route to appropriate agent handler
    switch (agentId) {
      case "student-agent":
        return await this.handleStudentAgent(payload);
      case "teacher-agent":
        return await this.handleTeacherAgent(payload);
      case "a2a-agent":
        return await this.handleA2AAgent(payload);
      case "analysis-agent":
        return await this.handleAnalysisAgent(payload);
      default:
        throw new Error(`Unknown agent type: ${agentId}`);
    }
  }

  // Handle student agent communication
  async handleStudentAgent(payload) {
    const { message, context } = payload;

    // Analyze student input for argument structure
    const analysis = await this.analyzeStudentArgument(message);

    // Detect learning style from student interaction
    const learningStyle = await this.detectLearningStyle(message, context);

    // Store learning style if detected
    if (learningStyle && context.studentId) {
      await this.storeLearningStyle(context.studentId, learningStyle);
    }

    return {
      type: "student_response",
      analysis: analysis,
      learningStyle: learningStyle,
      suggestions: this.generateStudentSuggestions(analysis),
      context: context,
    };
  }

  // Handle teacher agent communication
  async handleTeacherAgent(payload) {
    const { message, context } = payload;

    // Get student learning styles from database
    const studentLearningStyles = await this.getStudentLearningStyles(
      context.studentId
    );

    // Generate inclusive activity with personalized adaptations
    const activity = await this.generateInclusiveActivity(message, context);

    // Generate personalized adaptations based on detected learning styles
    const adaptations = await this.generatePersonalizedAdaptations(
      activity,
      studentLearningStyles,
      context
    );

    return {
      type: "teacher_response",
      activity: activity,
      adaptations: adaptations,
      studentLearningStyles: studentLearningStyles,
      context: context,
    };
  }

  // Handle A2A (Agent-to-Agent) communication
  async handleA2AAgent(payload) {
    const { message, context } = payload;

    // Analyze argument structure and provide feedback
    const argumentAnalysis = await this.analyzeArgumentStructure(message);

    return {
      type: "a2a_response",
      analysis: argumentAnalysis,
      feedback: this.generateCriticalThinkingFeedback(argumentAnalysis),
      recommendations: this.generateRecommendations(argumentAnalysis),
      context: context,
    };
  }

  // Handle analysis agent communication
  async handleAnalysisAgent(payload) {
    const { message, context } = payload;

    // Perform deep analysis of student work
    const deepAnalysis = await this.performDeepAnalysis(message, context);

    return {
      type: "analysis_response",
      analysis: deepAnalysis,
      metrics: this.calculateMetrics(deepAnalysis),
      context: context,
    };
  }

  // Analyze student argument structure
  async analyzeStudentArgument(text) {
    // This would integrate with LLM for analysis
    return {
      hasThesis: this.detectThesis(text),
      evidenceCount: this.countEvidence(text),
      reasoningQuality: this.assessReasoning(text),
      sourceDependency: this.assessSourceDependency(text),
      criticalThinkingLevel: this.assessCriticalThinking(text),
    };
  }

  // Generate student suggestions based on analysis
  generateStudentSuggestions(analysis) {
    const suggestions = [];

    if (!analysis.hasThesis) {
      suggestions.push({
        type: "thesis",
        message:
          "Tu respuesta necesita una tesis clara. ¿Cuál es tu posición principal sobre el tema?",
        priority: "high",
      });
    }

    if (analysis.evidenceCount < 2) {
      suggestions.push({
        type: "evidence",
        message:
          "Necesitas más evidencia para respaldar tu argumento. ¿Qué datos o ejemplos puedes usar?",
        priority: "medium",
      });
    }

    if (analysis.sourceDependency > 0.7) {
      suggestions.push({
        type: "originality",
        message:
          "Tu respuesta depende mucho de fuentes externas. ¿Cómo puedes desarrollar tu propio análisis?",
        priority: "high",
      });
    }

    return suggestions;
  }

  // Generate inclusive activity for teachers
  async generateInclusiveActivity(requirements, context) {
    // This would integrate with LLM for activity generation
    return {
      title: requirements.title || "Actividad Inclusiva",
      objectives: this.extractObjectives(requirements),
      adaptations: this.generateLearningAdaptations(requirements),
      resources: this.generateResources(requirements),
      assessment: this.generateAssessment(requirements),
    };
  }

  // Generate adaptations for different learning styles
  generateAdaptations(activity, context) {
    return {
      visual: {
        description: "Adaptación visual",
        resources: ["diagramas", "infografías", "mapas conceptuales"],
        activities: ["crear esquemas", "diseñar posters"],
      },
      auditory: {
        description: "Adaptación auditiva",
        resources: ["podcasts", "discusiones", "presentaciones orales"],
        activities: ["debates", "exposiciones", "grabaciones"],
      },
      kinesthetic: {
        description: "Adaptación kinestésica",
        resources: ["manipulativos", "simulaciones", "experimentos"],
        activities: ["construir modelos", "role-playing", "laboratorios"],
      },
      reading: {
        description: "Adaptación de lectura",
        resources: ["textos adaptados", "resúmenes", "glosarios"],
        activities: ["análisis de textos", "síntesis", "comparaciones"],
      },
    };
  }

  // Analyze argument structure for A2A agent
  async analyzeArgumentStructure(text) {
    return {
      structure: {
        introduction: this.detectIntroduction(text),
        body: this.detectBody(text),
        conclusion: this.detectConclusion(text),
      },
      quality: {
        coherence: this.assessCoherence(text),
        logic: this.assessLogic(text),
        evidence: this.assessEvidence(text),
        originality: this.assessOriginality(text),
      },
      weaknesses: this.identifyWeaknesses(text),
      strengths: this.identifyStrengths(text),
    };
  }

  // Generate critical thinking feedback
  generateCriticalThinkingFeedback(analysis) {
    const feedback = [];

    if (analysis.quality.coherence < 0.6) {
      feedback.push({
        type: "coherence",
        message:
          "Tu argumento necesita mejor organización. Considera usar un esquema antes de escribir.",
        suggestion: "Crea un mapa conceptual con tus ideas principales",
      });
    }

    if (analysis.quality.logic < 0.6) {
      feedback.push({
        type: "logic",
        message:
          "Hay inconsistencias en tu razonamiento. Revisa las conexiones entre tus ideas.",
        suggestion: "Usa conectores lógicos para unir tus argumentos",
      });
    }

    if (analysis.quality.evidence < 0.6) {
      feedback.push({
        type: "evidence",
        message: "Necesitas más evidencia para respaldar tus afirmaciones.",
        suggestion: "Incluye datos, ejemplos o referencias específicas",
      });
    }

    return feedback;
  }

  // Generate recommendations for improvement
  generateRecommendations(analysis) {
    const recommendations = [];

    // Based on weaknesses identified
    analysis.weaknesses.forEach((weakness) => {
      recommendations.push({
        area: weakness.type,
        action: weakness.suggestion,
        priority: weakness.severity === "high" ? "urgent" : "normal",
      });
    });

    return recommendations;
  }

  // Perform deep analysis for analysis agent
  async performDeepAnalysis(text, context) {
    return {
      cognitiveLevel: this.assessCognitiveLevel(text),
      criticalThinking: this.assessCriticalThinking(text),
      creativity: this.assessCreativity(text),
      metacognition: this.assessMetacognition(text),
      learningStyle: this.detectLearningStyle(text),
      progress: this.calculateProgress(text, context),
    };
  }

  // Calculate metrics for progress tracking
  calculateMetrics(analysis) {
    return {
      overallScore: this.calculateOverallScore(analysis),
      improvementAreas: this.identifyImprovementAreas(analysis),
      strengths: this.identifyStrengths(analysis),
      nextSteps: this.suggestNextSteps(analysis),
    };
  }

  // Helper methods for analysis
  detectThesis(text) {
    // Simple heuristic - in real implementation, use LLM
    return (
      text.includes("creo que") ||
      text.includes("mi opinión") ||
      text.includes("considero")
    );
  }

  countEvidence(text) {
    // Count evidence indicators
    const evidenceIndicators = [
      "porque",
      "debido a",
      "según",
      "datos",
      "estadísticas",
      "ejemplo",
    ];
    return evidenceIndicators.reduce((count, indicator) => {
      return count + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  assessReasoning(text) {
    // Simple assessment - in real implementation, use LLM
    const reasoningIndicators = [
      "por lo tanto",
      "en consecuencia",
      "esto demuestra",
      "se puede concluir",
    ];
    const reasoningCount = reasoningIndicators.reduce((count, indicator) => {
      return count + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(reasoningCount / 3, 1); // Normalize to 0-1
  }

  assessSourceDependency(text) {
    // Assess how much the text depends on external sources
    const sourceIndicators = [
      "según",
      "fuente",
      "referencia",
      "cita",
      "dice que",
    ];
    const sourceCount = sourceIndicators.reduce((count, indicator) => {
      return count + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(sourceCount / 5, 1); // Normalize to 0-1
  }

  assessCriticalThinking(text) {
    // Assess critical thinking level
    const criticalIndicators = [
      "analizar",
      "evaluar",
      "comparar",
      "contrastar",
      "cuestionar",
      "reflexionar",
    ];
    const criticalCount = criticalIndicators.reduce((count, indicator) => {
      return count + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(criticalCount / 4, 1); // Normalize to 0-1
  }

  // Additional helper methods
  detectIntroduction(text) {
    return text.length > 0;
  }
  detectBody(text) {
    return text.length > 50;
  }
  detectConclusion(text) {
    return text.length > 100;
  }
  assessCoherence(text) {
    return 0.7;
  } // Placeholder
  assessLogic(text) {
    return 0.6;
  } // Placeholder
  assessEvidence(text) {
    return this.countEvidence(text) / 5;
  }
  assessOriginality(text) {
    return 1 - this.assessSourceDependency(text);
  }
  identifyWeaknesses(text) {
    return [];
  } // Placeholder
  identifyStrengths(text) {
    return [];
  } // Placeholder
  assessCognitiveLevel(text) {
    return "analysis";
  } // Placeholder
  assessCreativity(text) {
    return 0.5;
  } // Placeholder
  assessMetacognition(text) {
    return 0.4;
  } // Placeholder
  detectLearningStyle(text) {
    return "mixed";
  } // Placeholder
  calculateProgress(text, context) {
    return 0.6;
  } // Placeholder
  calculateOverallScore(analysis) {
    return 0.7;
  } // Placeholder
  identifyImprovementAreas(analysis) {
    return [];
  } // Placeholder
  suggestNextSteps(analysis) {
    return [];
  } // Placeholder
  extractObjectives(requirements) {
    return [];
  } // Placeholder
  generateLearningAdaptations(requirements) {
    return {};
  } // Placeholder
  generateResources(requirements) {
    return [];
  } // Placeholder
  generateAssessment(requirements) {
    return {};
  } // Placeholder

  // Learning Style Detection Methods
  async detectLearningStyle(message, context) {
    try {
      // Analyze text patterns to detect learning style
      const text = message.toLowerCase();

      // Visual indicators
      const visualIndicators = [
        "veo",
        "visualizar",
        "imagen",
        "diagrama",
        "gráfico",
        "color",
        "forma",
        "dibujo",
        "esquema",
        "mapa",
        "foto",
        "ilustración",
        "ver",
        "mirar",
      ];

      // Auditory indicators
      const auditoryIndicators = [
        "escucho",
        "sonido",
        "música",
        "hablar",
        "discutir",
        "debate",
        "conversación",
        "audio",
        "podcast",
        "explicar",
        "contar",
        "narrar",
        "oír",
        "escuchar",
      ];

      // Reading/Writing indicators
      const readingIndicators = [
        "leer",
        "escribir",
        "texto",
        "libro",
        "artículo",
        "ensayo",
        "notas",
        "resumen",
        "lista",
        "palabras",
        "vocabulario",
        "definir",
        "explicar por escrito",
      ];

      // Kinesthetic indicators
      const kinestheticIndicators = [
        "hacer",
        "experimentar",
        "práctica",
        "manos",
        "tocar",
        "construir",
        "crear",
        "movimiento",
        "actividad",
        "proyecto",
        "manipular",
        "jugar",
        "actuar",
      ];

      // Count indicators for each style
      const visualScore = this.countIndicators(text, visualIndicators);
      const auditoryScore = this.countIndicators(text, auditoryIndicators);
      const readingScore = this.countIndicators(text, readingIndicators);
      const kinestheticScore = this.countIndicators(
        text,
        kinestheticIndicators
      );

      // Determine dominant style
      const scores = {
        visual: visualScore,
        auditory: auditoryScore,
        reading: readingScore,
        kinesthetic: kinestheticScore,
      };

      const dominantStyle = Object.keys(scores).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
      );

      // Only return a style if there's a clear preference (score > 2)
      const maxScore = Math.max(...Object.values(scores));
      if (maxScore >= 2) {
        return dominantStyle;
      }

      return null; // No clear preference detected
    } catch (error) {
      console.error("[MCP] Error detecting learning style:", error);
      return null;
    }
  }

  countIndicators(text, indicators) {
    return indicators.reduce((count, indicator) => {
      return count + (text.split(indicator).length - 1);
    }, 0);
  }

  async storeLearningStyle(studentId, learningStyle) {
    try {
      // Import supabase client
      const { createClient } = require("@supabase/supabase-js");
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Store or update learning style in database
      const { error } = await supabase
        .from("perfil_aprendizaje_estudiante")
        .upsert(
          {
            id_estudiante: studentId,
            id_estilo_principal: await this.getEstiloIdByName(learningStyle),
            fortalezas: `Detectado automáticamente: ${learningStyle}`,
            debilidades: "Por determinar",
          },
          {
            onConflict: "id_estudiante",
          }
        );

      if (error) {
        console.error("[MCP] Error storing learning style:", error);
      } else {
        console.log(
          `[MCP] Learning style ${learningStyle} stored for student ${studentId}`
        );
      }
    } catch (error) {
      console.error("[MCP] Error in storeLearningStyle:", error);
    }
  }

  async getStudentLearningStyles(studentId) {
    try {
      if (!studentId) return null;

      // Import supabase client
      const { createClient } = require("@supabase/supabase-js");
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get student learning style from database with join to estilos_aprendizaje
      const { data, error } = await supabase
        .from("perfil_aprendizaje_estudiante")
        .select(
          `
          id_estilo_principal,
          fortalezas,
          debilidades,
          estilos_aprendizaje!inner(nombre, descripcion)
        `
        )
        .eq("id_estudiante", studentId)
        .single();

      if (error) {
        console.error("[MCP] Error getting learning style:", error);
        return null;
      }

      return {
        estilo_detectado: data.estilos_aprendizaje.nombre,
        descripcion: data.estilos_aprendizaje.descripcion,
        fortalezas: data.fortalezas,
        debilidades: data.debilidades,
      };
    } catch (error) {
      console.error("[MCP] Error in getStudentLearningStyles:", error);
      return null;
    }
  }

  async getEstiloIdByName(styleName) {
    try {
      // Import supabase client
      const { createClient } = require("@supabase/supabase-js");
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get estilo ID by name
      const { data, error } = await supabase
        .from("estilos_aprendizaje")
        .select("id_estilo")
        .eq("nombre", styleName)
        .single();

      if (error) {
        console.error("[MCP] Error getting estilo ID:", error);
        return null;
      }

      return data.id_estilo;
    } catch (error) {
      console.error("[MCP] Error in getEstiloIdByName:", error);
      return null;
    }
  }

  async generatePersonalizedAdaptations(activity, learningStyles, context) {
    try {
      if (!learningStyles || !learningStyles.estilo_detectado) {
        // Return default adaptations if no learning style detected
        return this.generateDefaultAdaptations();
      }

      const detectedStyle = learningStyles.estilo_detectado;
      const confidence = learningStyles.confianza || 0.5;

      // Generate personalized adaptations based on detected style
      const adaptations = {
        [detectedStyle]: this.generateStyleSpecificAdaptations(
          detectedStyle,
          activity,
          confidence
        ),
      };

      // If confidence is high, focus on that style; if low, provide mixed options
      if (confidence < 0.7) {
        // Add complementary styles for low confidence
        const complementaryStyles = this.getComplementaryStyles(detectedStyle);
        complementaryStyles.forEach((style) => {
          adaptations[style] = this.generateStyleSpecificAdaptations(
            style,
            activity,
            0.3
          );
        });
      }

      return adaptations;
    } catch (error) {
      console.error("[MCP] Error generating personalized adaptations:", error);
      return this.generateDefaultAdaptations();
    }
  }

  generateStyleSpecificAdaptations(style, activity, confidence) {
    const baseActivity = activity.title || "Actividad de pensamiento crítico";

    const adaptationsByStyle = {
      visual: {
        actividades: [
          `Crear un mapa conceptual sobre ${baseActivity}`,
          `Diseñar infografías que representen los argumentos principales`,
          `Usar diagramas de flujo para organizar ideas`,
          `Crear una presentación visual con imágenes y gráficos`,
        ],
        recursos: [
          "Herramientas de diseño gráfico",
          "Plantillas de mapas conceptuales",
          "Biblioteca de imágenes educativas",
          "Software de presentaciones",
        ],
      },
      auditory: {
        actividades: [
          `Participar en un debate oral sobre ${baseActivity}`,
          `Grabar un podcast explicando los argumentos`,
          `Realizar una exposición oral con argumentos`,
          `Participar en discusiones grupales estructuradas`,
        ],
        recursos: [
          "Grabadora de audio",
          "Plantillas de debate",
          "Biblioteca de podcasts educativos",
          "Guías de expresión oral",
        ],
      },
      reading: {
        actividades: [
          `Redactar un ensayo estructurado sobre ${baseActivity}`,
          `Crear un resumen escrito de los argumentos`,
          `Elaborar fichas de lectura con citas`,
          `Escribir un análisis crítico por escrito`,
        ],
        recursos: [
          "Plantillas de ensayo",
          "Guías de escritura académica",
          "Biblioteca de textos de referencia",
          "Herramientas de citación",
        ],
      },
      kinesthetic: {
        actividades: [
          `Crear un proyecto práctico sobre ${baseActivity}`,
          `Realizar experimentos que demuestren los argumentos`,
          `Construir modelos físicos de los conceptos`,
          `Participar en actividades de role-play`,
        ],
        recursos: [
          "Materiales de construcción",
          "Kits de experimentos",
          "Herramientas de modelado",
          "Espacios de trabajo colaborativo",
        ],
      },
    };

    return adaptationsByStyle[style] || adaptationsByStyle.reading;
  }

  getComplementaryStyles(primaryStyle) {
    const complementaryMap = {
      visual: ["reading", "kinesthetic"],
      auditory: ["visual", "kinesthetic"],
      reading: ["visual", "auditory"],
      kinesthetic: ["visual", "auditory"],
    };

    return complementaryMap[primaryStyle] || ["visual", "auditory"];
  }

  generateDefaultAdaptations() {
    return {
      visual: this.generateStyleSpecificAdaptations("visual", {}, 0.5),
      auditory: this.generateStyleSpecificAdaptations("auditory", {}, 0.5),
      reading: this.generateStyleSpecificAdaptations("reading", {}, 0.5),
      kinesthetic: this.generateStyleSpecificAdaptations(
        "kinesthetic",
        {},
        0.5
      ),
    };
  }
}

module.exports = MCP;
