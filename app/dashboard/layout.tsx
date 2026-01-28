// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       // call logout API
//       await fetch("/api/logout", { method: "POST" });
//       router.replace("/login");
//     }, 5000); // 5 seconds for testing

//     return () => clearTimeout(timer);
//   }, [router]);

//   return <>{children}</>;
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const nineHoursInMs = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

    const timer = setTimeout(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.replace("/login");
    }, nineHoursInMs);

    return () => clearTimeout(timer);
  }, [router]);

  return <>{children}</>;
}
