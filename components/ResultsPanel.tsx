"use client"

import React from 'react'
import { MeetingResult, ActionItem } from '@/types/meeting'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy, Download, Calendar, Users, Clock, MessageSquare, AlertCircle } from 'lucide-react'
import ActionTable from './ActionTable'
import IntegrationBar from './IntegrationBar'
import { toast } from 'sonner'

interface ResultsPanelProps {
  result: MeetingResult
  onUpdate: (result: MeetingResult) => void
}

export default function ResultsPanel({ result, onUpdate }: ResultsPanelProps) {
  const copySummary = () => {
    const text = `
Meeting: ${result.title}
Date: ${new Date(result.date).toLocaleDateString()}

Summary:
${result.summary}

Key Decisions:
${result.decisions.map(d => `• ${d}`).join('\n')}

Action Items:
${result.actionItems.map(a => `• ${a.task} (${a.owner}) - Due: ${a.deadline}`).join('\n')}
    `.trim()
    
    navigator.clipboard.writeText(text)
    toast.success('Summary copied to clipboard')
  }

  const exportMarkdown = () => {
    const content = `
# ${result.title}
**Date:** ${new Date(result.date).toLocaleDateString()}

## Summary
${result.summary}

## Key Decisions
${result.decisions.map(d => `- ${d}`).join('\n')}

## Action Items
| Task | Owner | Deadline | Priority |
|------|-------|----------|----------|
${result.actionItems.map(a => `| ${a.task} | ${a.owner} | ${a.deadline} | ${a.priority} |`).join('\n')}

## Open Questions
${result.openQuestions.map(q => `- ${q}`).join('\n')}
    `.trim()
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.title.replace(/\s+/g, '-').toLowerCase()}-summary.md`
    a.click()
    toast.success('Exported as Markdown')
  }

  const handleUpdateActionItems = (newActionItems: ActionItem[]) => {
    onUpdate({ ...result, actionItems: newActionItems })
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-4">
          <Badge className="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border-indigo-500/30 font-bold tracking-widest text-[10px] uppercase py-1 px-3">
            AI Analysis Complete
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">{result.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <Calendar size={14} className="text-indigo-400" />
              </div>
              <span className="font-medium text-zinc-300">{new Date(result.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <Users size={14} className="text-indigo-400" />
              </div>
              <span className="font-medium text-zinc-300 max-w-[200px] truncate">{result.participants?.join(', ') || 'Unknown'}</span>
            </div>
            {result.duration && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Clock size={14} className="text-indigo-400" />
                </div>
                <span className="font-medium text-zinc-300">{result.duration}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={copySummary} className="gap-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all rounded-lg">
            <Copy size={14} /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={exportMarkdown} className="gap-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all rounded-lg">
            <Download size={14} /> Export
          </Button>
          <IntegrationBar result={result} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1 mb-2">
              <div className="p-2 bg-indigo-600/10 rounded-lg">
                <MessageSquare size={20} className="text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Executive Summary</h2>
            </div>
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-xl hover:shadow-indigo-500/5 transition-all overflow-hidden border-l-4 border-l-indigo-600">
              <CardContent className="p-8">
                <p className="text-zinc-300 leading-relaxed text-lg font-medium italic">
                  "{result.summary}"
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Action Items</h2>
                <Badge className="ml-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-full px-3">
                  {result.actionItems.length} Tasks
                </Badge>
              </div>
            </div>
            <ActionTable items={result.actionItems} onItemsChange={handleUpdateActionItems} />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-border bg-card shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 size={64} />
            </div>
            <CardHeader className="border-b border-border bg-black/40 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
                Key Decisions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {result.decisions.map((decision, i) => (
                  <li key={i} className="flex gap-4 group/item">
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-black text-xs group-hover/item:bg-green-500 group-hover/item:text-black transition-all">
                      {i + 1}
                    </span>
                    <span className="text-zinc-300 text-sm leading-snug font-medium">{decision}</span>
                  </li>
                ))}
                {result.decisions.length === 0 && (
                  <li className="text-zinc-600 text-sm italic py-2 text-center">No major decisions recorded.</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle size={64} />
            </div>
            <CardHeader className="border-b border-border bg-black/40 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2">
                Open Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {result.openQuestions.map((question, i) => (
                  <li key={i} className="flex gap-3 text-sm items-start">
                    <span className="shrink-0 text-amber-500 mt-0.5">•</span>
                    <span className="text-zinc-400 italic leading-relaxed">{question}</span>
                  </li>
                ))}
                {result.openQuestions.length === 0 && (
                  <li className="text-zinc-600 text-sm italic py-2 text-center">No pending questions.</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10">
            <h4 className="text-sm font-bold text-indigo-400 mb-2">Next Steps</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Sync these results to your team's workflow to ensure follow-through. Use the integration bar above to push to Slack or Notion.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
