'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar'

interface AppHeaderProps {
  breadcrumbs?: { label: string; href?: string }[]
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background md:bg-background bg-sidebar text-sidebar-foreground md:text-foreground border-sidebar-border md:border-border px-4 md:px-6">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto order-last text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>
      )}
      
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbLink href="/" className="font-semibold text-sidebar-primary md:text-primary">
            VetCRM
          </BreadcrumbLink>
          
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="contents">
              <BreadcrumbSeparator className="text-sidebar-foreground/50 md:text-muted-foreground" />
              {index === breadcrumbs.length - 1 || !crumb.href ? (
                <BreadcrumbPage className="text-sidebar-foreground md:text-foreground">{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href} className="text-sidebar-foreground/80 md:text-muted-foreground">{crumb.label}</BreadcrumbLink>
              )}
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
