'use client'

import { usePets, useOwners, useAppointments } from '@/lib/data-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PawPrint, Users, Calendar, Clock, CheckCircle, AlertCircle, Search, Plus, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function DashboardContent() {
  const { pets } = usePets()
  const { owners } = useOwners()
  const { appointments } = useAppointments()

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter((a) => a.date === today)
  const upcomingAppointments = appointments
    .filter((a) => a.date >= today && a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)

  const stats = [
    {
      title: 'Patients',
      value: pets.length,
      icon: PawPrint,
      href: '/pets',
      color: 'text-primary',
      bg: 'bg-primary/10',
      action: 'View all pets',
    },
    {
      title: 'Clients',
      value: owners.length,
      icon: Users,
      href: '/owners',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      action: 'View all clients',
    },
    {
      title: 'Today',
      value: todayAppointments.length,
      icon: Calendar,
      href: '/appointments',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      action: 'View schedule',
    },
    {
      title: 'Pending',
      value: appointments.filter((a) => a.status === 'scheduled').length,
      icon: Clock,
      href: '/appointments',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
      action: 'Manage bookings',
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      scheduled: { variant: 'secondary', label: 'Scheduled' },
      confirmed: { variant: 'default', label: 'Confirmed' },
      'in-progress': { variant: 'outline', label: 'In Progress' },
      completed: { variant: 'secondary', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    }
    const config = variants[status] || { variant: 'secondary' as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const appointmentTypeConfig: Record<string, { label: string; color: string; bg: string }> = {
    checkup: { label: 'Checkup', color: 'bg-primary', bg: 'bg-primary/10 text-primary' },
    vaccination: { label: 'Vaccine', color: 'bg-green-500', bg: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    surgery: { label: 'Surgery', color: 'bg-rose-500', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    grooming: { label: 'Groom', color: 'bg-violet-500', bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    emergency: { label: 'Emergency', color: 'bg-red-500', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    'follow-up': { label: 'Follow-up', color: 'bg-amber-500', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  }

  const getAppointmentTypeBadge = (type: string) => {
    const config = appointmentTypeConfig[type] || { label: type, color: 'bg-muted', bg: 'bg-muted text-muted-foreground' }
    return <Badge variant="outline" className={config.bg}>{config.label}</Badge>
  }

  const getAppointmentTypeColor = (type: string) => {
    return appointmentTypeConfig[type]?.color || 'bg-muted'
  }

  const getPetById = (petId: string) => pets.find((p) => p.id === petId)
  const getOwnerById = (ownerId: string) => owners.find((o) => o.id === ownerId)

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Quick Actions - Mobile First */}
      <div className="grid grid-cols-4 gap-2 md:hidden">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border transition-all active:scale-95">
              <div className={`flex size-10 items-center justify-center rounded-full ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{stat.title}</span>
              <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Buttons - Mobile */}
      <div className="flex gap-2 md:hidden">
        <Button asChild className="flex-1 h-12">
          <Link href="/appointments">
            <Plus className="size-4 mr-2" />
            New Appointment
          </Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1 h-12">
          <Link href="/assistant">
            <Search className="size-4 mr-2" />
            Look Up Info
          </Link>
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your clinic overview.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/appointments">
                <Plus className="size-4 mr-2" />
                New Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/assistant">
                <Search className="size-4 mr-2" />
                Look Up Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Stats */}
      <div className="hidden md:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:shadow-md cursor-pointer group overflow-hidden h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg} transition-transform group-hover:scale-110`}>
                  <stat.icon className={`size-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>{stat.action}</span>
                  <ChevronRight className="size-3 ml-1 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Calendar className="size-4 md:size-5 text-primary" />
                Upcoming
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="size-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">All clear for now</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingAppointments.slice(0, 4).map((appointment) => {
                  const pet = getPetById(appointment.petId)
                  return (
                    <Link
                      key={appointment.id}
                      href="/appointments"
                      className="flex items-center justify-between gap-3 rounded-lg border p-2.5 transition-all hover:shadow-sm hover:border-primary/20 active:bg-muted overflow-hidden relative"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getAppointmentTypeColor(appointment.type)}`} />
                      <div className="flex items-center gap-3 min-w-0 pl-1">
                        {pet?.imageUrl ? (
                          <div className="size-9 rounded-full overflow-hidden shrink-0 ring-2 ring-background">
                            <Image
                              src={pet.imageUrl}
                              alt={pet.name}
                              width={36}
                              height={36}
                              className="size-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <PawPrint className="size-4 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{pet?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getAppointmentTypeBadge(appointment.type)}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <FileText className="size-4 md:size-5 text-primary" />
                Recent Patients
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/pets">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {pets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle className="size-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No patients yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pets.slice(0, 4).map((pet) => {
                  const owner = getOwnerById(pet.ownerId)
                  return (
                    <Link
                      key={pet.id}
                      href={`/pets/${pet.id}`}
                      className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-muted/50 active:bg-muted"
                    >
                      {pet.imageUrl ? (
                        <div className="size-9 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={pet.imageUrl}
                            alt={pet.name}
                            width={36}
                            height={36}
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                          <PawPrint className="size-4 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{pet.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {pet.breed} - {owner ? `${owner.firstName} ${owner.lastName[0]}.` : 'Unknown'}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {pet.species}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
