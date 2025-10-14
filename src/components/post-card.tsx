"use client";

import { Post } from "@/@types/posts";
import { formatPostDate } from "@/utils/date-formatter";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useLike } from "@/hooks/like/use-like";
import { twMerge } from "tailwind-merge";

const getInitials = (name: string) => {
  return name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);
};

export function PostCard(post: Post) {
  const { isLiked, likeCount, isLoading, toggleLike } = useLike({
    postId: post.id,
    initialLikes: post.likeCount,
    initialIsLiked: post.isLikedByMe ?? false,
  });

  return (
    <div className="bg-card rounded-2xl p-5 shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 rounded-full">
            <Link href={`/${post.author.username}`}>
              <AvatarImage
                src={post?.author?.avatarUrl}
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback>{getInitials(post?.author?.name)}</AvatarFallback>
            </Link>
          </Avatar>
          <div>
            <h4 className="text-sm">
              {post.author.name}
              <span className="dark:text-gray-400 text-gray-500 text-sm font-light ml-1">
                @{post?.author?.username}
              </span>
            </h4>
            <p className="text-gray-400 text-xs">
              {formatPostDate(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-300">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="my-4">
          <img
            src={post.imageUrl}
            alt="Imagem do post"
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-6">
          <button
            onClick={toggleLike}
            disabled={isLoading}
            className={twMerge(
              "flex items-center gap-2 transition-colors",
              isLiked
                ? "text-red-500 hover:text-red-400"
                : "text-gray-400 hover:text-red-500"
            )}
          >
            <Heart
              className={twMerge(
                "w-4 h-4 transition-transform",
                isLiked && "fill-red-500"
              )}
            />
            <span className="text-sm">{likeCount}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
