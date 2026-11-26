import { cn } from "@/lib/cn";

/**
 * Restrained reveal using CSS scroll-driven animations (progressive enhancement).
 * No JS: content is never left hidden if scripts fail or in browsers without support.
 */
export function Reveal({ children, className, delay: _delay, as: As = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" }) {
  void _delay;
  return <As className={cn("reveal", className)}>{children}</As>;
}
