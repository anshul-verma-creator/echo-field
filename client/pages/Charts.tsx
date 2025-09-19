import TodayPie from "@/components/charts/TodayPie";
import AllowancePie from "@/components/charts/AllowancePie";

export default function Charts() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-semibold mb-3">Today's Expenses</h2>
        <TodayPie />
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-semibold mb-3">Remaining This Month</h2>
        <AllowancePie />
      </div>
    </div>
  );
}
