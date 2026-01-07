"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function RevenueChart({ data }) {
  // Données placeholder si pas de données
  const hasData = data && data.length > 0 && data.some(d => d.revenue > 0);
  const chartData = hasData ? data : [
    { month: "Jan", revenue: 0, placeholder: 100 },
    { month: "Fév", revenue: 0, placeholder: 100 },
    { month: "Mar", revenue: 0, placeholder: 100 },
    { month: "Avr", revenue: 0, placeholder: 100 },
    { month: "Mai", revenue: 0, placeholder: 100 },
    { month: "Juin", revenue: 0, placeholder: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chiffre d&apos;Affaires Apporté</CardTitle>
        <CardDescription>
          {hasData ? "CA généré par vos filleuls sur les 6 derniers mois" : "Aucun CA généré pour le moment"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
                domain={hasData ? ['auto', 'auto'] : [0, 200]}
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
                  return [`${hasData ? Number(value).toFixed(2) : '0.00'} €`, 'CA'];
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: "hsl(var(--foreground))",
                }}
                iconType="circle"
              />
              <Bar 
                dataKey={hasData ? "revenue" : "placeholder"}
                fill={hasData ? "#5b50ff" : "rgba(255, 255, 255, 0.08)"} 
                fillOpacity={1}
                radius={[8, 8, 0, 0]}
                name="CA (€)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
