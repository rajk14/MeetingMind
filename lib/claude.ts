import Anthropic from '@anthropic-ai/sdk'
import { MeetingResult } from '@/types/meeting'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analyzeMeeting(transcript: string): Promise<MeetingResult> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `You are an expert meeting analyst. Extract structured information from meeting transcripts with precision.
Always respond with valid JSON only — no markdown, no explanation, no preamble.
If a field cannot be determined, use sensible defaults ("Unassigned", "No deadline", etc.).
Be specific: action items must be concrete, actionable tasks — not vague intentions.
For deadlines, interpret relative phrases like "by end of week" as ISO date strings based on today's date.
Today's date is ${new Date().toISOString().split('T')[0]}.`,
    messages: [{
      role: 'user',
      content: `Analyze this meeting transcript and return a JSON object with this exact shape:
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
${transcript}`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(text)

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
