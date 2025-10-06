import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import HomePageClient from "./home-page-client";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    redirect("/");
  }

  return <HomePageClient />;
}
