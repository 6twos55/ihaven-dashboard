"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, X } from "lucide-react"

interface QrScannerProps {
  open: boolean
  onClose: () => void
  onScan: (result: string) => void
}

export default function QrScanner({ open, onClose, onScan }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        if (!open) return

        setError(null)
        setScanning(true)

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        setError("Could not access camera. Please ensure you've granted camera permissions.")
        setScanning(false)
        console.error("Error accessing camera:", err)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      setScanning(false)
    }
  }, [open])

  // This is a simplified mock implementation
  // In a real app, you would use a library like jsQR to scan QR codes
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Mock QR code detection - in a real app, you would process the image here
    // For demo purposes, we'll just simulate finding a wallet address
    const mockWalletAddress = "8ZmHXpKJJTdMNLPSfgJLBFrFhQJ5zamcKtQJGbki9rKY"
    onScan(mockWalletAddress)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          {error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <>
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-white/50 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4 mt-4">
                <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleCapture}
                  className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  disabled={!scanning}
                >
                  <Camera className="h-4 w-4" />
                  Capture
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
