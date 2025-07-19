import { type NextRequest, NextResponse } from "next/server"

/**
 * In-memory settings store – survives while the serverless
 * function lives during dev/preview. In production you would
 * read these from a database.
 */
let settings = {
  isWithdrawalEnabled: false,
  isBookingEnabled: false,
  isOrderEnabled: false,
  isPackagesEnabled: false,
  isFaqsEnabled: false,
  isRatingEnabled: true,
  isSaveAndFoldersEnabled: true,
  isUploadEnabled: false,
  isMessageEnabled: false,
  isTwoFactorsEnabled: false,
}

export async function GET() {
  return NextResponse.json({
    message: "Settings retrieved successfully",
    data: settings,
  })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    // merge & coerce to boolean
    settings = {
      ...settings,
      ...Object.fromEntries(Object.entries(body).map(([k, v]) => [k, Boolean(v)])),
    }

    return NextResponse.json({
      message: "Settings updated successfully",
      data: settings,
    })
  } catch (error) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }
}
