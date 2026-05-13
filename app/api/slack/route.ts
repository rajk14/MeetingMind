import { NextRequest, NextResponse } from 'next/server'
import { postToSlack } from '@/lib/slack'

export async function POST(req: NextRequest) {
  try {
    const { meetingResult } = await req.json()
    if (!meetingResult) {
      return NextResponse.json({ error: 'Missing meeting result' }, { status: 400 })
    }
    
    const webhook = process.env.SLACK_WEBHOOK_URL
    if (!webhook || webhook.includes('your_slack_webhook_url_here') || webhook === '') {
      return NextResponse.json({ 
        error: 'Slack is not configured. Add your Webhook URL to .env.local to enable this feature.' 
      }, { status: 400 })
    }

    await postToSlack(meetingResult)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Slack push failed' }, { status: 500 })
  }
}
