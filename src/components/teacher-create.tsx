import { useMemo, useState, useEffect } from "react";
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
  Lightbulb,
  Book
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TeacherCreateProps {
  onNavigate: (page: string) => void;
}

type Modality = "visual" | "auditory" | "reading" | "kinesthetic" | "mixed";

type ActivityStats = {
  estudiantes: number;
  planes_creados: number;
};

type ActivityResult = {
  activity?: { id_actividad?: string };
  stats?: ActivityStats;
  por_estilo?: Record<string, { estudiantes: number }>;
  error?: string;
  details?: unknown;
  // Contenido generado por el backend (si existe)
  base?: {
    objetivo?: string;
    pasos?: Array<{ titulo: string; descripcion: string }>;
  };
  adaptaciones?: Record<Modality, {
    actividades: string[];
    recursos: string[];
  }>;
};

export function TeacherCreate({ onNavigate }: TeacherCreateProps) {
  const [step, setStep] = useState<'form' | 'generated'>("form");
  const [formData, setFormData] = useState({
    topic: "",
    objective: "",
    level: "",
    duration: "",
    context: ""
  });
  const [classId, setClassId] = useState("");
  const [activityResult, setActivityResult] = useState<ActivityResult | null>(null);
  const [groupProfile, setGroupProfile] = useState<{
    total: number;
    counts: { visual: number; auditory: number; reading: number; kinesthetic: number };
    dominant: 'visual'|'auditory'|'reading'|'kinesthetic'|'mixed';
  } | null>(null);
  const [learningProfile, setLearningProfile] = useState<Modality>("mixed");
  const [loading, setLoading] = useState(false);

  // Carga automática del perfil del grupo al pegar id_clase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!classId) return;
      try {
        const res = await fetch(`/api/group-profile?classId=${classId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Error perfil');
        setGroupProfile(data);
        setLearningProfile(data.dominant);
      } catch (e) {
        setGroupProfile(null);
      }
    };
    const t = setTimeout(fetchProfile, 400);
    return () => clearTimeout(t);
  }, [classId]);

  // Mapeo seguro de clases Tailwind (evita strings dinámicos sueltos)
  const colorByModality: Record<Exclude<Modality, "mixed">, { bg: string; fg: string }> = {
    visual: { bg: "bg-blue-100", fg: "text-blue-600" },
    auditory: { bg: "bg-green-100", fg: "text-green-600" },
    reading: { bg: "bg-amber-100", fg: "text-amber-600" },
    kinesthetic: { bg: "bg-purple-100", fg: "text-purple-600" },
  };

  const iconByModality: Record<Exclude<Modality, "mixed">, any> = {
    visual: Eye,
    auditory: Ear,
    reading: Book,
    kinesthetic: Hand,
  };

  const defaultAdaptations: Record<Exclude<Modality, "mixed">, {
    title: string;
    description: string;
    activities: string[];
    resources: string[];
  }> = {
    visual: {
      title: "Adaptación Visual",
      description: "Para estudiantes que aprenden mejor con imágenes y diagramas",
      activities: [
        "Crear un mapa conceptual sobre las causas del cambio climático",
        "Analizar infografías comparativas de emisiones de CO2",
        "Diseñar una línea de tiempo visual de eventos climáticos"
      ],
      resources: ["Diagramas de flujo", "Gráficos interactivos", "Videos educativos"]
    },
    auditory: {
      title: "Adaptación Auditiva",
      description: "Para estudiantes que aprenden mejor escuchando",
      activities: [
        "Participar en debate sobre políticas climáticas",
        "Escuchar un podcast y resumir puntos clave",
        "Exposición oral defendiendo una solución"
      ],
      resources: ["Podcasts educativos", "Debates grabados", "Entrevistas a expertos"]
    },
    reading: {
      title: "Lectura/Escritura",
      description: "Para quienes procesan mejor leyendo y redactando",
      activities: [
        "Redactar un ensayo breve con tesis y 3 evidencias",
        "Fichar 2 artículos y comparar argumentos",
        "Elaborar glosario con términos clave"
      ],
      resources: ["Artículos académicos", "Reportes", "Guías de estilo"]
    },
    kinesthetic: {
      title: "Adaptación Kinestésica",
      description: "Para estudiantes que aprenden haciendo",
      activities: [
        "Experimento: medir huella de carbono personal",
        "Proyecto: plan de sostenibilidad escolar",
        "Role‑play: simular una cumbre climática"
      ],
      resources: ["Calculadoras de huella", "Kits de experimentos", "Materiales reciclados"]
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivityResult(null);
    if (loading) return;
    try {
      if (!classId) {
        setActivityResult({ error: "Debes ingresar el ID de la clase (id_clase)" });
        return;
      }
      setLoading(true);

      // Mapeo de campos locales -> backend
      const payload = {
        id_clase: classId,
        titulo: formData.topic || "Actividad sin título",
        objetivo: formData.objective || "Objetivo no definido",
        nivel_taxonomia: formData.level || "analizar",
        tipo_recurso: "mixto",
        complejidad: formData.duration || "media",
        contexto: formData.context || "",
        // NUEVO: perfil de aprendizaje preferido; si es "mixed" el backend puede decidir según datos del grupo
        perfil_aprendizaje: learningProfile,
      };

      const res = await fetch("/api/activity-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ActivityResult = await res.json();
      if (!res.ok) {
        setActivityResult({ error: (data as any)?.error || "Error al generar actividad", details: (data as any)?.details });
      } else {
        setActivityResult(data);
        setStep("generated");
      }
    } catch (err: any) {
      setActivityResult({ error: err?.message || "Error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  const tabsToShow: Exclude<Modality, "mixed">[] = useMemo(() => {
    if (learningProfile === "mixed") return ["visual", "auditory", "reading", "kinesthetic"];
    return [learningProfile];
  }, [learningProfile]);

  const defaultTab = tabsToShow[0];

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate("teacher-dashboard")}
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
              La IA generará una actividad base y adaptaciones automáticas según el perfil de aprendizaje.
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleGenerate}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="classId">ID de la clase (id_clase) *</Label>
                  <Input
                    id="classId"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    placeholder="Pega aquí el UUID de la clase"
                    required
                    className="mt-2"
                  />
                </div>

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
                    placeholder="Ej: Desarrollar pensamiento crítico evaluando causas, consecuencias y soluciones"
                    required
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
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

                  <div>
                    <Label htmlFor="profile">Perfil de aprendizaje</Label>
                    <Select value={learningProfile} onValueChange={(val) => setLearningProfile(val as Modality)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Mixto (auto)</SelectItem>
                        <SelectItem value="visual">Visual</SelectItem>
                        <SelectItem value="auditory">Auditivo</SelectItem>
                        <SelectItem value="reading">Lectura/Escritura</SelectItem>
                        <SelectItem value="kinesthetic">Kinestésico</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Si eliges "Mixto", el backend puede decidir según datos del grupo.</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="context">Contexto adicional (opcional)</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder="Recursos disponibles, conocimientos previos, limitaciones, etc."
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
                      La IA crea una actividad base y versiones adaptadas al perfil de aprendizaje (visual, auditivo, lectura/escritura o kinestésico).
                      También puedes dejarlo en modo mixto para que se ajuste a la composición del grupo. Si pegas un ID de clase válido,
                      detectaremos automáticamente el perfil dominante del grupo y lo usaremos al generar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => onNavigate("teacher-dashboard")}>Cancelar</Button>
                <Button type="submit" className="gap-2" disabled={loading}>
                  <Sparkles className="w-4 h-4" /> {loading ? "Generando..." : "Generar actividad con IA"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Vista generada
  const baseObjetivo = activityResult?.base?.objetivo || formData.objective ||
    "Desarrollar pensamiento crítico sobre el tema seleccionado";

  const basePasos = activityResult?.base?.pasos || [
    { titulo: "Tesis principal", descripcion: "Formular una tesis clara sobre la postura del equipo" },
    { titulo: "Razones y evidencias", descripcion: "Aportar al menos 3 razones con fuentes confiables" },
    { titulo: "Contraargumentos", descripcion: "Anticipar objeciones y responder de forma fundamentada" },
  ];

  // Si el backend regresó adaptaciones, úsalas; si no, recurre a las de defecto
  const uiAdaptaciones = useMemo(() => {
    const out: Array<{
      type: Exclude<Modality, "mixed">;
      title: string;
      description: string;
      activities: string[];
      resources: string[];
    }> = [];

    tabsToShow.forEach((mod) => {
      const server = activityResult?.adaptaciones?.[mod as Exclude<Modality, "mixed">];
      const fallback = defaultAdaptations[mod as Exclude<Modality, "mixed">];
      out.push({
        type: mod as Exclude<Modality, "mixed">,
        title: server ? fallback.title : fallback.title,
        description: server ? fallback.description : fallback.description,
        activities: server?.actividades || fallback.activities,
        resources: server?.recursos || fallback.resources,
      });
    });
    return out;
  }, [activityResult?.adaptaciones, tabsToShow]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setStep("form")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Editar parámetros
            </Button>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-green-600">Actividad generada</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Descargar</Button>
            <Button variant="outline" className="gap-2"><Save className="w-4 h-4" /> Guardar borrador</Button>
            <Button className="gap-2" onClick={() => onNavigate("teacher-dashboard")}>
              <Send className="w-4 h-4" /> Publicar actividad
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge className="bg-green-100 text-green-700 mb-4">✨ Generado con IA</Badge>
          <h1 className="text-4xl mb-2 text-gray-900">{formData.topic || "Actividad de pensamiento crítico"}</h1>
          <p className="text-xl text-gray-600">Actividad base {learningProfile !== "mixed" && 
            <>
              + adaptación <span className="font-semibold">{learningProfile}</span>
            </>
          }{learningProfile === "mixed" && 
            <>+ múltiples adaptaciones para diferentes estilos</>
          }</p>
        </div>

        {activityResult && (
          <Card className="p-6 mb-8">
            {activityResult.error ? (
              <div className="text-red-700">
                {activityResult.error}
                {activityResult.details && (
                  <pre className="mt-2 text-xs text-red-800 whitespace-pre-wrap break-words bg-red-50 p-2 rounded">{String(activityResult.details)}</pre>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex gap-4 flex-wrap">
                  <Badge variant="outline">Actividad: {activityResult.activity?.id_actividad || "—"}</Badge>
                  <Badge variant="outline">Estudiantes: {activityResult.stats?.estudiantes ?? 0}</Badge>
                  <Badge variant="outline">Planes creados: {activityResult.stats?.planes_creados ?? 0}</Badge>
                </div>
                {activityResult.por_estilo && (
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(activityResult.por_estilo).map(([k, v]) => (
                      <Badge key={k} className="bg-blue-50 text-blue-700" variant="outline">{k}: {(v as any).estudiantes}</Badge>
                    ))}
                  </div>
                )}

                {groupProfile && (
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">Total: {groupProfile.total}</Badge>
                      <Badge className="bg-blue-50 text-blue-700" variant="outline">Visual: {groupProfile.counts.visual}</Badge>
                      <Badge className="bg-green-50 text-green-700" variant="outline">Auditivo: {groupProfile.counts.auditory}</Badge>
                      <Badge className="bg-amber-50 text-amber-700" variant="outline">Lectura/Escritura: {groupProfile.counts.reading}</Badge>
                      <Badge className="bg-purple-50 text-purple-700" variant="outline">Kinestésico: {groupProfile.counts.kinesthetic}</Badge>
                    </div>
                    <div className="text-gray-700">
                      Perfil dominante: <span className="font-medium">{groupProfile.dominant === 'reading' ? 'Lectura/Escritura' : groupProfile.dominant}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Actividad Base */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl text-gray-900">Actividad base</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-gray-900 mb-2">Objetivo</h3>
              <p className="text-gray-700">{baseObjetivo}</p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-2">Estructura guiada</h3>
              <div className="space-y-3">
                {basePasos.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">{idx + 1}</div>
                    <div>
                      <div className="text-gray-900 mb-1">{p.titulo}</div>
                      <p className="text-sm text-gray-600">{p.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Adaptaciones */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4 text-gray-900">Adaptaciones por estilo de aprendizaje</h2>
        </div>

        <Tabs defaultValue={defaultTab} className="mb-8">
          <TabsList className={`grid w-full ${tabsToShow.length === 1 ? "grid-cols-1" : "grid-cols-4"} mb-6`}>
            {tabsToShow.map((type) => {
              const Icon = iconByModality[type];
              const colors = colorByModality[type];
              return (
                <TabsTrigger key={type} value={type} className="gap-2">
                  <Icon className={`w-4 h-4 ${colors.fg}`} />
                  {type === "visual" && "Visual"}
                  {type === "auditory" && "Auditivo"}
                  {type === "reading" && "Lectura/Escritura"}
                  {type === "kinesthetic" && "Kinestésico"}
                  {learningProfile !== "mixed" && learningProfile === type && (
                    <Badge className="ml-2">Recomendado</Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {uiAdaptaciones.map((adapt) => {
            const Icon = iconByModality[adapt.type];
            const colors = colorByModality[adapt.type];
            return (
              <TabsContent key={adapt.type} value={adapt.type}>
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.fg}`} />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900">{adapt.type === "reading" ? "Lectura/Escritura" : adapt.type === "auditory" ? "Adaptación Auditiva" : adapt.type === "visual" ? "Adaptación Visual" : "Adaptación Kinestésica"}</h3>
                      <p className="text-sm text-gray-600">{
                        defaultAdaptations[adapt.type].description
                      }</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-gray-900 mb-3">Actividades sugeridas</h4>
                      <div className="space-y-2">
                        {adapt.activities.map((activity, index) => (
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
                        {adapt.resources.map((resource, index) => (
                          <Badge key={index} variant="outline" className="text-sm">{resource}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Acciones */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-blue-900 mb-2">Siguiente paso</div>
              <p className="text-sm text-blue-800 mb-4">
                Revisa las adaptaciones y personalízalas según tu grupo. Puedes editar, descargar o publicar.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep("form")}>Editar parámetros</Button>
                <Button size="sm" onClick={() => onNavigate("teacher-dashboard")}>Publicar para estudiantes</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
