"use client";

import Link from "next/link";
import { Search, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Footer from "./footer";
import { User } from "@/@types/users";
import { useEffect, useState, useCallback } from "react";
import { twiiApi } from "@/lib/twii-api";
import clsx from "clsx";
import { getInitials } from "@/utils/string-formatter";
import { useAuth } from "@/hooks/auth/use-auth";
import { toast } from "sonner";

interface UseFollowActionsProps {
  userId: string;
  isInitiallyFollowing: boolean;
  userName: string;
}

const useFollowActions = ({
  userId,
  isInitiallyFollowing,
  userName,
}: UseFollowActionsProps) => {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFollow = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousFollowingState = isFollowing;
    setIsFollowing(!previousFollowingState);

    try {
      if (previousFollowingState) {
        await twiiApi.unfollow(userId);
        toast.info(`Você deixou de seguir ${userName}.`);
      } else {
        await twiiApi.follow(userId);
        toast.info(`Você começou a seguir ${userName}.`);
      }
    } catch (error) {
      console.error("Erro na ação de seguir/deixar de seguir:", error);
      setIsFollowing(previousFollowingState);
      toast.info(
        `Falha ao ${
          previousFollowingState ? "deixar de seguir" : "seguir"
        } ${userName}. Tente novamente.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, isFollowing, isLoading, userName]);

  return {
    isFollowing,
    isLoading,
    toggleFollow,
  };
};

const UserSuggestionCard = ({
  user,
  currentUserId,
}: {
  user: User;
  currentUserId?: string;
}) => {
  const { isFollowing, isLoading, toggleFollow } = useFollowActions({
    userId: user.id,
    isInitiallyFollowing: user.isFollowedByMe || false,
    userName: user.name,
  });

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
        <p className="text-gray-400 text-xs truncate">@{user?.username}</p>
      </div>
      {showFollowButton && (
        <button
          className={clsx(
            "transition-all duration-200 cursor-pointer border px-3 rounded-sm text-[10px] py-1",
            "opacity-0 group-hover:opacity-100",
            isLoading && "opacity-50 cursor-not-allowed",
            isFollowing
              ? "text-gray-300 border-gray-500 hover:bg-gray-500/10"
              : "text-primary border-primary hover:bg-primary/10"
          )}
          onClick={toggleFollow}
          disabled={isLoading}
        >
          {isLoading ? "..." : isFollowing ? "Deixar de Seguir" : "Seguir"}
        </button>
      )}
    </div>
  );
};

export function RightSidebar() {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredUsers = users
    .filter((user) => user.id !== currentUser?.id)
    .slice(0, 5);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await twiiApi.findAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;
    fetchUsers();
  }, [isAuthLoading, currentUser?.id]);

  return (
    <aside
      className={clsx(
        "hidden sm:flex flex-col",
        "bg-card",
        "rounded-2xl shadow-md",
        "p-3 md:p-4",
        "w-[22vw] lg:w-[23vw]",
        "fixed right-28 top-4",
        "z-30",
        "overflow-y-auto",
        "transition-all duration-300"
      )}
    >
      <div className="rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Search</h3>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm text-gray-300 placeholder:text-gray-500 outline-none focus:border-white/20"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Sugestões</h3>
            <button className="text-gray-400 hover:text-gray-300 text-xs">
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-500 text-sm">Carregando...</p>
            ) : (
              filteredUsers.map((user) => (
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
