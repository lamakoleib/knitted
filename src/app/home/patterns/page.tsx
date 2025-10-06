"use client"
import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import SearchBar from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

//filter options
type YarnWeight =
  | "Lace"
  | "Fingering"
  | "Sport"
  | "DK"
  | "Worsted"
  | "Aran"
  | "Bulky"

const CATEGORIES = 
[
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
const WEIGHTS: YarnWeight[] = 
[
  "Lace",
  "Fingering",
  "Sport",
  "DK",
  "Worsted",
  "Aran",
  "Bulky",
]
type Pattern = 
{
  id: string
  name: string
  image: string
  category: (typeof CATEGORIES)[number]
  weight: YarnWeight
  designer?: string
}

//dummy data (changing this later)
const MOCK_PATTERNS: Pattern[] = 
[
  {id: "p1", name: "Nordic Yoke", image: "/placeholder.svg", category: "Sweater", weight: "Worsted", designer: "A. Maker"},
  {id: "p2", name: "Classic Beanie", image: "/placeholder.svg", category: "Hat", weight: "DK", designer: "KnitLab"},
  {id: "p3", name: "Colorwork Mittens", image: "/placeholder.svg", category: "Mittens/Gloves", weight: "Sport", designer: "SnowyPurls"},
  {id: "p4", name: "Comfy Socks", image: "/placeholder.svg", category: "Socks", weight: "Fingering", designer: "ToeBeans"},
  {id: "p5", name: "Textured Pullover", image: "/placeholder.svg", category: "Sweater", weight: "Aran", designer: "Stitch Co."},
  {id: "p6", name: "Cable Cushion", image: "/placeholder.svg", category: "Home", weight: "Bulky", designer: "Loop Co."},
  {id: "p7", name: "Baby Cardi", image: "/placeholder.svg", category: "Baby", weight: "DK", designer: "Tiny Stitches"},
  {id: "p8", name: "Stripes Jumper", image: "/placeholder.svg", category: "Sweater", weight: "Sport", designer: "Wool&Co"},
  {id: "p9", name: "Triangle Shawl", image: "/placeholder.svg", category: "Shawl", weight: "Fingering", designer: "Lace Atelier"},
  {id: "p10", name: "Chunky Rib Hat", image: "/placeholder.svg", category: "Hat", weight: "Bulky", designer: "Warm Threads"},
  {id: "p11", name: "Simple Scarf", image: "/placeholder.svg", category: "Scarf", weight: "Worsted", designer: "Everyday Knit"},
  {id: "p12", name: "Bear Toy", image: "/placeholder.svg", category: "Toys", weight: "DK", designer: "PlayKnit"},
]

//the pattern card
function PatternCard({ p }: { p: Pattern }) 
{
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card">
      <Link href={`/home/patterns/${p.id}`} className="block">
        <div className="aspect-square w-full bg-muted">
          <Image
            src={p.image}
            alt={p.name}
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
          <Badge variant="secondary" className="rounded-md">{p.weight}</Badge>
          <Badge variant="outline" className="rounded-md">{p.category}</Badge>
        </div>
      </div>
    </div>
  )
}

//filtering card
function FilterPanel({
  selectedCategories,
  setSelectedCategories,
  selectedWeights,
  setSelectedWeights,
  onClear,
  weightCounts,
}: {
  selectedCategories: Set<string>
  setSelectedCategories: (next: Set<string>) => void
  selectedWeights: Set<string>
  setSelectedWeights: (next: Set<string>) => void
  onClear: () => void
  weightCounts: Record<string, number>
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
        <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
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
                    onCheckedChange={() => toggle(selectedCategories, c, setSelectedCategories)}
                  />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="mb-2 text-sm font-medium">Yarn weight</div>
            <div className="space-y-2">
              {WEIGHTS.map((w) => (
                <label key={w} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedWeights.has(w)}
                    onCheckedChange={() => toggle(selectedWeights, w, setSelectedWeights)}
                  />
                  <span className="text-sm">
                    {w}{" "}
                    <span className="text-muted-foreground">({weightCounts[w] ?? 0})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

//the whole page
export default function PatternsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedWeights, setSelectedWeights] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleSearch = async () => {}

  //search and filters
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return MOCK_PATTERNS.filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.designer ?? "").toLowerCase().includes(q)

      const byCat = selectedCategories.size === 0 || selectedCategories.has(p.category)
      const byWeight = selectedWeights.size === 0 || selectedWeights.has(p.weight)

      return matchesQ && byCat && byWeight
    })
  }, [searchTerm, selectedCategories, selectedWeights])

  const weightCounts = useMemo(() => {
    const base = MOCK_PATTERNS.filter((p) => {
      const q = searchTerm.trim().toLowerCase()
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.designer ?? "").toLowerCase().includes(q)
      )
    })
    return base.reduce<Record<string, number>>((acc, p) => {
      acc[p.weight] = (acc[p.weight] ?? 0) + 1
      return acc
    }, {})
  }, [searchTerm])

  const clearAll = () => {
    setSelectedCategories(new Set())
    setSelectedWeights(new Set())
  }

  return (
    <div className="p-6">
      {/* title */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold">Patterns</h1>
    </div>

      {/* search and filters */}
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
            <Button variant="outline" className="rounded-full md:hidden">Filters</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <FilterPanel
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedWeights={selectedWeights}
              setSelectedWeights={setSelectedWeights}
              onClear={clearAll}
              weightCounts={weightCounts}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> result
              {filtered.length === 1 ? "" : "s"}
              {searchTerm ? <> for <span className="font-medium">“{searchTerm}”</span></> : null}
            </div>
            <Button variant="ghost" size="sm" onClick={clearAll} className="hidden md:inline-flex">
              Clear filters
            </Button>
          </div>

          {filtered.length === 0 ? 
          (
            <div className="rounded-xl border bg-card p-10 text-center">
              <div className="mb-2 text-lg font-semibold">No patterns found</div>
              <p className="text-sm text-muted-foreground">
                Try a different search term or remove some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => 
              (
                <PatternCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden rounded-xl border bg-card p-4 md:block">
          <FilterPanel
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedWeights={selectedWeights}
            setSelectedWeights={setSelectedWeights}
            onClear={clearAll}
            weightCounts={weightCounts}
          />
        </aside>
      </div>
    </div>
  )
}
