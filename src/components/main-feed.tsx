"use client";
import { useState } from "react";
import { useFeedPosts } from "@/hooks/posts/use-feed-posts";
import { CreatePostCard } from "./create-post-card";
import { PostCard } from "./post-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function MainFeed() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const { posts, isLoading, error } = useFeedPosts(activeTab === "following");


  const renderFeedContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-sm text-gray-400 mt-10 animate-pulse">
          Carregando...
        </p>
      );
    }

    if (error) {
      return (
        <p className="text-center text-sm text-red-500 mt-10">
          Erro ao carregar posts.
        </p>
      );
    }

    if (posts.length === 0) {
      return (
        <p className="text-center text-sm text-gray-500 mt-10">
          Nenhum post encontrado.
        </p>
      );
    }

    return posts.map((post) => <PostCard key={post.id} post={post} />);
  };

  return (
    <div className="w-full sm:mx-auto flex flex-col mx-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full justify-center mb-6">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>
      <CreatePostCard />

      <div className="flex flex-col gap-4 pb-22">{renderFeedContent()}</div>
    </div>
  );
}
