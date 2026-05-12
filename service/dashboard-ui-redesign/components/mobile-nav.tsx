'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const navItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Pets', href: '/pets', icon: PawPrint },
  { title: 'Owners', href: '/owners', icon: Users },
  { title: 'Appointments', href: '/appointments', icon: Calendar },
  { title: 'Medical Records', href: '/medical-records', icon: FileText },
  { title: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { title: 'Settings', href: '/settings', icon: Settings },
]

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-full">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PawPrint className="size-5" />
              </div>
              <SheetTitle className="text-lg font-semibold">VetCRM</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Button>
          </div>
        </SheetHeader>
        
        <nav className="flex flex-col p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-4 rounded-lg px-4 py-4 text-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="size-6" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
