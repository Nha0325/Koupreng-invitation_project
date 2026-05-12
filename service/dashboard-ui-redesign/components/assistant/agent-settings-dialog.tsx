'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useAgentSettings, updateAgentSettings } from '@/lib/data-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Bot, Thermometer, FileText, Cpu } from 'lucide-react'

interface AgentSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const modelOptions = [
  { value: 'anthropic/claude-opus-4.5', label: 'Claude Opus 4.5', provider: 'Anthropic', recommended: true },
  { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4', provider: 'Anthropic' },
  { value: 'anthropic/claude-3-5-haiku', label: 'Claude 3.5 Haiku', provider: 'Anthropic' },
  { value: 'openai/gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { value: 'xai/grok-3', label: 'Grok 3', provider: 'xAI' },
]

export function AgentSettingsDialog({ open, onOpenChange }: AgentSettingsDialogProps) {
  const { settings } = useAgentSettings()
  
  const [formData, setFormData] = useState({
    model: settings.model,
    temperature: settings.temperature,
    systemPrompt: settings.systemPrompt,
  })

  useEffect(() => {
    setFormData({
      model: settings.model,
      temperature: settings.temperature,
      systemPrompt: settings.systemPrompt,
    })
  }, [settings, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateAgentSettings(formData)
    onOpenChange(false)
  }

  const handleReset = () => {
    const defaultSettings = {
      model: 'anthropic/claude-opus-4.5',
      temperature: 0.7,
      systemPrompt: `You are a helpful veterinary assistant for VetCRM. You help staff with:
- Looking up patient and owner information
- Scheduling appointments
- Answering common veterinary questions
- Providing reminders about vaccinations and follow-ups

Always be professional, empathetic, and accurate in your responses.`,
    }
    setFormData(defaultSettings)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="size-5" />
            AI Assistant Settings
          </DialogTitle>
          <DialogDescription>
            Configure the AI assistant behavior and capabilities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="size-4" />
                Model Selection
              </CardTitle>
              <CardDescription>Choose the AI model for the assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {option.provider}
                        </Badge>
                        {option.recommended && (
                          <Badge variant="default" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Thermometer className="size-4" />
                Temperature
              </CardTitle>
              <CardDescription>
                Controls response randomness. Lower values are more focused, higher values are more creative.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Focused</span>
                <span className="text-sm font-medium">{formData.temperature.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">Creative</span>
              </div>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4" />
                System Prompt
              </CardTitle>
              <CardDescription>
                Define the assistant&apos;s personality and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                placeholder="Enter system prompt..."
                rows={8}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capabilities</CardTitle>
              <CardDescription>
                The assistant currently has access to the following features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Read Clinic Data</Badge>
                <Badge variant="secondary">Answer Questions</Badge>
                <Badge variant="secondary">Veterinary Knowledge</Badge>
                <Badge variant="outline">Schedule Appointments (coming soon)</Badge>
                <Badge variant="outline">Update Records (coming soon)</Badge>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
