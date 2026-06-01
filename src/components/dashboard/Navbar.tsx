"use client";

import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

interface CurrentUser {
  name?: string;
  email?: string;
  username?: string;
}

interface NavbarProps {
  title?: string;
}

export default function Navbar({
  title = "Employee Dashboard",
}: NavbarProps) {
  const [user, setUser] = useState<CurrentUser | null>(
    null
  );

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  const displayName =
    user?.name ?? user?.email ?? user?.username ?? "User";

  return (
    <div className="w-full h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
      <h2 className="text-white text-xl font-semibold">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-medium text-white">
            {displayName}
          </span>
          {user?.email && (
            <span className="text-xs text-zinc-400">
              {user.email}
            </span>
          )}
        </div>

        <div className="flex size-10 items-center justify-center rounded-full bg-purple-500 text-white">
          <UserRound size={18} />
        </div>

        <a
          href="/api/auth/logout"
          className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </a>
      </div>
    </div>
  );
}
