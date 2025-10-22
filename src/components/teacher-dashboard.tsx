import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Brain,
  LogOut,
  Plus,
  Users,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Settings
} from "lucide-react";

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [activities] = useState([
    {
      id: 1,
      title: "Cambio climático y sostenibilidad",
      students: 32,
      completed: 28,
      avgScore: 85,
      dueDate: "25 Oct 2025"
    },
    {
      id: 2,
      title: "Revolución Industrial",
      students: 32,
      completed: 32,
      avgScore: 92,
      dueDate: "20 Oct 2025"
    },
    {
      id: 3,
      title: "Democracia y derechos humanos",
      students: 32,
      completed: 5,
      avgScore: 78,
      dueDate: "30 Oct 2025"
    }
  ]);

  const [groups] = useState([
    { name: "Grupo A - Matutino", students: 32, avgProgress: 85 },
    { name: "Grupo B - Vespertino", students: 28, avgProgress: 78 },
    { name: "Grupo C - Online", students: 24, avgProgress: 90 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-green-600" />
            <span className="text-xl text-green-600">Mentor-IA Platform - Docente</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('teacher-users')}
              className="gap-2"
            >
              <Settings className="w-4 h-4" /> Gestión de usuarios
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('home')} className="gap-2">
              <LogOut className="w-4 h-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">¡Hola, Prof. García! 👨‍🏫</h1>
          <p className="text-xl text-gray-600">
            Gestiona tus actividades y sigue el progreso de tus estudiantes
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">3 grupos</Badge>
            </div>
            <div className="text-3xl mb-1">84</div>
            <div className="text-sm text-gray-600">Estudiantes totales</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-100 text-green-700">+2 esta semana</Badge>
            </div>
            <div className="text-3xl mb-1">15</div>
            <div className="text-sm text-gray-600">Actividades creadas</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700">+5%</Badge>
            </div>
            <div className="text-3xl mb-1">87%</div>
            <div className="text-sm text-gray-600">Promedio general</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700">Activo</Badge>
            </div>
            <div className="text-3xl mb-1">65</div>
            <div className="text-sm text-gray-600">Entregas esta semana</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('teacher-create')}
          >
            <Plus className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-xl mb-2 text-blue-900">Crear actividad adaptativa</h3>
            <p className="text-sm text-blue-700">
              Genera actividades con IA para diferentes estilos de aprendizaje
            </p>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('teacher-metrics')}
          >
            <BarChart3 className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-xl mb-2 text-green-900">Métricas grupales</h3>
            <p className="text-sm text-green-700">
              Analiza el progreso y rendimiento de tus grupos
            </p>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('teacher-users')}
          >
            <Users className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-xl mb-2 text-purple-900">Gestionar estudiantes</h3>
            <p className="text-sm text-purple-700">
              Administra permisos y accesos de usuarios
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activities List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-gray-900">Actividades recientes</h2>
              <Button onClick={() => onNavigate('teacher-create')} className="gap-2">
                <Plus className="w-4 h-4" /> Nueva actividad
              </Button>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 text-gray-900">{activity.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {activity.students} estudiantes
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {activity.completed} completaron
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {activity.dueDate}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        activity.completed === activity.students
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {activity.completed === activity.students ? 'Completada' : 'En progreso'}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Tasa de completitud</span>
                      <span className="text-gray-900">
                        {Math.round((activity.completed / activity.students) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(activity.completed / activity.students) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Promedio:</span>
                      <span className="text-lg text-gray-900">{activity.avgScore}%</span>
                      <Badge
                        variant={activity.avgScore >= 85 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.avgScore >= 85 ? 'Excelente' : 'Bueno'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('teacher-metrics')}
                      >
                        Analizar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Groups Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-gray-900">Mis grupos</h3>
              </div>
              <div className="space-y-4">
                {groups.map((group, index) => (
                  <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-900">{group.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {group.students} estudiantes
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progreso promedio</span>
                      <span className="text-gray-900">{group.avgProgress}%</span>
                    </div>
                    <Progress value={group.avgProgress} className="h-1.5" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => onNavigate('teacher-metrics')}>
                Ver métricas completas
              </Button>
            </Card>

            {/* AI Insights */}
            <Card className="p-6 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-purple-900">Insights de IA</span>
              </div>
              <div className="space-y-3 text-sm text-purple-800">
                <p>
                  💡 El 85% de tus estudiantes mejoran más con contenido visual. Considera crear más actividades visuales.
                </p>
                <p>
                  📊 El tema "Democracia" tiene la tasa de completitud más baja. Podría necesitar más tiempo o recursos.
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-green-900">Esta semana</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Entregas:</span>
                  <span className="text-green-900">65</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Promedio:</span>
                  <span className="text-green-900">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Sesiones IA:</span>
                  <span className="text-green-900">124</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
