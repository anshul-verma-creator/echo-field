import TransactionRow from "@/components/TransactionRow";
import { useStore } from "@/state/store";

export default function History() {
  const { state } = useStore();
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-bold mb-2">All Transactions</h2>
      <div className="divide-y">
        {state.transactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
        {state.transactions.length === 0 && (
          <div className="text-sm text-foreground/60 py-6">No transactions yet</div>
        )}
      </div>
    </div>
  );
}
