"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSignedUp } from "@/lib/student-profile";

const PUBLIC = new Set([
  "/signup",
  "/about",
  "/tools",
]);

/**
 * First visit → curriculum signup (software pack + profile).
 * Allows About/Tools without signup so download links stay reachable.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const path = pathname || "/";
    const publicPath =
      PUBLIC.has(path) || path.startsWith("/signup");
    if (publicPath) {
      setAllowed(true);
      setReady(true);
      return;
    }
    if (!isSignedUp()) {
      router.replace(`/signup?next=${encodeURIComponent(path)}`);
      setAllowed(false);
      setReady(true);
      return;
    }
    setAllowed(true);
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="page-shell flex min-h-[40vh] items-center justify-center">
        <p className="text-muted">Loading Yearwise…</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="page-shell flex min-h-[40vh] items-center justify-center">
        <p className="text-muted">Opening curriculum signup…</p>
      </div>
    );
  }

  return <>{children}</>;
}
