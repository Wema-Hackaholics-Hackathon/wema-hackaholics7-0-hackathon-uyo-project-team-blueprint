import { House, Package, BookOpen, ArrowsLeftRight } from "@phosphor-icons/react";
import { Link, useLocation } from "@tanstack/react-router";

const tabs = [
  { id: "dashboard", icon: House, label: "Home", to: "/dashboard" },
  { id: "inventory", icon: Package, label: "Stock", to: "/inventory" },
  { id: "transactions", icon: ArrowsLeftRight, label: "History", to: "/transactions" },
  { id: "debtors", icon: BookOpen, label: "Debtors", to: "/debtors" },
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="absolute bottom-0 inset-x-0 flex h-16 shrink-0 items-center justify-around border-t border-border bg-card px-4 z-20 select-none pb-2">
      {tabs.map(({ id, icon: Icon, label, to }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={id}
            to={to}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center py-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon weight={isActive ? "fill" : "regular"} className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-bold">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
