// Agent-to-Agent (A2A) Implementation
// Specialized agent for argument analysis and critical thinking feedback

class A2AAgent {
  constructor(mcp) {
    this.mcp = mcp;
    this.analysisHistory = new Map();
    this.feedbackTemplates = this.initializeFeedbackTemplates();
  }

  // Initialize feedback templates for different scenarios
  initializeFeedbackTemplates() {
    return {
      thesis_weak: {
        message:
          "Tu respuesta necesita una tesis más clara. ¿Cuál es tu posición principal sobre el tema?",
        suggestion: "Comienza con una declaración clara de tu posición",
        priority: "high",
      },
      evidence_lacking: {
        message:
          "Necesitas más evidencia para respaldar tu argumento. ¿Qué datos o ejemplos puedes usar?",
        suggestion:
          "Incluye al menos 2-3 ejemplos específicos o datos relevantes",
        priority: "medium",
      },
      source_dependency: {
        message:
          "Tu respuesta depende mucho de fuentes externas. ¿Cómo puedes desarrollar tu propio análisis?",
        suggestion: "Combina información de fuentes con tu propio razonamiento",
        priority: "high",
      },
      reasoning_weak: {
        message:
          "Hay inconsistencias en tu razonamiento. Revisa las conexiones entre tus ideas.",
        suggestion:
          "Usa conectores lógicos para unir tus argumentos de manera coherente",
        priority: "medium",
      },
      critical_thinking_low: {
        message:
          "Necesitas desarrollar más pensamiento crítico. ¿Qué preguntas puedes hacer sobre el tema?",
        suggestion:
          "Considera diferentes perspectivas y cuestiona las suposiciones",
        priority: "high",
      },
    };
  }

  // Main method to analyze student argument and provide feedback
  async analyzeArgument(studentText, context = {}) {
    try {
      // Perform comprehensive argument analysis
      const analysis = await this.performArgumentAnalysis(studentText);

      // Generate personalized feedback
      const feedback = await this.generatePersonalizedFeedback(
        analysis,
        context
      );

      // Create micro-challenges based on weaknesses
      const microChallenges = await this.generateMicroChallenges(
        analysis,
        context
      );

      // Store analysis for progress tracking
      this.storeAnalysis(context.sessionId, analysis, feedback);

      return {
        analysis: analysis,
        feedback: feedback,
        microChallenges: microChallenges,
        recommendations: this.generateRecommendations(analysis),
        progress: this.calculateProgress(context.sessionId),
      };
    } catch (error) {
      console.error("[A2A Agent] Error analyzing argument:", error);
      throw error;
    }
  }

  // Perform comprehensive argument analysis
  async performArgumentAnalysis(text) {
    const analysis = {
      structure: await this.analyzeStructure(text),
      content: await this.analyzeContent(text),
      reasoning: await this.analyzeReasoning(text),
      evidence: await this.analyzeEvidence(text),
      criticalThinking: await this.analyzeCriticalThinking(text),
      originality: await this.analyzeOriginality(text),
      overall: {},
    };

    // Calculate overall scores
    analysis.overall = this.calculateOverallScores(analysis);

    return analysis;
  }

  // Analyze argument structure
  async analyzeStructure(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    return {
      hasIntroduction: this.detectIntroduction(text),
      hasBody: this.detectBody(text),
      hasConclusion: this.detectConclusion(text),
      sentenceCount: sentences.length,
      averageSentenceLength: this.calculateAverageSentenceLength(sentences),
      coherence: this.assessCoherence(text),
      organization: this.assessOrganization(text),
    };
  }

  // Analyze content quality
  async analyzeContent(text) {
    return {
      hasThesis: this.detectThesis(text),
      thesisClarity: this.assessThesisClarity(text),
      topicRelevance: this.assessTopicRelevance(text),
      depth: this.assessDepth(text),
      breadth: this.assessBreadth(text),
    };
  }

  // Analyze reasoning quality
  async analyzeReasoning(text) {
    return {
      logicalConnections: this.detectLogicalConnections(text),
      argumentFlow: this.assessArgumentFlow(text),
      consistency: this.assessConsistency(text),
      fallacies: this.detectFallacies(text),
      reasoningQuality: this.assessReasoningQuality(text),
    };
  }

