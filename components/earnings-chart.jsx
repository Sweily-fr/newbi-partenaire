"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function EarningsChart({ data }) {
  // Données placeholder si pas de données
  const hasData = data && data.length > 0 && data.some(d => d.earnings > 0);
  const chartData = hasData ? data : [
    { month: "Jan", earnings: 0, placeholder: 50 },
    { month: "Fév", earnings: 0, placeholder: 50 },
    { month: "Mar", earnings: 0, placeholder: 50 },
    { month: "Avr", earnings: 0, placeholder: 50 },
    { month: "Mai", earnings: 0, placeholder: 50 },
    { month: "Juin", earnings: 0, placeholder: 50 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des Gains</CardTitle>
        <CardDescription>
          {hasData ? "Vos commissions sur les 6 derniers mois" : "Aucune commission pour le moment"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b50ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5b50ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={hasData ? 0.3 : 0.5}
                vertical={true}
                horizontal={true}
              />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "#ffffff", fontSize: 12 }}
                stroke="hsl(var(--border))"
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fill: "#ffffff", fontSize: 12 }}
                stroke="hsl(var(--border))"
                axisLine={{ stroke: "hsl(var(--border))" }}
                domain={hasData ? ['auto', 'auto'] : [0, 100]}
                tickFormatter={(value) => Number(value).toFixed(2)}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                labelStyle={{ 
                  color: "hsl(var(--popover-foreground))",
                  fontWeight: "600",
                  marginBottom: "4px"
                }}
                itemStyle={{
                  color: "hsl(var(--popover-foreground))",
                }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
                formatter={(value, name) => {
                  if (name === "Structure") return null;
                  return [`${hasData ? Number(value).toFixed(2) : '0.00'} €`, 'Gains'];
                }}
              />
              {!hasData && (
                <Area 
                  type="monotone" 
                  dataKey="placeholder" 
                  stroke="rgba(255, 255, 255, 0.15)" 
                  strokeWidth={2}
                  fillOpacity={0.08} 
                  fill="rgba(255, 255, 255, 0.05)" 
                  name="Structure"
                  dot={false}
                />
              )}
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke={hasData ? "#5b50ff" : "transparent"} 
                strokeWidth={2}
                fillOpacity={hasData ? 1 : 0} 
                fill={hasData ? "url(#colorEarnings)" : "transparent"} 
                name="Gains"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
