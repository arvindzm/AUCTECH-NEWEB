import type { Metadata } from "next";
import { AdminStoreProvider } from "@/features/admin/store/AdminStore";
import { ToastProvider } from "@/features/admin/components/Toast";

export const metadata: Metadata = { title: { default: "Admin · Auctech CMS", template: "%s · Auctech CMS" }, robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <AdminStoreProvider><ToastProvider>{children}</ToastProvider></AdminStoreProvider>;
}
