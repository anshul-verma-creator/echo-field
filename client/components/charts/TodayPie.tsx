import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useStore } from "@/state/store";

const COLORS: Record<string, string> = {
  Rent: "hsl(var(--cat-rent))",
  Food: "hsl(var(--cat-food))",
  Travel: "hsl(var(--cat-travel))",
  Fun: "hsl(var(--cat-fun))",
  Savings: "hsl(var(--cat-savings))",
  Others: "hsl(var(--cat-others))",
};

export default function TodayPie() {
  const { state } = useStore();
  const { transactions } = state as any;

  const data = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();
    const cats: Record<string, number> = { Rent: 0, Food: 0, Travel: 0, Fun: 0, Savings: 0, Others: 0 };

    for (const t of transactions || []) {
      const d = new Date(t.date).getTime();
      if (d >= start && d < end && t.type === "expense") {
        const cat = t.category && cats.hasOwnProperty(t.category) ? t.category : "Others";
        cats[cat] = (cats[cat] || 0) + t.amount;
      }
    }

    return Object.keys(cats).map((k) => ({ name: k, value: cats[k] })).filter((r) => r.value > 0);
  }, [transactions]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={2}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={(COLORS as any)[entry.name] || "hsl(var(--brand-blue))"} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any) => `₹ ${Number(v).toLocaleString("en-IN")}`} />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
