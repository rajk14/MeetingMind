"use client"

import React, { useState } from 'react'
import { ActionItem } from '@/types/meeting'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface ActionTableProps {
  items: ActionItem[]
  onItemsChange: (items: ActionItem[]) => void
}

export default function ActionTable({ items, onItemsChange }: ActionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const toggleComplete = (id: string) => {
    onItemsChange(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const updateItem = (id: string, field: keyof ActionItem, value: any) => {
    onItemsChange(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const priorityColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  }

  return (
    <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden shadow-2xl">
      <Table>
        <TableHeader className="bg-black/60">
          <TableRow className="hover:bg-transparent border-border/30 h-12">
            <TableHead className="w-[60px] pl-6"></TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Action Task</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground w-[150px]">Owner</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground w-[180px]">Deadline</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground w-[120px] text-right pr-6">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-border/30 hover:bg-white/[0.03] transition-all group h-16">
              <TableCell className="pl-6">
                <Checkbox 
                  checked={item.completed} 
                  onCheckedChange={() => toggleComplete(item.id)}
                  className="w-5 h-5 rounded-md border-zinc-700 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 transition-all"
                />
              </TableCell>
              
              <TableCell className="font-semibold text-zinc-200">
                {editingId === `${item.id}-task` ? (
                  <Input 
                    autoFocus
                    value={item.task}
                    onChange={(e) => updateItem(item.id, 'task', e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    className="h-9 bg-black/60 border-indigo-500/50 text-sm focus-visible:ring-indigo-500/30"
                  />
                ) : (
                  <div 
                    onClick={() => setEditingId(`${item.id}-task`)}
                    className={cn(
                      "cursor-text py-2 group-hover:text-white transition-all text-sm leading-snug",
                      item.completed && "line-through text-muted-foreground opacity-50"
                    )}
                  >
                    {item.task}
                  </div>
                )}
              </TableCell>

              <TableCell>
                {editingId === `${item.id}-owner` ? (
                  <Input 
                    autoFocus
                    value={item.owner}
                    onChange={(e) => updateItem(item.id, 'owner', e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    className="h-9 bg-black/60 border-indigo-500/50 text-sm focus-visible:ring-indigo-500/30"
                  />
                ) : (
                  <div 
                    onClick={() => setEditingId(`${item.id}-owner`)}
                    className="cursor-text text-indigo-400/80 font-bold text-xs bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10 inline-block group-hover:bg-indigo-500/10 transition-all"
                  >
                    {item.owner}
                  </div>
                )}
              </TableCell>

              <TableCell>
                {editingId === `${item.id}-deadline` ? (
                  <Input 
                    type="date"
                    autoFocus
                    value={item.deadline === 'No deadline' ? '' : item.deadline}
                    onChange={(e) => updateItem(item.id, 'deadline', e.target.value || 'No deadline')}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    className="h-9 bg-black/60 border-indigo-500/50 text-sm focus-visible:ring-indigo-500/30"
                  />
                ) : (
                  <div 
                    onClick={() => setEditingId(`${item.id}-deadline`)}
                    className="cursor-text text-zinc-500 text-xs font-mono"
                  >
                    {item.deadline === 'No deadline' ? 'No deadline' : new Date(item.deadline).toLocaleDateString()}
                  </div>
                )}
              </TableCell>

              <TableCell className="text-right pr-6">
                <Select 
                  value={item.priority} 
                  onValueChange={(val) => updateItem(item.id, 'priority', val)}
                >
                  <SelectTrigger className={cn(
                    "h-7 w-24 border border-transparent shadow-none focus:ring-0 px-2 py-0 rounded-full text-[10px] font-black uppercase tracking-wider ml-auto transition-all hover:scale-105",
                    priorityColors[item.priority]
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="high" className="text-red-500 focus:bg-red-500/20 focus:text-red-500 font-bold">HIGH</SelectItem>
                    <SelectItem value="medium" className="text-amber-500 focus:bg-amber-500/20 focus:text-amber-500 font-bold">MEDIUM</SelectItem>
                    <SelectItem value="low" className="text-blue-500 focus:bg-blue-500/20 focus:text-blue-500 font-bold">LOW</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic bg-black/20">
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle size={32} className="opacity-20" />
                  <p>No action items detected in this meeting.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
