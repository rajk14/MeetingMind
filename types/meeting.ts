export interface ActionItem {
  id: string
  task: string
  owner: string         // name or "Unassigned"
  deadline: string      // ISO date string or "No deadline"
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

export interface MeetingResult {
  id: string
  title: string         // auto-generated short title
  date: string          // ISO timestamp
  rawTranscript: string
  summary: string       // 2–3 sentence TL;DR
  decisions: string[]
  actionItems: ActionItem[]
  openQuestions: string[]
  duration?: string     // "45 min" if detectable
  participants?: string[]
}
