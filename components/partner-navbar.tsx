"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PartnerNavbar = ({ className }: { className?: string }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={className}>
      <nav className="fixed z-20 w-full">
        {/* Mobile navbar */}
        <div className="lg:hidden bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" aria-label="home" className="flex items-center gap-2">
              <Logo />
              <span className="text-base font-semibold text-gray-400">
                Partenaire
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">
                  <span>Connexion</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop navbar */}
        <div
          className={cn(
            "hidden lg:block mx-auto mt-7 bg-white/5 backdrop-blur-md rounded-2xl shadow-sm max-w-4xl px-2 transition-all duration-300 lg:px-3 border border-white/10",
            isScrolled &&
              "mt-2 bg-white/10 backdrop-blur-lg border-white/20 max-w-3xl shadow-md"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-2">
            {/* Logo à gauche avec "Partner" */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-3"
              >
                <Logo />
                <span className="text-lg font-semibold text-gray-400">
                  Partenaire
                </span>
              </Link>
            </div>

            {/* Boutons à droite */}
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">
                  <span>Connexion</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Logo = () => {
  return (
    <img
      src="/Logo + texte_blanc.svg"
      alt="Logo Newbi"
      width="120"
      height="40"
      className="h-8 w-auto"
    />
  );
};

export default PartnerNavbar;
