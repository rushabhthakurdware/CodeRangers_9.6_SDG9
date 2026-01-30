import { usePathname, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useLogRoutes() {
    const pathname = usePathname();
    const segments = useSegments();

    useEffect(() => {
        console.log(
            `
      --- NAVIGATED ---
      Pathname: ${pathname}
      Segments: [${segments.join(', ')}]
      -----------------
      `
        );
    }, [pathname, segments]);
}