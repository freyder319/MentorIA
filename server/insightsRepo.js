// server/insightsRepo.js - JavaScript version for Express server

const INSIGHTS = [
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

const ROSTERS = {
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

async function addInsight(insight) {
  const item = {
    id: crypto.randomUUID(),
    createdAt: insight.createdAt ?? new Date().toISOString(),
    classId: insight.classId,
    studentId: insight.studentId,
    modality: insight.modality ?? "mixed",
    level: insight.level ?? "intermedio",
    strengths: insight.strengths ?? [],
    needs: insight.needs ?? [],
    recentTopic: insight.recentTopic,
    metrics: insight.metrics,
  };
  INSIGHTS.push(item);
  return item;
}

async function getInsightsByClass(classId) {
  return INSIGHTS.filter((i) => i.classId === classId);
}

async function getRosterByClass(classId) {
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

module.exports = {
  addInsight,
  getInsightsByClass,
  getRosterByClass,
};