  // Analyze evidence usage
  async analyzeEvidence(text) {
    const evidenceIndicators = this.extractEvidenceIndicators(text);

    return {
      evidenceCount: evidenceIndicators.count,
      evidenceTypes: evidenceIndicators.types,
      evidenceQuality: this.assessEvidenceQuality(text),
      sourceDependency: this.assessSourceDependency(text),
      evidenceRelevance: this.assessEvidenceRelevance(text),
    };
  }

  // Analyze critical thinking level
  async analyzeCriticalThinking(text) {
    return {
      questioning: this.detectQuestioning(text),
      analysis: this.detectAnalysis(text),
      evaluation: this.detectEvaluation(text),
      synthesis: this.detectSynthesis(text),
      metacognition: this.detectMetacognition(text),
      overallLevel: this.calculateCriticalThinkingLevel(text),
    };
  }

  // Analyze originality
  async analyzeOriginality(text) {
    return {
      sourceDependency: this.assessSourceDependency(text),
      personalInsights: this.detectPersonalInsights(text),
      creativeElements: this.detectCreativeElements(text),
      originalityScore: this.calculateOriginalityScore(text),
    };
  }

  // Generate personalized feedback based on analysis
  async generatePersonalizedFeedback(analysis, context) {
    const feedback = [];
    const weaknesses = this.identifyWeaknesses(analysis);

    // Generate feedback for each weakness
    weaknesses.forEach((weakness) => {
      const template = this.feedbackTemplates[weakness.type];
      if (template) {
        feedback.push({
          type: weakness.type,
          message: template.message,
          suggestion: template.suggestion,
          priority: template.priority,
          area: weakness.area,
          score: weakness.score,
        });
      }
    });

    // Add positive reinforcement for strengths
    const strengths = this.identifyStrengths(analysis);
    strengths.forEach((strength) => {
      feedback.push({
        type: "strength",
        message: `Excelente trabajo en ${strength.area}. ${strength.message}`,
        suggestion: `Continúa desarrollando esta fortaleza`,
        priority: "low",
        area: strength.area,
        score: strength.score,
      });
    });

    return feedback;
  }

  // Generate micro-challenges based on analysis
  async generateMicroChallenges(analysis, context) {
    const challenges = [];
    const weaknesses = this.identifyWeaknesses(analysis);

    weaknesses.forEach((weakness) => {
      const challenge = this.createMicroChallenge(weakness, context);
      if (challenge) {
        challenges.push(challenge);
      }
    });

    return challenges;
  }

