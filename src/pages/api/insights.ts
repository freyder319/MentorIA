// pages/api/insights.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  addInsight,
  getInsightsByClass,
  ChatInsight,
} from "../../../server/insightsRepo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      classId,
      studentId,
      modality,
      level,
      strengths = [],
      needs = [],
      recentTopic,
      metrics,
    } = req.body || {};
    if (!classId || !studentId)
      return res.status(400).json({ error: "classId y studentId requeridos" });

    const created = await addInsight({
      classId,
      studentId,
      modality,
      level,
      strengths,
      needs,
      recentTopic,
      metrics,
    });
    return res.status(201).json({ ok: true, id: created.id });
  }

  if (req.method === "GET") {
    const classId = req.query.classId as string | undefined;
    if (!classId) return res.status(400).json({ error: "Falta classId" });
    const list: ChatInsight[] = await getInsightsByClass(classId);
    return res.status(200).json(list);
  }

  res.status(405).json({ error: "Método no permitido" });
}
