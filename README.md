# MeetingMind — AI Meeting Summarizer & Action Tracker

> Stop losing action items in chat threads. MeetingMind turns any meeting
> transcript into a structured summary + trackable action items in under 10 seconds.

## The Problem
Teams waste 30–60 min per meeting on manual notes, follow-up emails,
and chasing down who owns what. Action items get lost in Slack threads.

## The Solution
Paste or upload your transcript → Claude AI extracts summary, decisions,
action items (with owners + deadlines) → push directly to Slack or Notion.

## ROI
- Average meeting: 45 min, 4 attendees, ~$80/hr blended rate
- Manual follow-up time saved: ~25 min/meeting
- For a 10-person team with 5 meetings/week: **~$1,700/week saved**

## Setup
```bash
# Clone the repository
git clone <repo-url>
cd meetingmind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY and OPENAI_API_KEY

# Run development server
npm run dev
```

## Features
- **3 Input Modes**: Paste text, upload audio (Whisper), or upload transcript files (.txt, .vtt, .srt).
- **AI Processing Pipeline**: Uses Claude 3.5 Sonnet for precise extraction.
- **Interactive Dashboard**: Edit action items inline, sort by priority, and mark as complete.
- **Integrations**: One-click push to Slack (Notion coming soon).
- **History**: Local persistence of your last 10 meetings.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude API, OpenAI Whisper API
- **Styling**: Modern dark theme with "Command Center" aesthetic

---
*Built for the Internal Tools Hacks hackathon on Devpost.*
*Stack: Next.js · Claude API · Whisper · Tailwind · shadcn/ui · Vercel*
