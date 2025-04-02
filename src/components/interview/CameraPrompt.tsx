"use client"
import { Video, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CameraPromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEnableCamera: () => void
  cameraError: string | null
  retryCount: number
}

export default function CameraPrompt({
  open,
  onOpenChange,
  onEnableCamera,
  cameraError,
  retryCount,
}: CameraPromptProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Don't allow closing this dialog by clicking outside
        if (newOpen === false) {
          // Keep dialog open
          onOpenChange(true)
        } else {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Video className="h-5 w-5 text-primary" />
            Camera and Microphone Access Required
          </DialogTitle>
          <DialogDescription className="text-center">
            This interview requires camera and microphone access. Please enable them to continue.
            <br />
            <span className="text-red-500 font-medium">
              Note: You will not be able to disable your camera or microphone during the interview.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {cameraError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera Error</AlertTitle>
              <AlertDescription>{cameraError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Video className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {retryCount > 0
              ? `We've tried ${retryCount} times. Please check your browser settings and ensure camera permissions are allowed.`
              : "Click the button below to enable your camera and microphone."}
          </p>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={onEnableCamera}>
            {retryCount > 0 ? "Try Again" : "Enable Camera & Microphone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

