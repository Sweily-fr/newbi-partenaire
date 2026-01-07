import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Award, Crown, Sparkles, UserPlus, Link as LinkIcon, Users, Wallet } from "lucide-react";
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

        {/* Section Gains Possibles */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
              Gagnez jusqu&apos;à <span className="text-[#5b50FF]">50%</span> de commission
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Plus vous recommandez, plus votre taux de commission augmente. Débloquez des paliers et maximisez vos revenus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Bronze */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center hover:bg-white/[0.05] transition-all">
              <div className="mx-auto bg-orange-500/20 rounded-full p-4 w-fit mb-4">
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Bronze</h3>
              <p className="text-3xl font-bold text-orange-500 mb-2">20%</p>
              <p className="text-sm text-white/50">0 - 1 000€ de CA</p>
            </div>

            {/* Argent */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center hover:bg-white/[0.05] transition-all">
              <div className="mx-auto bg-gray-400/20 rounded-full p-4 w-fit mb-4">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Argent</h3>
              <p className="text-3xl font-bold text-gray-400 mb-2">25%</p>
              <p className="text-sm text-white/50">1 001 - 5 000€ de CA</p>
            </div>

            {/* Or */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center hover:bg-white/[0.05] transition-all">
              <div className="mx-auto bg-yellow-500/20 rounded-full p-4 w-fit mb-4">
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Or</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">30%</p>
              <p className="text-sm text-white/50">5 001 - 10 000€ de CA</p>
            </div>

            {/* Platine */}
            <div className="bg-gradient-to-br from-[#5b50FF]/20 to-purple-500/10 border border-[#5b50FF]/30 rounded-2xl p-6 text-center hover:from-[#5b50FF]/30 transition-all">
              <div className="mx-auto bg-[#5b50FF]/20 rounded-full p-4 w-fit mb-4">
                <Sparkles className="h-8 w-8 text-[#5b50FF]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Platine</h3>
              <p className="text-3xl font-bold text-[#5b50FF] mb-2">50%</p>
              <p className="text-sm text-white/50">+ 10 000€ de CA</p>
            </div>
          </div>

          <p className="text-center text-white/40 text-sm mt-8">
            Exemple : Un client souscrit à l&apos;abonnement annuel à 490€ → Vous gagnez jusqu&apos;à 245€ sur le premier paiement
          </p>
        </section>

        {/* Section Comment ça marche */}
        <section id="comment-ca-marche" className="py-16 sm:py-20 lg:py-24 border-t border-white/[0.08] scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              En 4 étapes simples, commencez à générer des revenus passifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Étape 1 */}
            <div className="relative">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#5b50FF]/20 rounded-full p-3">
                    <UserPlus className="h-6 w-6 text-[#5b50FF]" />
                  </div>
                  <span className="text-4xl font-bold text-white/20">01</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Inscrivez-vous</h3>
                <p className="text-sm text-white/60">
                  Créez votre compte partenaire gratuitement en quelques secondes
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {/* Étape 2 */}
            <div className="relative">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#5b50FF]/20 rounded-full p-3">
                    <LinkIcon className="h-6 w-6 text-[#5b50FF]" />
                  </div>
                  <span className="text-4xl font-bold text-white/20">02</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Partagez votre lien</h3>
                <p className="text-sm text-white/60">
                  Obtenez votre lien unique et partagez-le avec votre réseau professionnel
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {/* Étape 3 */}
            <div className="relative">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#5b50FF]/20 rounded-full p-3">
                    <Users className="h-6 w-6 text-[#5b50FF]" />
                  </div>
                  <span className="text-4xl font-bold text-white/20">03</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Vos contacts s&apos;inscrivent</h3>
                <p className="text-sm text-white/60">
                  Vos filleuls créent leur compte et souscrivent à un abonnement Newbi
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {/* Étape 4 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#5b50FF]/20 to-purple-500/10 border border-[#5b50FF]/30 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#5b50FF]/20 rounded-full p-3">
                    <Wallet className="h-6 w-6 text-[#5b50FF]" />
                  </div>
                  <span className="text-4xl font-bold text-white/20">04</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Recevez vos commissions</h3>
                <p className="text-sm text-white/60">
                  Demandez le retrait de vos gains directement sur votre compte bancaire
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="gap-2 group bg-[#5b50FF] hover:bg-[#5b50FF]/90 rounded-full px-8 py-5 text-white">
              <Link href="/auth/signup">
                <span>Commencer maintenant</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Section CTA Newbi */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5b50FF] via-[#7B6FFF] to-purple-600 p-8 sm:p-12 lg:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                Découvrez Newbi
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                La plateforme qui va révolutionner votre manière d&apos;entreprendre
              </h2>
              
              <p className="text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                Facturation, devis, gestion clients, suivi de trésorerie... Tout ce dont vous avez besoin pour gérer votre activité en un seul endroit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 group bg-white text-[#5b50FF] hover:bg-white/90 rounded-full px-8 py-5 font-semibold">
                  <a href="https://www.newbi.fr" target="_blank" rel="noopener noreferrer">
                    <span>Découvrir Newbi</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-5">
                  <a href="https://www.newbi.fr/auth/signup" target="_blank" rel="noopener noreferrer">
                    Essayer gratuitement
                  </a>
                </Button>
              </div>
              
              <p className="text-white/60 text-sm mt-6">
                14 jours d&apos;essai gratuit • Sans engagement • Sans carte bancaire
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PartnerFooter />
    </div>
  );
}
