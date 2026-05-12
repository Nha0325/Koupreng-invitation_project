'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { addMedicalRecord, usePets } from '@/lib/data-store'
import type { MedicalRecord } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface MedicalRecordFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId?: string
}

const typeOptions: { value: MedicalRecord['type']; label: string }[] = [
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'lab-result', label: 'Lab Result' },
  { value: 'note', label: 'Note' },
]

const veterinarians = [
  'Dr. Amanda Foster',
  'Dr. James Wilson',
  'Dr. Sarah Chen',
  'Lisa Martinez',
]

export function MedicalRecordFormDialog({
  open,
  onOpenChange,
  petId: initialPetId,
}: MedicalRecordFormDialogProps) {
  const { pets } = usePets()

  const [formData, setFormData] = useState({
    petId: initialPetId || '',
    date: '',
    type: 'vaccination' as MedicalRecord['type'],
    title: '',
    description: '',
    veterinarian: veterinarians[0],
  })

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFormData({
      petId: initialPetId || pets[0]?.id || '',
      date: today,
      type: 'vaccination',
      title: '',
      description: '',
      veterinarian: veterinarians[0],
    })
  }, [initialPetId, pets, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMedicalRecord(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>
            Create a new medical record for a patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pet">Patient</Label>
              <Select
                value={formData.petId}
                onValueChange={(value) => setFormData({ ...formData, petId: value })}
              >
                <SelectTrigger id="pet">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Record Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: MedicalRecord['type']) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinarian</Label>
              <Select
                value={formData.veterinarian}
                onValueChange={(value) => setFormData({ ...formData, veterinarian: value })}
              >
                <SelectTrigger id="veterinarian">
                  <SelectValue placeholder="Select veterinarian" />
                </SelectTrigger>
                <SelectContent>
                  {veterinarians.map((vet) => (
                    <SelectItem key={vet} value={vet}>
                      {vet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Annual Vaccination, Dental Cleaning"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed notes about this medical record..."
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
