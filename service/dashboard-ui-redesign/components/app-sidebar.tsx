'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  ChevronDown,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const navGroups = [
  {
    title: 'Dashboard',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Pets', href: '/pets', icon: PawPrint },
      { title: 'Owners', href: '/owners', icon: Users },
    ],
  },
  {
    title: 'Medical',
    items: [
      { title: 'Appointments', href: '/appointments', icon: Calendar },
      { title: 'Medical Records', href: '/medical-records', icon: FileText },
    ],
  },
  {
    title: 'Tools',
    items: [
      { title: 'AI Assistant', href: '/assistant', icon: MessageSquare },
    ],
  },
]

const bottomNavItems = [
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['Dashboard', 'Management', 'Medical', 'Tools'])
  )

  const handleNavClick = () => {
    setOpenMobile(false)
  }

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle)
    } else {
      newExpanded.add(groupTitle)
    }
    setExpandedGroups(newExpanded)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link 
          href="/" 
          className="flex items-center gap-3"
          onClick={handleNavClick}
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PawPrint className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">VetCRM</span>
            <span className="text-xs text-sidebar-foreground/70">Clinic Management</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between px-2 py-2 text-sm font-semibold text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
            >
              <span>{group.title}</span>
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  expandedGroups.has(group.title) ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
            {expandedGroups.has(group.title) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname.startsWith(item.href))
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href} onClick={handleNavClick}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href} onClick={handleNavClick}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
