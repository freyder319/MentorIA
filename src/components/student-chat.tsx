import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Brain,
  ArrowLeft,
  Send,
  Sparkles,
  TrendingUp,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react";

interface StudentChatProps {
  onNavigate: (page: string) => void;
}

interface Message {
  id: number;
  sender: "user" | "ai" | "system";
  content: string;
  type?: "question" | "message" | "analysis";
  questions?: string[];
  analysis?: ArgumentAnalysis;
  microChallenges?: MicroChallenge[];
}

interface ArgumentAnalysis {
  structure: {
    hasIntroduction: boolean;
    hasBody: boolean;
    hasConclusion: boolean;
    coherence: number;
    organization: number;
  };
  content: {
    hasThesis: boolean;
    thesisClarity: number;
    depth: number;
    breadth: number;
  };
  reasoning: {
    logicalConnections: number;
    argumentFlow: number;
    reasoningQuality: number;
  };
  evidence: {
    evidenceCount: number;
    evidenceQuality: number;
    sourceDependency: number;
  };
  criticalThinking: {
    questioning: number;
    analysis: number;
    evaluation: number;
    overallLevel: number;
  };
  originality: {
    originalityScore: number;
    personalInsights: number;
  };
  overall: {
    structure: number;
    content: number;
    reasoning: number;
    evidence: number;
    criticalThinking: number;
    originality: number;
    total: number;
  };
}

interface MicroChallenge {
  id: string;
  type: string;
  prompt: string;
  skill: string;
  hint: string;
  criteria: string;
  priority: string;
  estimatedTime: string;
}

interface Feedback {
  type: string;
  message: string;
  suggestion: string;
  priority: string;
  area: string;
  score: number;
}

type Mode = "coach" | "direct";

