"use client"

import React, { useState } from 'react'
import { MeetingResult } from '@/types/meeting'
import { Button } from '@/components/ui/button'
import { Hash, FileSpreadsheet, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface IntegrationBarProps {
  result: MeetingResult
}

export default function IntegrationBar({ result }: IntegrationBarProps) {
  const [isPushingSlack, setIsPushingSlack] = useState(false)
  const [slackDone, setSlackDone] = useState(false)
  
  const [isPushingNotion, setIsPushingNotion] = useState(false)
  const [notionDone, setNotionDone] = useState(false)

  const pushToSlack = async () => {
    setIsPushingSlack(true)
    try {
      const response = await fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingResult: result })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to push to Slack')

      setSlackDone(true)
      toast.success('Pushed to Slack successfully!')
      setTimeout(() => setSlackDone(false), 3000)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsPushingSlack(false)
    }
  }

  const pushToNotion = async () => {
    setIsPushingNotion(true)
    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingResult: result })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to push to Notion')

      setNotionDone(true)
      toast.success('Pushed to Notion successfully!')
      setTimeout(() => setNotionDone(false), 3000)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsPushingNotion(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={pushToSlack}
        disabled={isPushingSlack || slackDone}
        className={cn(
          "gap-2 transition-all duration-500 rounded-lg h-9 px-4",
          slackDone 
            ? "bg-green-500/20 text-green-500 border-green-500/50" 
            : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-indigo-500/30"
        )}
      >
        {isPushingSlack ? (
          <Loader2 size={14} className="animate-spin" />
        ) : slackDone ? (
          <Check size={14} className="animate-in zoom-in duration-300" />
        ) : (
          <Hash size={14} className="text-[#E01E5A]" />
        )}
        <span className="font-bold text-[11px] uppercase tracking-wider">{slackDone ? 'Sent!' : 'Slack'}</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={pushToNotion}
        disabled={isPushingNotion || notionDone}
        className={cn(
          "gap-2 transition-all duration-500 rounded-lg h-9 px-4",
          notionDone 
            ? "bg-green-500/20 text-green-500 border-green-500/50" 
            : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-indigo-500/30"
        )}
      >
        {isPushingNotion ? (
          <Loader2 size={14} className="animate-spin" />
        ) : notionDone ? (
          <Check size={14} className="animate-in zoom-in duration-300" />
        ) : (
          <FileSpreadsheet size={14} className="text-white" />
        )}
        <span className="font-bold text-[11px] uppercase tracking-wider">{notionDone ? 'Sent!' : 'Notion'}</span>
      </Button>
    </div>
  )
}
