"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEmployee } from "@/context/EmployeeContext";

interface NavbarProps {
  role?: "employee" | "hr" | "manager";
}

export default function Navbar({
  role = "employee",
}: NavbarProps) {
  const {
    employeeId,
    setEmployeeId,
  } = useEmployee();

  const title =
    role === "hr"
      ? "HR Dashboard"
      : role === "manager"
      ? "Manager Dashboard"
      : "Employee Dashboard";

  return (
    <div className="w-full h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
      <h2 className="text-white text-xl font-semibold">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        <select
          value={employeeId}
          onChange={(e) =>
            setEmployeeId(
              e.target.value
            )
          }
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700"
        >
          <option value="EMP101">
            EMP101
          </option>

          <option value="EMP102">
            EMP102
          </option>

          <option value="EMP103">
            EMP103
          </option>
        </select>

        <Button
          asChild
          variant="outline"
          className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
        >
          <Link
            href="/api/auth/logout"
            className="gap-2"
          >
            <LogOut size={16} />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
}
