import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Brain,
  LogOut,
  Users,
  BookOpen,
  Activity,
  Settings,
  Shield,
  TrendingUp,
  Server,
  Database
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const userStats = [
    { month: 'Jun', students: 120, teachers: 15, admins: 3 },
    { month: 'Jul', students: 145, teachers: 18, admins: 3 },
    { month: 'Ago', students: 180, teachers: 22, admins: 4 },
    { month: 'Sep', students: 220, teachers: 28, admins: 4 },
    { month: 'Oct', students: 268, teachers: 34, admins: 5 }
  ];

  const activityData = [
    { day: 'Lun', sessions: 145 },
    { day: 'Mar', sessions: 168 },
    { day: 'Mié', sessions: 192 },
    { day: 'Jue', sessions: 178 },
    { day: 'Vie', sessions: 156 },
    { day: 'Sáb', sessions: 98 },
    { day: 'Dom', sessions: 76 }
  ];

  const recentActivities = [
    { user: 'Prof. García', action: 'creó 3 nuevas actividades', time: 'Hace 5 min' },
    { user: 'Ana Martínez', action: 'completó actividad de Cambio Climático', time: 'Hace 12 min' },
    { user: 'Admin López', action: 'modificó permisos de Grupo B', time: 'Hace 25 min' },
    { user: 'Carlos López', action: 'solicitó feedback de IA', time: 'Hace 35 min' },
    { user: 'Prof. Rodríguez', action: 'exportó métricas grupales', time: 'Hace 1 hora' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-xl text-purple-600">Mentor-IA Platform - Administrador</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('admin-users')}
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
          <h1 className="text-4xl mb-2 text-gray-900">Panel de Control Global 🎛️</h1>
          <p className="text-xl text-gray-600">
            Vista completa del sistema y gestión de usuarios
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white">+32 hoy</Badge>
            </div>
            <div className="text-3xl mb-1 text-blue-900">307</div>
            <div className="text-sm text-blue-700">Usuarios totales</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-600 text-white">+12 esta semana</Badge>
            </div>
            <div className="text-3xl mb-1 text-green-900">156</div>
            <div className="text-sm text-green-700">Actividades activas</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-600 text-white">+18%</Badge>
            </div>
            <div className="text-3xl mb-1 text-purple-900">1,247</div>
            <div className="text-sm text-purple-700">Sesiones esta semana</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-600 text-white">Excelente</Badge>
            </div>
            <div className="text-3xl mb-1 text-orange-900">94%</div>
            <div className="text-sm text-orange-700">Satisfacción promedio</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('admin-users')}
          >
            <Shield className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-xl mb-2 text-gray-900">Gestión de roles y permisos</h3>
            <p className="text-sm text-gray-600">
              Administra usuarios, roles y niveles de acceso del sistema
            </p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <Settings className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-xl mb-2 text-gray-900">Configuración del sistema</h3>
            <p className="text-sm text-gray-600">
              Ajusta parámetros globales y preferencias de la plataforma
            </p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <Database className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-xl mb-2 text-gray-900">Respaldos y seguridad</h3>
            <p className="text-sm text-gray-600">
              Gestiona copias de seguridad y configuración de seguridad
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Growth */}
            <Card className="p-6">
              <h3 className="text-xl mb-6 text-gray-900">Crecimiento de usuarios</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="students" name="Estudiantes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="teachers" name="Docentes" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="admins" name="Admins" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Activity Trend */}
            <Card className="p-6">
              <h3 className="text-xl mb-6 text-gray-900">Actividad semanal</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Sesiones"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* System Stats */}
            <Card className="p-6">
              <h3 className="text-xl mb-6 text-gray-900">Estado del sistema</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uso de servidor</span>
                    </div>
                    <span className="text-sm text-gray-900">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Almacenamiento</span>
                    </div>
                    <span className="text-sm text-gray-900">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Tráfico de red</span>
                    </div>
                    <span className="text-sm text-gray-900">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl text-green-900">99.8%</div>
                  <div className="text-xs text-green-700">Uptime</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl text-blue-900">124ms</div>
                  <div className="text-xs text-blue-700">Latencia</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl text-purple-900">2.4k</div>
                  <div className="text-xs text-purple-700">Req/min</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Distribution */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Distribución de usuarios</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estudiantes</span>
                  <span className="text-sm text-gray-900">268 (87%)</span>
                </div>
                <Progress value={87} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Docentes</span>
                  <span className="text-sm text-gray-900">34 (11%)</span>
                </div>
                <Progress value={11} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Administradores</span>
                  <span className="text-sm text-gray-900">5 (2%)</span>
                </div>
                <Progress value={2} className="h-2" />
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Actividad reciente</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
                    <div className="text-sm text-gray-900 mb-1">{activity.user}</div>
                    <div className="text-xs text-gray-600 mb-1">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-sm">
                Ver todo el registro
              </Button>
            </Card>

            {/* Alerts */}
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-yellow-600" />
                <h3 className="text-yellow-900">Alertas del sistema</h3>
              </div>
              <div className="space-y-2 text-sm text-yellow-800">
                <p>⚠️ El almacenamiento alcanzó el 68%. Considera aumentar capacidad.</p>
                <p>✅ Actualización de seguridad disponible.</p>
                <p>📊 Backup programado para esta noche a las 2:00 AM.</p>
              </div>
            </Card>

            {/* System Info */}
            <Card className="p-6 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-purple-900">Información del sistema</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Versión:</span>
                  <span className="text-purple-900">v2.4.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Última actualización:</span>
                  <span className="text-purple-900">15 Oct 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Próximo mantenimiento:</span>
                  <span className="text-purple-900">28 Oct 2025</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
