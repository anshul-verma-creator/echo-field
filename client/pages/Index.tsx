import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import TransactionRow from "@/components/TransactionRow";
import TodayBar from "@/components/charts/TodayBar";
import CategoryModal from "@/components/CategoryModal";
import { useNavigate } from "react-router-dom";
import { useStore, formatINR } from "@/state/store";

export default function Index() {
  const nav = useNavigate();
  const { state, todaySpent, monthTotals } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const budgetLeft = useMemo(() => {
    const spent = monthTotals.expense;
    const income = state.allowance > 0 ? state.allowance : monthTotals.income;
    const totalAllowance = Math.max(income, state.allowance);
    return Math.max(totalAllowance - spent, 0);
  }, [monthTotals, state.allowance]);

  const dailyMax = useMemo(() => {
    const essential = state.fixed.Rent + state.fixed.Food + state.fixed.Travel;
    const allowance = state.allowance > 0 ? state.allowance : monthTotals.income;
    const free = Math.max(allowance - essential, 0);
    return free / 30;
  }, [state.fixed, state.allowance, monthTotals.income]);

  const todayBreakdown = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();
    const categories = { Food: 0, Travel: 0, Savings: 0 } as Record<string, number>;
    for (const t of state.transactions) {
      const d = new Date(t.date).getTime();
      if (d >= start && d < end) {
        if (t.type === "expense") {
          if (t.category === "Food" || t.category === "Travel" || t.category === "Savings") {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
          }
        } else if (t.type === "income") {
          // treat explicit Savings incomes as savings
          if (t.category === "Savings") categories.Savings = (categories.Savings || 0) + t.amount;
        }
      }
    }
    return categories;
  }, [state.transactions]);

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setModalOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
          className="rounded-2xl p-5 bg-cardtone-blue text-white shadow-sm cursor-pointer"
        >
          <div className="text-sm/5 opacity-90">Today’s Spending</div>
          <div className="text-3xl font-extrabold mt-1">{formatINR(todaySpent)}</div>
          <div className="mt-3">
            <ProgressBar value={todaySpent} max={Math.max(dailyMax, todaySpent)} color="white" />
            <div className="mt-1 text-xs opacity-90">Max today: {formatINR(dailyMax)}</div>
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-cardtone-green text-white shadow-sm">
          <div className="text-sm/5 opacity-90">Budget Left</div>
          <div className="text-3xl font-extrabold mt-1">{formatINR(budgetLeft)}</div>
          <div className="mt-3">
            <ProgressBar value={budgetLeft} max={Math.max(budgetLeft, 1)} color="white" />
            <div className="mt-1 text-xs opacity-90">Allowance: {formatINR(Math.max(state.allowance, monthTotals.income))}</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          className="h-12 rounded-xl text-base font-semibold bg-red-600 hover:bg-red-700"
          onClick={() => nav("/input?type=expense")}
        >
          + Expense
        </Button>
        <Button
          className="h-12 rounded-xl text-base font-semibold bg-brand-blue text-white hover:brightness-110"
          onClick={() => nav("/input?type=income")}
        >
          + Income
        </Button>
      </div>

      {/* Today's breakdown chips */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border p-3 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--cat-food))" }} />
          <div>
            <div className="text-sm font-medium">Today’s Food</div>
            <div className="font-semibold">{formatINR(todayBreakdown.Food)}</div>
          </div>
        </div>
        <div className="flex-1 rounded-xl border p-3 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--cat-travel))" }} />
          <div>
            <div className="text-sm font-medium">Today’s Travel</div>
            <div className="font-semibold">{formatINR(todayBreakdown.Travel)}</div>
          </div>
        </div>
        <div className="flex-1 rounded-xl border p-3 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--cat-savings))" }} />
          <div>
            <div className="text-sm font-medium">Today’s Savings</div>
            <div className="font-semibold">{formatINR(todayBreakdown.Savings)}</div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <section>
        <h2 className="text-lg font-bold">Recent Transactions</h2>
        <div className="mt-2 divide-y">
          {(() => {
            const recent = state.transactions.slice(0, 4);
            const placeholders = Math.max(0, 4 - recent.length);
            return (
              <>
                {recent.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
                {Array.from({ length: placeholders }).map((_, i) => (
                  <div key={`ph-${i}`} className="flex items-center justify-between py-3 text-foreground/40">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-foreground/10" />
                      <span className="font-medium">No transaction</span>
                    </div>
                    <div className="font-semibold">—</div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </section>

      {/* Charts */}
      <section>
        <div className="rounded-xl border p-4">
          <div className="font-semibold mb-2">Remaining This Month</div>
          <TodayBar mode="remaining" />
        </div>
      </section>
      <CategoryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
