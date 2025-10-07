import Link from "next/link";

export default function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-left md:text-center">
        Bem-vindo ao <span className="bg-clip-text text-primary">Twii</span>
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-400 text-left md:text-center max-w-2xl">
        Conecte-se com pessoas ao redor do mundo. Compartilhe momentos, ideias e
        experiências na nossa rede social.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 w-full sm:w-auto">
        <Link
          href="/login"
          className="px-6 py-3 bg-primary text-gray-900 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center w-full sm:w-40"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-gray-900 transition-colors text-center w-full sm:w-40"
        >
          Criar Conta
        </Link>
      </div>
    </main>
  );
}
