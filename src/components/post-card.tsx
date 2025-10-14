"use client";

import { useState, FC } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Post } from "@/@types/posts";
import { formatPostDate } from "@/utils/date-formatter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Loader2,
} from "lucide-react";
import { useLike } from "@/hooks/like/use-like";
import { useComment } from "@/hooks/comment/use-comment";
import { getInitials } from "@/utils/string-formatter";

const PostAvatar: FC<{
  username: string;
  name: string;
  avatarUrl?: string;
}> = ({ username, name, avatarUrl }) => (
  <Avatar className="w-10 h-10 rounded-full">
    <Link href={`/${username}`}>
      <AvatarImage
        src={avatarUrl}
        className="w-full h-full object-cover rounded-full"
      />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Link>
  </Avatar>
);

const PostContent: FC<{ post: Post }> = ({ post }) => (
  <Link
    href={`/${post?.author?.username}/status/${post.id}`}
    className="cursor-pointer"
  >
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
  </Link>
);

export const PostCard: FC<{ post: Post }> = ({ post }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const {
    isLiked,
    likeCount,
    isLoading: isLiking,
    toggleLike,
  } = useLike({
    postId: post?.id,
    initialLikes: post?.likeCount,
    initialIsLiked: post?.isLikedByMe ?? false,
  });

  const {
    content,
    setContent,
    commentCount,
    isLoading: isCommenting,
    handleCommentSubmit,
  } = useComment({
    postId: post?.id,
    initialCommentCount: post?.commentCount,
  });

  if (!post) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl p-5 shadow-md border border-border/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <PostAvatar
            username={post?.author.username}
            name={post?.author?.name}
            avatarUrl={post?.author.avatarUrl}
          />
          <div>
            <h4 className="text-sm">
              {post?.author?.name}
              <span className="dark:text-gray-400 text-gray-500 text-sm font-light ml-1">
                @{post?.author?.username}
              </span>
            </h4>
            <p className="text-gray-400 text-xs">
              {formatPostDate(post?.createdAt)}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-300">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <PostContent post={post} />

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-6">
          <button
            onClick={toggleLike}
            disabled={isLiking}
            className={twMerge(
              "flex items-center gap-2 transition-colors disabled:opacity-50",
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

          <button
            onClick={() => setIsCommentSectionOpen((prev) => !prev)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{commentCount}</span>
          </button>
        </div>
      </div>

      {isCommentSectionOpen && (
        <form
          onSubmit={handleCommentSubmit}
          className="flex items-start gap-2 pt-4"
        >
          <Textarea
            placeholder="Adicione um comentário..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none"
            rows={1}
            disabled={isCommenting}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isCommenting || !content.trim()}
          >
            {isCommenting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      )}
    </div>
  );
};
