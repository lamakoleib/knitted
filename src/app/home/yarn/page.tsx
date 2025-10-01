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

//yarn types

type YarnWeight =
  | "Lace"
  | "Light Fingering"
  | "Fingering"
  | "Sport"
  | "DK"
  | "Worsted"
  | "Aran"
  | "Bulky"
  | "Super Bulky"
  | "Jumbo"

//shape of a yarn
type Yarn = {
  id: string
  name: string
  brand: string
  image: string
  weight: YarnWeight
  fibers: string[]
  colors: string[]
  styles: string[]
  price?: string
}

//fiber filter options
const FIBERS = [
  "Acrylic",
  "Alpaca",
  "Angora",
  "Bamboo",
  "Bison",
  "Cashmere",
  "Cotton",
  "Hemp",
  "Linen",
  "Merino",
  "Mohair",
  "Nylon",
  "Polyester",
  "Rayon",
  "Silk",
  "Wool",
] as const

//weight filter options
const WEIGHTS: YarnWeight[] = [
  "Lace",
  "Light Fingering",
  "Fingering",
  "Sport",
  "DK",
  "Worsted",
  "Aran",
  "Bulky",
  "Super Bulky",
  "Jumbo",
]

//pattern filter options
const PATTERN_STYLES = [
  "Solid",
  "Heather",
  "Tweed",
  "Speckled",
  "Variegated",
  "Self-Striping",
  "Ombre/Gradient",
  "Metallic/Glitter",
  "Hand-Dyed",
  "Marled",
  "Bouclé",
  "Chainette",
] as const

//colour options
const COLOR_SWATCHES = [
  { label: "White", hex: "#FFFFFF" },
  { label: "Ivory", hex: "#FFFFF0" },
  { label: "Cream", hex: "#FFFDD0" },
  { label: "Beige", hex: "#F5F5DC" },
  { label: "Tan", hex: "#D2B48C" },
  { label: "Brown", hex: "#8B4513" },
  { label: "Black", hex: "#000000" },
  { label: "Charcoal", hex: "#36454F" },
  { label: "Grey", hex: "#808080" },
  { label: "Silver", hex: "#C0C0C0" },

  { label: "Red", hex: "#E11D48" },
  { label: "Burgundy", hex: "#800020" },
  { label: "Coral", hex: "#FF7F50" },
  { label: "Orange", hex: "#F97316" },
  { label: "Rust", hex: "#B7410E" },
  { label: "Peach", hex: "#FFD1B3" },
  { label: "Pink", hex: "#EC4899" },
  { label: "Rose", hex: "#EFB8C8" },
  { label: "Magenta", hex: "#FF00FF" },
  { label: "Purple", hex: "#8B5CF6" },
  { label: "Lavender", hex: "#B57EDC" },
  { label: "Plum", hex: "#673147" },

  { label: "Yellow", hex: "#FACC15" },
  { label: "Mustard", hex: "#FFDB58" },
  { label: "Gold", hex: "#D4AF37" },

  { label: "Green", hex: "#22C55E" },
  { label: "Lime", hex: "#84CC16" },
  { label: "Olive", hex: "#556B2F" },
  { label: "Sage", hex: "#B2AC88" },
  { label: "Mint", hex: "#98FF98" },
  { label: "Teal", hex: "#14B8A6" },
  { label: "Turquoise", hex: "#40E0D0" },

  { label: "Blue", hex: "#3B82F6" },
  { label: "Sky", hex: "#87CEEB" },
  { label: "Royal", hex: "#4169E1" },
  { label: "Navy", hex: "#001F54" },
] as const

