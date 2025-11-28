"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import SearchBar from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

/* ----------------------------- Types & Options ---------------------------- */

type YarnWeight =
  | "Lace"
  | "Fingering"
  | "Sport"
  | "DK"
  | "Worsted"
  | "Aran"
  | "Bulky"

const CATEGORIES = [
  "Sweater",
  "Hat",
  "Socks",
  "Bottoms",
  "Mittens/Gloves",
  "Toys",
  "Scarf",
  "Shawl",
  "Blanket",
  "Baby",
  "Home",
  "Accessories",
] as const

const WEIGHTS: YarnWeight[] = [
  "Lace",
  "Fingering",
  "Sport",
  "DK",
  "Worsted",
  "Aran",
  "Bulky",
]

type Pattern = {
  id: string
  name: string
  image: string
  category: (typeof CATEGORIES)[number]
  weight: YarnWeight
  designer?: string
}

/* ----------------------------- Dev fallback data ----------------------------- */

const MOCK_PATTERNS: Pattern[] = [
  { id: "p1", name: "Nordic Yoke", image: "/placeholder.svg", category: "Sweater", weight: "Worsted", designer: "A. Maker" },
  { id: "p2", name: "Classic Beanie", image: "/placeholder.svg", category: "Hat", weight: "DK", designer: "KnitLab" },
  { id: "p3", name: "Colorwork Mittens", image: "/placeholder.svg", category: "Mittens/Gloves", weight: "Sport", designer: "SnowyPurls" },
  { id: "p4", name: "Comfy Socks", image: "/placeholder.svg", category: "Socks", weight: "Fingering", designer: "ToeBeans" },
  { id: "p5", name: "Textured Pullover", image: "/placeholder.svg", category: "Sweater", weight: "Aran", designer: "Stitch Co." },
  { id: "p6", name: "Cable Cushion", image: "/placeholder.svg", category: "Home", weight: "Bulky", designer: "Loop Co." },
  { id: "p7", name: "Baby Cardi", image: "/placeholder.svg", category: "Baby", weight: "DK", designer: "Tiny Stitches" },
  { id: "p8", name: "Stripes Jumper", image: "/placeholder.svg", category: "Sweater", weight: "Sport", designer: "Wool&Co" },
  { id: "p9", name: "Triangle Shawl", image: "/placeholder.svg", category: "Shawl", weight: "Fingering", designer: "Lace Atelier" },
  { id: "p10", name: "Chunky Rib Hat", image: "/placeholder.svg", category: "Hat", weight: "Bulky", designer: "Warm Threads" },
  { id: "p11", name: "Simple Scarf", image: "/placeholder.svg", category: "Scarf", weight: "Worsted", designer: "Everyday Knit" },
  { id: "p12", name: "Bear Toy", image: "/placeholder.svg", category: "Toys", weight: "DK", designer: "PlayKnit" },
]

/* ------------------------- Helpers to normalize data ------------------------ */

type ApiPattern = {
  id: string
  name: string
  image: string
  designer?: string
  yarn_weight?: { name?: string } | null
  yarns_used?: { yarn_weight?: { name?: string } | null }[] | null
  pattern_categories?: { name?: string }[] | null
}

// turn Ravelry weight string into one of our YarnWeight options
function normalizeWeight(raw?: string): YarnWeight {
  const s = raw?.toLowerCase() ?? ""
  if (s.includes("lace")) return "Lace"
  if (s.includes("fingering")) return "Fingering"
  if (s.includes("sport")) return "Sport"
  if (s.includes("dk") || s.includes("double knitting")) return "DK"
  if (s.includes("aran") || s.includes("heavy worsted")) return "Aran"
  if (s.includes("bulky") || s.includes("chunky")) return "Bulky"
  return "Worsted"
}

//bucket Ravelry category names into our 12 high-level categories
function bucketCategory(raw?: string): (typeof CATEGORIES)[number] {
  const s = raw?.toLowerCase() ?? ""

  if (
    s.includes("sweater") ||
    s.includes("pullover") ||
    s.includes("cardigan") ||
    s.includes("jumper") ||
    s.includes("top") ||
    s.includes("tee") ||
    s.includes("tank")
  ) return "Sweater"

  if (s.includes("hat") || s.includes("beanie") || s.includes("tuque")) return "Hat"
  if (s.includes("sock")) return "Socks"
  if (s.includes("skirt") || s.includes("shorts") || s.includes("pants") || s.includes("leggings"))
    return "Bottoms"
  if (s.includes("mitten") || s.includes("glove")) return "Mittens/Gloves"
  if (s.includes("toy") || s.includes("amigurumi")) return "Toys"
  if (s.includes("scarf") || s.includes("cowl")) return "Scarf"
  if (s.includes("shawl") || s.includes("wrap")) return "Shawl"
  if (s.includes("blanket") || s.includes("throw") || s.includes("afghan"))
    return "Blanket"
  if (s.includes("baby") || s.includes("newborn")) return "Baby"
  if (
    s.includes("pillow") ||
    s.includes("cushion") ||
    s.includes("home") ||
    s.includes("dishcloth") ||
    s.includes("towel")
  ) return "Home"

  return "Accessories"
}

