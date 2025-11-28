import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic" // don't cache

function getAuth() {
  const u = process.env.RAVELRY_USERNAME
  const p = process.env.RAVELRY_PASSWORD
  if (!u || !p) return null
  return "Basic " + Buffer.from(`${u}:${p}`).toString("base64")
}

function mapPattern(p: any) {
  // Prefer first_photo if present, then photos array, then photo_url
  const first = p.first_photo ?? null
  const photos = Array.isArray(p.photos) ? p.photos : []

  const photoUrl =
    first?.medium_url ||
    first?.square_url ||
    photos[0]?.medium_url ||
    photos[0]?.square_url ||
    photos[0]?.small_url ||
    p.photo_url ||
    "/placeholder.svg"

  return {
    id: String(p.id),
    name: p.name ?? "Unknown",
    image: photoUrl,
    designer:
      p.pattern_author?.name ??
      p.first_author?.name ??
      p.designer?.name ??
      "Unknown designer",

    // you’re not using weight on the frontend from here anymore, so keep it simple
    yarn_weight: p.yarn_weight ?? null,
    yarns_used: p.yarns_used ?? null,
    pattern_categories: p.pattern_categories ?? null,
  }
}

export async function GET(req: NextRequest) {
  const auth = getAuth()
  if (!auth) {
    return NextResponse.json(
      { error: "Missing RAVELRY_USERNAME/RAVELRY_PASSWORD" },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const page = searchParams.get("page") ?? "1"
  const page_size = searchParams.get("page_size") ?? "70"
  const craft = searchParams.get("craft") ?? "" // optional

  const url = new URL("https://api.ravelry.com/patterns/search.json")
  if (q) url.searchParams.set("query", q)
  url.searchParams.set("page", page)
  url.searchParams.set("page_size", page_size)
  if (craft) url.searchParams.set("craft", craft)

  // 👇 ask for first_photo + photos + weights + categories
  url.searchParams.set(
    "additional_fields",
    "pattern_author,first_photo,photos,yarn_weight,yarns_used,pattern_categories",
  )

  const r = await fetch(url.toString(), {
    headers: { Authorization: auth, Accept: "application/json" },
    cache: "no-store",
  })

  if (!r.ok) {
    const text = await r.text()
    return NextResponse.json(
      { error: `Ravelry error ${r.status}`, body: text.slice(0, 400) },
      { status: r.status },
    )
  }

  const data = await r.json()
  const results = (data?.patterns ?? []).map(mapPattern)

  return NextResponse.json({
    results,
    page: Number(page),
    page_size: Number(page_size),
  })
}
