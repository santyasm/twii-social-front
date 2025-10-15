"use client";

import { useFollowActions } from "@/hooks/follow/use-follow-actions";
import clsx from "clsx";
import { useState } from "react";

interface FollowButtonProps {
  userId: string;
  username: string;
  isInitiallyFollowing: boolean;
  size?: "sm" | "md" | "lg";
}

export function FollowButton({
  userId,
  username,
  isInitiallyFollowing,
  size = "sm",
}: FollowButtonProps) {
  const { isFollowing, isLoading, toggleFollow } = useFollowActions({
    userId,
    username,
    isInitiallyFollowing,
  });

  const [isHovered, setIsHovered] = useState(false);
  const showUnfollowState = isFollowing && isHovered;

  const sizeClasses = {
    sm: "px-3 py-1 text-[10px] rounded-sm",
    md: "px-4 py-1.5 text-xs rounded-md",
    lg: "px-5 py-2 text-sm rounded-lg",
  }[size];

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "transition-all duration-200 cursor-pointer border font-medium",
        sizeClasses,
        isLoading && "opacity-50 cursor-not-allowed",
        !isFollowing &&
          "text-primary border-primary hover:bg-primary/10 hover:text-primary",
        isFollowing &&
          (showUnfollowState
            ? "text-red-500 border-red-500 hover:bg-red-500/10"
            : "text-gray-300 border-gray-500 hover:bg-gray-500/10")
      )}
    >
      {isLoading
        ? "..."
        : showUnfollowState
        ? "Deixar de seguir"
        : isFollowing
        ? "Seguindo"
        : "Seguir"}
    </button>
  );
}
