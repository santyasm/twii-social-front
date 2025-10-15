"use client";

import { useState, FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/@types/users";
import { SearchResults } from "@/components/search-results";
import { Loader2, Search } from "lucide-react";

interface SearchPageClientProps {
  query: string;
  profiles: User[];
}

export default function SearchPageClient({
  query,
  profiles,
}: SearchPageClientProps) {
  const [inputValue, setInputValue] = useState(query);
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    startTransition(() => {
      if (trimmedValue) {
        router.push(`/search?q=${trimmedValue}`);
      } else {
        router.push("/search");
      }
    });
  };

  return (
    <div className="w-full lg:px-1 px-4">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          id="q"
          name="q"
          placeholder="Buscar perfis..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isPending}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm text-gray-300 placeholder:text-gray-500 outline-none focus:border-white/20"
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </form>

      {!isPending && <SearchResults initialResults={profiles} query={query} />}
    </div>
  );
}
