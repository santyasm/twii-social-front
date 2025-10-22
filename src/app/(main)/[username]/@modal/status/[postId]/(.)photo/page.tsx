"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState, FC } from "react";
import Link from "next/link";
import { twiiApi } from "@/lib/twii-api";
import { Post } from "@/@types/posts";
import { useLike } from "@/hooks/like/use-like";
import { useComment } from "@/hooks/comment/use-comment";
import { useAuth } from "@/hooks/auth/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/utils/string-formatter";
import { formatPostDate } from "@/utils/date-formatter";
import { Heart, MessageCircle, Send, Loader2, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

const SidebarContent: FC<{ post: Post }> = ({ post }) => {
    const { user } = useAuth();

    const {
        isLiked,
        likeCount,
        isLoading: isLiking,
        toggleLike,
    } = useLike({
        postId: post.id,
        initialLikes: post.likeCount,
        initialIsLiked: post.isLikedByMe ?? false,
    });

    const {
        content: commentContent,
        setContent: setCommentContent,
        commentCount,
        isLoading: isCommenting,
        handleCommentSubmit,
    } = useComment({
        postId: post.id,
        initialCommentCount: post.commentCount,
    });

    return (
        <>
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Link href={`/${post.author.username}`}>
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={post.author.avatarUrl}
                                className="w-full h-full object-cover"
                            />
                            <AvatarFallback className="w-full h-full">
                                {getInitials(post.author.name)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div>
                        <h4 className="text-sm">
                            {post.author.name}
                            <span className="dark:text-gray-400 text-gray-500 text-sm font-light ml-1">
                                @{post.author.username}
                            </span>
                        </h4>
                        <p className="text-gray-400 text-xs">
                            {formatPostDate(post.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 hidden sm:block">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {post.content}
                </p>
                <div className="space-y-4">
                    {post.comments?.map((c) => (
                        <div key={c.id} className="flex gap-2 text-sm">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={c.author.avatarUrl} />
                                <AvatarFallback>{getInitials(c.author.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="font-semibold">@{c.author.username}</span>
                                <p className="text-gray-400">{c.content}</p>
                            </div>
                        </div>
                    ))}
                    {post.comments?.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">
                            Nenhum comentário ainda.
                        </p>
                    )}
                </div>
            </div>


            <div className="p-4 border-t border-border/50 space-y-4">
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
                                "w-5 h-5 transition-transform",
                                isLiked && "fill-red-500"
                            )}
                        />
                        <span className="text-sm">{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-400">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{commentCount}</span>
                    </div>
                </div>
                <form onSubmit={handleCommentSubmit} className="sm:flex items-start gap-2 hidden">
                    <Avatar className="w-9 h-9 mt-1">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
                    </Avatar>
                    <Textarea
                        placeholder="Adicione um comentário..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="resize-none"
                        rows={1}
                        disabled={isCommenting}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isCommenting || !commentContent.trim()}
                    >
                        {isCommenting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </>
    );
};

export default function PhotoModal({
    params,
}: {
    params: { username: string; postId: string };
}) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const data = await twiiApi.findPostById(params.postId);
                setPost(data);
            } catch (error) {
                console.error("Erro ao buscar post:", error);
                router.back();
            } finally {
                setIsLoading(false);
            }
        };
        if (params.postId) {
            fetchPost();
        }
    }, [params.postId, router]);

    const handleClose = () => {
        router.back();
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:text-white/80"
                onClick={handleClose}
            >
                <X className="w-6 h-6" />
            </Button>

            <motion.div
                className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
            >
                <div className="flex-1 bg-black flex items-center justify-center relative">
                    {isLoading && (
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    )}
                    {post?.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt="Imagem do post"
                            className="object-contain w-full h-full max-h-[60vh] md:max-h-[90vh]"
                        />
                    )}
                </div>

                <div className="w-full md:w-[400px] flex flex-col max-h-[90vh]">
                    {isLoading || !post ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : (
                        <SidebarContent post={post} />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}