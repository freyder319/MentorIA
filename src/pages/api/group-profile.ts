// pages/api/group-profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsightsByClass } from "../../../server/insightsRepo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const classId = req.query.classId as string;
  if (!classId) return res.status(400).json({ error: "Falta classId" });

  const insights = await getInsightsByClass(classId);

  const counts = { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 };
  const students = new Set<string>();

  insights.forEach((i) => {
    students.add(i.studentId);
    const k = i.modality;
    if (k && k !== "mixed" && (counts as any)[k] !== undefined)
      (counts as any)[k]++;
  });

  const total = students.size;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][1] === 0 ? "mixed" : sorted[0][0];

  return res.status(200).json({
    total,
    counts,
    dominant,
  });
}
