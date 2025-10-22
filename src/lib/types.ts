// lib/types.ts
export type Modality = "visual" | "auditory" | "reading" | "kinesthetic" | "mixed";
export type LevelTax = "recordar" | "entender" | "aplicar" | "analizar" | "evaluar" | "crear";

export interface ClassMember {
  studentId: string;
  nombre: string;
  classId: string;
}

export interface ChatInsight {
  id: string;
  classId: string;
  studentId: string;
  createdAt: string; // ISO
  // inferencias del StudentChat (agent 1)
  modality: Modality;          // preferencia detectada
  level: "basico" | "intermedio" | "avanzado";
  strengths: string[];         // p.ej. "evidencia cuantitativa"
  needs: string[];             // p.ej. "contraargumentos", "síntesis"
  recentTopic?: string;        // tema del diálogo
  // métricas de pensamiento crítico
  metrics?: { analisis: number; reflexion: number; sintesis: number }; // 0–100
}

export interface GroupProfile {
  total: number;
  counts: { visual: number; auditory: number; reading: number; kinesthetic: number };
  dominant: Exclude<Modality, "mixed"> | "mixed";
}

export interface ActivityBase {
  objetivo: string;
  pasos: Array<{ titulo: string; descripcion: string }>;
}

export interface ActivityPlanByModality {
  actividades: string[];
  recursos: string[];
}

export interface ActivityAgentResponse {
  activity?: { id_actividad?: string };
  stats?: { estudiantes: number; planes_creados: number };
  por_estilo?: Record<string, { estudiantes: number }>;
  base?: ActivityBase;
  adaptaciones?: Record<Exclude<Modality,"mixed">, ActivityPlanByModality>;
  // NUEVO: variaciones por estudiante (Agent2Agent real)
  por_estudiante?: Array<{
    studentId: string;
    nombre: string;
    modalidad: Modality;
    nivel: "basico" | "intermedio" | "avanzado";
    objetivos_personalizados: string[];
    pasos_personalizados: Array<{ titulo: string; descripcion: string }>;
    recursos: string[];
  }>;
  error?: string;
  details?: unknown;
}
