import { useState } from "react";
import { useStore } from "@/state/store";
import { Button } from "@/components/ui/button";

export default function FixedExpenses() {
  const { state, setFixed } = useStore();
  const [local, setLocal] = useState({ ...state.fixed });

  function save() {
    setFixed(local);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-6 bg-card">
        <div className="text-xl font-bold mb-4">Fixed Expenses</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(local).map(([key, value]) => (
            <label key={key} className="text-sm font-medium">
              <div className="mb-2">{key}</div>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                <span>₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  className="w-full text-right outline-none"
                  value={value}
                  onChange={(e) => setLocal((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                />
              </div>
            </label>
          ))}
        </div>
        <Button className="mt-6 rounded-xl bg-brand-blue text-white hover:brightness-110" onClick={save}>
          Save Fixed Expenses
        </Button>
      </div>
    </div>
  );
}
