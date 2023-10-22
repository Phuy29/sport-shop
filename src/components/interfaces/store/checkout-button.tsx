import React from "react";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CheckoutButton = () => {
  const router = useRouter();
  const session = useSession();

  return (
    <Button
      aria-label="Add to order"
      className="flex-none"
      onClick={() => {
        session.status === "unauthenticated"
          ? signIn()
          : router.push("/store/checkout");
      }}
    >
      Checkout
    </Button>
  );
};

export default CheckoutButton;
