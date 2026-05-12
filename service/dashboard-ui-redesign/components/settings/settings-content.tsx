'use client'

import { useState } from 'react'
import { useAgentSettings } from '@/lib/data-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  Bot,
  Building2,
  Bell,
  Shield,
  Database,
  ChevronRight,
} from 'lucide-react'
import { AgentSettingsDialog } from '@/components/assistant/agent-settings-dialog'

export function SettingsContent() {
  const { settings } = useAgentSettings()
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false)

  const settingsSections = [
    {
      title: 'AI Assistant',
      description: 'Configure the AI chatbot behavior, model, and system prompt',
      icon: Bot,
      badge: settings.model.split('/').pop(),
      onClick: () => setAgentSettingsOpen(true),
    },
    {
      title: 'Clinic Information',
      description: 'Update your clinic name, address, and contact details',
      icon: Building2,
      badge: null,
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Notifications',
      description: 'Manage email and SMS notification preferences',
      icon: Bell,
      badge: null,
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Security',
      description: 'Password, two-factor authentication, and session management',
      icon: Shield,
      badge: null,
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Data & Storage',
      description: 'Backup, export, and manage your clinic data',
      icon: Database,
      badge: null,
      onClick: () => {},
      disabled: true,
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your clinic and application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Configure your VetCRM application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {settingsSections.map((section, index) => (
            <div key={section.title}>
              {index > 0 && <Separator />}
              <button
                type="button"
                onClick={section.onClick}
                disabled={section.disabled}
                className="flex items-center gap-4 w-full p-4 text-left transition-colors hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <section.icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{section.title}</h3>
                    {section.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {section.badge}
                      </Badge>
                    )}
                    {section.disabled && (
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About VetCRM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment</span>
            <Badge variant="secondary">Development</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data Storage</span>
            <span className="font-medium">In-Memory (Demo)</span>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            VetCRM is a complete veterinary clinic management solution. Connect a database integration
            to enable persistent data storage.
          </p>
        </CardContent>
      </Card>

      <AgentSettingsDialog open={agentSettingsOpen} onOpenChange={setAgentSettingsOpen} />
    </div>
  )
}
