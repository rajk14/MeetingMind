"use client"

import React, { useEffect, useState } from 'react'
import { MeetingResult } from '@/types/meeting'
import { storage } from '@/lib/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Trash2, ArrowRight, History } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function HistoryPage() {
  const [history, setHistory] = useState<MeetingResult[]>([])

  useEffect(() => {
    setHistory(storage.getHistory())
  }, [])

  const deleteMeeting = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    storage.deleteMeeting(id)
    setHistory(storage.getHistory())
    window.dispatchEvent(new Event('meeting-updated'))
    toast.success('Meeting deleted from history')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600/10 rounded-lg">
            <History size={24} className="text-indigo-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Meeting History</h1>
        </div>
        <p className="text-muted-foreground text-lg">Access and manage your past AI-analyzed meetings.</p>
      </div>

      <div className="grid gap-4">
        {history.length === 0 ? (
          <Card className="bg-card/30 border-dashed border-zinc-800 p-12 text-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <History size={48} className="opacity-20" />
              <p>No meetings in your history yet.</p>
              <Link href="/">
                <Button variant="outline" className="mt-2 border-zinc-800">Start your first analysis</Button>
              </Link>
            </div>
          </Card>
        ) : (
          history.map((meeting) => (
            <Link key={meeting.id} href={`/?id=${meeting.id}`}>
              <Card className="bg-card/30 border-border hover:border-indigo-500/30 hover:bg-card/50 transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-6 gap-6">
                    <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 group-hover:border-indigo-500/50 transition-colors">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
                        {new Date(meeting.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xl font-black text-white">
                        {new Date(meeting.date).getDate()}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xl font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                        {meeting.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-indigo-500/50" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-indigo-500/50" />
                          {meeting.actionItems.length} Action Items
                        </div>
                        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-[10px] py-0">
                          {meeting.participants?.length || 0} participants
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10"
                        onClick={(e) => deleteMeeting(meeting.id, e)}
                      >
                        <Trash2 size={18} />
                      </Button>
                      <ArrowRight size={20} className="text-zinc-800 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