//dummy data (replacing later)
const MOCK_YARNS: Yarn[] = [
  {
    id: "1",
    name: "Sheep Soft",
    brand: "WoolEase",
    image: "/placeholder.svg",
    weight: "Worsted",
    fibers: ["Wool"],
    colors: ["Blue", "Teal"],
    styles: ["Heather", "Solid"],
    price: "$7.99",
  },
  {
    id: "2",
    name: "Caron Simply Soft",
    brand: "Caron",
    image: "/placeholder.svg",
    weight: "Worsted",
    fibers: ["Acrylic"],
    colors: ["Mint", "White"],
    styles: ["Solid"],
    price: "$4.49",
  },
  {
    id: "3",
    name: "Angora Cloud",
    brand: "Luxury Spin",
    image: "/placeholder.svg",
    weight: "Sport",
    fibers: ["Angora", "Silk"],
    colors: ["Pink", "Lavender"],
    styles: ["Ombre/Gradient"],
    price: "$12.50",
  },
  {
    id: "4",
    name: "Homespun",
    brand: "Lion Brand",
    image: "/placeholder.svg",
    weight: "Bulky",
    fibers: ["Acrylic"],
    colors: ["Beige", "Gold"],
    styles: ["Self-Striping"],
    price: "$6.99",
  },
  {
    id: "5",
    name: "Alpaca Dream",
    brand: "Andean Mills",
    image: "/placeholder.svg",
    weight: "DK",
    fibers: ["Alpaca", "Wool"],
    colors: ["Grey"],
    styles: ["Tweed"],
    price: "$10.90",
  },
  {
    id: "6",
    name: "Bamboo Breeze",
    brand: "Plant Threads",
    image: "/placeholder.svg",
    weight: "Sport",
    fibers: ["Bamboo", "Cotton"],
    colors: ["White"],
    styles: ["Solid"],
    price: "$8.25",
  },
]

//ui add ons
function Dot({ hex }: { hex: string }) {
  return <span className="inline-block size-3 rounded-full border" style={{ backgroundColor: hex }} />
}

