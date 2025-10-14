"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { useParams } from "next/navigation";
import { useState } from "react";
import { User } from "@/@types/users";
import ProfileCard from "@/components/profile-card";
import { RightSidebar } from "@/components/right-side-bar";
import { PostCard } from "@/components/post-card";
import { useFollowActions } from "@/hooks/follow/use-follow-actions";

interface ProfileClientProps {
  initialUser: User | null;
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const { username: routeUsername } = useParams() as { username: string };
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  const [viewedUser] = useState<User | null>(initialUser);
  const [isProfileLoading] = useState(!initialUser);

  const isMyProfile = currentUser?.username === routeUsername;

  const isInitiallyFollowing = viewedUser?.isFollowedByMe ?? false;

  const followActions = useFollowActions({
    userId: viewedUser?.id || "",
    isInitiallyFollowing: isInitiallyFollowing,
    username: viewedUser?.username || "",
  });

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-gray-500 dark:text-gray-300">
          Carregando perfil...
        </p>
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <div className="text-center mt-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Usuário não encontrado
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          O perfil que você está tentando acessar não existe.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row justify-center w-full gap-6 sm:mx-0 mx-4">
      <main className="flex-1 flex flex-col gap-4 pb-22">
        <ProfileCard
          user={viewedUser}
          isMyProfile={isMyProfile}
          followActions={isMyProfile ? undefined : followActions}
        />

        {viewedUser.posts && viewedUser.posts.length > 0 ? (
          viewedUser.posts.map((post) => (
            <PostCard key={post.id} post={{ ...post, author: viewedUser }} />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
            Nenhum post encontrado.
          </p>
        )}
      </main>

      <aside className="hidden xl:block w-[21.5vw] flex-shrink-0">
        <RightSidebar />
      </aside>
    </div>
  );
}
