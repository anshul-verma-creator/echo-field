import { useRef } from "react";
import { useStore } from "@/state/store";

export default function Profile() {
  const { state, setProfileImage } = useStore();
  const inputRef = useRef<HTMLInputElement | null>(null);

  function trigger() {
    inputRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(f);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border bg-card p-4 space-y-4">
        <div className="flex items-center gap-4">
          <input ref={inputRef} onChange={onFile} type="file" accept="image/*" className="hidden" />
          <img src={state.profileImage ?? "/placeholder.svg"} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
          <div>
            <div className="text-lg font-bold">Profile</div>
            <button onClick={trigger} className="text-sm text-brand-blue mt-1">
              Change photo
            </button>
          </div>
        </div>

        <ul className="divide-y">
          <li className="py-4 text-lg font-bold">Settings</li>
          <li className="py-4 text-lg font-bold">About Us</li>
          <li className="py-4 text-lg font-bold">Contact Us</li>
        </ul>
      </div>
    </div>
  );
}
