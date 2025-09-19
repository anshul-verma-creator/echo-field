import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore, formatINR } from "@/state/store";
import { Button } from "@/components/ui/button";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const CATEGORIES = ["Rent", "Food", "Travel", "Fun", "Savings", "Others"] as const;

export default function Input() {
  const q = useQuery();
  const mode = q.get("mode"); // allowance (from Add page)
  const type = q.get("type"); // income | expense (from Home buttons)
  const nav = useNavigate();
  const { addIncome, addExpense, setAllowance } = useStore();
  const [amount, setAmount] = useState<string>("");

  const initialCategory = (q.get("category") as string) || "Others";
  const [category, setCategory] = useState<string>(initialCategory);

  const title =
    mode === "allowance"
      ? "Set Fixed Monthly Allowance"
      : type === "income"
      ? "+ Income"
      : `Expenses-(${category ?? "Others"})`;

  function submit() {
    const n = Number(amount);
    if (!isFinite(n) || n <= 0) return;
    if (mode === "allowance") {
      setAllowance(n);
    } else if (type === "income") {
      addIncome(n);
    } else {
      addExpense(n, category as any);
    }
    nav(-1);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-xl font-bold mb-4">{title}</div>

        {type === "expense" && (
          <div className="mb-4">
            <div className="text-sm text-foreground/70 mb-2">Select Category</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-xl border ${c === category ? "bg-brand-blue text-white" : "bg-white text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-white">
          <span className="text-2xl">₹</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="w-full outline-none text-right text-2xl"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="text-sm text-foreground/60 mt-2">Preview: {formatINR(Number(amount) || 0)}</div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="rounded-xl" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button className="bg-brand-blue text-white hover:brightness-110 rounded-xl" onClick={submit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
