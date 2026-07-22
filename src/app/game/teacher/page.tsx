"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy /game/teacher route — classes are app-run with a voice teacher.
 * Redirect to the main class experience.
 */
export default function TeacherDeskRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/game/live");
  }, [router]);

  return (
    <div className="page-shell">
      <p className="text-muted">
        Opening app classes… Lessons are taught by the voice teacher bot inside
        the app.
      </p>
    </div>
  );
}
