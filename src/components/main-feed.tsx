"use client";

import { twiiApi } from "@/lib/twii-api";
import { useEffect } from "react";
import { useState } from "react";
import { Post } from "@/@types/posts";
import { PostCard } from "./post-card";

export function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await twiiApi.findAllPosts();

      if (Array.isArray(response)) {
        setPosts(response as Post[]);
      } else {
        setPosts([]);
        console.warn("API response is not an array:", response);
      }
      console.log("Posts encontrados:", response);
    } catch (error) {
      console.warn("Não foi possível buscar posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  });

  return (
    <div className="max-w-2xl w-full py-6">
      {/* Create Post */}

      {/* Sort */}
      <div className="mb-4">
        <button className="text-xs text-gray-400 hover:text-gray-300">
          Sort by: Following ▾
        </button>
      </div>

      {/* Post */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
