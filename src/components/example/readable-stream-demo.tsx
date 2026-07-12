import { Activity, Clock, Cpu, Play, Square } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface StreamData {
  count: number
  timestamp: string
  message: string
  status?: string
}

export default function ReadableStreamDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "done" | "error"
  >("idle")
  const [messages, setMessages] = useState<StreamData[]>([])
  const [abortController, setAbortController] = useState<AbortController | null>(
    null
  )

  const connectStream = async () => {
    if (abortController) {
      abortController.abort()
    }

    setMessages([])
    setStatus("connecting")

    const controller = new AbortController()
    setAbortController(controller)

    try {
      const streamUrl = `${import.meta.env.VITE_API_URL || "/api"}/readable-stream-demo`
      const response = await fetch(streamUrl, {
        signal: controller.signal,
      })

      if (!response.body) {
        throw new Error("No response body available")
      }

      setStatus("connected")
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          break
        }

        // Decode binary chunk to text
        const chunkText = decoder.decode(value, { stream: true })
        buffer += chunkText

        // Split buffer by newlines (NDJSON format)
        const lines = buffer.split("\n")
        // Keep the last partial line in the buffer
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const data: StreamData = JSON.parse(line)
            if (data.status === "done") {
              setStatus("done")
            } else {
              setMessages((prev) => [data, ...prev].slice(0, 10))
            }
          } catch (e) {
            console.error("Error parsing NDJSON line:", e)
          }
        }
      }

      if (!controller.signal.aborted) {
        setStatus("done")
      }
    } catch (err: any) {
      if (err.name === "AbortError" || controller.signal.aborted) {
        // Ignored
      } else {
        console.error("Fetch Stream Error:", err)
        setStatus("error")
      }
    } finally {
      setAbortController(null)
    }
  }

  const disconnectStream = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setStatus("idle")
  }

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [abortController])

  const latestMessage = messages[0]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button
          variant="outline"
          className="relative group overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300"
        >
          <Activity className="size-4 animate-pulse text-indigo-500 mr-2" />
          <span>Fetch Stream</span>
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
            <Cpu className="size-5 text-indigo-500" />
            HTTP Readable Streams Demo
          </DialogTitle>
          <DialogDescription>
            Live HTTP fetch stream demonstration. Streams raw NDJSON chunks.
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
                {status === "connecting" && "Connecting..."}
                {status === "connected" && "Streaming Fetch Chunks"}
                {status === "done" && "Finished"}
                {status === "error" && "Connection Error"}
              </span>
            </div>

            <div className="flex gap-2">
              {status === "connected" || status === "connecting" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={disconnectStream}
                  className="h-8 px-3 text-xs"
                >
                  <Square className="size-3 mr-1.5 fill-current" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={connectStream}
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
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  <Activity className="size-3 text-indigo-500 animate-pulse" />
                  Chunk #{latestMessage.count}
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
                    ? "Reading stream buffer..."
                    : "No stream data received yet."}
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={`${msg.count}-${idx}`}
                    className="flex justify-between items-center px-3 py-1.5 rounded-lg text-xs font-mono border border-transparent hover:border-border hover:bg-muted/30 transition-all animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <span className="text-indigo-500 font-bold">#{msg.count}</span>
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
