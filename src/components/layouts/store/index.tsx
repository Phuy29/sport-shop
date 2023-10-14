import { ReactElement } from "react";
import { SiteHeader } from "./site-header";

export default function LayoutSite(page: ReactElement) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{page}</main>
    </div>
  );
}
