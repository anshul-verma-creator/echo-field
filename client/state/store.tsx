import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

export type Category = "Rent" | "Food" | "Travel" | "Fun" | "Savings" | "Others";
export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number; // positive numbers only; sign derived from type
  date: string; // ISO string
  category: Category | "Allowance"; // incomes labeled as Allowance for UI
}

export interface FixedExpenses {
  Rent: number;
  Food: number;
  Travel: number;
  Fun: number;
  Savings: number;
  Others: number;
}

interface State {
  allowance: number; // monthly allowance (user-set or from incomes)
  fixed: FixedExpenses;
  transactions: Transaction[];
  profileImage?: string | null;
}

const initialState: State = {
  allowance: 0,
  fixed: { Rent: 0, Food: 0, Travel: 0, Fun: 0, Savings: 0, Others: 0 },
  transactions: [],
  profileImage: null,
};

// Actions

type Action =
  | { type: "SET_ALLOWANCE"; amount: number }
  | { type: "SET_FIXED"; fixed: Partial<FixedExpenses> }
  | { type: "ADD_INCOME"; amount: number; date?: string }
  | { type: "ADD_EXPENSE"; amount: number; category?: Category; date?: string }
  | { type: "SET_PROFILE_IMAGE"; dataUrl: string | null }
  | { type: "LOAD"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALLOWANCE":
      return { ...state, allowance: Math.max(0, action.amount) };
    case "SET_FIXED":
      return { ...state, fixed: { ...state.fixed, ...action.fixed } };
    case "ADD_INCOME": {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        type: "income",
        amount: Math.max(0, action.amount),
        date: action.date ?? new Date().toISOString(),
        category: "Allowance",
      };
      const next = { ...state, transactions: [tx, ...state.transactions] };
      return next;
    }
    case "ADD_EXPENSE": {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        type: "expense",
        amount: Math.max(0, action.amount),
        date: action.date ?? new Date().toISOString(),
        category: action.category ?? "Others",
      };
      const next = { ...state, transactions: [tx, ...state.transactions] };
      return next;
    }
    case "SET_PROFILE_IMAGE":
      return { ...state, profileImage: action.dataUrl };
    case "LOAD":
      return action.state;
    default:
      return state;
  }
}

const StoreCtx = createContext<{
  state: State;
  setAllowance: (amount: number) => void;
  setFixed: (fixed: Partial<FixedExpenses>) => void;
  addIncome: (amount: number) => void;
  addExpense: (amount: number, category?: Category) => void;
  setProfileImage: (dataUrl: string | null) => void;
  todaySpent: number;
  monthTotals: { income: number; expense: number };
} | null>(null);

const STORAGE_KEY = "budget-tracker-state-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        dispatch({ type: "LOAD", state: parsed });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const setAllowance = useCallback((amount: number) => {
    dispatch({ type: "SET_ALLOWANCE", amount });
  }, []);

  const setFixed = useCallback((fixed: Partial<FixedExpenses>) => {
    dispatch({ type: "SET_FIXED", fixed });
  }, []);

  const addIncome = useCallback((amount: number) => {
    dispatch({ type: "ADD_INCOME", amount });
  }, []);

  const addExpense = useCallback((amount: number, category?: Category) => {
    dispatch({ type: "ADD_EXPENSE", amount, category });
  }, []);

  const setProfileImage = useCallback((dataUrl: string | null) => {
    dispatch({ type: "SET_PROFILE_IMAGE", dataUrl });
  }, []);

  const todaySpent = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return state.transactions
      .filter((t) => t.type === "expense")
      .filter((t) => {
        const d = new Date(t.date).getTime();
        return d >= start.getTime() && d < end.getTime();
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const monthTotals = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    let income = 0;
    let expense = 0;
    for (const t of state.transactions) {
      const d = new Date(t.date).getTime();
      if (d >= monthStart && d < nextMonth) {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
      }
    }
    return { income, expense };
  }, [state.transactions]);

  const value = useMemo(
    () => ({ state, setAllowance, setFixed, addIncome, addExpense, setProfileImage, todaySpent, monthTotals }),
    [state, setAllowance, setFixed, addIncome, addExpense, setProfileImage, todaySpent, monthTotals],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}
