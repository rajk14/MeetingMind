"use client"

import React, { useEffect, useState } from 'react'
import { MeetingResult } from '@/types/meeting'
import { storage } from '@/lib/storage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Plus, History, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function MeetingHistory() {
  const [history, setHistory] = useState<MeetingResult[]>([])
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentId = searchParams.get('id')

  useEffect(() => {
    // Initial load
    setHistory(storage.getHistory())

    // Listen for storage changes or custom events
    const handleUpdate = () => {
      setHistory(storage.getHistory())
    }
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('meeting-updated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('meeting-updated', handleUpdate)
    }
  }, [])

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full hidden md:flex">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-indigo-500">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">
            M
          </div>
          <span className="tracking-tight">MeetingMind</span>
        </Link>
      </div>

      <div className="p-4">
        <Link href="/">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Plus size={16} />
            New Meeting
          </button>
        </Link>
      </div>

      <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        <History size={12} />
        Recent Meetings
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {history.length === 0 ? (
            <div className="text-xs text-muted-foreground p-4 text-center italic">
              No recent meetings
            </div>
          ) : (
            history.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/?id=${meeting.id}`}
                className={cn(
                  "block p-3 rounded-md transition-all duration-200 hover:bg-accent group",
                  currentId === meeting.id ? "bg-accent border-l-2 border-indigo-500" : "border-l-2 border-transparent"
                )}
              >
                <div className="text-sm font-medium truncate group-hover:text-indigo-400">
                  {meeting.title}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock size={10} />
                  {new Date(meeting.date).toLocaleDateString()}
                  <span className="mx-1">•</span>
                  {meeting.actionItems.length} tasks
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-accent text-sm text-muted-foreground",
            pathname === '/settings' ? "bg-accent text-foreground" : ""
          )}
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  )
}
