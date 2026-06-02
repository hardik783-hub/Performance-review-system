import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { EmployeeProvider } from "@/context/EmployeeContext";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Performance Review System",
  description: "AWS-based Employee Performance Review Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-black text-white`}>
  <EmployeeProvider>
    {children}
    <Toaster richColors />
  </EmployeeProvider>
</body>
    </html>
  );
}