import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const nav = useNavigate();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6 bg-brand-blue text-white shadow-sm">
        <div className="text-2xl font-extrabold">Income</div>
        <p className="opacity-90 mt-1">Set your fixed monthly allowance.</p>
        <Button
          onClick={() => nav("/input?mode=allowance")}
          className="mt-4 bg-white text-brand-blue hover:bg-white/90 rounded-xl"
        >
          Set Fixed Monthly Allowance
        </Button>
      </div>

      <div className="rounded-2xl p-6 bg-red-600 text-white shadow-sm">
        <div className="text-2xl font-extrabold">Expenses</div>
        <p className="opacity-90 mt-1">Configure fixed expenses per category.</p>
        <Button
          onClick={() => nav("/fixed-expenses")}
          className="mt-4 bg-white text-red-600 hover:bg-white/90 rounded-xl"
        >
          Set Fixed Expenses
        </Button>
      </div>
    </div>
  );
}
