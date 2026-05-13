import { NextRequest, NextResponse } from 'next/server'
import { transcribeAudio } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('audio') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const mimeType = file.type || 'audio/mpeg'

    const transcription = await transcribeAudio(buffer, mimeType)

    return NextResponse.json({ transcript: transcription })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Transcription failed' }, { status: 500 })
  }
}