  // Create a specific micro-challenge
  createMicroChallenge(weakness, context) {
    const challengeTemplates = {
      thesis_weak: {
        prompt:
          "Escribe una oración que exprese claramente tu posición principal sobre el tema",
        skill: "thesis_formation",
        hint: "Comienza con 'Mi posición es que...' o 'Creo que...'",
        criteria: "Debe ser una declaración clara y específica",
      },
      evidence_lacking: {
        prompt:
          "Identifica 3 datos o ejemplos específicos que respalden tu argumento",
        skill: "evidence_gathering",
        hint: "Busca estadísticas, ejemplos concretos o casos específicos",
        criteria: "Deben ser relevantes y específicos al tema",
      },
      reasoning_weak: {
        prompt: "Explica cómo una de tus ideas principales se conecta con otra",
        skill: "logical_connection",
        hint: "Usa palabras como 'por lo tanto', 'en consecuencia', 'esto demuestra'",
        criteria: "Debe mostrar una conexión lógica clara",
      },
      critical_thinking_low: {
        prompt:
          "Formula 2 preguntas críticas sobre el tema que no hayas considerado",
        skill: "critical_questioning",
        hint: "Pregunta sobre suposiciones, alternativas o implicaciones",
        criteria: "Deben ser preguntas que requieran análisis profundo",
      },
    };

    const template = challengeTemplates[weakness.type];
    if (template) {
      return {
        id: `challenge_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        type: weakness.type,
        prompt: template.prompt,
        skill: template.skill,
        hint: template.hint,
        criteria: template.criteria,
        priority: weakness.priority,
        estimatedTime: "5-10 minutos",
      };
    }

    return null;
  }

  // Generate recommendations for improvement
  generateRecommendations(analysis) {
    const recommendations = [];

    // Structure recommendations
    if (analysis.structure.coherence < 0.6) {
      recommendations.push({
        area: "Estructura",
        action: "Usa un esquema antes de escribir para organizar tus ideas",
        priority: "high",
      });
    }

    // Content recommendations
    if (analysis.content.thesisClarity < 0.6) {
      recommendations.push({
        area: "Contenido",
        action: "Define claramente tu tesis principal al inicio",
        priority: "high",
      });
    }

    // Reasoning recommendations
    if (analysis.reasoning.reasoningQuality < 0.6) {
      recommendations.push({
        area: "Razonamiento",
        action: "Practica conectar ideas usando conectores lógicos",
        priority: "medium",
      });
    }

    // Evidence recommendations
    if (analysis.evidence.evidenceCount < 2) {
      recommendations.push({
        area: "Evidencia",
        action: "Incluye más ejemplos específicos y datos relevantes",
        priority: "medium",
      });
    }

    return recommendations;
  }

  // Store analysis for progress tracking
  storeAnalysis(sessionId, analysis, feedback) {
    if (!this.analysisHistory.has(sessionId)) {
      this.analysisHistory.set(sessionId, []);
    }

    this.analysisHistory.get(sessionId).push({
      timestamp: Date.now(),
      analysis: analysis,
      feedback: feedback,
    });
  }

  // Calculate progress over time
  calculateProgress(sessionId) {
    const history = this.analysisHistory.get(sessionId);
    if (!history || history.length < 2) {
      return { trend: "insufficient_data", improvement: 0 };
    }

    const recent = history.slice(-3); // Last 3 analyses
    const older = history.slice(-6, -3); // Previous 3 analyses

    if (older.length === 0) {
      return { trend: "insufficient_data", improvement: 0 };
    }

    const recentAvg = this.calculateAverageScore(recent);
    const olderAvg = this.calculateAverageScore(older);

    const improvement = recentAvg - olderAvg;
    const trend =
      improvement > 0.1
        ? "improving"
        : improvement < -0.1
        ? "declining"
        : "stable";

    return {
      trend: trend,
      improvement: improvement,
      currentScore: recentAvg,
      previousScore: olderAvg,
    };
  }

  // Helper methods for analysis
  detectIntroduction(text) {
    const introIndicators = [
      "introducción",
      "en primer lugar",
      "para comenzar",
      "inicialmente",
    ];
    return introIndicators.some((indicator) =>
      text.toLowerCase().includes(indicator)
    );
  }

  detectBody(text) {
    return text.length > 100; // Simple heuristic
  }

  detectConclusion(text) {
    const conclusionIndicators = [
      "en conclusión",
      "finalmente",
      "para terminar",
      "en resumen",
    ];
    return conclusionIndicators.some((indicator) =>
      text.toLowerCase().includes(indicator)
    );
  }

  calculateAverageSentenceLength(sentences) {
    if (sentences.length === 0) return 0;
    const totalLength = sentences.reduce(
      (sum, sentence) => sum + sentence.trim().length,
      0
    );
    return totalLength / sentences.length;
  }

  assessCoherence(text) {
    // Simple coherence assessment
    const coherenceIndicators = [
      "por lo tanto",
      "en consecuencia",
      "además",
      "sin embargo",
      "por otro lado",
    ];
    const count = coherenceIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(count / 3, 1);
  }

  assessOrganization(text) {
    // Assess organization based on structure indicators
    const structureIndicators = [
      "primero",
      "segundo",
      "tercero",
      "finalmente",
      "en primer lugar",
    ];
    const count = structureIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(count / 2, 1);
  }

  detectThesis(text) {
    const thesisIndicators = [
      "creo que",
      "mi opinión",
      "considero",
      "mi posición",
      "estoy convencido",
    ];
    return thesisIndicators.some((indicator) =>
      text.toLowerCase().includes(indicator)
    );
  }

  assessThesisClarity(text) {
    // Simple assessment - in real implementation, use LLM
    return this.detectThesis(text) ? 0.8 : 0.3;
  }

  assessTopicRelevance(text) {
    // Placeholder - would need topic context
    return 0.7;
  }

  assessDepth(text) {
    // Assess depth based on analysis indicators
    const depthIndicators = [
      "analizar",
      "examinar",
      "investigar",
      "profundizar",
      "detallar",
    ];
    const count = depthIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(count / 2, 1);
  }

  assessBreadth(text) {
    // Assess breadth based on variety of ideas
    const breadthIndicators = [
      "además",
      "también",
      "por otro lado",
      "asimismo",
      "igualmente",
    ];
    const count = breadthIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(count / 3, 1);
  }

  detectLogicalConnections(text) {
    const connectionIndicators = [
      "por lo tanto",
      "en consecuencia",
      "esto demuestra",
      "se puede concluir",
      "debido a",
    ];
    return connectionIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  assessArgumentFlow(text) {
    // Simple assessment based on logical connections
    const connections = this.detectLogicalConnections(text);
    return Math.min(connections / 3, 1);
  }

  assessConsistency(text) {
    // Placeholder - would need more sophisticated analysis
    return 0.7;
  }

  detectFallacies(text) {
    // Simple fallacy detection - in real implementation, use LLM
    const fallacyIndicators = [
      "todos",
      "nunca",
      "siempre",
      "nadie",
      "todo el mundo",
    ];
    return fallacyIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  assessReasoningQuality(text) {
    const connections = this.detectLogicalConnections(text);
    const fallacies = this.detectFallacies(text);
    return Math.max(0, Math.min(1, (connections - fallacies) / 3));
  }

  extractEvidenceIndicators(text) {
    const evidenceTypes = {
      statistics: ["porcentaje", "estadística", "dato", "cifra"],
      examples: ["ejemplo", "caso", "instancia", "muestra"],
      quotes: ["cita", "dice", "menciona", "afirma"],
      references: ["según", "fuente", "referencia", "estudio"],
    };

    const counts = {};
    const types = [];

    Object.entries(evidenceTypes).forEach(([type, indicators]) => {
      const count = indicators.reduce((sum, indicator) => {
        return sum + (text.toLowerCase().split(indicator).length - 1);
      }, 0);
      if (count > 0) {
        counts[type] = count;
        types.push(type);
      }
    });

    return {
      count: Object.values(counts).reduce((sum, count) => sum + count, 0),
      types: types,
      details: counts,
    };
  }

  assessEvidenceQuality(text) {
    const evidenceIndicators = this.extractEvidenceIndicators(text);
    return Math.min(evidenceIndicators.count / 5, 1);
  }

  assessSourceDependency(text) {
    const sourceIndicators = [
      "según",
      "fuente",
      "referencia",
      "cita",
      "dice que",
      "menciona",
    ];
    const count = sourceIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
    return Math.min(count / 5, 1);
  }

  assessEvidenceRelevance(text) {
    // Placeholder - would need topic context
    return 0.7;
  }

  detectQuestioning(text) {
    const questionIndicators = [
      "¿",
      "por qué",
      "cómo",
      "qué",
      "cuándo",
      "dónde",
    ];
    return questionIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  detectAnalysis(text) {
    const analysisIndicators = [
      "analizar",
      "examinar",
      "investigar",
      "estudiar",
      "evaluar",
    ];
    return analysisIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  detectEvaluation(text) {
    const evaluationIndicators = [
      "evaluar",
      "juzgar",
      "valorar",
      "considerar",
      "ponderar",
    ];
    return evaluationIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  detectSynthesis(text) {
    const synthesisIndicators = [
      "sintetizar",
      "combinar",
      "integrar",
      "unificar",
      "consolidar",
    ];
    return synthesisIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  detectMetacognition(text) {
    const metacognitionIndicators = [
      "reflexionar",
      "pensar sobre",
      "considerar",
      "meditar",
      "contemplar",
    ];
    return metacognitionIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  calculateCriticalThinkingLevel(text) {
    const questioning = this.detectQuestioning(text);
    const analysis = this.detectAnalysis(text);
    const evaluation = this.detectEvaluation(text);
    const synthesis = this.detectSynthesis(text);
    const metacognition = this.detectMetacognition(text);

    const total =
      questioning + analysis + evaluation + synthesis + metacognition;
    return Math.min(total / 5, 1);
  }

  assessSourceDependency(text) {
    return this.assessSourceDependency(text); // Reuse existing method
  }

  detectPersonalInsights(text) {
    const personalIndicators = [
      "mi experiencia",
      "creo que",
      "pienso que",
      "mi opinión",
      "considero",
    ];
    return personalIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  detectCreativeElements(text) {
    const creativeIndicators = [
      "imaginemos",
      "supongamos",
      "crear",
      "diseñar",
      "innovar",
    ];
    return creativeIndicators.reduce((sum, indicator) => {
      return sum + (text.toLowerCase().split(indicator).length - 1);
    }, 0);
  }

  calculateOriginalityScore(text) {
    const sourceDependency = this.assessSourceDependency(text);
    const personalInsights = this.detectPersonalInsights(text);
    const creativeElements = this.detectCreativeElements(text);

    return Math.max(
      0,
      Math.min(1, (personalInsights + creativeElements) / 5 - sourceDependency)
    );
  }

  // Identify weaknesses in analysis
  identifyWeaknesses(analysis) {
    const weaknesses = [];

    if (analysis.content.thesisClarity < 0.6) {
      weaknesses.push({
        type: "thesis_weak",
        area: "Tesis",
        score: analysis.content.thesisClarity,
        priority: "high",
      });
    }

    if (analysis.evidence.evidenceCount < 2) {
      weaknesses.push({
        type: "evidence_lacking",
        area: "Evidencia",
        score: analysis.evidence.evidenceCount / 5,
        priority: "medium",
      });
    }

    if (analysis.originality.sourceDependency > 0.7) {
      weaknesses.push({
        type: "source_dependency",
        area: "Originalidad",
        score: 1 - analysis.originality.sourceDependency,
        priority: "high",
      });
    }

    if (analysis.reasoning.reasoningQuality < 0.6) {
      weaknesses.push({
        type: "reasoning_weak",
        area: "Razonamiento",
        score: analysis.reasoning.reasoningQuality,
        priority: "medium",
      });
    }

    if (analysis.criticalThinking.overallLevel < 0.5) {
      weaknesses.push({
        type: "critical_thinking_low",
        area: "Pensamiento Crítico",
        score: analysis.criticalThinking.overallLevel,
        priority: "high",
      });
    }

    return weaknesses;
  }

  // Identify strengths in analysis
  identifyStrengths(analysis) {
    const strengths = [];

    if (analysis.content.thesisClarity > 0.8) {
      strengths.push({
        area: "Tesis",
        message: "Tu tesis está bien definida y clara",
        score: analysis.content.thesisClarity,
      });
    }

    if (analysis.evidence.evidenceCount >= 3) {
      strengths.push({
        area: "Evidencia",
        message:
          "Incluyes buena cantidad de evidencia para respaldar tu argumento",
        score: analysis.evidence.evidenceCount / 5,
      });
    }

    if (analysis.originality.originalityScore > 0.6) {
      strengths.push({
        area: "Originalidad",
        message: "Tu análisis muestra pensamiento original y personal",
        score: analysis.originality.originalityScore,
      });
    }

    if (analysis.reasoning.reasoningQuality > 0.8) {
      strengths.push({
        area: "Razonamiento",
        message: "Tu razonamiento es lógico y bien estructurado",
        score: analysis.reasoning.reasoningQuality,
      });
    }

    return strengths;
  }

  // Calculate overall scores
  calculateOverallScores(analysis) {
    return {
      structure:
        (analysis.structure.coherence + analysis.structure.organization) / 2,
      content:
        (analysis.content.thesisClarity +
          analysis.content.depth +
          analysis.content.breadth) /
        3,
      reasoning: analysis.reasoning.reasoningQuality,
      evidence:
        (analysis.evidence.evidenceQuality +
          analysis.evidence.evidenceRelevance) /
        2,
      criticalThinking: analysis.criticalThinking.overallLevel,
      originality: analysis.originality.originalityScore,
      total: 0, // Will be calculated below
    };
  }

  // Calculate average score from analysis history
  calculateAverageScore(analyses) {
    if (analyses.length === 0) return 0;

    const totalScore = analyses.reduce((sum, analysis) => {
      return sum + analysis.analysis.overall.total;
    }, 0);

    return totalScore / analyses.length;
  }
}

module.exports = A2AAgent;
