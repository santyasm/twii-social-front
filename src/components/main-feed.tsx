"use client";

import { Post } from "@/@types/posts";
import { useAuth } from "@/hooks/auth/use-auth";
import { twiiApi } from "@/lib/twii-api";
import { useEffect, useState } from "react";
import { CreatePostCard } from "./create-post-card";
import { PostCard } from "./post-card";

export function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await twiiApi.findAllPosts();
      if (Array.isArray(response)) setPosts(response as Post[]);
      else setPosts([]);
    } catch {
      console.warn("Não foi possível buscar posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full mx-auto flex flex-col">
      {user && <CreatePostCard user={user} />}

      <div className="flex flex-col gap-4 pb-10">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} {...post} />)
        ) : (
          <p className="text-center text-sm text-gray-500 mt-10">
            Nenhum post encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
