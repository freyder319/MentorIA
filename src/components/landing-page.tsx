import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Brain, BookOpen, BarChart3, Users, Sparkles, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl text-blue-600">Mentor-IA Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              Iniciar sesión
            </Button>
            <Button onClick={() => onNavigate('register')}>
              Comenzar gratis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Potenciado por IA avanzada</span>
            </div>
            <h1 className="text-5xl mb-6 text-gray-900">
              Transforma el aprendizaje con inteligencia artificial
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Una plataforma educativa que analiza el pensamiento crítico, ofrece retroalimentación personalizada y adapta las actividades según el estilo de cada estudiante.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => onNavigate('register')} className="gap-2">
                Empezar ahora <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Ver demostración
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1645363308298-3a949c8bfd86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWNobm9sb2d5JTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYxMDQ3MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Tecnología educativa"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-900">¿Por qué elegir Mentor-IA?</h2>
            <p className="text-xl text-gray-600">
              Una plataforma completa para docentes, estudiantes y administradores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3">Análisis de Pensamiento Crítico</h3>
              <p className="text-gray-600">
                La IA evalúa y mejora las habilidades de razonamiento mediante retroalimentación reflexiva personalizada.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Actividades Adaptativas</h3>
              <p className="text-gray-600">
                Contenido que se adapta automáticamente a diferentes estilos de aprendizaje: visual, auditivo y kinestésico.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Métricas en Tiempo Real</h3>
              <p className="text-gray-600">
                Visualiza el progreso cognitivo con gráficos detallados y recomendaciones prácticas para mejorar.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-900">Para cada rol educativo</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl mb-3 text-blue-900">Estudiantes</h3>
              <ul className="space-y-2 text-blue-800">
                <li>✓ Guías interactivas paso a paso</li>
                <li>✓ Asistente IA para reflexión</li>
                <li>✓ Seguimiento de progreso personal</li>
                <li>✓ Recomendaciones personalizadas</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <BookOpen className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-2xl mb-3 text-green-900">Docentes</h3>
              <ul className="space-y-2 text-green-800">
                <li>✓ Creación de actividades adaptativas</li>
                <li>✓ Métricas grupales detalladas</li>
                <li>✓ Gestión de estudiantes</li>
                <li>✓ Exportación de reportes</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <BarChart3 className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-2xl mb-3 text-purple-900">Administradores</h3>
              <ul className="space-y-2 text-purple-800">
                <li>✓ Control total del sistema</li>
                <li>✓ Gestión de roles y permisos</li>
                <li>✓ Estadísticas globales</li>
                <li>✓ Configuración avanzada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4 text-white">
            Comienza a transformar la educación hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de educadores que ya están usando Mentor-IA Platform
          </p>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('register')} className="gap-2">
            Crear cuenta gratuita <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400">Mentor-IA Platform</span>
          </div>
          <p>© 2025 Mentor-IA Platform. Transformando la educación con inteligencia artificial.</p>
        </div>
      </footer>
    </div>
  );
}
