import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Brain,
  ArrowLeft,
  Download,
  TrendingUp,
  Award,
  Target,
  AlertCircle
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";

interface StudentMetricsProps {
  onNavigate: (page: string) => void;
}

export function StudentMetrics({ onNavigate }: StudentMetricsProps) {
  const radarData = [
    { skill: 'Análisis', value: 88 },
    { skill: 'Síntesis', value: 75 },
    { skill: 'Evaluación', value: 82 },
    { skill: 'Argumentación', value: 78 },
    { skill: 'Evidencias', value: 92 },
    { skill: 'Reflexión', value: 85 }
  ];

  const progressData = [
    { week: 'Sem 1', score: 65 },
    { week: 'Sem 2', score: 72 },
    { week: 'Sem 3', score: 78 },
    { week: 'Sem 4', score: 85 }
  ];

  const skillsData = [
    { name: 'Análisis crítico', before: 65, after: 88 },
    { name: 'Argumentación', before: 60, after: 78 },
    { name: 'Evidencias', before: 70, after: 92 },
    { name: 'Contraargumentos', before: 55, after: 75 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('student-dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600">Mis métricas de aprendizaje</span>
            </div>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" /> Descargar reporte
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-blue-600 text-white">+12%</Badge>
            </div>
            <div className="text-3xl mb-1 text-blue-900">85%</div>
            <div className="text-sm text-blue-700">Nivel cognitivo global</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-green-600 text-white">Top 15%</Badge>
            </div>
            <div className="text-3xl mb-1 text-green-900">92%</div>
            <div className="text-sm text-green-700">Uso de evidencias</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-purple-600 text-white">+8%</Badge>
            </div>
            <div className="text-3xl mb-1 text-purple-900">88%</div>
            <div className="text-sm text-purple-700">Análisis crítico</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-orange-600 text-white">Activo</Badge>
            </div>
            <div className="text-3xl mb-1 text-orange-900">24</div>
            <div className="text-sm text-orange-700">Sesiones con IA</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <Card className="p-6">
            <h3 className="text-xl mb-6 text-gray-900">Habilidades de pensamiento crítico</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="Nivel actual" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Valores en escala de 0-100
            </div>
          </Card>

          {/* Progress Line Chart */}
          <Card className="p-6">
            <h3 className="text-xl mb-6 text-gray-900">Evolución semanal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Puntuación promedio por semana
            </div>
          </Card>
        </div>

        {/* Before/After Comparison */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl mb-6 text-gray-900">Comparación: Antes vs. Después</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="before" name="Inicio del mes" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="after" name="Actualidad" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Mejora promedio: +26% en todas las habilidades
          </div>
        </Card>

        {/* Strengths and Weaknesses */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-green-600" />
              <h3 className="text-xl text-green-900">Fortalezas</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-green-900 mb-1">Excelente uso de evidencias</div>
                  <p className="text-sm text-green-700">
                    Incluyes datos concretos y citas de fuentes confiables en un 92% de tus argumentos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-green-900 mb-1">Análisis profundo</div>
                  <p className="text-sm text-green-700">
                    Demuestras capacidad para analizar problemas desde múltiples perspectivas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-green-900 mb-1">Reflexión constante</div>
                  <p className="text-sm text-green-700">
                    Muestras disposición para reconsiderar tus ideas iniciales con nueva información.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Areas for Improvement */}
          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl text-orange-900">Áreas de mejora</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-orange-900 mb-1">Contraargumentos más sólidos</div>
                  <p className="text-sm text-orange-700">
                    Intenta anticipar y abordar posibles objeciones a tus argumentos principales.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-orange-900 mb-1">Síntesis de ideas</div>
                  <p className="text-sm text-orange-700">
                    Practica resumir múltiples conceptos complejos en conclusiones claras y concisas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-orange-900 mb-1">Conexiones interdisciplinarias</div>
                  <p className="text-sm text-orange-700">
                    Explora cómo los temas se relacionan con otras áreas de conocimiento.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl text-blue-900">Recomendaciones personalizadas</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-blue-900 mb-2">📚 Ejercicio sugerido</div>
              <p className="text-sm text-blue-800">
                Practica escribir contraargumentos a tus propias tesis para fortalecer tu pensamiento crítico.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-blue-900 mb-2">🎯 Objetivo semanal</div>
              <p className="text-sm text-blue-800">
                Completar 3 actividades con enfoque en síntesis de información compleja.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-blue-900 mb-2">💡 Recurso recomendado</div>
              <p className="text-sm text-blue-800">
                Explora el módulo "Análisis de falacias lógicas" para mejorar tu argumentación.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