/* --------------------------------- UI bits --------------------------------- */

function PatternCard({ p }: { p: Pattern }) {
  
  const imgSrc = p.image || "/placeholder.svg"

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card">
      <Link href={`/home/patterns/${p.id}`} className="block">
        <div className="aspect-square w-full bg-muted">
          <Image
            src={imgSrc}
            alt={p.name}
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            
            unoptimized
          />
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <div className="truncate font-medium">{p.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {p.designer ?? "Unknown designer"}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {/* keeping weight in the type, but not showing it */}
          <Badge variant="outline" className="rounded-md">
            {p.category}
          </Badge>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({
  selectedCategories,
  setSelectedCategories,
  onClear,
}: {
  selectedCategories: Set<string>
  setSelectedCategories: (next: Set<string>) => void
  onClear: () => void
}) {
  const toggle = (set: Set<string>, value: string, setter: (n: Set<string>) => void) => {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    setter(next)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-13rem)] pr-2">
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-sm font-medium">Category</div>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedCategories.has(c)}
                    onCheckedChange={() =>
                      toggle(selectedCategories, c, setSelectedCategories)
                    }
                  />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>

          
        </div>
      </ScrollArea>
    </div>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function PatternsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  const [results, setResults] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const handleSearch = useCallback(async () => {
    // cancel previous request
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm.trim()) params.set("q", searchTerm.trim())
      params.set("page_size", "70")

      const res = await fetch(`/api/patterns?${params.toString()}`, { signal })
      if (!res.ok) throw new Error(`Search failed (${res.status})`)

      const data = await res.json()
      const apiResults: ApiPattern[] = Array.isArray(data?.results) ? data.results : []

      const mapped: Pattern[] = apiResults.map((p) => {
        const rawWeight =
          p.yarn_weight?.name ??
          p.yarns_used?.[0]?.yarn_weight?.name

        const cats = p.pattern_categories ?? []
        const leafCatName =
          cats.length > 0
            ? cats[cats.length - 1]?.name ?? cats[0]?.name
            : undefined

        return {
          id: String(p.id),
          name: p.name ?? "Unknown",
          image: p.image ?? "/placeholder.svg",
          designer: p.designer ?? "Unknown designer",
          weight: normalizeWeight(rawWeight),
          category: bucketCategory(leafCatName ?? p.name),
        }
      })

      if (!signal.aborted) {
        setResults(mapped)
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("Ravelry API Search Error:", e)
        setError(e?.message ?? "Search failed")
        setResults([])
      }
    } finally {
      if (!abortRef.current?.signal.aborted) {
        setLoading(false)
      }
    }
  }, [searchTerm])

  const filtered = useMemo(() => {
    const base = results.length ? results : MOCK_PATTERNS
    const q = searchTerm.trim().toLowerCase()

    return base.filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.designer ?? "").toLowerCase().includes(q)

      const byCat =
        selectedCategories.size === 0 || selectedCategories.has(p.category)

      return matchesQ && byCat
    })
  }, [results, searchTerm, selectedCategories])

  const clearAll = () => {
    setSelectedCategories(new Set())
  }

  return (
    <div className="p-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold">Patterns</h1>
      </div>

      <div className="mx-auto mb-6 flex max-w-2xl items-center gap-2">
        <div className="flex-1">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full md:hidden">
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <FilterPanel
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              onClear={clearAll}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <>Searching…</>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filtered.length}
                  </span>{" "}
                  result{filtered.length === 1 ? "" : "s"}
                  {searchTerm ? (
                    <>
                      {" "}
                      for{" "}
                      <span className="font-medium">“{searchTerm}”</span>
                    </>
                  ) : null}
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="hidden md:inline-flex"
            >
              Clear filters
            </Button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border bg-red-50 p-4 text-center text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border bg-card p-10 text-center">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center">
              <div className="mb-2 text-lg font-semibold">No patterns found</div>
              <p className="text-sm text-muted-foreground">
                Try a different search term or remove some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PatternCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden rounded-xl border bg-card p-4 md:block">
          <FilterPanel
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onClear={clearAll}
          />
        </aside>
      </div>
    </div>
  )
}
