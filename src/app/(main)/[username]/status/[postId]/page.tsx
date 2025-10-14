import { twiiApi } from "@/lib/twii-api";
import { PostDetailClientView } from "@/components/post-detail-client-view";
import { notFound } from "next/navigation";
import { Post } from "@/@types/posts";
import { RightSidebar } from "@/components/right-side-bar";

interface PostPageProps {
  params: {
    username: string;
    postId: string;
  };
}

async function getPostData(postId: string): Promise<Post | null> {
  try {
    const post = await twiiApi.findPostById(postId);
    return post;
  } catch (error) {
    return null;
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
