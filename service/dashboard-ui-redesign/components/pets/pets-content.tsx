'use client'

import { useState } from 'react'
import { usePets, useOwners, deletePet } from '@/lib/data-store'
import type { Pet } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, MoreHorizontal, Edit, Trash2, PawPrint, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PetFormDialog } from './pet-form-dialog'

const speciesIcons: Record<string, string> = {
  dog: 'Dog',
  cat: 'Cat',
  bird: 'Bird',
  rabbit: 'Rabbit',
  reptile: 'Reptile',
  other: 'Other',
}

type SpeciesFilter = Pet['species'] | 'all'

export function PetsContent() {
  const { pets, isLoading } = usePets()
  const { owners } = useOwners()
  const [searchQuery, setSearchQuery] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null)

  const getOwnerName = (ownerId: string) => {
    const owner = owners.find((o) => o.id === ownerId)
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOwnerName(pet.ownerId).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter
    return matchesSearch && matchesSpecies
  })

  const speciesOptions: { value: SpeciesFilter; label: string }[] = [
    { value: 'all', label: 'All Species' },
    { value: 'dog', label: 'Dogs' },
    { value: 'cat', label: 'Cats' },
    { value: 'bird', label: 'Birds' },
    { value: 'rabbit', label: 'Rabbits' },
    { value: 'reptile', label: 'Reptiles' },
    { value: 'other', label: 'Other' },
  ]

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet)
    setDialogOpen(true)
  }

  const handleDelete = (pet: Pet) => {
    setDeletingPet(pet)
  }

  const confirmDelete = () => {
    if (deletingPet) {
      deletePet(deletingPet.id)
      setDeletingPet(null)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingPet(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading pets...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pets</h1>
          <p className="text-muted-foreground">Manage your patient records</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Pet
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>{filteredPets.length} pets registered</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search pets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {speciesOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSpeciesFilter(option.value === speciesFilter ? 'all' : option.value)
                    }
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      speciesFilter === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PawPrint className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No pets found</h3>
              <p className="text-muted-foreground">
                {searchQuery || speciesFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first pet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead className="hidden md:table-cell">Breed</TableHead>
                    <TableHead className="hidden sm:table-cell">Age</TableHead>
                    <TableHead className="hidden lg:table-cell">Weight</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPets.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell>
                        <Link
                          href={`/pets/${pet.id}`}
                          className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                        >
                          {pet.imageUrl ? (
                            <div className="size-8 rounded-full overflow-hidden shrink-0">
                              <Image
                                src={pet.imageUrl}
                                alt={pet.name}
                                width={32}
                                height={32}
                                className="size-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                              <PawPrint className="size-4 text-primary" />
                            </div>
                          )}
                          {pet.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{speciesIcons[pet.species]}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{pet.breed}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {calculateAge(pet.dateOfBirth)} yrs
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{pet.weight} kg</TableCell>
                      <TableCell>
                        <Link
                          href={`/owners/${pet.ownerId}`}
                          className="hover:text-primary transition-colors"
                        >
                          {getOwnerName(pet.ownerId)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/pets/${pet.id}`}>
                                <Eye className="size-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(pet)}>
                              <Edit className="size-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(pet)}
                              className="text-destructive"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <PetFormDialog open={dialogOpen} onOpenChange={handleDialogClose} pet={editingPet} />

      <AlertDialog open={!!deletingPet} onOpenChange={() => setDeletingPet(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingPet?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
