import { Activity, Clock, Cpu, Play, Square } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn, sleep } from "@/lib/utils"

// Delay between consecutive poll attempts so the loop isn't a tight,
// unthrottled request cycle.
const POLL_DELAY_MS = 1000

interface PollData {
  count: number
  timestamp: string
  message: string
  status?: string
}

export default function LongPollDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "done" | "error"
  >("idle")
  const [messages, setMessages] = useState<PollData[]>([])

  const isPollingRef = useRef<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const connectPoll = async () => {
    disconnectPoll()

    setMessages([])
    setStatus("connecting")
    isPollingRef.current = true

    let currentCount = 0

    const poll = async () => {
      if (!isPollingRef.current) return

      try {
        const controller = new AbortController()
        abortControllerRef.current = controller

        const pollUrl = `${
          import.meta.env.VITE_API_URL || "/api"
        }/long-poll-demo?count=${currentCount}`

        const response = await fetch(pollUrl, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: PollData = await response.json()

        if (!isPollingRef.current) return

        setStatus("connected")
        setMessages((prev) => [data, ...prev].slice(0, 10))

        if (data.status === "done") {
          setStatus("done")
          isPollingRef.current = false
        } else {
          currentCount = data.count
          // Wait a beat before polling again so this isn't a tight,
          // unthrottled request loop.
          await sleep(POLL_DELAY_MS)
          if (!isPollingRef.current) return
          void poll()
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Ignored since it was intentionally disconnected
          return
        }
        console.error("Long Poll Fetch Error:", err)
        if (isPollingRef.current) {
          setStatus("error")
          isPollingRef.current = false
        }
      } finally {
        abortControllerRef.current = null
      }
    }

    void poll()
  }

  const disconnectPoll = () => {
    isPollingRef.current = false
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setStatus("idle")
  }

  // Disconnect whenever the dialog closes (Escape, overlay click, or the
  // close button) — not just on unmount. The dialog's content (and thus this
  // component's lifecycle) is not guaranteed to unmount when it visually
  // closes, so this handler (not just an unmount effect) is the reliable
  // signal to tear down the connection. Wired into `onOpenChange` below
  // rather than a `useEffect` on `isOpen`, since calling setState
  // synchronously from an effect body is discouraged (this is an event
  // handler, not an effect).
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      disconnectPoll()
    }
  }

  // Belt-and-braces cleanup on actual unmount.
  useEffect(() => {
    return () => {
      isPollingRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const latestMessage = messages[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button
          variant="outline"
          className="relative group overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300"
        >
          <Activity className="size-4 animate-pulse text-amber-500 mr-2" />
          <span>Long Polling</span>
          {status === "connected" && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </Button>}>

      </DialogTrigger>

      <DialogContent className="max-w-md border-border bg-card text-card-foreground shadow-2xl overflow-hidden rounded-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Cpu className="size-5 text-amber-500" />
            Long Polling Demo
          </DialogTitle>
          <DialogDescription>
            Client-driven long polling demonstration. Polls single JSON updates iteratively.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Connection Status Section */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-muted-foreground/10">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "relative flex h-3.5 w-3.5 rounded-full border border-background",
                  status === "idle" && "bg-muted-foreground/30",
                  status === "connecting" && "bg-amber-400 animate-pulse",
                  status === "connected" && "bg-emerald-500",
                  status === "done" && "bg-indigo-500",
                  status === "error" && "bg-destructive animate-bounce"
                )}
              >
                {status === "connected" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
              </span>
              <span className="font-semibold text-sm capitalize">
                {status === "idle" && "Disconnected"}
                {status === "connecting" && "Waiting for Server..."}
                {status === "connected" && "Polling Active"}
                {status === "done" && "Finished"}
                {status === "error" && "Connection Error"}
              </span>
            </div>

            <div className="flex gap-2">
              {status === "connected" || status === "connecting" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={disconnectPoll}
                  className="h-8 px-3 text-xs"
                >
                  <Square className="size-3 mr-1.5 fill-current" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={connectPoll}
                  className="h-8 px-3 text-xs"
                >
                  <Play className="size-3 mr-1.5 fill-current" />
                  {status === "done" ? "Restart" : "Connect"}
                </Button>
              )}
            </div>
          </div>

          {/* Current Event Info */}
          {latestMessage && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  <Activity className="size-3 text-amber-500 animate-pulse" />
                  Poll Event #{latestMessage.count}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(latestMessage.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground tracking-wide">
                {latestMessage.message}
              </div>
            </div>
          )}

          {/* Messages Log History */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-1">
              Event Log (Last 10)
            </h4>
            <div className="h-44 border rounded-xl overflow-y-auto p-2 bg-background/50 space-y-1 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                  {status === "connecting"
                    ? "Awaiting long poll response..."
                    : "No poll responses received yet."}
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={`${msg.count}-${idx}`}
                    className="flex justify-between items-center px-3 py-1.5 rounded-lg text-xs font-mono border border-transparent hover:border-border hover:bg-muted/30 transition-all animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <span className="text-amber-500 font-bold">#{msg.count}</span>
                    <span className="text-foreground flex-1 mx-3 truncate">
                      {msg.message}
                    </span>
                    <span className="text-muted-foreground/75 text-[10px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
