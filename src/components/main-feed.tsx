"use client";
import { useAuth } from "@/hooks/auth/use-auth";
import { useFeedPosts } from "@/hooks/posts/use-feed-posts";
import { CreatePostCard } from "./create-post-card";
import { PostCard } from "./post-card";

export function MainFeed() {
  const { user } = useAuth();
  const { posts, isLoading, error } = useFeedPosts();

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
      {user && <CreatePostCard user={user} />}

      <div className="flex flex-col gap-4 pb-22">{renderFeedContent()}</div>
    </div>
  );
}
