import { PostDetailClientView } from "@/components/post-detail-client-view";
import { notFound } from "next/navigation";
import { Post } from "@/@types/posts";
import { RightSidebar } from "@/components/right-side-bar";
import { getCachedPostById } from "@/utils/data-caching.ts";
import type { Metadata } from "next";

interface PostPageProps {
  params: {
    username: string;
    postId: string;
  };
}

async function getPostData(postId: string): Promise<Post | null> {
  try {
    const post = await getCachedPostById(postId);
    return post;
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string; postId: string };
}): Promise<Metadata> {
  const { postId } = params;

  try {
    const post = await getCachedPostById(postId);

    if (!post) {
      return {
        title: "Publicação não encontrada • Twii",
        description: "A publicação solicitada não existe ou foi removida.",
        openGraph: { images: ["/og.png"] },
      };
    }

    const authorName = post.author?.name || post.author?.username || "Usuário";
    const title = `Post de ${authorName} • Twii`;
    const description =
      post.content?.slice(0, 120) ||
      "Veja esta publicação e participe da conversa no Twii.";

    const imageUrl = post.imageUrl || post.author?.avatarUrl || "/og.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://twii.vercel.app/${post.author?.username}/status/${post.id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Post de ${authorName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Erro ao gerar metadata do post:", error);
    return {
      title: "Erro ao carregar publicação • Twii",
      description: "Ocorreu um erro ao tentar carregar esta publicação.",
      openGraph: { images: ["/og.png"] },
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostData(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full gap-6 sm:mx-0 mx-4 flex-row flex">
      <PostDetailClientView initialPost={post} />

      <aside className="hidden xl:block w-[21.5vw] flex-shrink-0">
        <RightSidebar />
      </aside>
    </div>
  );
}
