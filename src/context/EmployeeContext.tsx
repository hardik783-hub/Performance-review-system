"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type EmployeeContextType = {
  employeeId: string;
  setEmployeeId: (
    id: string
  ) => void;
};

const EmployeeContext =
  createContext<
    EmployeeContextType | undefined
  >(undefined);

export function EmployeeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employeeId, setEmployeeId] =
    useState("EMP101");

  return (
    <EmployeeContext.Provider
      value={{
        employeeId,
        setEmployeeId,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context =
    useContext(EmployeeContext);

  if (!context) {
    throw new Error(
      "useEmployee must be used inside EmployeeProvider"
    );
  }

  return context;
}