import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic" // don't cache

function getAuth() {
  const u = process.env.RAVELRY_USERNAME
  const p = process.env.RAVELRY_PASSWORD
  if (!u || !p) return null
  return "Basic " + Buffer.from(`${u}:${p}`).toString("base64")
}

// Map a Ravelry yarn item to UI Yarn shape
function mapYarn(y: any) {
  return {
    id: String(y.id),
    name: y.name ?? "Unknown",
    brand: y.yarn_company_name ?? "—",
    image: y.first_photo.medium_url,
    weight: y.yarn_weight.name,
    fibers: (y.yarn_fibers ?? [])
      .map((f: any) => (f?.fiber_type_name ?? "").split(" ")[0])
      .filter(Boolean),
    colors: [],
    styles: [],
    price: undefined,
  }
}

export async function GET(req: NextRequest) {
  const auth = getAuth()
  if (!auth) {
    return NextResponse.json(
      { error: "Missing RAVELRY_USERNAME/RAVELRY_PASSWORD" },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const page = searchParams.get("page") ?? "1"
  const page_size = searchParams.get("page_size") ?? "24"
  const weight = searchParams.get("weight") ?? ""
  const fiberc = searchParams.get("fiberc") ?? ""
  const needles = searchParams.get("needles") ?? ""

  const url = new URL("https://api.ravelry.com/yarns/search.json")
  if (q) url.searchParams.set("query", q)
  url.searchParams.set("page", page)
  url.searchParams.set("page_size", page_size)
  if (weight) url.searchParams.set("weight", weight)
  if (fiberc) url.searchParams.set("fiberc", fiberc)
  if (needles) url.searchParams.set("needles", needles)

  const r = await fetch(url.toString(), {
    headers: { Authorization: auth, Accept: "application/json" },
    cache: "no-store",
  })

  if (!r.ok) {
    const text = await r.text()
    return NextResponse.json(
      { error: `Ravelry error ${r.status}`, body: text.slice(0, 400) },
      { status: r.status }
    )
  }

  const data = await r.json()
  const results = (data?.yarns ?? []).map(mapYarn)
  return NextResponse.json({
    results,
    page: Number(page),
    page_size: Number(page_size),
  })
}
