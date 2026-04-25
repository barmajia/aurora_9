import Link from "next/link";
import { Button } from "@/components/ui";
import {
  HeroSection,
  CategoriesSection,
  FeaturesSection,
} from "@/components/home/HomeClient";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <HeroSection />

      {/* Dynamic Featured Products - Server Component */}
      <FeaturedProducts />

      <CategoriesSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[3rem] overflow-hidden bg-zinc-50 dark:bg-zinc-900 p-12 md:p-20 border border-zinc-200 dark:border-white/5 transition-colors duration-500">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:opacity-20" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter  uppercase mb-8 leading-none">
                Ready to Join the <br />
                <span className="text-blue-600 dark:text-blue-400">
                  Aurora Ecosystem?
                </span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="w-full sm:w-auto">
                    Initialize Account
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View Manifesto
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
