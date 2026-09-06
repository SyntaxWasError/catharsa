'use client';

import { useEffect, useState } from 'react';

/** Load the design capture helper only for an explicit Figma capture URL. */
export function FigmaCapture() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    const update = () => {
      const requested = new URLSearchParams(window.location.hash.slice(1)).has(
        'figmacapture',
      );
      queueMicrotask(() => {
        if (active) setEnabled(requested);
      });
    };
    update();
    window.addEventListener('hashchange', update);
    return () => {
      active = false;
      window.removeEventListener('hashchange', update);
    };
  }, []);

  return enabled ? (
    <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
  ) : null;
}
