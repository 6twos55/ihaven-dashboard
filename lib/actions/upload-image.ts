"use server"

import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "ddhwvds38",
  api_key: process.env.CLOUDINARY_API_KEY || "532942231152668",
  api_secret: process.env.CLOUDINARY_API_SECRET || "ad-D_3oyHx4aCw55_YfVx3vMoFo",
})

export async function uploadImage(base64Image: string, uploadPreset?: string): Promise<string | null> {
  try {
    console.log("Server-side upload: Starting with cloud name:", process.env.CLOUDINARY_CLOUD_NAME)

    // Upload options
    const uploadOptions: any = {
      folder: "blog-images",
      resource_type: "image",
      // Add CORS settings
      cors: "anonymous",
      access_mode: "public",
    }

    // If upload preset is provided, use it for unsigned uploads
    if (uploadPreset) {
      uploadOptions.upload_preset = uploadPreset
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, uploadOptions)

    console.log("Server-side upload successful:", result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return null
  }
}
