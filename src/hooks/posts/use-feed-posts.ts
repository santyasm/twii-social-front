import { Post } from "@/@types/posts";
import { useAuth } from "@/hooks/auth/use-auth";
import { twiiApi } from "@/lib/twii-api";
import { useEffect, useState } from "react";

export function useFeedPosts() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiCall = user ? twiiApi.getFeed() : twiiApi.findAllPosts();
            const response = await apiCall;

            if (Array.isArray(response)) {
                setPosts(response as Post[]);
            } else {
                setPosts([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user]);

    return { posts, isLoading, error, refetch: fetchPosts };
}