// server/insightsRepo.ts
import type { NextApiRequest } from "next";

export type Modality = "visual" | "auditory" | "reading" | "kinesthetic" | "mixed";

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

const INSIGHTS: ChatInsight[] = [];
const ROSTERS: Record<string, RosterItem[]> = {
  // Mock: cambia por tu matrícula real
  "demo-class-1": [
    { studentId: "s1", nombre: "Ana" },
    { studentId: "s2", nombre: "Luis" },
    { studentId: "s3", nombre: "María" },
  ],
};

export async function addInsight(i: Omit<ChatInsight, "id" | "createdAt"> & Partial<ChatInsight>) {
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
  return INSIGHTS.filter(i => i.classId === classId);
}

export async function getRosterByClass(classId: string): Promise<RosterItem[]> {
  // Si no hay roster, crea uno básico a partir de los insights
  if (!ROSTERS[classId]) {
    const ids = Array.from(new Set(INSIGHTS.filter(i => i.classId === classId).map(i => i.studentId)));
    ROSTERS[classId] = ids.map((sid, idx) => ({ studentId: sid, nombre: `Estudiante ${idx + 1}` }));
  }
  return ROSTERS[classId] || [];
}
