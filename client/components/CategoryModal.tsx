import React from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["Food", "Travel", "Rent", "Fun", "Savings", "Others"] as const;

export default function CategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-md bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Add Expense to</h3>
          <button onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/input?type=expense&category=${encodeURIComponent(c)}`}
              onClick={onClose}
              className="rounded-xl border p-3 text-center hover:shadow-md"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
