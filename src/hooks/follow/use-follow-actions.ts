import { twiiApi } from "@/lib/twii-api";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseFollowActionsProps {
    userId: string;
    isInitiallyFollowing: boolean;
}

/**
 * Hook customizado para gerenciar as ações de follow e unfollow.
 *
 * @param userId 
 * @param isInitiallyFollowing 
 */
export function useFollowActions({ userId, isInitiallyFollowing }: UseFollowActionsProps) {
    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

    const [isLoading, setIsLoading] = useState(false);

    const toggleFollow = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        const previousFollowingState = isFollowing;

        setIsFollowing(!previousFollowingState);

        try {
            if (isFollowing) {
                await twiiApi.unfollow(userId);
                toast.success(`Você deixou de seguir o usuário.`);
            } else {
                await twiiApi.follow(userId);
                toast.success(`Você começou a seguir o usuário.`);
            }
        } catch (error) {
            console.error("Erro na ação de seguir/deixar de seguir:", error);
            setIsFollowing(previousFollowingState);
            toast.error(`Falha ao ${isFollowing ? 'deixar de seguir' : 'seguir'}. Tente novamente.`);
        } finally {
            setIsLoading(false);
        }
    }, [userId, isFollowing, isLoading]);

    return {
        isFollowing,
        isLoading,
        toggleFollow,
    };
}