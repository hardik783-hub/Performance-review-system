"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  FileText,
} from "lucide-react";

import Navbar from "@/components/dashboard/Navbar";

const hrLinks = [
  {
    title: "Overview",
    href: "/hr",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/hr/reports",
    icon: FileText,
  },
  {
    title: "Cycles",
    href: "/hr/cycles",
    icon: CalendarDays,
  },
];

interface HRLayoutProps {
  children: React.ReactNode;
}

export default function HRLayout({
  children,
}: HRLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-5">
        <h1 className="mb-10 text-3xl font-bold text-white">
          PerformAI
        </h1>

        <nav className="space-y-3">
          {hrLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl p-3 transition ${
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
        </nav>
      </aside>

      <div className="flex-1">
        <Navbar role="hr" />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
