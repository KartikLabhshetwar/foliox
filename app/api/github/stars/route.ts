import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 300

export async function GET() {
  try {
    const response = await fetch("https://api.github.com/repos/kartiklabhshetwar/foliox", {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ stars: 0 }, { status: 200 })
    }

    const data = await response.json()
    const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : 0
    return NextResponse.json({ stars })
  } catch {
    return NextResponse.json({ stars: 0 }, { status: 200 })
  }
}