export function StudentChat({ onNavigate }: StudentChatProps) {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<Mode>("coach");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      content:
        "¡Hola! Soy tu asistente de pensamiento crítico. Puedo ayudarte a analizar tus argumentos y mejorar tu razonamiento. ¿En qué estás trabajando hoy? 📚",
      type: "message",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [currentAnalysis, setCurrentAnalysis] =
    useState<ArgumentAnalysis | null>(null);
  const [progress, setProgress] = useState({
    trend: "insufficient_data",
    improvement: 0,
  });

  // Load progress metrics on component mount
  useEffect(() => {
    loadProgressMetrics();
  }, []);

  // Load progress metrics from the server
  async function loadProgressMetrics() {
    try {
      const response = await fetch(`/api/progress-metrics/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProgress(data.progress);
        }
      }
    } catch (error) {
      console.error("Error loading progress metrics:", error);
    }
  }

  // Analyze argument using A2A agent
  async function analyzeArgument(text: string) {
    try {
      const response = await fetch("/api/analyze-argument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentText: text,
          sessionId: sessionId,
          context: {
            studentId: "demo-student-1",
            learningStyle: "mixed",
            topic: "Cambio climático",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.analysis;
        }
      }
      return null;
    } catch (error) {
      console.error("Error analyzing argument:", error);
      return null;
    }
  }

  // --- NUEVO: función reutilizable para enviar señales de insight ---
  async function sendInsightPing(userText: string, aiText: string) {
    const currentClassId = "demo-class-1";
    const currentStudentId = "s1";

    const needs: string[] = [];
    const t = userText.toLowerCase();
    if (t.includes("contraargument")) needs.push("contraargumentos");
    if (
      t.includes("resumen") ||
      t.includes("síntesis") ||
      t.includes("sintesis")
    )
      needs.push("síntesis");

    const modality:
      | "visual"
      | "auditory"
      | "reading"
      | "kinesthetic"
      | "mixed" = "mixed";
    const level: "basico" | "intermedio" | "avanzado" = "intermedio";

    try {
      await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: currentClassId,
          studentId: currentStudentId,
          modality,
          level,
          strengths: [],
          needs,
          recentTopic: "Cambio climático",
          metrics: { analisis: 72, reflexion: 68, sintesis: 61 },
          echo: { userText, aiText },
        }),
      });
    } catch {}
  }

  // --- NUEVO: prompt según modo ---
  function buildSystemPrompt(m: Mode) {
    if (m === "direct") {
      return (
        'Responde en español, de forma directa, concreta y breve. Da la mejor respuesta inmediata sin repetir la pregunta, sin añadir prefijos como "Assistant:" ni recapitulaciones.' +
        " Evita sermones y entrega solo la información necesaria."
      );
    }
    // coach (socrático)
    return (
      "Eres un tutor socrático en español. Tu objetivo es formar el razonamiento del estudiante." +
      " No entregues respuestas finales directas a problemas o tareas evaluables." +
      " En su lugar: (1) reconoce brevemente el objetivo; (2) formula de 1 a 3 preguntas guía específicas;" +
      " (3) ofrece un micro-plan de 3 pasos para avanzar; (4) propone un ejemplo pequeño (no la solución completa);" +
      " (5) pregunta si desea una pista adicional." +
      " Sé breve y concreto. Evita sermones y generalidades."
    );
  }

  // --- NUEVO: heurística local para solicitudes de "dame la respuesta" ---
  function shouldRefuseDirectAnswer(text: string) {
    const t = text.toLowerCase();
    const patterns = [
      "dame la respuesta",
      "resuélvelo por mí",
      "resuelvelo por mi",
      "hazme la tarea",
      "solo la respuesta",
      "no expliques",
    ];
    return patterns.some((p) => t.includes(p));
  }

  async function handleSendMessage() {
    if (!message.trim() || loading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: message,
      type: "message",
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setMessage("");
    setLoading(true);

    try {
      // Check if this looks like an argument or essay that needs analysis
      const shouldAnalyze =
        message.length > 100 &&
        (message.includes("creo que") ||
          message.includes("mi opinión") ||
          message.includes("considero") ||
          message.includes("argumento") ||
          message.includes("tesis") ||
          message.includes("evidencia"));

      if (shouldAnalyze) {
        // Analyze the argument using A2A agent
        const analysis = await analyzeArgument(message);

        if (analysis) {
          setCurrentAnalysis(analysis);

          // Create analysis message
          const analysisMessage: Message = {
            id: nextMessages.length + 1,
            sender: "ai",
            content:
              "He analizado tu argumento. Aquí tienes un análisis detallado y sugerencias para mejorar:",
            type: "analysis",
            analysis: analysis,
            microChallenges: analysis.microChallenges,
          };

          setMessages([...nextMessages, analysisMessage]);
          await sendInsightPing(userMessage.content, analysisMessage.content);
          return;
        }
      }

      // If pide explícitamente la respuesta, respondemos localmente con guía y evitamos la llamada
      if (mode === "coach" && shouldRefuseDirectAnswer(userMessage.content)) {
        const guided: Message = {
          id: nextMessages.length + 1,
          sender: "ai",
          content:
            "No puedo darte la respuesta directa, pero puedo guiarte. Empecemos con 3 preguntas y un plan breve:",
          type: "question",
          questions: [
            "¿Qué te pide exactamente la consigna y qué dato clave ya tienes?",
            "¿Qué estrategia o fórmula se ajusta mejor a ese tipo de problema?",
            "¿Qué suposición podrías comprobar primero con un ejemplo pequeño?",
          ],
        };
        setMessages([...nextMessages, guided]);
        await sendInsightPing(userMessage.content, guided.content);
        return;
      }

      // Construye el historial (excluye saludo inicial) y limita a las 10 últimas interacciones
      const conversation = nextMessages
        .filter((m, idx) => !(idx === 0 && m.sender === "ai"))
        .slice(-10);

      const payload = {
        messages: [
          { role: "system", content: buildSystemPrompt(mode) },
          ...conversation.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
        ],
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error de red");
      }

      const data = await res.json();
      const aiText =
        data.content || "Lo siento, no pude generar una respuesta ahora.";

      const aiMessage: Message = {
        id: nextMessages.length + 1,
        sender: "ai",
        content: aiText,
        type: "message",
      };

      setMessages([...nextMessages, aiMessage]);
      await sendInsightPing(userMessage.content, aiText);
    } catch (e) {
      const aiMessage: Message = {
        id: nextMessages.length + 1,
        sender: "ai",
        content:
          "Hubo un problema al contactar la IA. Verifica la configuración del servidor o las llaves en .env.",
        type: "message",
      };
      setMessages([...nextMessages, aiMessage]);
      await sendInsightPing(userMessage.content, "");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate("student-dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600">
                Asistente IA de Pensamiento Crítico
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700">
              <Sparkles className="w-3 h-3 mr-1" /> En línea
            </Badge>
            {/* Toggle de modo */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 hidden sm:inline">Modo:</span>
              <Button
                variant={mode === "coach" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("coach")}
                className={mode === "coach" ? "" : "bg-white"}
              >
                Guía
              </Button>
              <Button
                variant={mode === "direct" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("direct")}
                className={mode === "direct" ? "" : "bg-white"}
              >
                Directo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cognitive Progress */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">Progreso cognitivo</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Análisis</span>
                    <span className="text-gray-900">
                      {currentAnalysis
                        ? Math.round(currentAnalysis.overall.content * 100)
                        : 75}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      currentAnalysis
                        ? currentAnalysis.overall.content * 100
                        : 75
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Reflexión</span>
                    <span className="text-gray-900">
                      {currentAnalysis
                        ? Math.round(
                            currentAnalysis.overall.criticalThinking * 100
                          )
                        : 82}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      currentAnalysis
                        ? currentAnalysis.overall.criticalThinking * 100
                        : 82
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Síntesis</span>
                    <span className="text-gray-900">
                      {currentAnalysis
                        ? Math.round(currentAnalysis.overall.originality * 100)
                        : 68}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      currentAnalysis
                        ? currentAnalysis.overall.originality * 100
                        : 68
                    }
                    className="h-2"
                  />
                </div>
                {progress.trend !== "insufficient_data" && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Tendencia:</span>
                      <Badge
                        variant={
                          progress.trend === "improving"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          progress.trend === "improving"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                      >
                        {progress.trend === "improving"
                          ? "Mejorando"
                          : progress.trend === "declining"
                          ? "Necesita atención"
                          : "Estable"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Session Info */}
            <Card className="p-6 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <h3 className="text-purple-900">Sesión actual</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Tema:</span>
                  <span className="text-purple-900">Cambio climático</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Mensajes:</span>
                  <span className="text-purple-900">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Tiempo:</span>
                  <span className="text-purple-900">12 min</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-blue-900">Consejos</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Sé específico en tus preguntas</li>
                <li>• Reflexiona sobre las preguntas que te hago</li>
                <li>• No temas explorar diferentes perspectivas</li>
                <li>• Tómate tu tiempo para pensar</li>
              </ul>
            </Card>

            {/* Version Comparison */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-3">Versiones guardadas</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-sm justify-start"
                >
                  📝 Versión 1 (Inicial)
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm justify-start"
                >
                  ✏️ Versión 2 (Revisada)
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm justify-start bg-blue-50 border-blue-200"
                >
                  ⭐ Versión 3 (Actual)
                </Button>
              </div>
              <Button variant="ghost" className="w-full mt-3 text-sm">
                Comparar versiones
              </Button>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col h-[calc(100vh-200px)]">
              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                          : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm"
                      } p-4`}
                    >
                      {msg.sender === "ai" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600">
                            Asistente IA
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>

                      {msg.type === "question" && msg.questions && (
                        <div className="mt-4 space-y-2">
                          {msg.questions.map((question, index) => (
                            <Card
                              key={index}
                              className="p-3 bg-white border-blue-200"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-blue-600 text-sm mt-0.5">
                                  {index + 1}.
                                </span>
                                <p className="text-sm text-gray-800">
                                  {question}
                                </p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}

                      {msg.type === "analysis" && msg.analysis && (
                        <div className="mt-4 space-y-4">
                          {/* Analysis Overview */}
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-green-50 border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  Fortalezas
                                </span>
                              </div>
                              <div className="space-y-1">
                                {msg.analysis.feedback
                                  ?.filter((f) => f.type === "strength")
                                  .map((strength, idx) => (
                                    <p
                                      key={idx}
                                      className="text-xs text-green-700"
                                    >
                                      {strength.message}
                                    </p>
                                  ))}
                              </div>
                            </Card>

                            <Card className="p-4 bg-orange-50 border-orange-200">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-800">
                                  Áreas de mejora
                                </span>
                              </div>
                              <div className="space-y-1">
                                {msg.analysis.feedback
                                  ?.filter((f) => f.type !== "strength")
                                  .slice(0, 2)
                                  .map((feedback, idx) => (
                                    <p
                                      key={idx}
                                      className="text-xs text-orange-700"
                                    >
                                      {feedback.message}
                                    </p>
                                  ))}
                              </div>
                            </Card>
                          </div>

                          {/* Micro Challenges */}
                          {msg.microChallenges &&
                            msg.microChallenges.length > 0 && (
                              <Card className="p-4 bg-purple-50 border-purple-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium text-purple-800">
                                    Micro-retos sugeridos
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {msg.microChallenges
                                    .slice(0, 2)
                                    .map((challenge, idx) => (
                                      <div
                                        key={idx}
                                        className="p-3 bg-white rounded-lg border border-purple-200"
                                      >
                                        <div className="flex items-start gap-2 mb-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {challenge.priority === "high"
                                              ? "Alta prioridad"
                                              : "Prioridad media"}
                                          </Badge>
                                          <span className="text-xs text-gray-500">
                                            {challenge.estimatedTime}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-800 mb-2">
                                          {challenge.prompt}
                                        </p>
                                        <div className="text-xs text-purple-600">
                                          <strong>Pista:</strong>{" "}
                                          {challenge.hint}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </Card>
                            )}

                          {/* Detailed Analysis */}
                          <Card className="p-4 bg-gray-50 border-gray-200">
                            <h4 className="text-sm font-medium text-gray-800 mb-3">
                              Análisis detallado
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-gray-600">
                                    Estructura
                                  </span>
                                  <span className="text-gray-800">
                                    {Math.round(
                                      msg.analysis.overall.structure * 100
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={msg.analysis.overall.structure * 100}
                                  className="h-1"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-gray-600">
                                    Evidencia
                                  </span>
                                  <span className="text-gray-800">
                                    {Math.round(
                                      msg.analysis.overall.evidence * 100
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={msg.analysis.overall.evidence * 100}
                                  className="h-1"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-gray-600">
                                    Pensamiento crítico
                                  </span>
                                  <span className="text-gray-800">
                                    {Math.round(
                                      msg.analysis.overall.criticalThinking *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    msg.analysis.overall.criticalThinking * 100
                                  }
                                  className="h-1"
                                />
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      mode === "coach"
                        ? "Plantea tu duda y te guiaré paso a paso..."
                        : "Escribe tu pregunta..."
                    }
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="gap-2"
                    disabled={loading}
                  >
                    <Send className="w-4 h-4" />{" "}
                    {loading ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600">
                    Preguntas rápidas:
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage("¿Cómo puedo mejorar mi tesis?")}
                  >
                    Mejorar tesis
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMessage("¿Qué evidencias debería incluir?")
                    }
                  >
                    Evidencias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage("Ayúdame con el contraargumento")}
                  >
                    Contraargumento
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600">Análisis:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMessage(
                        "Analiza mi argumento sobre el cambio climático: Creo que el cambio climático es un problema grave que requiere acción inmediata. Las temperaturas están aumentando y los glaciares se están derritiendo. Necesitamos reducir las emisiones de carbono y usar más energías renovables."
                      )
                    }
                    className="text-xs"
                  >
                    Analizar argumento
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
