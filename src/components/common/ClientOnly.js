'use client';

import { useEffect, useState } from 'react';

/**
 * This component is used to prevent hydration errors by only rendering its children on the client side.
 * It's particularly useful for handling cases where browser extensions or client-side JavaScript
 * might modify the DOM in ways that cause hydration mismatches with server-rendered content.
 *
 * Common use cases:
 * - Preventing hydration errors from browser extensions (like the cz-shortcut-listen attribute)
 * - Components that need to access browser-specific APIs
 * - Components that depend on window or document objects
 */
export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During server-side rendering or before client-side hydration is complete,
  // return a placeholder with the same props to maintain layout structure
  if (!hasMounted) {
    return <div style={{ visibility: 'hidden' }} {...delegated} />;
  }

  // Once mounted on the client, render the actual children
  return <div {...delegated}>{children}</div>;
}
