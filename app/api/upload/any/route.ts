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
      return NextResponse.json({ error: "Upload failed" }, { status: response.status })
    }

    const data = await response.json()

    // Return the response from the API
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
