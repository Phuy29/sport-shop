import { ReactElement } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import dynamic from "next/dynamic";
const SiteHeaderNoSSR = dynamic(
  () => import("@/components/layouts/store/site-header"),
  {
    ssr: false,
  }
);
export default function LayoutSite(page: ReactElement) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        <SiteHeaderNoSSR />
        <main className="flex-1">{page}</main>
      </div>
    </NextThemesProvider>
  );
}
