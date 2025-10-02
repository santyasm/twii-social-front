import AppLogoIcon from "@/components/app-logo-icon";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <AppLogoIcon className="fill-current text-primary" />
      <main className="flex flex-col gap-[32px] row-start-2 md:justify-center md:items-center items-start">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center sm:text-left">
          Welcome to <span className="bg-clip-text text-primary">Twii</span>
          {process.env.NEXT_PUBLIC_TWII_API_URL}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
          Conecte-se com pessoas ao redor do mundo. Compartilhe momentos, ideias
          e experiências na nossa rede social.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-center"
          >
            Criar Conta
          </Link>
        </div>
      </main>
    </div>
  );
}
