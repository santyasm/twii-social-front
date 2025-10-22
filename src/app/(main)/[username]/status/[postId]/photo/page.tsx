import { redirect } from "next/navigation";

export default async function PhotoPageOnRefresh({
    params,
}: {
    params: { username: string; postId: string };
}) {
    const postPageUrl = `/${params.username}/status/${params.postId}`;

    redirect(postPageUrl);

    return null;
}