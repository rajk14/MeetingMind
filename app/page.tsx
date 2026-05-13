"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import UploadZone from '@/components/UploadZone'
import ResultsPanel from '@/components/ResultsPanel'
import ProcessingState from '@/components/ProcessingState'
import { MeetingResult } from '@/types/meeting'
import { storage } from '@/lib/storage'
import { toast } from 'sonner'

function HomeContent() {
  const [meeting, setMeeting] = useState<MeetingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(1)
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  useEffect(() => {
    if (id) {
      const history = storage.getHistory()
      const found = history.find(m => m.id === id)
      if (found) {
        setMeeting(found)
      } else if (id !== 'new') {
        toast.error('Meeting not found')
        router.push('/')
      }
    } else {
      setMeeting(null)
    }
  }, [id, router])

  const handleProcessingComplete = (result: MeetingResult) => {
    setMeeting(result)
    setIsProcessing(false)
    storage.saveMeeting(result)
    // Dispatch event for sidebar to update
    window.dispatchEvent(new Event('meeting-updated'))
    router.push(`/?id=${result.id}`)
  }

  const handleStartProcessing = () => {
    setIsProcessing(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-full flex flex-col">
      {isProcessing ? (
        <ProcessingState step={processingStep} />
      ) : meeting ? (
        <ResultsPanel result={meeting} onUpdate={(updated) => {
          setMeeting(updated)
          storage.saveMeeting(updated)
          window.dispatchEvent(new Event('meeting-updated'))
        }} />
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent pb-2">
              Meetings, mastered.
            </h1>
            <p className="text-muted-foreground text-xl max-w-xl mx-auto">
              Extract action items, decisions, and summaries from any meeting in seconds.
            </p>
          </div>
          <UploadZone 
            onStart={handleStartProcessing} 
            onComplete={handleProcessingComplete}
            setStep={setProcessingStep}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { title: 'AI-Powered', desc: 'Driven by Claude Sonnet for unmatched precision.' },
              { title: 'Action Tracker', desc: 'Never lose track of who owns what task again.' },
              { title: 'Instant Sync', desc: 'Push directly to Slack or Notion with one click.' }
            ].map((feature, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card/50">
                <div className="font-bold mb-1 text-indigo-400">{feature.title}</div>
                <div className="text-xs text-muted-foreground">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
