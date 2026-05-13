import { GoogleGenerativeAI } from "@google/generative-ai";
import { MeetingResult } from '@/types/meeting'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using gemini-2.5-flash as gemini-3-flash has reached its daily quota
const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" },
  { apiVersion: 'v1beta' }
);

export async function analyzeMeeting(transcript: string): Promise<MeetingResult> {
  const prompt = `You are an expert meeting analyst. Extract structured information from meeting transcripts with precision.
Always respond with valid JSON only — no markdown, no explanation, no preamble.
If a field cannot be determined, use sensible defaults ("Unassigned", "No deadline", etc.).
Be specific: action items must be concrete, actionable tasks — not vague intentions.
For deadlines, interpret relative phrases like "by end of week" as ISO date strings based on today's date.
Today's date is ${new Date().toISOString().split('T')[0]}.

Analyze this meeting transcript and return a JSON object with this exact shape:
{
  "title": "short descriptive title (max 8 words)",
  "summary": "2-3 sentence executive TL;DR",
  "decisions": ["decision 1", "decision 2"],
  "actionItems": [
    {
      "task": "specific actionable task description",
      "owner": "person's name or Unassigned",
      "deadline": "YYYY-MM-DD or No deadline",
      "priority": "high | medium | low"
    }
  ],
  "openQuestions": ["question or blocker with no clear owner"],
  "participants": ["name1", "name2"],
  "duration": "estimated duration or Unknown"
}

TRANSCRIPT:
${transcript}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean potential markdown code blocks if Gemini ignores responseMimeType
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const cleanText = jsonMatch ? jsonMatch[0] : text;
  
  const parsed = JSON.parse(cleanText);

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    rawTranscript: transcript,
    ...parsed,
    actionItems: (parsed.actionItems || []).map((item: any) => ({
      ...item,
      id: crypto.randomUUID(),
      completed: false
    }))
  }
}

export async function transcribeAudio(fileBuffer: Buffer, mimeType: string): Promise<string> {
  const transcribeModel = genAI.getGenerativeModel(
    { model: "gemini-2.5-flash" },
    { apiVersion: 'v1beta' }
  );
  
  const result = await transcribeModel.generateContent([
    {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType
      }
    },
    "Transcribe this audio file accurately. Return only the transcript text without any preamble or explanation."
  ]);
  
  return result.response.text();
}
