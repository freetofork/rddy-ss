import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Star, Check, Coins, UserCheck, Database, Activity, Map, CloudDownload, BarChart4, Network, Sparkles } from "lucide-react"
import { ImageSlider } from "@/components/image-slider"
import { ScrollReveal } from "@/components/scroll-reveal"
import Stripe from 'stripe'

// Types
interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: Stripe.Price;
}

// This makes the page dynamic instead of static
export const revalidate = 3600 // Revalidate every hour

async function getStripeProducts(): Promise<StripeProduct[]> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is missing. Using dummy products to prevent SSR crash.");
    return [
      {
        id: "prod_dummy1",
        name: "Starter Plan",
        description: "Perfect for testing the waters",
        features: ["Access to basic features", "Community Support", "1 Project"],
        price: { unit_amount: 900, recurring: { interval: "month" } } as any
      },
      {
        id: "prod_dummy2",
        name: "Pro Plan",
        description: "For serious builders",
        features: ["Everything in Starter", "Priority Support", "Unlimited Projects"],
        price: { unit_amount: 2900, recurring: { interval: "month" } } as any
      }
    ];
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20'
  });

  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    features: product.metadata?.features ? JSON.parse(product.metadata.features) : [],
    price: product.default_price as Stripe.Price
  })).sort((a, b) => (a.price.unit_amount || 0) - (b.price.unit_amount || 0));
}

export default async function LandingPage() {
  const products = await getStripeProducts();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-12 flex items-center justify-center bg-background/80 backdrop-blur-md border-b fixed border-b-border w-full z-50">
        <nav className="flex items-center gap-6 sm:gap-10">
          <a className="text-xs font-normal text-muted-foreground hover:text-foreground transition-colors" href="#features">
            Features
          </a>
          <a className="text-xs font-normal text-muted-foreground hover:text-foreground transition-colors" href="#testimonials">
            Upcoming
          </a>
          <a className="text-xs font-normal text-muted-foreground hover:text-foreground transition-colors" href="#pricing">
            Pricing
          </a>
          <Link className="text-xs font-normal text-muted-foreground hover:text-foreground transition-colors" href="/login">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 lg:py-28 xl:py-36">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex flex-col space-y-4 md:w-1/3 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Image src="/ruddy-icon.png" alt="Ruddy" width={48} height={48} className="rounded-xl shadow-sm" priority />
                  <h1 className="text-xl font-display font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl/none">
                    Ruddy
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">
                  Query local and cloud data natively with DuckDB.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Button>Download for macOS</Button>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-2xl shadow-2xl border border-border"
              >
                <source src="/ruddy-hero-dive.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
        <ScrollReveal>
          <div className="w-full bg-muted py-8 md:py-12">
            <div className="container px-4 md:px-6">
              <ImageSlider />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <section className="w-full py-10 md:py-20 lg:py-32 bg-muted" id="features">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Our Features</h2>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Core Engine</h3>
                  <p className="text-muted-foreground text-center">Optimized Native DuckDB. Zero WASM overhead.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Code</h3>
                  <p className="text-muted-foreground text-center">Execute Python or SQL code in custom notebooks. Install your own native libraries.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Catalog</h3>
                  <p className="text-muted-foreground text-center">Rich and clean information about your schemas</p>
                </div>
                <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Data</h3>
                  <p className="text-muted-foreground text-center">Work with local files or cloud data sources seamlessly.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Network className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">ERD Builder</h3>
                  <p className="text-muted-foreground text-center">Explore database schemas via an interactive map and build visually generated queries.</p>
                </div>
                <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Linter</h3>
                  <p className="text-muted-foreground text-center">Built-in SQL Linter catches syntax errors and standardizes your code on the fly.</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section className="w-full py-10 md:py-20 lg:py-32" id="testimonials">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Upcoming</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CloudDownload className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xl font-black text-primary/20">#1</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Cloud Expansion</h3>
                    <p className="text-sm text-muted-foreground">More cloud and remote data sources (Buckets, HTTPS etc)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Map className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xl font-black text-primary/20">#2</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Spatial Analytics</h3>
                    <p className="text-sm text-muted-foreground">Local GIS and Map interface for spatial data visualization.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart4 className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xl font-black text-primary/20">#3</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Native Charts</h3>
                    <p className="text-sm text-muted-foreground">Graphical outputs directly in the SQL Console.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section className="w-full py-10 md:py-20 lg:py-32 bg-muted" id="pricing">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Pricing Plans</h2>
              <p className="text-muted-foreground text-center mb-8 md:text-xl">Early &quot;Duck&quot; Access. Join our limited first wave of divers with locked-in legacy rates.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col h-full">
                    <CardHeader className="p-6 pb-2">
                      <CardTitle className="text-xl md:text-2xl font-display">{product.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-6 pt-0">
                      <div className="mb-6">
                        <p className="text-3xl md:text-4xl font-bold font-display tracking-tight">
                          {product.price.unit_amount
                            ? `$${(product.price.unit_amount / 100).toFixed(0)}`
                            : 'Custom'}
                          <span className="text-lg md:text-xl font-normal text-muted-foreground tracking-normal block mt-1">
                            {(() => {
                              if (!product.price.recurring) return '';
                              const { interval, interval_count = 1 } = product.price.recurring;
                              if (interval === 'month' && interval_count === 3) return 'For 3 Months';
                              if (interval === 'month' && interval_count === 6) return 'For 6 Months';
                              if (interval === 'year' || (interval === 'month' && interval_count === 12)) return 'For 1 Year';
                              return `per ${interval}`;
                            })()}
                          </span>
                        </p>
                      </div>
                      <ul className="space-y-3 flex-1">
                        {product.features?.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="mr-2 h-4 w-4 text-primary shrink-0 transition-opacity opacity-80" />
                            <span className="text-foreground/80 leading-snug text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-6 pt-4 mt-auto">
                      <Link
                        className="w-full"
                        href={`/signup?plan=${product.id}`}
                      >
                        <Button className="w-full text-sm h-10">Get Started</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section className="w-full py-10 md:py-16 lg:py-20">
            <div className="w-full">
              <div className="relative w-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source src="/ruddy-underwater-cta.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 md:pt-12">
                  <h2 className="text-2xl md:text-4xl font-bold font-display tracking-tighter text-[#4F2C1E]">Ready to query?</h2>
                  <p className="text-[#4F2C1E]/80 text-sm md:text-lg mt-2">
                    Dive in while the water&apos;s fine
                  </p>
                  <Link className="btn mt-4" href="#">
                    <Button>Download for macOS</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 Ruddy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div >
  )
}
