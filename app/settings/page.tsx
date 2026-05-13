"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Hash, FileSpreadsheet, Lock, Settings as SettingsIcon, AlertCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Settings saved locally. For production, these should be environment variables.')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600/10 rounded-lg">
            <SettingsIcon size={24} className="text-indigo-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground text-lg">Manage your AI configurations and third-party integrations.</p>
      </div>

      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={18} className="text-zinc-500" />
            API Configurations
          </h2>
          <Card className="bg-card/30 border-border">
            <form onSubmit={handleSave}>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gemini_key" className="text-xs font-black uppercase tracking-widest text-zinc-500">Gemini API Key (Free Tier)</Label>
                  <Input 
                    id="gemini_key" 
                    type="password" 
                    placeholder="AIza..." 
                    className="bg-black/40 border-zinc-800 focus:border-indigo-500/50"
                    defaultValue="••••••••••••••••"
                    disabled
                  />
                  <p className="text-[10px] text-zinc-500 italic">Pre-configured in environment variables for this hackathon demo.</p>
                </div>
              </CardContent>
            </form>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/30 border-border group hover:border-indigo-500/30 transition-all flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Hash size={24} className="text-[#E01E5A]" />
                  <div className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded uppercase">Active</div>
                </div>
                <CardTitle className="text-lg">Slack Webhook</CardTitle>
                <CardDescription className="text-xs">Post summaries to a specific channel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Webhook URL</Label>
                  <Input 
                    placeholder="https://hooks.slack.com/services/..." 
                    className="bg-black/40 border-zinc-800 text-xs"
                    defaultValue="••••••••••••••••"
                    disabled
                  />
                </div>
                <a 
                  href="https://api.slack.com/apps" 
                  target="_blank" 
                  className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 mt-2"
                >
                  Create Webhook <ExternalLink size={10} />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-border group hover:border-indigo-500/30 transition-all flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <FileSpreadsheet size={24} className="text-white" />
                  <div className="px-2 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded uppercase">Active</div>
                </div>
                <CardTitle className="text-lg">Notion Database</CardTitle>
                <CardDescription className="text-xs">Sync items to your Notion workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Database ID</Label>
                  <Input 
                    placeholder="Database ID" 
                    className="bg-black/40 border-zinc-800 text-xs"
                    defaultValue="••••••••••••••••"
                    disabled
                  />
                </div>
                <a 
                  href="https://www.notion.so/my-integrations" 
                  target="_blank" 
                  className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 mt-2"
                >
                  Create Integration <ExternalLink size={10} />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
          <AlertCircle size={24} className="text-amber-500 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-500">How to Setup Integrations</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              1. **Slack**: Create an app, enable Incoming Webhooks, and copy the URL. <br />
              2. **Notion**: Create an internal integration, share your database with it, and copy the Database ID (the part of the URL after the last slash but before the question mark).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
