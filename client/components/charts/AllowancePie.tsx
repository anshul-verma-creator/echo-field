import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useStore } from "@/state/store";

const COLORS = {
  Rent: "hsl(var(--cat-rent))",
  Food: "hsl(var(--cat-food))",
  Travel: "hsl(var(--cat-travel))",
  Fun: "hsl(var(--cat-fun))",
  Savings: "hsl(var(--cat-savings))",
  Others: "hsl(var(--cat-others))",
};

export default function AllowancePie() {
  const { state } = useStore();
  const { allowance, fixed, transactions } = state as any;

  const data = useMemo(() => {
    // compute month spending per category
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

    const spentByCat: Record<string, number> = { Rent: 0, Food: 0, Travel: 0, Fun: 0, Savings: 0, Others: 0 };
    for (const t of transactions || []) {
      const d = new Date(t.date).getTime();
      if (d >= monthStart && d < nextMonth && t.type === "expense") {
        const cat = t.category || "Others";
        spentByCat[cat] = (spentByCat[cat] || 0) + t.amount;
      }
    }

    const categories = ["Rent", "Food", "Travel", "Fun", "Savings"];
    const rows: { name: string; value: number }[] = [];
    const totalFixed = categories.reduce((s, c) => s + (fixed[c] || 0), 0);

    for (const c of categories) {
      const allocated = fixed[c] || 0;
      const spent = spentByCat[c] || 0;
      const remaining = Math.max(allocated - spent, 0);
      if (remaining > 0) rows.push({ name: c, value: remaining });
    }

    const othersAllocated = Math.max((allowance || 0) - totalFixed, 0);
    const othersSpent = spentByCat["Others"] || 0;
    const othersRemaining = Math.max(othersAllocated - othersSpent, 0);
    if (othersRemaining > 0) rows.push({ name: "Others", value: othersRemaining });

    return rows;
  }, [allowance, fixed, transactions]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.name]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any) => `₹ ${Number(v).toLocaleString("en-IN")}`} />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
