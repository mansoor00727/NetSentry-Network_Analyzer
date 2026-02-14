import { motion } from "motion/react"
import { Monitor, Network, Container, Layers, Zap, Clock, Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"

export function Features() {
  const features = [
    {
      icon: <Network className="h-12 w-12 text-blue-500" />,
      title: "WebSocket Streaming",
      description: "Experience zero-latency updates with our WebSocket-first architecture. Watch traffic flows update instantly without page refreshes.",
      benefits: ["Real-time packet inspection", "Millisecond-level latency", "Persistent connections"]
    },
    {
      icon: <Layers className="h-12 w-12 text-indigo-500" />,
      title: "ML Ensemble",
      description: "Leverage multiple machine learning models working in concert to detect sophisticated threats that single models might miss.",
      benefits: ["Random Forest + LSTM", "Unsupervised Anomaly Detection", "Adaptive Thresholding"]
    },
    {
      icon: <Monitor className="h-12 w-12 text-purple-500" />,
      title: "Prometheus/Grafana Integration",
      description: "Seamlessly export metrics to your existing observability stack. Built-in exporters for Prometheus and pre-configured Grafana dashboards.",
      benefits: ["Standard Metrics Format", "Custom Alert Rules", "Historical Data Retention"]
    },
    {
      icon: <Container className="h-12 w-12 text-emerald-500" />,
      title: "Docker Containerization",
      description: "Deploy anywhere with our lightweight, containerized agents. Run on bare metal, VMs, or Kubernetes clusters with a single command.",
      benefits: ["Kubernetes Native", "Small Footprint (<50MB)", "Auto-scaling Support"]
    }
  ]

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-primary">
            Platform Capabilities
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Built for Scale & Speed
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Every component is optimized for high-throughput network environments.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col p-6 hover:shadow-lg transition-shadow border-muted">
                <CardHeader className="p-0 pb-4 flex flex-row items-center gap-4">
                  <div className="p-3 bg-muted/50 rounded-xl">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm font-medium">
                        <Zap className="mr-2 h-4 w-4 text-amber-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
