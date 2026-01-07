import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PartnerNavbar from "@/components/partner-navbar";
import PartnerFooter from "@/components/partner-footer";
import { AnimatedShapesBackground } from "@/components/animated-shapes-background";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <AnimatedShapesBackground />
      
      {/* Header */}
      <PartnerNavbar />

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-[80rem] px-4 pt-20 pb-24 text-center sm:px-6 md:px-8 md:pt-24 lg:pt-32">
        {/* Main Title */}
        <h1 className="bg-gradient-to-br from-white to-white/60 bg-clip-text py-4 text-4xl font-medium leading-tight tracking-tighter text-transparent sm:py-6 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          Devenez Partenaire<br className="hidden sm:block" /> et Gagnez des Commissions
        </h1>
        
        <p className="mb-8 text-base tracking-tight text-white/60 sm:mb-10 sm:text-lg md:mb-12 md:text-xl max-w-2xl mx-auto px-4">
          Recommandez Newbi à votre réseau professionnel et<br className="hidden sm:block" /> générez des revenus récurrents sur chaque client référé.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <Button asChild size="lg" className="gap-2 group bg-[#5b50FF] hover:bg-[#5b50FF]/90 rounded-full px-8 py-5 text-sm sm:px-10 sm:py-6 sm:text-base md:px-12 text-white">
            <Link href="/auth/signup">
              <span>Devenir partenaire</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <PartnerFooter />
    </div>
  );
}
