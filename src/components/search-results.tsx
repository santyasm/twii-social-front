"use client";

import { User } from "@/@types/users";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/utils/string-formatter";
import { useAuth } from "@/hooks/auth/use-auth";
import { FollowButton } from "./follow-button";

interface SearchResultsProps {
  query: string;
  initialResults: User[];
}

export function SearchResults({ query, initialResults }: SearchResultsProps) {
  const { user: currentUser } = useAuth();

  if (!query) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>Comece a buscar por usuários na rede.</p>
      </div>
    );
  }

  if (initialResults.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>{`Nenhum resultado encontrado para "${query}".`}</p>
        <p className="text-sm">Tente buscar por outro termo.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {initialResults.map((profile) => {
        const showFollowButton = currentUser && currentUser.id !== profile.id;

        return (
          <div
            key={profile.id}
            className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/${profile.username}`}>
                  <p className="font-bold hover:underline">{profile.name}</p>
                  <p className="text-sm text-gray-500">@{profile.username}</p>
                  {profile?.bio && <p className="text-md">{profile.bio}</p>}
                </Link>
              </div>
            </div>

            {showFollowButton && (
              <FollowButton
                userId={profile.id}
                username={profile.username}
                isInitiallyFollowing={!!profile.isFollowedByMe}
                size="md"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
