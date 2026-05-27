import { useEffect, useRef, useState, useCallback } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: (node: Element | null) => void;
  inView: boolean;
}

export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((el: Element | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setInView(isIntersecting);
        if (isIntersecting && triggerOnce) {
          observerRef.current?.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observerRef.current.observe(node);
    return () => observerRef.current?.disconnect();
  }, [node, threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}
