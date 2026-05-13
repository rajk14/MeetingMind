import { Client } from '@notionhq/client'
import { MeetingResult } from '@/types/meeting'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function pushToNotion(result: MeetingResult) {
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId) throw new Error('NOTION_DATABASE_ID is missing')

  // Note: This assumes the database has a title property (usually named "Name")
  // and potentially a "Date" property. We'll stick to the title for compatibility
  // and put everything else in the body.
  
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [
          { text: { content: result.title } }
        ]
      }
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ text: { content: result.title } }] }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ text: { content: `Date: ${new Date(result.date).toLocaleDateString()}` } }] }
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'Executive Summary' } }] }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ text: { content: result.summary } }] }
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'Key Decisions' } }] }
      },
      ...result.decisions.map(d => ({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: [{ text: { content: d } }] }
      } as any)),
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'Action Items' } }] }
      },
      ...result.actionItems.map(a => ({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ text: { content: `${a.task} (@${a.owner}) - Due: ${a.deadline} [${a.priority.toUpperCase()}]` } }],
          checked: a.completed
        }
      } as any))
    ]
  })
}
