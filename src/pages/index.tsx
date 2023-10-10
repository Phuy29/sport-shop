import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return { redirect: { permanent: false, destination: "/login" } };
  }

  return { redirect: { permanent: false, destination: "/app" } };
}

export default function Home() {
  return;
}
