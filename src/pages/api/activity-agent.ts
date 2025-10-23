// pages/api/activity-agent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInsightsByClass,
  getRosterByClass,
} from "../../../server/insightsRepo";
import type { Modality } from "../../../server/insightsRepo";

type ActivityBase = {
  objetivo: string;
  pasos: Array<{ titulo: string; descripcion: string }>;
};
type ActivityPlanByModality = { actividades: string[]; recursos: string[] };

const DEFAULT_BY_MODALITY: Record<
  Exclude<Modality, "mixed">,
  ActivityPlanByModality
> = {
  visual: {
    actividades: [
      "Mapa conceptual de causas/efectos",
      "Análisis de 2 infografías",
      "Línea de tiempo visual",
    ],
    recursos: ["Diagramas de flujo", "Gráficos", "Videos cortos"],
  },
  auditory: {
    actividades: [
      "Debate estructurado",
      "Podcast + resumen oral",
      "Pitch de 2 minutos",
    ],
    recursos: ["Podcasts", "Grabaciones", "Rúbrica de debate"],
  },
  reading: {
    actividades: [
      "Ensayo breve (3 evidencias)",
      "Fichas de 2 artículos (APA)",
      "Glosario de conceptos",
    ],
    recursos: ["Artículos", "Reportes", "Guía de citas"],
  },
  kinesthetic: {
    actividades: [
      "Experimento/medición local",
      "Plan de intervención",
      "Role-play de decisiones",
    ],
    recursos: ["Kits/Materiales", "Plantillas de proyecto", "Checklists"],
  },
};

function buildBase(topic: string, objective: string): ActivityBase {
  return {
    objetivo: objective || `Desarrollar pensamiento crítico sobre ${topic}`,
    pasos: [
      {
        titulo: "Formular tesis",
        descripcion: "Define una postura clara y delimitada.",
      },
      {
        titulo: "Evidencias",
        descripcion: "Selecciona 3 evidencias confiables con cita.",
      },
      {
        titulo: "Contraargumento",
        descripcion: "Anticipa objeciones y respóndelas.",
      },
    ],
  };
}

function personalizeFromInsight(i: any, topic: string) {
  const objetivos: string[] = [];
  const pasos: Array<{ titulo: string; descripcion: string }> = [];
  const recursos: string[] = [];

  if (i?.needs?.includes("síntesis") || i?.needs?.includes("sintesis")) {
    objetivos.push("Mejorar la síntesis de información");
    pasos.push({
      titulo: "Esquema 10-20-30",
      descripcion: "Reduce a 10 ideas, 20 palabras, 30 segundos.",
    });
  }
  if (i?.needs?.includes("contraargumentos")) {
    objetivos.push("Fortalecer el manejo de contraargumentos");
    pasos.push({
      titulo: "Tabla Objeción-Respuesta-Evidencia",
      descripcion: "Completa O-R-E con fuentes.",
    });
  }
  if (i?.metrics) {
    if (i.metrics.analisis < 70)
      objetivos.push("Profundizar en análisis de causas/efectos");
    if (i.metrics.reflexion < 70)
      objetivos.push("Elevar reflexión metacognitiva");
    if (i.metrics.sintesis < 70) objetivos.push("Mejorar síntesis");
  }

  const mod = i?.modality === "mixed" ? "reading" : i?.modality || "reading";
  recursos.push(
    ...DEFAULT_BY_MODALITY[mod as Exclude<Modality, "mixed">].recursos
  );

  const nivel = i?.level ?? "intermedio";
  if (nivel === "basico")
    pasos.push({
      titulo: "Andamiaje básico",
      descripcion: "Plantilla Causa–Evidencia–Conclusión.",
    });
  if (nivel === "avanzado")
    pasos.push({
      titulo: "Indicadores",
      descripcion: "Define 2 KPIs para evaluar tu propuesta.",
    });

  pasos.push({
    titulo: `Aplicación al contexto: ${topic}`,
    descripcion: "Conecta con un caso local.",
  });

  return {
    objetivos,
    pasos,
    recursos,
    modalidad: i?.modality ?? "mixed",
    nivel,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const {
    id_clase,
    titulo,
    objetivo,
    perfil_aprendizaje = "mixed",
  } = req.body || {};
  if (!id_clase) return res.status(400).json({ error: "Falta id_clase" });

  const insights = await getInsightsByClass(id_clase);
  const roster = await getRosterByClass(id_clase);

  const base = buildBase(titulo ?? "Actividad", objetivo ?? "");
  const adaptaciones =
    perfil_aprendizaje === "mixed"
      ? DEFAULT_BY_MODALITY
      : {
          [perfil_aprendizaje]:
            DEFAULT_BY_MODALITY[
              perfil_aprendizaje as Exclude<Modality, "mixed">
            ],
        };

  // Variaciones por estudiante
  const por_estudiante = roster.map((r) => {
    const last = insights
      .filter((i) => i.studentId === r.studentId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
    const seed = last ?? {
      modality: "reading",
      level: "intermedio",
      needs: ["síntesis"],
      metrics: { analisis: 70, reflexion: 70, sintesis: 60 },
    };
    const p = personalizeFromInsight(seed, titulo ?? "tema");
    const objetivos = p.objetivos.length
      ? p.objetivos
      : ["Consolidar argumento con evidencias"];
    const pasos = p.pasos.length ? p.pasos : base.pasos;
    return {
      studentId: r.studentId,
      nombre: r.nombre,
      modalidad: p.modalidad,
      nivel: p.nivel,
      objetivos_personalizados: objetivos,
      pasos_personalizados: pasos,
      recursos: p.recursos,
    };
  });

  // Conteo por estilo
  const por_estilo = insights.reduce<Record<string, { estudiantes: number }>>(
    (acc, cur) => {
      const k = cur.modality === "mixed" ? "reading" : cur.modality;
      acc[k] = acc[k] || { estudiantes: 0 };
      acc[k].estudiantes++;
      return acc;
    },
    {}
  );

  return res.status(200).json({
    activity: { id_actividad: `act-${id_clase}-${Date.now()}` },
    stats: {
      estudiantes: roster.length,
      planes_creados: por_estudiante.length,
    },
    por_estilo,
    base,
    adaptaciones,
    por_estudiante,
  });
}
