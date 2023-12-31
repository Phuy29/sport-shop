import Link from "next/link";
import {
  AvatarIcon,
  DashboardIcon,
  ExitIcon,
  GearIcon,
} from "@radix-ui/react-icons";

import { siteConfig } from "@/config/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MainNav } from "./main-nav";
import { useSession } from "next-auth/react";
import { USER_ROLE } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/stores/cart";
import { CartSheet } from "@/components/interfaces/store/cart-sheet";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useRouter } from "next/router";
export default function SiteHeader() {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const cartStore = useCartStore((state) => ({
    carts: state.carts,
  }));

  const totalQuantity = cartStore.carts.reduce(
    (acc, carts) => acc + carts.quantity,
    0
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
          <Button
              aria-label="Open cart"
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => router.push("/store/carts")}
            >
              {totalQuantity > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-2 -top-2 h-6 w-6 justify-center rounded-full p-2.5"
                >
                  {totalQuantity}
                </Badge>
              )}
              <Icons.cart className="h-4 w-4" aria-hidden="true" />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild disabled>
                      <Link href="/dashboard/account">
                        <AvatarIcon
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Account
                        <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === USER_ROLE.ADMIN && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <DashboardIcon
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Admin
                          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {/* <DropdownMenuItem asChild disabled>
                      <Link href="/dashboard/settings">
                        <GearIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild onClick={() => signOut()}>
                    <div>
                      <ExitIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="auth/signin"
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Sign In
                <span className="sr-only">Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
