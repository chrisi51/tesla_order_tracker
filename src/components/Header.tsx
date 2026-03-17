'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  LogIn,
  Heart,
  Coffee,
  Github,
  Code2,
  Menu,
} from 'lucide-react'

interface HeaderProps {
  isAdmin: boolean
  settings: { showDonation?: boolean; donationUrl?: string; paypalUrl?: string } | null
}

export function Header({ isAdmin, settings }: HeaderProps) {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const tn = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg shadow-sm">
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
      <div className="w-full max-w-[98vw] mx-auto px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo + title */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="relative rounded-lg bg-primary p-1.5 w-[34px] h-[40px] transition-transform hover:scale-105 shadow-md shadow-primary/20">
              <Image
                src="/logo.webp"
                alt="Tesla Tracker Logo"
                fill
                sizes="40px"
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-lg font-bold tracking-tight">TFF Order Stats</span>
          </Link>

          {/* Desktop nav (>=1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {settings?.showDonation && (settings?.donationUrl || settings?.paypalUrl) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    {tc('support')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {settings.donationUrl && (
                    <DropdownMenuItem asChild>
                      <a href={settings.donationUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Coffee className="h-4 w-4" />
                        Buy Me a Coffee
                      </a>
                    </DropdownMenuItem>
                  )}
                  {settings.paypalUrl && (
                    <DropdownMenuItem asChild>
                      <a href={settings.paypalUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.644h6.568c2.175 0 3.906.544 4.996 1.588.322.31.566.66.735 1.04.18.407.263.854.248 1.335-.016.054-.016.108-.032.162a5.58 5.58 0 0 1-.15.823 4.81 4.81 0 0 1-.39 1.014c-.51.97-1.375 1.67-2.585 2.1-.576.205-1.228.35-1.944.433-.283.033-.576.05-.878.05H9.94a.77.77 0 0 0-.758.645l-.924 5.86a.641.641 0 0 1-.633.54H7.07l.006.001z"/><path d="M18.27 7.468c-.01.058-.02.115-.035.173-.636 3.267-2.81 4.394-5.588 4.394h-1.413a.687.687 0 0 0-.679.581l-.723 4.578-.205 1.3a.361.361 0 0 0 .357.417h2.504a.676.676 0 0 0 .668-.57l.027-.144.53-3.355.034-.184a.676.676 0 0 1 .668-.571h.42c2.722 0 4.853-1.105 5.476-4.303.26-1.336.125-2.45-.562-3.234a2.68 2.68 0 0 0-.77-.56l-.107-.05-.002.028z"/></svg>
                        PayPal
                      </a>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Link href="/docs">
              <Button variant="ghost" size="icon" className="h-9 w-9" title={tn('apiDocs')}>
                <Code2 className="h-4 w-4" />
                <span className="sr-only">{tn('apiDocs')}</span>
              </Button>
            </Link>
            <a
              href="https://github.com/svenger87/tesla_order_tracker"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </a>

            <div className="w-px h-5 bg-border mx-2" />

            <LanguageSwitcher />
            <ThemeToggle />

            {/* Admin */}
            {isAdmin ? (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/5">
                  Admin
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Tablet nav (640-1024px): icon-only */}
          <nav className="hidden sm:flex lg:hidden items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />

            {isAdmin ? (
              <Link href="/admin">
                <Button variant="outline" size="icon" className="h-9 w-9 border-primary/30 text-primary" title="Admin">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="icon" className="h-9 w-9" title="Admin">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile nav (<640px) */}
          <div className="flex sm:hidden items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{tc('menu')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>TFF Order Stats</SheetTitle>
            <SheetDescription className="sr-only">{tn('navigationMenu')}</SheetDescription>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-2">
            <Link href="/docs" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Code2 className="h-4 w-4" />
                {tn('apiDocs')}
              </Button>
            </Link>
            <a
              href="https://github.com/svenger87/tesla_order_tracker"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </a>
            {settings?.showDonation && settings?.donationUrl && (
              <a
                href={settings.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Coffee className="h-4 w-4" />
                  Buy Me a Coffee
                </Button>
              </a>
            )}
            {settings?.showDonation && settings?.paypalUrl && (
              <a
                href={settings.paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.644h6.568c2.175 0 3.906.544 4.996 1.588.322.31.566.66.735 1.04.18.407.263.854.248 1.335-.016.054-.016.108-.032.162a5.58 5.58 0 0 1-.15.823 4.81 4.81 0 0 1-.39 1.014c-.51.97-1.375 1.67-2.585 2.1-.576.205-1.228.35-1.944.433-.283.033-.576.05-.878.05H9.94a.77.77 0 0 0-.758.645l-.924 5.86a.641.641 0 0 1-.633.54H7.07l.006.001z"/><path d="M18.27 7.468c-.01.058-.02.115-.035.173-.636 3.267-2.81 4.394-5.588 4.394h-1.413a.687.687 0 0 0-.679.581l-.723 4.578-.205 1.3a.361.361 0 0 0 .357.417h2.504a.676.676 0 0 0 .668-.57l.027-.144.53-3.355.034-.184a.676.676 0 0 1 .668-.571h.42c2.722 0 4.853-1.105 5.476-4.303.26-1.336.125-2.45-.562-3.234a2.68 2.68 0 0 0-.77-.56l-.107-.05-.002.028z"/></svg>
                  PayPal
                </Button>
              </a>
            )}

            <div className="h-px bg-border my-2" />

            {isAdmin ? (
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 text-primary">
                  <LogIn className="h-4 w-4" />
                  {tn('adminDashboard')}
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

/**
 * Self-contained header wrapper that fetches its own data.
 * Used in layout.tsx (server component) to avoid prop drilling.
 */
export function HeaderWithData() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [settings, setSettings] = useState<{ showDonation?: boolean; donationUrl?: string; paypalUrl?: string } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [authRes, settingsRes] = await Promise.all([
        fetch('/api/auth/check'),
        fetch('/api/settings'),
      ])
      const authData = await authRes.json()
      setIsAdmin(authData.authenticated)
      const settingsData = await settingsRes.json()
      setSettings(settingsData)
    } catch {
      // Silently handle — header renders fine without admin/settings
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Header
      isAdmin={isAdmin}
      settings={settings}
    />
  )
}
