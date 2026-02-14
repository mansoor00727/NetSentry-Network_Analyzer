'use client';

import Link from "next/link"
import { ShieldCheck, Menu, X, Github, Twitter, Linkedin } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/button"
import { usePathname } from 'next/navigation';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
          <Link className="flex items-center gap-2 font-bold text-xl" href="/">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span>NetSentry</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link className="transition-colors hover:text-primary" href="/features">
              Features
            </Link>
            <Link className="transition-colors hover:text-primary" href="/demo">
              Demo
            </Link>
            <Link className="transition-colors hover:text-primary" href="/docs">
              Docs
            </Link>
            <Link className="transition-colors hover:text-primary" href="/contact">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-b bg-background p-4">
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <Link
                className="transition-colors hover:text-primary"
                href="/features"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                className="transition-colors hover:text-primary"
                href="/demo"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo
              </Link>
              <Link
                className="transition-colors hover:text-primary"
                href="/docs"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                className="transition-colors hover:text-primary"
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="w-full">
                <Link href="/demo" onClick={() => setIsMenuOpen(false)}>
                  Try Demo
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/40 py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span>NetSentry</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced real-time network traffic analysis and anomaly detection for modern infrastructure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/demo" className="hover:text-foreground">Live Demo</Link></li>
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Community</Link></li>
                <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4 text-muted-foreground">
                <Link href="#" className="hover:text-foreground"><Twitter className="h-5 w-5" /></Link>
                <Link href="#" className="hover:text-foreground"><Github className="h-5 w-5" /></Link>
                <Link href="#" className="hover:text-foreground"><Linkedin className="h-5 w-5" /></Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NetSentry Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
