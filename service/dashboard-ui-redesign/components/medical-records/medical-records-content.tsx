'use client'

import React from "react"

import { useState } from 'react'
import { useMedicalRecords, usePets } from '@/lib/data-store'
import type { MedicalRecord } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  FileText,
  Syringe,
  Stethoscope,
  Pill,
  FlaskConical,
  StickyNote,
} from 'lucide-react'
import Link from 'next/link'
import { MedicalRecordFormDialog } from './medical-record-form-dialog'

type TypeFilter = MedicalRecord['type'] | 'all'

const recordTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  vaccination: Syringe,
  diagnosis: Stethoscope,
  prescription: Pill,
  procedure: FlaskConical,
  'lab-result': FlaskConical,
  note: StickyNote,
}

const recordTypeLabels: Record<string, string> = {
  vaccination: 'Vaccination',
  diagnosis: 'Diagnosis',
  prescription: 'Prescription',
  procedure: 'Procedure',
  'lab-result': 'Lab Result',
  note: 'Note',
}

export function MedicalRecordsContent() {
  const { records, isLoading } = useMedicalRecords()
  const { pets } = usePets()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const getPetName = (petId: string) => pets.find((p) => p.id === petId)?.name || 'Unknown'

  const filteredRecords = records
    .filter((record) => {
      const matchesSearch =
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getPetName(record.petId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.veterinarian.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === 'all' || record.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const typeOptions: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'lab-result', label: 'Lab Result' },
    { value: 'note', label: 'Note' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading medical records...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">View and manage patient medical history</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>{filteredRecords.length} records on file</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>
          <div className="flex gap-1 flex-wrap mt-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTypeFilter(option.value === typeFilter ? 'all' : option.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  typeFilter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No records found</h3>
              <p className="text-muted-foreground">
                {searchQuery || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add medical records to track patient history'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const Icon = recordTypeIcons[record.type] || FileText
                const pet = pets.find((p) => p.id === record.petId)
                return (
                  <div key={record.id} className="flex gap-4 rounded-lg border p-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold">{record.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Link
                              href={`/pets/${record.petId}`}
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {getPetName(record.petId)}
                            </Link>
                            <span>-</span>
                            <span>{record.veterinarian}</span>
                            <span>-</span>
                            <span>
                              {new Date(record.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline">{recordTypeLabels[record.type]}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {record.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <MedicalRecordFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
