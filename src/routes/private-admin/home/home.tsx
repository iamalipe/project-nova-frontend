import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { sleep } from "@/lib/utils"
import { toast } from "sonner"

import AlertPopupExample from "@/components/alert-popup/alert-popup-example"
import LongPollDemo from "@/components/example/long-poll-demo"
import ReadableStreamDemo from "@/components/example/readable-stream-demo"
import SseDemo from "@/components/example/sse-demo"

const Home = () => {
  const onToastTest = () => {
    toast("This is a test toast message!")
    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
    toast.promise(sleep(2000), {
      loading: "Loading...",
      success: () => {
        return `Hello toast has been added`
      },
      error: "Error",
    })
    toast.warning("Event start time cannot be earlier than 8am")
  }

  return (
    <TooltipProvider>
      <main className="flex-1 overflow-auto flex flex-col p-2 md:p-4 gap-2 md:gap-4">
        <div>
          <h1>Private Home Page</h1>
          <div className="flex gap-2 mb-6">
            <SseDemo />
            <ReadableStreamDemo />
            <LongPollDemo />
            <Button onClick={onToastTest}>Toast Test</Button>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            <Input />
          </div>
          <AlertPopupExample />
        </div>
      </main>
    </TooltipProvider>
  )
}

export default Home