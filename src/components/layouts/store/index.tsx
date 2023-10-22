import { ReactElement } from "react";
import dynamic from "next/dynamic";

const SiteHeaderNoSSR = dynamic(
  () => import("@/components/layouts/store/site-header"),
  {
    ssr: false,
  }
);

export default function LayoutSite(page: ReactElement) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderNoSSR />
      <main className="flex-1">{page}</main>
    </div>
  );
}
