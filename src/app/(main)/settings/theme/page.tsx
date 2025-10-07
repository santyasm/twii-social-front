import ThemeToggle from "@/components/theme-toggle";


export default function ThemeSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-3">
        Tema e Visualização
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg">
        <div className="space-y-1">
          <p className="font-medium">Tema da Interface</p>
          <p className="text-gray-400 text-sm">Altere entre claro, escuro ou use a preferência do seu sistema.</p>
        </div>

        <div className="mt-4 sm:mt-0">
          <ThemeToggle />
        </div>
      </div>

    </div>
  );
}