"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg font-medium">Redirecting to Login...</p>
    </div>
  );
}
