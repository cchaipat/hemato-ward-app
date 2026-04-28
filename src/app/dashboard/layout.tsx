"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userRole === null) {
      router.replace("/");
    }
  }, [userRole, router]);

  if (!mounted || userRole === null) return null;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
