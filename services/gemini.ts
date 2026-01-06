
import { GoogleGenAI, Type } from "@google/genai";
import { PointLog, Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStudentBehavior = async (student: Student, history: PointLog[]) => {
  const historySummary = history
    .slice(0, 5)
    .map(h => `${new Date(h.date).toLocaleDateString()}: ${h.title} (${h.points > 0 ? '+' : ''}${h.points})`)
    .join(', ');

  const prompt = `
    Analyze behavior for student: ${student.name} from SMAN 2 Tanggul.
    Current Stats: Points: ${student.points}, Violations: ${student.violations}.
    Recent History: ${historySummary || 'No recent activity.'}
    
    Provide:
    1. A short summary of their behavior (1-2 sentences).
    2. A motivational quote or advice based on their current status.
    3. A risk assessment (Low, Medium, High) regarding their discipline.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            advice: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          },
          required: ["summary", "advice", "riskLevel"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      summary: "Analisis otomatis sedang tidak tersedia.",
      advice: "Teruslah berbuat baik dan patuhi peraturan sekolah.",
      riskLevel: "Low"
    };
  }
};
