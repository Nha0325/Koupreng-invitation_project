import React from "react"
export interface Pet {
  id: string
  name: string
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other'
  breed: string
  dateOfBirth: string
  weight: number
  ownerId: string
  notes: string
  imageUrl?: string
  createdAt: string
}

export interface Owner {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  petIds: string[]
  createdAt: string
}

export interface Appointment {
  id: string
  petId: string
  ownerId: string
  date: string
  time: string
  type: 'checkup' | 'vaccination' | 'surgery' | 'grooming' | 'emergency' | 'follow-up'
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  notes: string
  veterinarian: string
  createdAt: string
}

export interface MedicalRecord {
  id: string
  petId: string
  appointmentId?: string
  date: string
  type: 'vaccination' | 'prescription' | 'diagnosis' | 'procedure' | 'lab-result' | 'note'
  title: string
  description: string
  veterinarian: string
  attachments?: string[]
  createdAt: string
}

export interface AgentSettings {
  model: string
  temperature: number
  systemPrompt: string
}

export type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}
