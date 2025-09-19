import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useMemo } from "react";
import { useStore } from "@/state/store";

const COLORS: Record<string, string> = {
  Rent: "hsl(var(--cat-rent))",
  Food: "hsl(var(--cat-food))",
  Travel: "hsl(var(--cat-travel))",
  Fun: "hsl(var(--cat-fun))",
  Savings: "hsl(var(--cat-savings))",
  Others: "hsl(var(--cat-others))",
};

type Mode = "today" | "remaining";

export default function TodayBar({ mode = "today" }: { mode?: Mode }) {
  const { state } = useStore();
  const { transactions, fixed, allowance } = state as any;

  const data = useMemo(() => {
    const categories = ["Rent", "Food", "Travel", "Fun", "Savings", "Others"];

    if (mode === "today") {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();

      const totals: Record<string, number> = { Rent: 0, Food: 0, Travel: 0, Fun: 0, Savings: 0, Others: 0 };

      for (const t of transactions || []) {
        const d = new Date(t.date).getTime();
        if (d >= start && d < end) {
          if (t.type === "expense") {
            const key = categories.includes(t.category) ? t.category : "Others";
            totals[key] = (totals[key] || 0) + t.amount;
          } else if (t.type === "income") {
            if (t.category === "Savings") totals.Savings = (totals.Savings || 0) + t.amount;
          }
        }
      }

      return categories.map((c) => ({ name: c, value: totals[c] || 0 }));
    }

    // remaining mode: show remaining monthly amount per category (allocated - spentThisMonth)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

    const spentByCat: Record<string, number> = { Rent: 0, Food: 0, Travel: 0, Fun: 0, Savings: 0, Others: 0 };
    for (const t of transactions || []) {
      const d = new Date(t.date).getTime();
      if (d >= monthStart && d < nextMonth && t.type === "expense") {
        const key = categories.includes(t.category) ? t.category : "Others";
        spentByCat[key] = (spentByCat[key] || 0) + t.amount;
      }
    }

    const totalFixed = categories.reduce((s, c) => s + (fixed[c] || 0), 0);
    const alloc: Record<string, number> = {
      Rent: fixed.Rent || 0,
      Food: fixed.Food || 0,
      Travel: fixed.Travel || 0,
      Fun: fixed.Fun || 0,
      Savings: fixed.Savings || 0,
      Others: Math.max((allowance || 0) - totalFixed, 0),
    };

    const rows = categories.map((c) => ({ name: c, value: Math.max(alloc[c] - (spentByCat[c] || 0), 0) }));
    return rows;
  }, [transactions, fixed, allowance, mode]);

  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  return (
    <div className="w-full h-48">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v: any) => `₹ ${Number(v).toLocaleString("en-IN")}`} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={(COLORS as any)[entry.name] || "hsl(var(--brand-blue))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-foreground/60">{mode === "today" ? "Values shown for today." : "Remaining this month by category."} Max: ₹ {maxVal.toFixed(2)}</div>
    </div>
  );
}
