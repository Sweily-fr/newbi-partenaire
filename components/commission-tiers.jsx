import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Crown, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    icon: Trophy,
    percentage: "20%",
    range: "0 - 1 000€",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    name: "Argent",
    icon: Award,
    percentage: "25%",
    range: "1 001 - 5 000€",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
  {
    name: "Or",
    icon: Crown,
    percentage: "30%",
    range: "5 001 - 10 000€",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    name: "Platine",
    icon: Sparkles,
    percentage: "50%",
    range: "+ 10 000€",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
];

export function CommissionTiers({ currentTier = "Bronze", currentCA = 0, nextTier = "Argent", progress = 0 }) {
  return (
    <Card className="py-0 gap-0">
      <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
        <CardTitle className="text-base sm:text-lg">Paliers de Commission</CardTitle>
        <CardDescription className="text-sm flex flex-wrap items-center gap-2">
          <span>Votre niveau actuel :</span>
          <Badge variant="outline">{currentTier}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {tiers.map((tier) => {
            const isActive = tier.name === currentTier;
            const Icon = tier.icon;
            
            return (
              <div
                key={tier.name}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all gap-3 ${
                  isActive
                    ? `${tier.bgColor} ${tier.borderColor} shadow-sm`
                    : "border-border bg-card/50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${tier.bgColor} shrink-0`}>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${tier.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base">{tier.name}</h3>
                      {isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Actuel
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{tier.range}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className={`text-xl sm:text-2xl font-bold ${tier.color}`}>
                    {tier.percentage}
                  </div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress to next tier */}
        {nextTier && (
          <div className="mt-6 p-3 sm:p-4 rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-2">
              <span className="text-xs sm:text-sm font-medium">Progression vers {nextTier}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              CA actuel : {currentCA.toFixed(2)}€
            </p>
          </div>
        )}
        {!nextTier && (
          <div className="mt-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
              🎉 Félicitations ! Vous avez atteint le niveau maximum (Platine)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
