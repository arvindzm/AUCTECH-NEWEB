import fs from "node:fs";
import path from "node:path";
import { MediaLibrary, type MediaAsset } from "@/features/admin/components/MediaLibrary";

/** Lists the original image assets shipped in /public/img (server-side, at build time). */
function scan(dir: string, base = ""): MediaAsset[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const rel = path.posix.join(base, e.name);
    if (e.isDirectory()) return scan(path.join(dir, e.name), rel);
    if (!/\.(webp|png|jpe?g|svg|gif|avif)$/i.test(e.name)) return [];
    return [{ id: rel, url: `/img/${rel}`, name: e.name, folder: base || "img", size: fs.statSync(path.join(dir, e.name)).size }];
  });
}

export default function MediaPage() {
  const assets = scan(path.join(process.cwd(), "public", "img")).sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name, undefined, { numeric: true }));
  return <MediaLibrary initial={assets} />;
}
