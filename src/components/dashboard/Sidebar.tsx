"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardCheck,
  Target,
  Users,
} from "lucide-react";

const employeeLinks = [
  {
    title: "Dashboard",
    href: "/employee",
    icon: LayoutDashboard,
  },
  {
    title: "Self Review",
    href: "/reviews/self",
    icon: ClipboardCheck,
  },
  {
    title: "Peer Review",
    href: "/reviews/peer",
    icon: Users,
  },
  {
    title: "OKRs",
    href: "/employee/okrs",
    icon: Target,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const links = employeeLinks;

  return (
    <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 p-5">
      <h1 className="text-3xl font-bold text-white mb-10">
        PerformAI
      </h1>

      <div className="space-y-3">
        {links.map((item) => {
          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
