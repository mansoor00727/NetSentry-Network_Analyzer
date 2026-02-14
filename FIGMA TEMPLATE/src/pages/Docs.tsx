import { Link } from "react-router-dom"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Copy, Terminal } from "lucide-react"

export function Docs() {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 py-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <div className="h-full py-6 pr-6 lg:py-8">
          <div className="w-full">
            <div className="pb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Getting Started</h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  Introduction
                </Link>
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  Installation
                </Link>
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  Quick Start
                </Link>
              </div>
            </div>
            <div className="pb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Core Concepts</h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  Architecture
                </Link>
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  Data Flow
                </Link>
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  Anomaly Detection
                </Link>
              </div>
            </div>
            <div className="pb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">API Reference</h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  REST API
                </Link>
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  WebSocket API
                </Link>
                <Link to="/docs" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline hover:text-foreground">
                  SDKs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
            <div className="font-medium text-foreground">Installation</div>
          </div>
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Installation</h1>
            <p className="text-lg text-muted-foreground">
              Get started with NetSentry by installing the agent on your server.
            </p>
          </div>
          <div className="pb-12 pt-8">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Prerequisites
            </h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Linux (Ubuntu 20.04+, CentOS 8+, Debian 10+)</li>
              <li>Docker Engine 19.03+</li>
              <li>4GB RAM, 2 CPU Cores minimum</li>
            </ul>
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              Docker Install
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              The recommended way to install NetSentry is via Docker. Run the following command to pull the latest image and start the agent:
            </p>
            <div className="relative mt-6 mb-4 rounded-md bg-muted">
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Terminal className="h-4 w-4" />
                  <span>Terminal</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-x-auto p-4">
                <pre className="font-mono text-sm">
                  <code className="language-bash">
{`docker run -d \\
  --name netsentry-agent \\
  --network host \\
  --restart always \\
  -e API_KEY="your-api-key" \\
  netsentry/agent:latest`}
                  </code>
                </pre>
              </div>
            </div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Once the container is running, you can verify the status by checking the logs:
            </p>
            <div className="relative mt-6 mb-4 rounded-md bg-muted">
               <div className="overflow-x-auto p-4">
                <pre className="font-mono text-sm">
                  <code className="language-bash">
{`docker logs -f netsentry-agent`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
            <div className="space-y-2">
              <p className="font-medium">On This Page</p>
              <ul className="m-0 list-none">
                <li className="mt-0 pt-2">
                  <a href="#" className="inline-block no-underline transition-colors hover:text-foreground text-muted-foreground">
                    Prerequisites
                  </a>
                </li>
                <li className="mt-0 pt-2">
                  <a href="#" className="inline-block no-underline transition-colors hover:text-foreground text-muted-foreground">
                    Docker Install
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
