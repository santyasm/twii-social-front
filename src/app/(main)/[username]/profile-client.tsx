"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { twiiApi } from "@/lib/twii-api";
import { User } from "@/@types/users";
import ProfileCard from "@/components/profile-card";
import { RightSidebar } from "@/components/right-side-bar";
import { PostCard } from "@/components/post-card";

export default function ProfileClient() {
  const { username: routeUsername } = useParams() as { username: string };
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const isMyProfile = currentUser?.username === routeUsername;

  useEffect(() => {
    if (!routeUsername) return;

    const fetchProfile = async () => {
      setIsProfileLoading(true);
      try {
        const userData = await twiiApi.findUserByUsername(routeUsername);
        setViewedUser(userData);
      } catch {
        setViewedUser(null);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, [routeUsername]);

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
    <div className="flex flex-col xl:flex-row justify-center w-full gap-6">
      <main className="flex-1 flex flex-col gap-4">
        <ProfileCard user={viewedUser} />

        {viewedUser.Post && viewedUser.Post.length > 0 ? (
          viewedUser.Post.map((post) => (
            <PostCard key={post.id} {...post} author={viewedUser} />
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
