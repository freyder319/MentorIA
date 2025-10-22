import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Brain, User, GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";

interface RegisterPageProps {
  onNavigate: (page: string, role?: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleContinue = () => {
    const dashboardMap: Record<string, string> = {
      student: 'student-dashboard',
      teacher: 'teacher-dashboard',
      admin: 'admin-dashboard'
    };
    onNavigate(dashboardMap[selectedRole], selectedRole);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl mb-3 text-gray-900">¡Cuenta creada con éxito!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta como {selectedRole === 'student' ? 'Estudiante' : selectedRole === 'teacher' ? 'Docente' : 'Administrador'} ha sido creada correctamente.
          </p>
          <Button onClick={handleContinue} className="w-full">
            Ir al panel de control
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
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

          <h2 className="text-3xl mb-2 text-gray-900">Crear cuenta</h2>
          <p className="text-gray-600 mb-8">
            Únete a nuestra plataforma educativa inteligente
          </p>

          <form onSubmit={handleRegister}>
            {/* Role Selection */}
            <div className="mb-8">
              <Label className="mb-4 block">Selecciona tu rol</Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                <div className="grid md:grid-cols-3 gap-4">
                  <label
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedRole === 'student'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <RadioGroupItem value="student" id="student" className="sr-only" />
                    <div className="flex flex-col items-center text-center">
                      <User className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="text-gray-900">Estudiante</span>
                      <span className="text-sm text-gray-500 mt-1">
                        Aprende con guías IA
                      </span>
                    </div>
                  </label>

                  <label
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedRole === 'teacher'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                    <div className="flex flex-col items-center text-center">
                      <GraduationCap className="w-8 h-8 text-green-600 mb-2" />
                      <span className="text-gray-900">Docente</span>
                      <span className="text-sm text-gray-500 mt-1">
                        Crea y gestiona actividades
                      </span>
                    </div>
                  </label>

                  <label
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <RadioGroupItem value="admin" id="admin" className="sr-only" />
                    <div className="flex flex-col items-center text-center">
                      <Brain className="w-8 h-8 text-purple-600 mb-2" />
                      <span className="text-gray-900">Administrador</span>
                      <span className="text-sm text-gray-500 mt-1">
                        Gestiona el sistema
                      </span>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: María García"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mb-4">
              Crear cuenta
            </Button>

            <div className="text-center text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
