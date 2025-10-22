import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Brain, ArrowLeft } from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: string, role?: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: redirect based on email domain
    if (email.includes('student')) {
      onNavigate('student-dashboard', 'student');
    } else if (email.includes('teacher') || email.includes('docente')) {
      onNavigate('teacher-dashboard', 'teacher');
    } else if (email.includes('admin')) {
      onNavigate('admin-dashboard', 'admin');
    } else {
      onNavigate('student-dashboard', 'student');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl text-blue-600">Mentor-IA Platform</span>
          </div>

          <h2 className="text-3xl mb-2 text-gray-900">Iniciar sesión</h2>
          <p className="text-gray-600 mb-8">
            Accede a tu cuenta educativa
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" />
                Recordarme
              </label>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button type="submit" className="w-full mb-4">
              Iniciar sesión
            </Button>

            <div className="text-center text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-blue-600 hover:underline"
              >
                Regístrate gratis
              </button>
            </div>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              💡 <strong>Demo:</strong> Usa estos emails para probar diferentes roles:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• student@demo.com → Panel de Estudiante</li>
              <li>• teacher@demo.com → Panel de Docente</li>
              <li>• admin@demo.com → Panel de Administrador</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
