import { useEffect, useRef, useState, useCallback } from "react";

type AnimationType = "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "zoom" | "none";

interface UseAnimationOptions {
  type?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

interface UseAnimationReturn {
  ref: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  isVisible: boolean;
}

const INITIAL_STYLES: Record<AnimationType, React.CSSProperties> = {
  fadeIn: { opacity: 0 },
  slideUp: { opacity: 0, transform: "translateY(30px)" },
  slideDown: { opacity: 0, transform: "translateY(-30px)" },
  slideLeft: { opacity: 0, transform: "translateX(30px)" },
  slideRight: { opacity: 0, transform: "translateX(-30px)" },
  zoom: { opacity: 0, transform: "scale(0.9)" },
  none: {},
};

const VISIBLE_STYLES: React.CSSProperties = {
  opacity: 1,
  transform: "none",
};

export function useAnimation(options: UseAnimationOptions = {}): UseAnimationReturn {
  const { type = "fadeIn", delay = 0, duration = 600, threshold = 0.1, triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((el: HTMLElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (triggerOnce) observerRef.current?.disconnect();
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    observerRef.current.observe(node);
    return () => observerRef.current?.disconnect();
  }, [node, delay, threshold, triggerOnce]);

  const style: React.CSSProperties = {
    transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    ...(isVisible ? VISIBLE_STYLES : INITIAL_STYLES[type]),
  };

  return { ref, style, isVisible };
}
