"use client";

import { twiiApi } from "@/lib/twii-api";
import { useState } from "react";
import { toast } from "sonner";

interface UseLikeProps {
  postId: string;
  initialLikes: number;
  initialIsLiked: boolean;
}

/**
 * Hook customizado para gerenciar as ações de like e unlike.
 *
 * @param postId
 * @param initialLikes
 * @param initialIsLiked
 */
export function useLike({
  postId,
  initialLikes,
  initialIsLiked,
}: UseLikeProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await twiiApi.unlikePost(postId);
      } else {
        await twiiApi.likePost(postId);
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error("Erro ao processar sua curtida. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return { isLiked, likeCount, isLoading, toggleLike };
}
