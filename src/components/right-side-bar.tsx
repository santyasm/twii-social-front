"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Footer from "./footer";
import { User } from "@/@types/users";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { twiiApi } from "@/lib/twii-api";
import clsx from "clsx";
import { getInitials } from "@/utils/string-formatter";
import { useAuth } from "@/hooks/auth/use-auth";
import { FollowButton } from "./follow-button";
import { useRouter } from "next/navigation";

interface UserSuggestionCardProps {
  user: User;
  currentUserId?: string;
}

const UserSuggestionCard = ({
  user,
  currentUserId,
}: UserSuggestionCardProps) => {
  const showFollowButton = currentUserId !== user.id;

  return (
    <div className="flex items-center gap-3 group">
      <Link href={`/${user.username}`}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatarUrl} className="object-cover" />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{user.name}</p>
        <p className="text-gray-400 text-xs truncate">@{user.username}</p>
      </div>

      {showFollowButton && (
        <FollowButton
          userId={user.id}
          username={user.name}
          isInitiallyFollowing={user.isFollowedByMe ?? false}
        />
      )}
    </div>
  );
};

export function RightSidebar() {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await twiiApi.findAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;
    fetchUsers();
  }, [isAuthLoading, currentUser?.id]);

  const suggestions = users
    .filter((user) => user.id !== currentUser?.id)
    .slice(0, 5);

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
    <aside
      className={clsx(
        "hidden sm:flex flex-col bg-card rounded-2xl shadow-md p-3 md:p-4",
        "w-[22vw] lg:w-[23vw] fixed right-28 top-4 z-30 overflow-y-auto transition-all duration-300"
      )}
    >
      <div className="rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Search</h3>
        </div>

        <form onSubmit={handleSubmit} className="relative nb-4">
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
        </form>

        <div className="p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Sugestões</h3>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-500 text-sm">Carregando...</p>
            ) : suggestions.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                Nenhum usuário sugerido.
              </p>
            ) : (
              suggestions.map((user) => (
                <UserSuggestionCard
                  key={user.id}
                  user={user}
                  currentUserId={currentUser?.id}
                />
              ))
            )}
          </div>
        </div>

        <Footer />
      </div>
    </aside>
  );
}
