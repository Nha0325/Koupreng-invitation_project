'use client'

import useSWR, { mutate } from 'swr'
import type { Pet, Owner, Appointment, MedicalRecord, AgentSettings } from './types'
import { mockPets, mockOwners, mockAppointments, mockMedicalRecords } from './mock-data'

// In-memory data store (simulates database)
let petsStore = [...mockPets]
let ownersStore = [...mockOwners]
let appointmentsStore = [...mockAppointments]
let medicalRecordsStore = [...mockMedicalRecords]
let agentSettingsStore: AgentSettings = {
  model: 'anthropic/claude-opus-4.5',
  temperature: 0.7,
  systemPrompt: `You are a helpful veterinary assistant for VetCRM. You help staff with:
- Looking up patient and owner information
- Scheduling appointments
- Answering common veterinary questions
- Providing reminders about vaccinations and follow-ups

Always be professional, empathetic, and accurate in your responses.`,
}

// Fetchers
const petsFetcher = () => Promise.resolve(petsStore)
const ownersFetcher = () => Promise.resolve(ownersStore)
const appointmentsFetcher = () => Promise.resolve(appointmentsStore)
const medicalRecordsFetcher = () => Promise.resolve(medicalRecordsStore)
const agentSettingsFetcher = () => Promise.resolve(agentSettingsStore)

// Hooks
export function usePets() {
  const { data, error, isLoading } = useSWR<Pet[]>('pets', petsFetcher)
  return { pets: data ?? [], error, isLoading }
}

export function usePet(id: string) {
  const { pets, error, isLoading } = usePets()
  const pet = pets.find((p) => p.id === id)
  return { pet, error, isLoading }
}

export function useOwners() {
  const { data, error, isLoading } = useSWR<Owner[]>('owners', ownersFetcher)
  return { owners: data ?? [], error, isLoading }
}

export function useOwner(id: string) {
  const { owners, error, isLoading } = useOwners()
  const owner = owners.find((o) => o.id === id)
  return { owner, error, isLoading }
}

export function useAppointments() {
  const { data, error, isLoading } = useSWR<Appointment[]>('appointments', appointmentsFetcher)
  return { appointments: data ?? [], error, isLoading }
}

export function useMedicalRecords(petId?: string) {
  const { data, error, isLoading } = useSWR<MedicalRecord[]>('medical-records', medicalRecordsFetcher)
  const records = petId ? (data ?? []).filter((r) => r.petId === petId) : data ?? []
  return { records, error, isLoading }
}

export function useAgentSettings() {
  const { data, error, isLoading } = useSWR<AgentSettings>('agent-settings', agentSettingsFetcher)
  return { settings: data ?? agentSettingsStore, error, isLoading }
}

// Mutations
export function addPet(pet: Omit<Pet, 'id' | 'createdAt'>) {
  const newPet: Pet = {
    ...pet,
    id: `pet-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  petsStore = [...petsStore, newPet]
  
  // Update owner's petIds
  const ownerIndex = ownersStore.findIndex((o) => o.id === pet.ownerId)
  if (ownerIndex !== -1) {
    ownersStore[ownerIndex] = {
      ...ownersStore[ownerIndex],
      petIds: [...ownersStore[ownerIndex].petIds, newPet.id],
    }
    mutate('owners')
  }
  
  mutate('pets')
  return newPet
}

export function updatePet(id: string, updates: Partial<Pet>) {
  const index = petsStore.findIndex((p) => p.id === id)
  if (index !== -1) {
    petsStore[index] = { ...petsStore[index], ...updates }
    mutate('pets')
    return petsStore[index]
  }
  return null
}

export function deletePet(id: string) {
  const pet = petsStore.find((p) => p.id === id)
  if (pet) {
    petsStore = petsStore.filter((p) => p.id !== id)
    
    // Remove from owner's petIds
    const ownerIndex = ownersStore.findIndex((o) => o.id === pet.ownerId)
    if (ownerIndex !== -1) {
      ownersStore[ownerIndex] = {
        ...ownersStore[ownerIndex],
        petIds: ownersStore[ownerIndex].petIds.filter((pId) => pId !== id),
      }
      mutate('owners')
    }
    
    mutate('pets')
    return true
  }
  return false
}

export function addOwner(owner: Omit<Owner, 'id' | 'createdAt' | 'petIds'>) {
  const newOwner: Owner = {
    ...owner,
    id: `owner-${Date.now()}`,
    petIds: [],
    createdAt: new Date().toISOString(),
  }
  ownersStore = [...ownersStore, newOwner]
  mutate('owners')
  return newOwner
}

export function updateOwner(id: string, updates: Partial<Owner>) {
  const index = ownersStore.findIndex((o) => o.id === id)
  if (index !== -1) {
    ownersStore[index] = { ...ownersStore[index], ...updates }
    mutate('owners')
    return ownersStore[index]
  }
  return null
}

export function deleteOwner(id: string) {
  ownersStore = ownersStore.filter((o) => o.id !== id)
  mutate('owners')
  return true
}

export function addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>) {
  const newAppointment: Appointment = {
    ...appointment,
    id: `appt-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  appointmentsStore = [...appointmentsStore, newAppointment]
  mutate('appointments')
  return newAppointment
}

export function updateAppointment(id: string, updates: Partial<Appointment>) {
  const index = appointmentsStore.findIndex((a) => a.id === id)
  if (index !== -1) {
    appointmentsStore[index] = { ...appointmentsStore[index], ...updates }
    mutate('appointments')
    return appointmentsStore[index]
  }
  return null
}

export function deleteAppointment(id: string) {
  appointmentsStore = appointmentsStore.filter((a) => a.id !== id)
  mutate('appointments')
  return true
}

export function addMedicalRecord(record: Omit<MedicalRecord, 'id' | 'createdAt'>) {
  const newRecord: MedicalRecord = {
    ...record,
    id: `record-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  medicalRecordsStore = [...medicalRecordsStore, newRecord]
  mutate('medical-records')
  return newRecord
}

export function updateAgentSettings(settings: Partial<AgentSettings>) {
  agentSettingsStore = { ...agentSettingsStore, ...settings }
  mutate('agent-settings')
  return agentSettingsStore
}
