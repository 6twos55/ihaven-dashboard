import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.file) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 })
    }

    // Forward the request to the actual API endpoint
    const response = await fetch("https://ihaven.vercel.app/v1/upload/any", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if present
        ...(request.headers.get("Authorization") ? { Authorization: request.headers.get("Authorization")! } : {}),
      },
      body: JSON.stringify({ file: body.file }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Upload failed with response:", errorText)
      return NextResponse.json({ error: "Failed to upload file" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data, {
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
