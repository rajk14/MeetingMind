import { MeetingResult } from '@/types/meeting'

const STORAGE_KEY = 'meetingmind_history'

export const storage = {
  saveMeeting: (meeting: MeetingResult) => {
    if (typeof window === 'undefined') return
    const history = storage.getHistory()
    // Remove if already exists (to update)
    const filtered = history.filter(m => m.id !== meeting.id)
    const newHistory = [meeting, ...filtered].slice(0, 10)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  },
  getHistory: (): MeetingResult[] => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(STORAGE_KEY)
    try {
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error('Failed to parse history', e)
      return []
    }
  },
  deleteMeeting: (id: string) => {
    if (typeof window === 'undefined') return
    const history = storage.getHistory()
    const newHistory = history.filter(m => m.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  }
}
