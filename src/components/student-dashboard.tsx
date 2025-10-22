import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Brain,
  BookOpen,
  BarChart3,
  LogOut,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [activities] = useState([
    {
      id: 1,
      title: "Cambio climático y sostenibilidad",
      status: "in-progress",
      progress: 65,
      dueDate: "25 Oct 2025"
    },
    {
      id: 2,
      title: "Revolución Industrial",
      status: "completed",
      progress: 100,
      dueDate: "20 Oct 2025"
    },
    {
      id: 3,
      title: "Democracia y derechos humanos",
      status: "pending",
      progress: 0,
      dueDate: "30 Oct 2025"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl text-blue-600">Mentor-IA Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onNavigate('home')} className="gap-2">
              <LogOut className="w-4 h-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">¡Hola, María! 👋</h1>
          <p className="text-xl text-gray-600">
            Continúa desarrollando tu pensamiento crítico
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">Activo</Badge>
            </div>
            <div className="text-3xl mb-1">12</div>
            <div className="text-sm text-gray-600">Actividades totales</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-100 text-green-700">+3 esta semana</Badge>
            </div>
            <div className="text-3xl mb-1">8</div>
            <div className="text-sm text-gray-600">Completadas</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700">+12%</Badge>
            </div>
            <div className="text-3xl mb-1">85%</div>
            <div className="text-sm text-gray-600">Nivel cognitivo</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700">Nuevo</Badge>
            </div>
            <div className="text-3xl mb-1">24</div>
            <div className="text-sm text-gray-600">Feedbacks IA</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activities List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-gray-900">Mis actividades</h2>
              <Button onClick={() => onNavigate('student-guide')} className="gap-2">
                <Sparkles className="w-4 h-4" /> Empezar con guía
              </Button>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl text-gray-900">{activity.title}</h3>
                        {activity.status === 'completed' && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {activity.status === 'in-progress' && (
                          <AlertCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {activity.dueDate}
                        </span>
                        <Badge
                          variant={
                            activity.status === 'completed'
                              ? 'default'
                              : activity.status === 'in-progress'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {activity.status === 'completed'
                            ? 'Completada'
                            : activity.status === 'in-progress'
                            ? 'En progreso'
                            : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso</span>
                      <span className="text-gray-900">{activity.progress}%</span>
                    </div>
                    <Progress value={activity.progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    {activity.status === 'in-progress' && (
                      <Button onClick={() => onNavigate('student-guide')} className="flex-1">
                        Continuar
                      </Button>
                    )}
                    {activity.status === 'pending' && (
                      <Button onClick={() => onNavigate('student-guide')} className="flex-1">
                        Comenzar
                      </Button>
                    )}
                    {activity.status === 'completed' && (
                      <Button variant="outline" className="flex-1">
                        Ver resultados
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => onNavigate('student-chat')}
                      className="gap-2"
                    >
                      <Brain className="w-4 h-4" /> Pedir ayuda IA
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <span className="text-blue-900">Asistente IA</span>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                ¿Necesitas ayuda con tu actividad? El asistente IA está listo para guiarte con preguntas reflexivas.
              </p>
              <Button
                onClick={() => onNavigate('student-chat')}
                className="w-full gap-2"
              >
                <Sparkles className="w-4 h-4" /> Abrir chat IA
              </Button>
            </Card>

            {/* Progress Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h3 className="text-gray-900">Tu progreso</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Análisis crítico</span>
                    <span className="text-gray-900">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Argumentación</span>
                    <span className="text-gray-900">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Evidencias</span>
                    <span className="text-gray-900">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => onNavigate('student-metrics')}
                className="w-full mt-4"
              >
                Ver métricas completas
              </Button>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-green-600" />
                <span className="text-green-900">Recomendación del día</span>
              </div>
              <p className="text-sm text-green-800">
                Intenta buscar contraargumentos a tu tesis principal. Esto fortalecerá tu pensamiento crítico.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
