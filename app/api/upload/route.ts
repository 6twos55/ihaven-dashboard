import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/actions/upload-image"

export async function POST(request: NextRequest) {
  try {
    const { image, uploadPreset } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    // Use the server action to upload the image, passing the upload preset
    const imageUrl = await uploadImage(image, uploadPreset)

    if (!imageUrl) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Return with CORS headers
    return new NextResponse(JSON.stringify({ url: imageUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
