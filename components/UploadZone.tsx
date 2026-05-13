"use client"

import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload, Type, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { MeetingResult } from '@/types/meeting'

interface UploadZoneProps {
  onStart: () => void
  onComplete: (result: MeetingResult) => void
  setStep: (step: number) => void
}

export default function UploadZone({ onStart, onComplete, setStep }: UploadZoneProps) {
  const [transcript, setTranscript] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = async (text: string) => {
    if (!text || text.trim().length < 50) {
      toast.error('Transcript is too short to analyze')
      return
    }

    onStart()
    setStep(1) // Reading transcript

    try {
      // Simulate some delay for "thoughtfulness"
      await new Promise(r => setTimeout(r, 1200))
      setStep(2) // Identifying participants
      
      await new Promise(r => setTimeout(r, 1000))
      setStep(3) // Extracting action items
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Analysis failed')
      }
      
      const result = await response.json()
      
      setStep(4) // Generating summary
      await new Promise(r => setTimeout(r, 800))
      
      onComplete(result)
      toast.success('Meeting analyzed successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to analyze meeting')
      console.error(err)
      // Parent component handles state reset if needed
      window.location.reload() // Simple way to reset everything on error
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const isAudio = file.type.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'mp4'].some(ext => file.name.toLowerCase().endsWith(ext))
    
    try {
      if (isAudio) {
        onStart()
        setStep(1) // Transcribing audio...
        
        const formData = new FormData()
        formData.append('audio', file)
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Transcription failed')
        }
        
        const { transcript: transcribedText } = await response.json()
        handleAnalyze(transcribedText)
      } else {
        // Text file
        const text = await file.text()
        setTranscript(text)
        handleAnalyze(text)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to process file')
      console.error(err)
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-1 border-border bg-card shadow-2xl overflow-hidden rounded-2xl">
      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-zinc-900/50 rounded-xl">
          <TabsTrigger value="paste" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
            <Type size={14} /> Paste Text
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
            <Upload size={14} /> Upload Audio/Doc
          </TabsTrigger>
        </TabsList>
        
        <div className="p-6">
          <TabsContent value="paste" className="space-y-4 mt-0">
            <Textarea 
              placeholder="Paste meeting transcript, notes, or chat logs here (minimum 50 characters)..." 
              className="min-h-[250px] bg-black/40 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all resize-none font-mono text-xs leading-relaxed"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-base font-bold shadow-xl shadow-indigo-500/10 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
              disabled={transcript.length < 50 || isUploading}
              onClick={() => handleAnalyze(transcript)}
            >
              Start AI Analysis
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4 mt-0">
            <div 
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files?.[0]) {
                  const file = e.dataTransfer.files[0];
                  // Trigger upload
                  const mockEvent = { target: { files: [file] } } as any;
                  handleFileUpload(mockEvent);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[250px] border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-5 bg-zinc-800/50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-indigo-500/40">
                <Upload size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-center relative z-10">
                <p className="font-bold text-lg text-zinc-200">Drop files here</p>
                <p className="text-sm text-muted-foreground mt-2 px-6">
                  Supports MP3, WAV, M4A, MP4 (Audio) <br />
                  and TXT, VTT, SRT (Transcript)
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                accept=".mp3,.m4a,.wav,.mp4,.txt,.vtt,.srt"
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-xl">
              <AlertCircle size={16} className="shrink-0" />
              <span>Audio files are automatically transcribed via OpenAI Whisper before AI processing.</span>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}
