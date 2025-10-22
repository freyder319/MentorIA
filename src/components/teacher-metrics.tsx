import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Brain,
  ArrowLeft,
  Download,
  Users,
  TrendingUp,
  Award,
  AlertTriangle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface TeacherMetricsProps {
  onNavigate: (page: string) => void;
}

export function TeacherMetrics({ onNavigate }: TeacherMetricsProps) {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const groupProgress = [
    { name: 'Grupo A', promedio: 85, estudiantes: 32 },
    { name: 'Grupo B', promedio: 78, estudiantes: 28 },
    { name: 'Grupo C', promedio: 90, estudiantes: 24 }
  ];

  const weeklyProgress = [
    { semana: 'Sem 1', grupoA: 75, grupoB: 70, grupoC: 82 },
    { semana: 'Sem 2', grupoA: 78, grupoB: 73, grupoC: 85 },
    { semana: 'Sem 3', grupoA: 82, grupoB: 76, grupoC: 88 },
    { semana: 'Sem 4', grupoA: 85, grupoB: 78, grupoC: 90 }
  ];

  const skillsComparison = [
    { skill: 'Análisis', grupoA: 88, grupoB: 80, grupoC: 92 },
    { skill: 'Síntesis', grupoA: 75, grupoB: 72, grupoC: 85 },
    { skill: 'Evaluación', grupoA: 82, grupoB: 76, grupoC: 88 },
    { skill: 'Argumentación', grupoA: 78, grupoB: 74, grupoC: 86 },
    { skill: 'Evidencias', grupoA: 92, grupoB: 85, grupoC: 95 }
  ];

  const topStudents = [
    { name: 'Ana Martínez', group: 'Grupo C', score: 96, improvement: '+15%' },
    { name: 'Carlos López', group: 'Grupo A', score: 94, improvement: '+12%' },
    { name: 'María García', group: 'Grupo C', score: 93, improvement: '+18%' },
    { name: 'Juan Pérez', group: 'Grupo B', score: 91, improvement: '+10%' },
    { name: 'Laura Sánchez', group: 'Grupo A', score: 90, improvement: '+14%' }
  ];

  const needsAttention = [
    { name: 'Pedro Ramírez', group: 'Grupo B', score: 58, issue: 'Baja participación' },
    { name: 'Sofia Torres', group: 'Grupo A', score: 62, issue: 'Dificultad con evidencias' },
    { name: 'Diego Morales', group: 'Grupo B', score: 65, issue: 'Entregas tardías' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('teacher-dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              <span className="text-green-600">Métricas grupales</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Exportar a Excel
            </Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" /> Exportar a PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-4xl text-gray-900">Análisis de rendimiento</h1>
          </div>
          <div className="flex gap-3">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grupos</SelectItem>
                <SelectItem value="a">Grupo A - Matutino</SelectItem>
                <SelectItem value="b">Grupo B - Vespertino</SelectItem>
                <SelectItem value="c">Grupo C - Online</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="trimester">Este trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">3 grupos</Badge>
            </div>
            <div className="text-3xl mb-1">84</div>
            <div className="text-sm text-gray-600">Estudiantes activos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-100 text-green-700">+5%</Badge>
            </div>
            <div className="text-3xl mb-1">87%</div>
            <div className="text-sm text-gray-600">Promedio general</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700">Top 5</Badge>
            </div>
            <div className="text-3xl mb-1">15</div>
            <div className="text-sm text-gray-600">Estudiantes destacados</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700">Atención</Badge>
            </div>
            <div className="text-3xl mb-1">3</div>
            <div className="text-sm text-gray-600">Necesitan apoyo</div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Group Comparison */}
          <Card className="p-6">
            <h3 className="text-xl mb-6 text-gray-900">Comparación entre grupos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="promedio" name="Promedio" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Puntuación promedio por grupo
            </div>
          </Card>

          {/* Weekly Trend */}
          <Card className="p-6">
            <h3 className="text-xl mb-6 text-gray-900">Evolución semanal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="semana" tick={{ fill: '#64748b' }} />
                <YAxis domain={[60, 100]} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="grupoA" name="Grupo A" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="grupoB" name="Grupo B" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="grupoC" name="Grupo C" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Tendencia del rendimiento por semana
            </div>
          </Card>
        </div>

        {/* Skills Comparison */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl mb-6 text-gray-900">Comparación de habilidades</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={skillsComparison}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Radar name="Grupo A" dataKey="grupoA" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name="Grupo B" dataKey="grupoB" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Radar name="Grupo C" dataKey="grupoC" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Nivel de desarrollo de habilidades de pensamiento crítico por grupo
          </div>
        </Card>

        {/* Students Lists */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-green-600" />
              <h3 className="text-xl text-gray-900">Estudiantes destacados</h3>
            </div>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.group}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gray-900">{student.score}%</div>
                    <Badge className="bg-green-600 text-white text-xs">
                      {student.improvement}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Need Attention */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl text-gray-900">Requieren atención</h3>
            </div>
            <div className="space-y-3">
              {needsAttention.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{student.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{student.group}</div>
                    <Badge variant="outline" className="text-xs bg-white">
                      {student.issue}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gray-900">{student.score}%</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Contactar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm text-blue-900 mb-1">Sugerencia de la IA</div>
                  <p className="text-sm text-blue-800">
                    Considera organizar sesiones de apoyo adicionales para estudiantes con puntuación menor a 70%.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights */}
        <Card className="p-6 mt-8 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl text-purple-900">Insights del sistema IA</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-purple-900 mb-2">📊 Tendencia general</div>
              <p className="text-sm text-purple-800">
                Todos los grupos muestran mejora constante. El promedio aumentó 5% este mes.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-purple-900 mb-2">🎯 Área de oportunidad</div>
              <p className="text-sm text-purple-800">
                La habilidad de síntesis es la más baja en todos los grupos. Considera enfatizarla.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-purple-900 mb-2">⭐ Fortaleza colectiva</div>
              <p className="text-sm text-purple-800">
                El uso de evidencias es excelente (promedio 91%). Mantén este enfoque.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
