"use client";

import { Post } from "@/@types/posts";
import { useLike } from "@/hooks/like/use-like";
import { useComment } from "@/hooks/comment/use-comment";
import { PostCard } from "./post-card";
import { CommentCard } from "./comment-card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PostDetailClientViewProps {
  initialPost: Post;
}

export function PostDetailClientView({
  initialPost,
}: PostDetailClientViewProps) {
  const { user } = useAuth();

  const {
    isLiked,
    likeCount,
  } = useLike({
    postId: initialPost.id,
    initialLikes: initialPost.likeCount,
    initialIsLiked: initialPost.isLikedByMe ?? false,
  });

  const {
    content,
    setContent,
    comments,
    isLoading: isCommenting,
    handleCommentSubmit,
  } = useComment({
    postId: initialPost.id,
    initialComments: initialPost.comments ?? [],
    initialCommentCount: initialPost.commentCount,
  });

  const updatedPost = { ...initialPost, isLikedByMe: isLiked, likeCount };

  return (
    <div className="space-y-6 w-full">
      <PostCard post={updatedPost} />

      <div className="px-5">
        <form onSubmit={handleCommentSubmit} className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Poste sua resposta"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isCommenting}
            rows={1}
            className="resize-none"
          />
          <Button type="submit" disabled={isCommenting || !content.trim()}>
            {isCommenting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Responder"
            )}
          </Button>
        </form>
      </div>

      <div className="flex flex-col">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
