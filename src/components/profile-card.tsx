"use client";
import Image from "next/image";
import { User } from "@/@types/users";
import { CalendarDays, UserPlus, UserMinus, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import clsx from "clsx";
import { getInitials } from "@/utils/string-formatter";

interface FollowActions {
  isFollowing: boolean;
  isLoading: boolean;
  toggleFollow: () => Promise<void>;
}
interface ProfileCardProps {
  user: User;
  isMyProfile: boolean;
  followActions?: FollowActions;
}
export default function ProfileCard({
  user,
  isMyProfile,
  followActions,
}: ProfileCardProps) {
  const memberSince = user.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy", { locale: ptBR })
    : "Data desconhecida";
  const postCount = user.Post?.length || 0;

  const renderActionButton = () => {
    if (isMyProfile) {
      return (
        <button
          onClick={() => console.log("Navegar para Edição de Perfil")}
          className="py-1.5 px-4 rounded-full font-semibold border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-1">
            <Edit className="w-4 h-4" />
            Editar Perfil
          </div>
        </button>
      );
    }
    if (followActions) {
      const { isFollowing, isLoading, toggleFollow } = followActions;
      return (
        <button
          onClick={toggleFollow}
          disabled={isLoading}
          className={clsx(
            "py-1.5 px-4 rounded-full font-semibold transition-colors duration-200 text-sm",
            isLoading && "opacity-70 cursor-not-allowed",
            isFollowing
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "border border-primary text-primary hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            "Aguarde..."
          ) : isFollowing ? (
            <div className="flex items-center gap-1">
              <UserMinus className="w-4 h-4" />
              Deixar de Seguir
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <UserPlus className="w-4 h-4" />
              Seguir
            </div>
          )}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden mb-6 shadow-md w-full">
      {/* Banner */}
      <div className="relative h-40 bg-gray-700/20 dark:bg-gray-700">
        <div className="flex items-center justify-center h-full text-gray-500 text-lg" />
      </div>

      <div className="p-4 relative">
        {/* Header (Avatar + Botão) */}
        <div className="flex justify-between items-start mb-4">
          {/* Avatar Container */}
          <div className="relative -mt-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-card bg-gray-800 overflow-hidden shadow-lg flex-shrink-0">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xl sm:text-2xl font-bold text-white">
                {getInitials(user.name)}
              </div>
            )}
          </div>

          <div className="pt-2">{renderActionButton()}</div>
        </div>

        <div className="sm:mt-0">
          <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            @{user.username}
          </p>
        </div>

        {user.bio && (
          <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed whitespace-pre-wrap">
            {user.bio}
          </p>
        )}

        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          <span>Membro desde {memberSince}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold">{user.following?.length || 0}</span>
            <span className="text-gray-500 dark:text-gray-400">Seguindo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{user.followers?.length || 0}</span>
            <span className="text-gray-500 dark:text-gray-400">Seguidores</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{postCount}</span>
            <span className="text-gray-500 dark:text-gray-400">Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
