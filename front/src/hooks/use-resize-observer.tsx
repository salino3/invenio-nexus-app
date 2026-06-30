import { useState, useEffect, useRef, type RefObject } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export function useResizeObserver<T extends HTMLElement>(): [
  RefObject<T | null>,
  Dimensions,
] {
  const ref = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  //
  useEffect(() => {
    // Cache the current element to safely unobserve it in the cleanup function
    const currentRef = ref.current;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, dimensions];
}

// Usage example:  const [divRef, dimensions] = useResizeObserver<HTMLDivElement>();
