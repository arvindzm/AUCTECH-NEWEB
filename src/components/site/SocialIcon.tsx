/** Minimal inline brand glyphs (Lucide no longer ships brand icons). */
export function SocialIcon({ name, className = "size-4" }: { name: string; className?: string }) {
  const p: Record<string, React.ReactNode> = {
    facebook: <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9a1 1 0 0 1 1-1z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" /></>,
    twitter: <path d="M4 4h4.5l4 5.6L17.5 4H20l-6.3 7.3L20.5 20H16l-4.3-6-5.2 6H4l6.6-7.6z" />,
    linkedin: <path d="M5 9h3v11H5zM6.5 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h3v1.6c.5-.9 1.7-1.8 3.4-1.8 3.2 0 3.6 2.1 3.6 4.8V20h-3v-5.6c0-1.3 0-3-1.8-3s-2.2 1.4-2.2 2.9V20h-3z" />,
    youtube: <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3z" />,
    whatsapp: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.4-.7a11.7 11.7 0 0 1-4.6-4.1 5.2 5.2 0 0 1-1.1-2.8 3 3 0 0 1 1-2.2 1 1 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.9 2.1a.5.5 0 0 1 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6a8 8 0 0 0 1.5 1.8 7.2 7.2 0 0 0 2.1 1.3c.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.2.5.2.6.4a2.4 2.4 0 0 1-.1 1.4z" />,
  };
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>{p[name]}</svg>;
}
