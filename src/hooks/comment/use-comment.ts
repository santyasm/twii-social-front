"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { twiiApi } from "@/lib/twii-api";

interface UseCommentProps {
  postId: string;
  initialCommentCount: number;
}

/**
 * Hook customizado para gerenciar a criação de comentários em um post.
 *
 * @param postId
 * @param initialCommentCount
 */
export const useComment = ({
  postId,
  initialCommentCount,
}: UseCommentProps) => {
  const [content, setContent] = useState("");
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleCommentSubmit = async (event?: FormEvent) => {
    if (event) event.preventDefault();

    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    const previousCommentCount = commentCount;
    setCommentCount((prev) => prev + 1);
    const commentContent = content;
    setContent("");
    try {
      await twiiApi.commentPost(postId, { content: commentContent });
      toast.success("Seu comentário foi adicionado!");
    } catch (error) {
      toast.error("Erro ao adicionar seu comentário.");
      setCommentCount(previousCommentCount);
      setContent(commentContent);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    content,
    setContent,
    commentCount,
    isLoading,
    handleCommentSubmit,
  };
};
