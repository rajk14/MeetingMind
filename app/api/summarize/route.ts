import { NextRequest, NextResponse } from 'next/server'
import { analyzeMeeting } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json()
    if (!transcript || transcript.trim().length < 50) {
      return NextResponse.json({ error: 'Transcript too short' }, { status: 400 })
    }
    const result = await analyzeMeeting(transcript)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Processing failed' }, { status: 500 })
  }
}
