import { ReactElement } from "react";
import { SiteHeader } from "./site-header";

export default function LayoutAdmin(page: ReactElement) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">{page}</div>
    </div>
  );
}
