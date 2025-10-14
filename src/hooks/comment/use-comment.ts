"use client";

import { useState, FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { twiiApi } from "@/lib/twii-api";
import { Comment } from "@/@types/comment";
import { useAuth } from "../auth/use-auth";

interface UseCommentProps {
  postId: string;
  initialComments?: Comment[];
  initialCommentCount?: number;
}

export const useComment = ({
  postId,
  initialComments = [],
  initialCommentCount = 0,
}: UseCommentProps) => {
  const { user } = useAuth();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleCommentSubmit = useCallback(
    async (event?: FormEvent) => {
      if (event) event.preventDefault();
      if (!content.trim() || isLoading || !user) return;

      setIsLoading(true);

      console.log(user);

      const tempComment: Comment = {
        id: `temp-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: user,
        authorId: user.id,
        postId,
      };

      setComments((prev) => [tempComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      const commentContent = content;
      setContent("");

      try {
        await twiiApi.commentPost(postId, {
          content: commentContent,
        });
      } catch (error) {
        toast.error("Erro ao adicionar seu comentário.");
        setComments((prev) => prev.filter((c) => c.id !== tempComment.id));
        setCommentCount((prev) => prev - 1);
        setContent(commentContent);
      } finally {
        setIsLoading(false);
      }
    },
    [content, isLoading, postId, user]
  );

  return {
    content,
    setContent,
    comments,
    commentCount,
    isLoading,
    handleCommentSubmit,
  };
};