function Card({ yarn }: { yarn: Yarn }) {
  const swatches = yarn.colors
    .map(label => COLOR_SWATCHES.find(c => c.label === label)?.hex)
    .filter(Boolean)
    .slice(0, 3) as string[]

  return (
    <div className="group rounded-xl border bg-card p-3 transition hover:shadow-sm">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={yarn.image}
          alt={yarn.name}
          width={640}
          height={480}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-muted-foreground">{yarn.brand}</div>
          <div className="font-medium">{yarn.name}</div>
        </div>
        {yarn.price ? (
          <span className="rounded-md bg-red-300/80 px-2 py-0.5 text-xs text-black">{yarn.price}</span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-md">
          {yarn.weight}
        </Badge>
        {yarn.fibers.slice(0, 2).map((f) => (
          <Badge key={f} variant="outline" className="rounded-md">
            {f}
          </Badge>
        ))}
        {swatches.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1">
            {swatches.map((hex, i) => (
              <Dot key={i} hex={hex} />
            ))}
          </span>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        {yarn.styles.slice(0, 2).join(" • ")}
      </div>

      <div className="mt-3">
        <Link
            href={`/home/yarn/${yarn.id}`}
            className="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-accent"
            >
            View details
        </Link>
      </div>
    </div>
  )
}

//filter panel

//sidebar filter with checkboxes for fiber,weight,style,colour
function FilterPanel({
  selectedFibers,
  setSelectedFibers,
  selectedColors,
  setSelectedColors,
  selectedWeights,
  setSelectedWeights,
  selectedStyles,
  setSelectedStyles,
  onClear,
}: {
  selectedFibers: Set<string>
  setSelectedFibers: (next: Set<string>) => void
  selectedColors: Set<string>
  setSelectedColors: (next: Set<string>) => void
  selectedWeights: Set<string>
  setSelectedWeights: (next: Set<string>) => void
  selectedStyles: Set<string>
  setSelectedStyles: (next: Set<string>) => void
  onClear: () => void
}) {
  //toggling an item
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
          {/* fiber section */}
          <div>
            <div className="mb-2 text-sm font-medium">Browse by Fiber</div>
            <div className="space-y-2">
              {FIBERS.map((f) => (
                <label key={f} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFibers.has(f)}
                    onCheckedChange={() => toggle(selectedFibers, f, setSelectedFibers)}
                  />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* weight section */}
          <div>
            <div className="mb-2 text-sm font-medium">Browse by Weight</div>
            <div className="space-y-2">
              {WEIGHTS.map((w) => (
                <label key={w} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedWeights.has(w)}
                    onCheckedChange={() => toggle(selectedWeights, w, setSelectedWeights)}
                  />
                  <span className="text-sm">{w}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* style section */}
          <div>
            <div className="mb-2 text-sm font-medium">Browse by Pattern</div>
            <div className="space-y-2">
              {PATTERN_STYLES.map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedStyles.has(s)}
                    onCheckedChange={() => toggle(selectedStyles, s, setSelectedStyles)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* colour section */}
          <div>
            <div className="mb-2 text-sm font-medium">Browse by Colour</div>
            <div className="space-y-2">
              {COLOR_SWATCHES.map((c) => (
                <label key={c.label} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedColors.has(c.label)}
                    onCheckedChange={() => toggle(selectedColors, c.label, setSelectedColors)}
                  />
                  <span className="inline-flex items-center gap-2 text-sm">
                    <Dot hex={c.hex} /> {c.label}
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

//page layout and filters
export default function YarnPage() 
{
  const [searchTerm, setSearchTerm] = useState("")

  //filtering for fiber,colour,weight,style
  const [selectedFibers, setSelectedFibers] = useState<Set<string>>(new Set())
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set())
  const [selectedWeights, setSelectedWeights] = useState<Set<string>>(new Set())
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleSearch = async () => {
  }
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return MOCK_YARNS.filter((y) => {
      const matchesQ =
        !q ||
        y.name.toLowerCase().includes(q) ||
        y.brand.toLowerCase().includes(q) ||
        y.fibers.some((f) => f.toLowerCase().includes(q)) ||
        y.styles.some((s) => s.toLowerCase().includes(q))

      const matchesFiber =
        selectedFibers.size === 0 || y.fibers.some((f) => selectedFibers.has(f))
      const matchesColor =
        selectedColors.size === 0 || y.colors.some((c) => selectedColors.has(c))
      const matchesWeight =
        selectedWeights.size === 0 || selectedWeights.has(y.weight)
      const matchesStyle =
        selectedStyles.size === 0 || y.styles.some((s) => selectedStyles.has(s))
      return matchesQ && matchesFiber && matchesColor && matchesWeight && matchesStyle
    })
  }, [searchTerm, selectedFibers, selectedColors, selectedWeights, selectedStyles])

  //resetting all filters
  const clearAll = () => {
    setSelectedFibers(new Set())
    setSelectedColors(new Set())
    setSelectedWeights(new Set())
    setSelectedStyles(new Set())
  }

  return (
    <div className="p-6">
      {/* title */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold">Yarns</h1>
      </div>

      {/* search bar and filters button */}
      <div className="mx-auto mb-6 flex max-w-2xl items-center gap-2">
        <div className="flex-1">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>

        {/* mobile filter */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full md:hidden">
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <FilterPanel
              selectedFibers={selectedFibers}
              setSelectedFibers={setSelectedFibers}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedWeights={selectedWeights}
              setSelectedWeights={setSelectedWeights}
              selectedStyles={selectedStyles}
              setSelectedStyles={setSelectedStyles}
              onClear={clearAll}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* grid and desktop filter */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
        {/* results grid */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> result
              {filtered.length === 1 ? "" : "s"}
              {searchTerm ? (
                <>
                  {" "}
                  for <span className="font-medium">“{searchTerm}”</span>
                </>
              ) : null}
            </div>
            <Button variant="ghost" size="sm" onClick={clearAll} className="hidden md:inline-flex">
              Clear filters
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center">
              <div className="mb-2 text-lg font-semibold">No yarns found</div>
              <p className="text-sm text-muted-foreground">
                Try a different search term or remove some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((y) => (
                <Card key={y.id} yarn={y} />
              ))}
            </div>
          )}
        </div>

        {/* the filter panel */}
        <aside className="hidden rounded-xl border bg-card p-4 md:block">
          <FilterPanel
            selectedFibers={selectedFibers}
            setSelectedFibers={setSelectedFibers}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedWeights={selectedWeights}
            setSelectedWeights={setSelectedWeights}
            selectedStyles={selectedStyles}
            setSelectedStyles={setSelectedStyles}
            onClear={clearAll}
          />
        </aside>
      </div>
    </div>
  )
}
