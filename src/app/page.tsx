import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AppLogoIcon from "@/components/app-logo-icon";
import Hero from "@/components/hero";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (token) {
    redirect("/home");
  }

  return (
    <div className="font-sans px-6 md:px-12 lg:px-24 pt-6">
      <div className="flex items-center pb-4 gap-1.5">
        <AppLogoIcon className="fill-current text-primary w-6" />
        <h1 className="font-bold text-xl">Twii</h1>
      </div>

      <Hero />
    </div>
  );
}
