"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'

interface ProcessingStateProps {
  step: number
}

export default function ProcessingState({ step }: ProcessingStateProps) {
  const steps = [
    { id: 1, label: 'Reading transcript...' },
    { id: 2, label: 'Identifying participants...' },
    { id: 3, label: 'Extracting action items...' },
    { id: 4, label: 'Generating summary...' }
  ]

  const progress = (step / steps.length) * 100

  return (
    <div className="max-w-md mx-auto w-full py-24 space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-2">
          <Loader2 size={32} className="text-indigo-500 animate-spin" />
        </div>
        <h2 className="text-3xl font-black tracking-tight">AI is Thinking...</h2>
        <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
          Gemini is analyzing the conversation to extract key insights and action items.
        </p>
      </div>

      <Card className="p-8 border-border bg-card/40 backdrop-blur-3xl space-y-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />
        
        <div className="space-y-8 relative z-10">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-5">
              <div className="flex items-center justify-center relative">
                {step > s.id ? (
                  <div className="bg-green-500/20 p-1 rounded-full">
                    <CheckCircle2 size={20} className="text-green-500" />
                  </div>
                ) : step === s.id ? (
                  <div className="bg-indigo-500/20 p-1 rounded-full">
                    <Loader2 size={20} className="text-indigo-500 animate-spin" />
                  </div>
                ) : (
                  <Circle size={20} className="text-zinc-800" />
                )}
                {s.id < steps.length && (
                  <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-[2px] h-6 ${
                    step > s.id ? 'bg-green-500/30' : 'bg-zinc-800'
                  }`} />
                )}
              </div>
              <div className={`text-base font-semibold transition-all duration-300 ${
                step >= s.id ? 'text-white' : 'text-zinc-600'
              } ${step === s.id ? 'translate-x-1' : ''}`}>
                {s.label}
              </div>
              {step > s.id && (
                <div className="ml-auto text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">
                  Done
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex justify-between text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
            <span>Processing Status</span>
            <span className="text-indigo-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full">
            <ProgressTrack className="h-1.5 bg-zinc-900 border border-white/5">
              <ProgressIndicator className="bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
            </ProgressTrack>
          </Progress>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium animate-pulse">
          Optimizing for business efficiency
        </p>
      </div>
    </div>
  )
}
