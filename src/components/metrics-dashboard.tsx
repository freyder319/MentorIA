// Metrics Dashboard Component for Cognitive Progress Tracking
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Clock,
  Award,
} from "lucide-react";

interface MetricsDashboardProps {
  studentId?: string;
  classId?: string;
  timeframe?: "daily" | "weekly" | "monthly";
}

interface CognitiveMetrics {
  criticalThinking: number;
  argumentStructure: number;
  evidenceUsage: number;
  originality: number;
  overall: number;
}

interface ProgressData {
  studentId: string;
  timeframe: string;
  metrics: CognitiveMetrics;
  trend: "improving" | "stable" | "declining";
  improvement: number;
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  nextSteps: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    estimatedTime: string;
  }>;
  alerts: Array<{
    type: "warning" | "info" | "success";
    message: string;
    action: string;
  }>;
}

interface ClassMetrics {
  classId: string;
  totalStudents: number;
  averageProgress: number;
  distribution: {
    improving: number;
    stable: number;
    declining: number;
  };
  topPerformers: Array<{
    studentId: string;
    name: string;
    progress: number;
  }>;
  needsAttention: Array<{
    studentId: string;
    name: string;
    issues: string[];
  }>;
}

export function MetricsDashboard({
  studentId,
  classId,
  timeframe = "weekly",
}: MetricsDashboardProps) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [classMetrics, setClassMetrics] = useState<ClassMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [studentId, classId, timeframe]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (studentId) {
        // Load individual student metrics
        const response = await fetch(
          `/api/progress-metrics/${studentId}?timeframe=${timeframe}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProgressData(data.progress);
          }
        }
      }

      if (classId) {
        // Load class metrics
        const response = await fetch(
          `/api/class-metrics/${classId}?timeframe=${timeframe}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setClassMetrics(data.metrics);
          }
        }
      }
    } catch (err) {
      setError("Error loading metrics");
      console.error("Error loading metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "bg-green-100 text-green-700";
      case "declining":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-600">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">{error}</div>
          <Button onClick={loadMetrics} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Métricas de Progreso
          </h2>
          <p className="text-gray-600">
            {studentId ? "Progreso individual" : "Métricas de clase"} -{" "}
            {timeframe}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeframe === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              /* Change timeframe */
            }}
          >
            Diario
          </Button>
          <Button
            variant={timeframe === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              /* Change timeframe */
            }}
          >
            Semanal
          </Button>
          <Button
            variant={timeframe === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              /* Change timeframe */
            }}
          >
            Mensual
          </Button>
        </div>
      </div>

      {/* Individual Student Metrics */}
      {progressData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Progreso General</h3>
              </div>
              <Badge className={getTrendColor(progressData.trend)}>
                {getTrendIcon(progressData.trend)}
                <span className="ml-1">
                  {progressData.trend === "improving"
                    ? "Mejorando"
                    : progressData.trend === "declining"
                    ? "Necesita atención"
                    : "Estable"}
                </span>
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Puntuación actual</span>
                  <span className="text-gray-900">
                    {Math.round(progressData.metrics.overall * 100)}%
                  </span>
                </div>
                <Progress
                  value={progressData.metrics.overall * 100}
                  className="h-2"
                />
              </div>
              <div className="text-sm text-gray-600">
                Mejora: {progressData.improvement > 0 ? "+" : ""}
                {Math.round(progressData.improvement * 100)}%
              </div>
            </div>
          </Card>

          {/* Critical Thinking */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Pensamiento Crítico</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Nivel actual</span>
                  <span className="text-gray-900">
                    {Math.round(progressData.metrics.criticalThinking * 100)}%
                  </span>
                </div>
                <Progress
                  value={progressData.metrics.criticalThinking * 100}
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Argument Structure */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Estructura</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Calidad</span>
                  <span className="text-gray-900">
                    {Math.round(progressData.metrics.argumentStructure * 100)}%
                  </span>
                </div>
                <Progress
                  value={progressData.metrics.argumentStructure * 100}
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Evidence Usage */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Evidencia</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Uso efectivo</span>
                  <span className="text-gray-900">
                    {Math.round(progressData.metrics.evidenceUsage * 100)}%
                  </span>
                </div>
                <Progress
                  value={progressData.metrics.evidenceUsage * 100}
                  className="h-2"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Insights and Recommendations */}
      {progressData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths and Weaknesses */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análisis de Progreso</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">
                  Fortalezas
                </h4>
                <ul className="space-y-1">
                  {progressData.insights.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-green-600 flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-0.5">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2">
                  Áreas de mejora
                </h4>
                <ul className="space-y-1">
                  {progressData.insights.weaknesses.map((weakness, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-orange-600 flex items-start gap-2"
                    >
                      <span className="text-orange-500 mt-0.5">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Próximos Pasos</h3>
            <div className="space-y-3">
              {progressData.nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Badge className={getPriorityColor(step.priority)}>
                    {step.priority === "high"
                      ? "Alta"
                      : step.priority === "medium"
                      ? "Media"
                      : "Baja"}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{step.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {step.estimatedTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Class Metrics */}
      {classMetrics && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Métricas de Clase</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class Overview */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Resumen de Clase
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total estudiantes:
                    </span>
                    <span className="text-sm font-medium">
                      {classMetrics.totalStudents}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Progreso promedio:
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(classMetrics.averageProgress * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Distribución de Progreso
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Mejorando:</span>
                  <span className="text-sm font-medium">
                    {classMetrics.distribution.improving}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Estable:</span>
                  <span className="text-sm font-medium">
                    {classMetrics.distribution.stable}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Necesita atención:
                  </span>
                  <span className="text-sm font-medium">
                    {classMetrics.distribution.declining}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Mejores Desempeños
              </h4>
              <div className="space-y-2">
                {classMetrics.topPerformers.slice(0, 3).map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {student.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(student.progress * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts */}
      {progressData && progressData.alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Alertas y Notificaciones
          </h3>
          <div className="space-y-3">
            {progressData.alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === "warning"
                    ? "bg-yellow-50 border-yellow-400"
                    : alert.type === "info"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-green-50 border-green-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      alert.type === "warning"
                        ? "bg-yellow-100"
                        : alert.type === "info"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        alert.type === "warning"
                          ? "text-yellow-600"
                          : alert.type === "info"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {alert.type === "warning"
                        ? "⚠"
                        : alert.type === "info"
                        ? "ℹ"
                        : "✓"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{alert.message}</p>
                    {alert.action && (
                      <p className="text-xs text-gray-600 mt-1">
                        Acción: {alert.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
