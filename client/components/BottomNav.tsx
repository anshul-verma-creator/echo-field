import { Link, useLocation } from "react-router-dom";
import { BarChart3, NotebookText, Clock, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const { pathname } = useLocation();
  const Item = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-xs font-medium text-foreground/70",
        pathname === to && "text-brand-blue"
      )}
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
      <span className="hidden sm:block">{label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur">
      <div className="relative mx-auto max-w-3xl px-6 py-3 grid grid-cols-5 items-center">
        <Item to="/stats" icon={BarChart3} label="Stats" />
        <Item to="/notes" icon={NotebookText} label="Notes" />

        <div className="flex items-center justify-center">
          <Link to="/add" aria-label="Add" className="-translate-y-5">
            <div className="h-14 w-14 rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/40 grid place-content-center">
              <Plus className="h-7 w-7 text-white" />
            </div>
          </Link>
        </div>

        <Item to="/history" icon={Clock} label="History" />
        <Item to="/settings" icon={Settings} label="Settings" />
      </div>
    </nav>
  );
}
