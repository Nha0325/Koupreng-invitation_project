'use client'

import { useState } from 'react'
import { useOwners, usePets, deleteOwner } from '@/lib/data-store'
import type { Owner } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Eye, PawPrint } from 'lucide-react'
import Link from 'next/link'
import { OwnerFormDialog } from './owner-form-dialog'

export function OwnersContent() {
  const { owners, isLoading } = useOwners()
  const { pets } = usePets()
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [deletingOwner, setDeletingOwner] = useState<Owner | null>(null)

  const getPetCount = (petIds: string[]) => {
    return petIds.length
  }

  const getPetNames = (petIds: string[]) => {
    return petIds
      .map((id) => pets.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  const filteredOwners = owners.filter((owner) => {
    const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      owner.email.toLowerCase().includes(query) ||
      owner.phone.includes(query)
    )
  })

  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner)
    setDialogOpen(true)
  }

  const handleDelete = (owner: Owner) => {
    setDeletingOwner(owner)
  }

  const confirmDelete = () => {
    if (deletingOwner) {
      deleteOwner(deletingOwner.id)
      setDeletingOwner(null)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingOwner(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading owners...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Owners</h1>
          <p className="text-muted-foreground">Manage your client directory</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Owner
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>{filteredOwners.length} clients registered</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOwners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No clients found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first client'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Pets</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <Link
                          href={`/owners/${owner.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {owner.firstName} {owner.lastName}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{owner.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{owner.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PawPrint className="size-4 text-muted-foreground" />
                          <span>{getPetCount(owner.petIds)}</span>
                          <span className="hidden lg:inline text-muted-foreground text-sm">
                            {getPetNames(owner.petIds) && `(${getPetNames(owner.petIds)})`}
                          </span>
                        </div>
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
                              <Link href={`/owners/${owner.id}`}>
                                <Eye className="size-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(owner)}>
                              <Edit className="size-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(owner)}
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

      <OwnerFormDialog open={dialogOpen} onOpenChange={handleDialogClose} owner={editingOwner} />

      <AlertDialog open={!!deletingOwner} onOpenChange={() => setDeletingOwner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingOwner?.firstName} {deletingOwner?.lastName}?
              This action cannot be undone.
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
