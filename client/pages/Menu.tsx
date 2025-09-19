import { Link } from "react-router-dom";

export default function Menu() {
  const items = [
    { label: "STATS", to: "/stats" },
    { label: "NOTES", to: "/notes" },
    { label: "HISTORY", to: "/history" },
    { label: "SETTINGS", to: "/settings" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border bg-white p-6">
        <ul className="flex flex-col gap-4">
          {items.map((it) => (
            <li key={it.label}>
              <Link to={it.to} className="block text-black font-extrabold text-lg">
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
