'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { addAppointment, updateAppointment, usePets, useOwners } from '@/lib/data-store'
import type { Appointment } from '@/lib/types'
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

interface AppointmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: Appointment | null
}

const typeOptions: { value: Appointment['type']; label: string }[] = [
  { value: 'checkup', label: 'Checkup' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'follow-up', label: 'Follow-up' },
]

const statusOptions: { value: Appointment['status']; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const veterinarians = [
  'Dr. Amanda Foster',
  'Dr. James Wilson',
  'Dr. Sarah Chen',
  'Lisa Martinez',
]

export function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
}: AppointmentFormDialogProps) {
  const { pets } = usePets()
  const { owners } = useOwners()
  const isEditing = !!appointment

  const [formData, setFormData] = useState({
    petId: '',
    ownerId: '',
    date: '',
    time: '',
    type: 'checkup' as Appointment['type'],
    status: 'scheduled' as Appointment['status'],
    notes: '',
    veterinarian: veterinarians[0],
  })

  useEffect(() => {
    if (appointment) {
      setFormData({
        petId: appointment.petId,
        ownerId: appointment.ownerId,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes,
        veterinarian: appointment.veterinarian,
      })
    } else {
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        petId: pets[0]?.id || '',
        ownerId: pets[0]?.ownerId || owners[0]?.id || '',
        date: today,
        time: '09:00',
        type: 'checkup',
        status: 'scheduled',
        notes: '',
        veterinarian: veterinarians[0],
      })
    }
  }, [appointment, pets, owners])

  const handlePetChange = (petId: string) => {
    const pet = pets.find((p) => p.id === petId)
    setFormData({
      ...formData,
      petId,
      ownerId: pet?.ownerId || formData.ownerId,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && appointment) {
      updateAppointment(appointment.id, formData)
    } else {
      addAppointment(formData)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Appointment' : 'Schedule Appointment'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the appointment details below.'
              : 'Fill in the details to schedule a new appointment.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pet">Pet</Label>
              <Select value={formData.petId} onValueChange={handlePetChange}>
                <SelectTrigger id="pet">
                  <SelectValue placeholder="Select pet" />
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
              <Label htmlFor="owner">Owner</Label>
              <Select
                value={formData.ownerId}
                onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
              >
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.firstName} {owner.lastName}
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
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Appointment['type']) =>
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Appointment['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes for this appointment..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Schedule'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
