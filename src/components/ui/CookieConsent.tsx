"use client";

import { useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-3xl border border-zinc-200 bg-white/95 p-4 shadow-xl shadow-zinc-900/5 text-sm text-zinc-900 backdrop-blur-xl sm:left-auto sm:right-6 sm:max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          We use cookies to improve your experience. By continuing to browse,
          you agree to our cookie policy.
        </p>
        <button
          type="button"
          className="inline-flex rounded-full bg-black px-4 py-2 text-white transition hover:bg-black/80"
          onClick={() => setVisible(false)}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
