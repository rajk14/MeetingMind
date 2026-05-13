import { MeetingResult } from '@/types/meeting'

export async function postToSlack(result: MeetingResult) {
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new Error('SLACK_WEBHOOK_URL is not configured')
  }

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `📋 ${result.title}`, emoji: true }
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*Summary*\n${result.summary}` }
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Action Items (${result.actionItems.length})*\n` +
          result.actionItems.map(item =>
            `• ${item.task} — *${item.owner}* (${item.deadline}) [${item.priority.toUpperCase()}]`
          ).join('\n')
      }
    }
  ]

  const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Slack API error: ${errorText}`)
  }
}
