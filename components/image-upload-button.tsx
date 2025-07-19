"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadButtonProps {
  onImageUploaded: (url: string) => void
  className?: string
}

export function ImageUploadButton({ onImageUploaded, className }: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Get upload preset from environment variables
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      if (!uploadPreset) {
        console.error("Cloudinary upload preset is not configured")
        throw new Error("Cloudinary upload preset is missing")
      }

      // Try server-side upload
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        try {
          const base64data = reader.result as string

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64data,
              uploadPreset: uploadPreset,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error("Server upload failed with response:", errorText)
            throw new Error("Server upload failed")
          }

          const data = await response.json()
          onImageUploaded(data.url)

          toast({
            title: "Success",
            description: "Image uploaded successfully",
          })
        } catch (error) {
          console.error("Upload error:", error)
          toast({
            title: "Upload failed",
            description: "Could not upload image. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
        }
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error handling upload:", error)
      toast({
        title: "Error",
        description: "Failed to process image upload",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={className}
        type="button"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      </Button>
    </>
  )
}
