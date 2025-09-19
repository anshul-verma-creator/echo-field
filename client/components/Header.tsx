import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { useRef } from "react";
import { useStore } from "@/state/store";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { state, setProfileImage } = useStore();

  function goBack() {
    try {
      if (window.history.length > 1) nav(-1);
      else nav("/");
    } catch {
      nav("/");
    }
  }

  const isHome = pathname === "/";

  function triggerUpload() {
    inputRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setProfileImage(res);
    };
    reader.readAsDataURL(f);
  }

  return (
    <header className="w-full sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          {!isHome ? (
            <button
              onClick={goBack}
              aria-label="Go back"
              className="p-2 rounded-md bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => nav('/menu')} aria-label="Menu" className="p-2 rounded-md bg-white/0 hover:bg-white/5">
              <Menu className="w-6 h-6 text-foreground/80" />
            </button>
          )}

          <h1 className={`text-[26px] font-extrabold tracking-tight leading-none ${isHome ? "" : "w-1/2"} text-left flex items-center`}>
            <span>BUDGET TRACKER</span>
            <span className="text-sm font-semibold text-foreground/70 ml-3">(BYTE BUSTERS)</span>
          </h1>
        </div>
        <div className="ml-auto">
          <input ref={inputRef} onChange={onFile} type="file" accept="image/*" className="hidden" />
          <button onClick={triggerUpload} aria-label="Profile">
            <img
              src={state.profileImage ?? "/placeholder.svg"}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-blue/20"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
