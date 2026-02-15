'use client';

import { motion } from "motion/react"
import { ArrowRight, Activity, Shield, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 xl:py-40 bg-background text-foreground">
        <div className="container px-4 md:px-6 relative z-10 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium self-start">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                v2.0 Now Available
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Real-Time Network Intelligence
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Detect anomalies, visualize traffic patterns, and secure your infrastructure with our AI-powered network analysis platform.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild className="gap-2">
                  <Link href="/dashboard/">
                    Live Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">Read Documentation</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last border shadow-2xl relative"
            >
              <img
                alt="Network Visualization"
                className="h-full w-full object-cover"
                src="/dashboard-preview.png"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-primary">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Why Choose NetSentry?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive monitoring tools designed for modern, distributed systems.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <FeatureCard 
              icon={<Activity className="h-10 w-10 text-blue-500" />}
              title="ML Anomaly Detection"
              description="Automatically identify unusual traffic patterns and potential security breaches in real-time using unsupervised learning."
            />
            <FeatureCard 
              icon={<Cpu className="h-10 w-10 text-indigo-500" />}
              title="Live Dashboards"
              description="Visualize network flow with interactive, real-time charts powered by WebSocket streaming and D3.js."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-emerald-500" />}
              title="Predictive Analytics"
              description="Forecast bandwidth usage and potential bottlenecks before they impact your users."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="flex flex-col items-center text-center p-6 h-full transition-all hover:shadow-lg hover:-translate-y-1 bg-card border-muted">
      <CardHeader className="p-0 mb-4">
        <div className="p-3 bg-muted rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardTitle className="mb-2 text-xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
