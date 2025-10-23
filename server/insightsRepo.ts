// server/insightsRepo.ts
import type { NextApiRequest } from "next";

export type Modality =
  | "visual"
  | "auditory"
  | "reading"
  | "kinesthetic"
  | "mixed";

export interface ChatInsight {
  id: string;
  classId: string;
  studentId: string;
  createdAt: string;
  modality: Modality;
  level: "basico" | "intermedio" | "avanzado";
  strengths: string[];
  needs: string[];
  recentTopic?: string;
  metrics?: { analisis: number; reflexion: number; sintesis: number };
}

export interface RosterItem {
  studentId: string;
  nombre: string;
}

const INSIGHTS: ChatInsight[] = [
  // Datos de prueba para la clase que estás usando
  {
    id: "1",
    classId: "55eb11c4-3a95-4f1a-91a9-c49d22f90695",
    studentId: "s1",
    createdAt: new Date().toISOString(),
    modality: "visual",
    level: "intermedio",
    strengths: ["síntesis visual"],
    needs: ["argumentación"],
    recentTopic: "cambio climático",
    metrics: { analisis: 70, reflexion: 80, sintesis: 75 },
  },
  {
    id: "2",
    classId: "55eb11c4-3a95-4f1a-91a9-c49d22f90695",
    studentId: "s2",
    createdAt: new Date().toISOString(),
    modality: "auditory",
    level: "basico",
    strengths: ["debate"],
    needs: ["escritura"],
    recentTopic: "cambio climático",
    metrics: { analisis: 60, reflexion: 70, sintesis: 65 },
  },
  {
    id: "3",
    classId: "55eb11c4-3a95-4f1a-91a9-c49d22f90695",
    studentId: "s3",
    createdAt: new Date().toISOString(),
    modality: "reading",
    level: "avanzado",
    strengths: ["análisis textual"],
    needs: ["creatividad"],
    recentTopic: "cambio climático",
    metrics: { analisis: 85, reflexion: 75, sintesis: 90 },
  },
];

const ROSTERS: Record<string, RosterItem[]> = {
  // Mock: cambia por tu matrícula real
  "demo-class-1": [
    { studentId: "s1", nombre: "Ana" },
    { studentId: "s2", nombre: "Luis" },
    { studentId: "s3", nombre: "María" },
  ],
  "55eb11c4-3a95-4f1a-91a9-c49d22f90695": [
    { studentId: "s1", nombre: "Ana" },
    { studentId: "s2", nombre: "Luis" },
    { studentId: "s3", nombre: "María" },
  ],
};

export async function addInsight(
  i: Omit<ChatInsight, "id" | "createdAt"> & Partial<ChatInsight>
) {
  const item: ChatInsight = {
    id: crypto.randomUUID(),
    createdAt: i.createdAt ?? new Date().toISOString(),
    classId: i.classId!,
    studentId: i.studentId!,
    modality: i.modality ?? "mixed",
    level: i.level ?? "intermedio",
    strengths: i.strengths ?? [],
    needs: i.needs ?? [],
    recentTopic: i.recentTopic,
    metrics: i.metrics,
  };
  INSIGHTS.push(item);
  return item;
}

export async function getInsightsByClass(classId: string) {
  return INSIGHTS.filter((i) => i.classId === classId);
}

export async function getRosterByClass(classId: string): Promise<RosterItem[]> {
  // Si no hay roster, crea uno básico a partir de los insights
  if (!ROSTERS[classId]) {
    const ids = Array.from(
      new Set(
        INSIGHTS.filter((i) => i.classId === classId).map((i) => i.studentId)
      )
    );
    ROSTERS[classId] = ids.map((sid, idx) => ({
      studentId: sid,
      nombre: `Estudiante ${idx + 1}`,
    }));
  }
  return ROSTERS[classId] || [];
}
