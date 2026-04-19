"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function VisitorBeacon() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/mmm') || pathname.startsWith('/api')) return;
    if (lastTrackedRef.current === pathname) return;

    lastTrackedRef.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    });

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
        return;
      }
    } catch {
      // fall through to fetch
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // swallow — analytics must never break the page
    });
  }, [pathname]);

  return null;
}
