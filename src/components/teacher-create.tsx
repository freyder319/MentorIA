import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Brain,
  ArrowLeft,
  Sparkles,
  Eye,
  Ear,
  Hand,
  Download,
  Save,
  Send,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TeacherCreateProps {
  onNavigate: (page: string) => void;
}

export function TeacherCreate({ onNavigate }: TeacherCreateProps) {
  const [step, setStep] = useState<'form' | 'generated'>('form');
  const [formData, setFormData] = useState({
    topic: '',
    objective: '',
    level: '',
    duration: '',
    context: ''
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('generated');
  };

  const adaptations = [
    {
      type: 'visual',
      icon: Eye,
      color: 'blue',
      title: 'Adaptación Visual',
      description: 'Para estudiantes que aprenden mejor con imágenes y diagramas',
      content: {
        activities: [
          'Crear un mapa conceptual sobre las causas del cambio climático',
          'Analizar infografías comparativas de emisiones de CO2',
          'Diseñar una línea de tiempo visual de eventos climáticos'
        ],
        resources: ['Diagramas de flujo', 'Gráficos interactivos', 'Videos educativos']
      }
    },
    {
      type: 'auditory',
      icon: Ear,
      color: 'green',
      title: 'Adaptación Auditiva',
      description: 'Para estudiantes que aprenden mejor escuchando',
      content: {
        activities: [
          'Participar en debate sobre políticas climáticas',
          'Escuchar podcast sobre sostenibilidad y resumir puntos clave',
          'Presentación oral argumentando soluciones al cambio climático'
        ],
        resources: ['Podcasts educativos', 'Debates grabados', 'Entrevistas a expertos']
      }
    },
    {
      type: 'kinesthetic',
      icon: Hand,
      color: 'purple',
      title: 'Adaptación Kinestésica',
      description: 'Para estudiantes que aprenden haciendo',
      content: {
        activities: [
          'Experimento: medir huella de carbono personal',
          'Proyecto práctico: diseñar plan de sostenibilidad escolar',
          'Role-play: simular cumbre climática internacional'
        ],
        resources: ['Calculadoras de huella de carbono', 'Kits de experimentos', 'Materiales reciclados']
      }
    }
  ];

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50">
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
                <span className="text-green-600">Crear actividad adaptativa</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl mb-2 text-gray-900">Nueva actividad con IA</h1>
            <p className="text-xl text-gray-600">
              La IA generará una actividad base y tres adaptaciones automáticas
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleGenerate}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="topic">Tema de la actividad *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Ej: Cambio climático y sostenibilidad"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="objective">Objetivo de aprendizaje *</Label>
                  <Textarea
                    id="objective"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="Ej: Desarrollar pensamiento crítico sobre las causas y consecuencias del cambio climático, evaluando diferentes perspectivas y propuestas de solución"
                    required
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="level">Nivel educativo *</Label>
                    <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="secundaria">Secundaria</SelectItem>
                        <SelectItem value="preparatoria">Preparatoria</SelectItem>
                        <SelectItem value="universidad">Universidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duración estimada *</Label>
                    <Select value={formData.duration} onValueChange={(val) => setFormData({ ...formData, duration: val })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutos</SelectItem>
                        <SelectItem value="1hora">1 hora</SelectItem>
                        <SelectItem value="2horas">2 horas</SelectItem>
                        <SelectItem value="1semana">1 semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="context">Contexto adicional (opcional)</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder="Información adicional que la IA debe considerar: recursos disponibles, conocimientos previos del grupo, etc."
                    className="mt-2 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-blue-900 mb-2">¿Cómo funciona la generación adaptativa?</div>
                    <p className="text-sm text-blue-800">
                      La IA analizará tu tema y objetivos para crear una actividad base de pensamiento crítico.
                      Luego generará automáticamente tres versiones adaptadas a diferentes estilos de aprendizaje:
                      visual, auditivo y kinestésico.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => onNavigate('teacher-dashboard')}>
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2">
                  <Sparkles className="w-4 h-4" /> Generar actividad con IA
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setStep('form')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Editar parámetros
            </Button>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-green-600">Actividad generada</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Descargar
            </Button>
            <Button variant="outline" className="gap-2">
              <Save className="w-4 h-4" /> Guardar borrador
            </Button>
            <Button className="gap-2" onClick={() => onNavigate('teacher-dashboard')}>
              <Send className="w-4 h-4" /> Publicar actividad
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge className="bg-green-100 text-green-700 mb-4">✨ Generado con IA</Badge>
          <h1 className="text-4xl mb-2 text-gray-900">{formData.topic || 'Cambio climático y sostenibilidad'}</h1>
          <p className="text-xl text-gray-600">
            Actividad base + 3 adaptaciones para diferentes estilos de aprendizaje
          </p>
        </div>

        {/* Base Activity */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl text-gray-900">Actividad base</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-gray-900 mb-2">Objetivo</h3>
              <p className="text-gray-700">
                {formData.objective || 'Desarrollar pensamiento crítico sobre las causas y consecuencias del cambio climático'}
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-2">Estructura guiada</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="text-gray-900 mb-1">Tesis principal</div>
                    <p className="text-sm text-gray-600">
                      Los estudiantes formularán una tesis clara sobre su postura ante el cambio climático
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-gray-900 mb-1">Razones y evidencias</div>
                    <p className="text-sm text-gray-600">
                      Desarrollarán al menos 3 razones respaldadas con datos científicos y fuentes confiables
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-gray-900 mb-1">Contraargumentos</div>
                    <p className="text-sm text-gray-600">
                      Anticiparán objeciones y desarrollarán respuestas fundamentadas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Adaptive Versions */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4 text-gray-900">Adaptaciones por estilo de aprendizaje</h2>
        </div>

        <Tabs defaultValue="visual" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {adaptations.map((adapt) => {
              const Icon = adapt.icon;
              return (
                <TabsTrigger key={adapt.type} value={adapt.type} className="gap-2">
                  <Icon className="w-4 h-4" />
                  {adapt.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {adaptations.map((adapt) => {
            const Icon = adapt.icon;
            return (
              <TabsContent key={adapt.type} value={adapt.type}>
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-${adapt.color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${adapt.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900">{adapt.title}</h3>
                      <p className="text-sm text-gray-600">{adapt.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-gray-900 mb-3">Actividades sugeridas</h4>
                      <div className="space-y-2">
                        {adapt.content.activities.map((activity, index) => (
                          <div key={index} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-gray-900 mb-3">Recursos recomendados</h4>
                      <div className="flex flex-wrap gap-2">
                        {adapt.content.resources.map((resource, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Actions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-blue-900 mb-2">Siguiente paso</div>
              <p className="text-sm text-blue-800 mb-4">
                Revisa las adaptaciones generadas y personalízalas según las necesidades específicas de tus grupos.
                Puedes editar, descargar o publicar directamente.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep('form')}>
                  Editar parámetros
                </Button>
                <Button size="sm" onClick={() => onNavigate('teacher-dashboard')}>
                  Publicar para estudiantes
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
