import SearchPageClient from "./search-page-client";
import { User } from "@/@types/users";
import { getCachedSearchProfiles } from "@/utils/data-caching.ts";

const getProfiles = async (query: string): Promise<User[] | []> => {
  try {
    const users = await getCachedSearchProfiles(query);

    return users;
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return [];
  }
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  let results: User[] = [];

  if (query) {
    results = await getProfiles(query);
  }

  return (
    <div
      className="
      flex w-full justify-center
      mx-auto
      pb-12
      "
    >
      <SearchPageClient profiles={results} query={query} />
    </div>
  );
}
