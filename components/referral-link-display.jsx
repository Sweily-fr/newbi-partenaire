"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function ReferralLinkDisplay({ userEmail }) {
  const [copied, setCopied] = useState(false);
  
  // Générer le code de parrainage à partir de l'email
  const generateReferralCode = (email) => {
    if (!email) return "partner";
    const username = email.split("@")[0].toLowerCase();
    return username.replace(/[^a-z0-9]/g, "").slice(0, 10);
  };

  // Toujours utiliser l'email pour générer le code
  const finalReferralCode = generateReferralCode(userEmail);
  const referralLink = `https://www.newbi.fr/auth/signup?partner=${finalReferralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Lien copié dans le presse-papier !");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  return (
    <div className="w-full">
      <label className="text-xs text-muted-foreground mb-1 block">
        Votre lien de parrainage
      </label>
      <div className="flex gap-2">
        <Input
          value={referralLink}
          readOnly
          className="font-mono text-sm bg-muted/50"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
