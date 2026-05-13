import { NextRequest, NextResponse } from 'next/server'
import { pushToNotion } from '@/lib/notion'

export async function POST(req: NextRequest) {
  try {
    const { meetingResult } = await req.json()
    if (!meetingResult) {
      return NextResponse.json({ error: 'Missing meeting result' }, { status: 400 })
    }

    const apiKey = process.env.NOTION_API_KEY
    const dbId = process.env.NOTION_DATABASE_ID
    
    if (!apiKey || apiKey.includes('your_') || !dbId || dbId.includes('your_')) {
      return NextResponse.json({ 
        error: 'Notion is not configured. Add your API Key and Database ID to .env.local to enable this feature.' 
      }, { status: 400 })
    }

    await pushToNotion(meetingResult)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Notion push failed' }, { status: 500 })
  }
}
