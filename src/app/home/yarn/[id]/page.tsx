import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"

//types
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

type Yarn = 
{
  id: string
  name: string
  brand: string
  image: string
  weight: YarnWeight
  fibers: string[]
  colors: string[]
  styles: string[]
  price?: string
  yardage?: string
  unitWeight?: string
  gauge?: string
  needleSize?: string
  hookSize?: string
  texture?: string
  washable?: string
  attributes?: string
  dye?: string
}

//dummy data
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
    yardage: "185 yds (169 m)",
    unitWeight: "100 g",
    gauge: "18–20 sts = 4 in",
    needleSize: "US 7–8 (4.5–5 mm)",
    hookSize: "US H (5 mm)",
    texture: "Heather • Solid",
    washable: "Machine wash, tumble dry low",
    attributes: "Soft, springy; good for garments",
    dye: "Mill dyed",
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
    yardage: "315 yds (288 m)",
    unitWeight: "170 g",
    gauge: "17 sts = 4 in",
    needleSize: "US 8 (5 mm)",
    hookSize: "US H (5 mm)",
    texture: "Smooth • Solid",
    washable: "Machine wash & dry",
    attributes: "Very soft acrylic; great drape",
    dye: "Mill dyed",
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
    yardage: "220 yds (201 m)",
    unitWeight: "50 g",
    gauge: "23–26 sts = 4 in",
    needleSize: "US 3–5 (3.25–3.75 mm)",
    hookSize: "US E (3.5 mm)",
    texture: "Halo • Gradient",
    washable: "Hand wash, dry flat",
    attributes: "Luxe blend with sheen",
    dye: "Hand dyed",
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
    yardage: "185 yds (169 m)",
    unitWeight: "170 g",
    gauge: "10–14 sts = 4 in",
    needleSize: "US 10 (6 mm)",
    hookSize: "US K (6.5 mm)",
    texture: "Single ply wrapped with binder",
    washable: "Machine wash, gentle",
    attributes: "Textured look; fast projects",
    dye: "Machine dyed",
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
    yardage: "230 yds (210 m)",
    unitWeight: "100 g",
    gauge: "22 sts = 4 in",
    needleSize: "US 6 (4 mm)",
    hookSize: "US G (4 mm)",
    texture: "Soft • Tweedy",
    washable: "Hand wash, dry flat",
    attributes: "Warm and lofty",
    dye: "Mill dyed",
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
    yardage: "250 yds (229 m)",
    unitWeight: "100 g",
    gauge: "22–24 sts = 4 in",
    needleSize: "US 4–6 (3.5–4 mm)",
    hookSize: "US F–G (3.75–4 mm)",
    texture: "Smooth • Cool",
    washable: "Machine wash, dry flat",
    attributes: "Breathable; great for summer",
    dye: "Mill dyed",
  },
]

function getYarnById(id: string): Yarn | null {
  return MOCK_YARNS.find((y) => y.id === id) ?? null
}

function SpecRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-y-2 py-2">
      <div className="text-muted-foreground">{label}</div>
      <div>{value ?? "—"}</div>
    </div>
  )
}

//the page ui
export default function YarnInfoPage({ params }: { params: { id: string } }) {
  const yarn = getYarnById(params.id)
  if (!yarn) return notFound()

  return (
    <div className="p-6">
      {/* top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/home/yarn">
          <Button className="bg-red-300 text-black hover:bg-red-400">Back to yarns</Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save</Button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-3">
        <span className="rounded-full bg-red-300/70 px-2 py-0.5 text-xs text-black">Yarn</span>
        <span className="text-sm text-muted-foreground">{yarn.brand}</span>
      </div>

      {/* title */}
      <h1 className="mb-6 text-2xl font-semibold">{yarn.name}</h1>

      {/* content */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,700px)_1fr]">
        {/* image */}
        <div className="rounded-xl border bg-card p-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={yarn.image}
              alt={yarn.name}
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* separators */}
        <div className="rounded-xl border bg-card p-6">
          <div className="divide-y">
            <SpecRow label="Weight" value={yarn.weight} />
            <SpecRow label="Fibers" value={yarn.fibers.join(", ")} />
            <SpecRow label="Styles" value={yarn.styles.length ? yarn.styles.join(" • ") : "—"} />
            <SpecRow label="Yardage" value={yarn.yardage} />
            <SpecRow label="Unit weight" value={yarn.unitWeight} />
            <SpecRow label="Gauge" value={yarn.gauge} />
            <SpecRow label="Needle size" value={yarn.needleSize} />
            <SpecRow label="Hook size" value={yarn.hookSize} />
            <SpecRow label="Texture" value={yarn.texture} />
            <SpecRow label="Machine wash?" value={yarn.washable} />
            <SpecRow label="Attributes" value={yarn.attributes} />
            <SpecRow label="Dye" value={yarn.dye} />
          </div>
        </div>
      </div>
    </div>
  )
}
