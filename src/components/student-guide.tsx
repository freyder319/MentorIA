import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Brain,
  ArrowLeft,
  Lightbulb,
  FileText,
  Target,
  Shield,
  Download,
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface StudentGuideProps {
  onNavigate: (page: string) => void;
}

export function StudentGuide({ onNavigate }: StudentGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  const steps = [
    {
      id: 0,
      title: "Tesis principal",
      icon: Target,
      color: "blue",
      prompt: "Formula tu tesis o argumento principal sobre el tema 'Cambio climático y sostenibilidad'",
      placeholder: "Ejemplo: El cambio climático requiere acciones inmediatas tanto individuales como gubernamentales para asegurar un futuro sostenible..."
    },
    {
      id: 1,
      title: "Razón 1",
      icon: Lightbulb,
      color: "green",
      prompt: "Proporciona tu primera razón que apoya tu tesis",
      placeholder: "Ejemplo: Los datos científicos muestran un aumento constante de la temperatura global..."
    },
    {
      id: 2,
      title: "Evidencia",
      icon: FileText,
      color: "purple",
      prompt: "Añade evidencias que respalden tu primera razón",
      placeholder: "Ejemplo: Según el Panel Intergubernamental sobre Cambio Climático (IPCC), la temperatura ha aumentado 1.1°C desde 1850..."
    },
    {
      id: 3,
      title: "Contraargumento",
      icon: Shield,
      color: "orange",
      prompt: "Considera un contraargumento y cómo responderías a él",
      placeholder: "Ejemplo: Algunos argumentan que los ciclos naturales causan el calentamiento. Sin embargo, la velocidad actual del cambio no tiene precedentes..."
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResponseChange = (value: string) => {
    setResponses({ ...responses, [currentStep]: value });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

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
              <span className="text-blue-600">Guía de pensamiento crítico</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Descargar PDF
            </Button>
            <Button onClick={() => onNavigate('student-chat')} className="gap-2">
              <Sparkles className="w-4 h-4" /> Solicitar feedback
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-gray-900 mb-4">Estructura del argumento</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = responses[step.id]?.length > 0;
                  const isCurrent = currentStep === index;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'border-2 border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-100'
                            : isCurrent
                            ? `bg-${step.color}-100`
                            : 'bg-gray-100'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Icon className={`w-4 h-4 text-${step.color}-600`} />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm text-gray-900">{step.title}</div>
                        <div className="text-xs text-gray-500">Paso {index + 1}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600 mb-2">Progreso general</div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="text-sm text-gray-900">{Math.round(progress)}% completado</div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {/* Step Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full bg-${currentStepData.color}-100 flex items-center justify-center`}>
                  <StepIcon className={`w-6 h-6 text-${currentStepData.color}-600`} />
                </div>
                <div>
                  <Badge className={`bg-${currentStepData.color}-100 text-${currentStepData.color}-700 mb-2`}>
                    Paso {currentStep + 1} de {steps.length}
                  </Badge>
                  <h2 className="text-3xl text-gray-900">{currentStepData.title}</h2>
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-blue-700 mb-1">Instrucción</div>
                    <p className="text-blue-900">{currentStepData.prompt}</p>
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <div className="mb-6">
                <Textarea
                  value={responses[currentStep] || ''}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="min-h-[300px] text-base"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{responses[currentStep]?.length || 0} caracteres</span>
                  <span>Mínimo recomendado: 150 caracteres</span>
                </div>
              </div>

              {/* AI Suggestions */}
              <Card className="p-4 bg-purple-50 border-purple-200 mb-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-purple-900 mb-2">
                      💡 Sugerencia de la IA
                    </div>
                    <p className="text-sm text-purple-800">
                      Intenta ser específico y concreto. Usa ejemplos del mundo real para fortalecer tu argumento. Recuerda citar fuentes cuando sea posible.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Anterior
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('student-chat')}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Pedir ayuda IA
                  </Button>
                  
                  {currentStep === steps.length - 1 ? (
                    <Button onClick={() => onNavigate('student-dashboard')} className="gap-2">
                      Finalizar <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Siguiente
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Tips Section */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">Buenas prácticas</span>
                </div>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ Sé claro y conciso</li>
                  <li>✓ Usa evidencias concretas</li>
                  <li>✓ Considera múltiples perspectivas</li>
                </ul>
              </Card>

              <Card className="p-4 bg-orange-50 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-900">Recuerda</span>
                </div>
                <p className="text-sm text-orange-800">
                  Puedes guardar tu progreso en cualquier momento y la IA analizará tu trabajo al final.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
