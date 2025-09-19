import { formatINR } from "@/state/store";
import type { Category, Transaction } from "@/state/store";

const colorByCategory: Record<Category | "Allowance", string> = {
  Rent: "hsl(var(--cat-rent))",
  Food: "hsl(var(--cat-food))",
  Travel: "hsl(var(--cat-travel))",
  Fun: "hsl(var(--cat-fun))",
  Savings: "hsl(var(--cat-savings))",
  Others: "hsl(var(--cat-others))",
  Allowance: "hsl(var(--brand-green))",
};

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.type === "income";
  const sign = isIncome ? "+" : "-";
  const color = isIncome ? colorByCategory["Allowance"] : colorByCategory[tx.category];
  const label = isIncome ? "Allowance" : tx.category;

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium">{label}</span>
      </div>
      <div className={isIncome ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
        {sign}
        {formatINR(tx.amount)}
      </div>
    </div>
  );
}
