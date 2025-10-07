'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const settingsNav = [
  { name: 'Sua conta', href: '/settings/account' },
  { name: 'Tema e Visualização', href: '/settings/theme' },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto py-8 px-4 w-full max-w-6xl mt-6">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
        Configurações
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navegação lateral */}
        <nav className="flex-shrink-0 w-full md:w-64">
          <ul className="space-y-2">
            {settingsNav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-gray-500 hover:text-primary hover:bg-white/5'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Conteúdo da subpágina */}
        <main className="flex-grow bg-card rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          {children}
        </main>
      </div>
    </div>
  );
}
