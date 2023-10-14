import Link from "next/link";
import { BarChart3, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { UserNav } from "./user-nav";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  console.log({ path: router.asPath });

  return (
    <div className={cn("pb-12 h-full", className)}>
      <div>
        <UserNav />
      </div>
      <div className="my-4 flex flex-col px-2">
        <h1 className="text-gray-400 text-xs font-medium">Store</h1>
        <h2 className="text-gray-900 font-medium">Sport shop</h2>
      </div>
      <div className="space-y-2 py-4">
        <Button
          variant={router.asPath === "/admin" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/admin">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Link>
        </Button>
        <Button
          variant={router.asPath === "/admin/products" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/admin/products">
            <Tag className="h-4 w-4 mr-2" />
            Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
