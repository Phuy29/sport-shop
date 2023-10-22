import { Session, authOptions } from "@/lib/next-auth";
import { USER_ROLE } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = (await getServerSession(req, res, authOptions)) as
    | Session
    | undefined;

  if (!session) {
    return { redirect: { permanent: false, destination: "/store" } };
  }

  const role = session.user.role;

  if (role === USER_ROLE.ADMIN) {
    return { redirect: { permanent: false, destination: "/admin" } };
  }

  return { redirect: { permanent: false, destination: "/store" } };
}

export default function Home() {
  return;
}
