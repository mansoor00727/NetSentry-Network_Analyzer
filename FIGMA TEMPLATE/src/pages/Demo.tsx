import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "motion/react"
import { Activity, ShieldCheck, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"

const data = [
  { time: "00:00", traffic: 4000, anomalies: 240 },
  { time: "04:00", traffic: 3000, anomalies: 139 },
  { time: "08:00", traffic: 2000, anomalies: 980 },
  { time: "12:00", traffic: 2780, anomalies: 390 },
  { time: "16:00", traffic: 1890, anomalies: 480 },
  { time: "20:00", traffic: 2390, anomalies: 380 },
  { time: "24:00", traffic: 3490, anomalies: 430 },
]

export function Demo() {
  return (
    <div className="w-full py-12 bg-muted/30 min-h-screen">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Live Dashboard Preview</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            See how NetSentry visualizes traffic spikes and security events in real-time.
          </p>
          <Button size="lg" className="animate-pulse">
            Connect to Live Stream
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border bg-card text-card-foreground shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b bg-muted/40 flex justify-between items-center">
            <div className="font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" /> Network Traffic Overview
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live
              </span>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full font-medium">Last 24h</span>
            </div>
          </div>
          <div className="p-6 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="time" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                <Area type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAnomalies)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-t bg-muted/20">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground">2.4 TB</div>
              <div className="text-sm text-muted-foreground mt-1">Total Bandwidth</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-500">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-500">12</div>
              <div className="text-sm text-muted-foreground mt-1">Threats Blocked</div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <CardTitle className="text-lg">Real-Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor packet flows as they happen with sub-millisecond precision using our proprietary engine.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              <CardTitle className="text-lg">Threat Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically block suspicious IPs and patterns before they can probe your internal network.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Zap className="h-8 w-8 text-amber-500" />
              <CardTitle className="text-lg">Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get notified via Slack, PagerDuty, or Email the moment an anomaly threshold is breached.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
