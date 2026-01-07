"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { AnimatedShapesBackground } from "@/components/animated-shapes-background";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] relative overflow-hidden p-4">
      <AnimatedShapesBackground />
      
      <Card className="w-full max-w-md relative z-10 bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-red-500/20 rounded-full p-3 w-fit">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Accès Refusé
          </CardTitle>
          <CardDescription className="text-white/70">
            Vous devez être un partenaire pour accéder à cette interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/60 text-center">
            Si vous souhaitez devenir apporteur d&apos;affaires, veuillez créer un compte partenaire.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full bg-white text-black hover:bg-white/90">
              <Link href="/auth/signup">
                Créer un compte partenaire
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              <Link href="/auth/login">
                Se connecter
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
