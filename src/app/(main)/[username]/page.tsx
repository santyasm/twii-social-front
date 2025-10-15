import type { Metadata } from "next";
import ProfileClient from "./profile-client";
import { getCachedUserByUsername } from "@/utils/data-caching.ts";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  try {
    const user = await getCachedUserByUsername(username);

    if (!user) {
      return {
        title: "Usuário não encontrado • Twii",
        description: "O perfil solicitado não existe no Twii.",
        openGraph: { images: ["/og.png"] },
      };
    }

    const title = `${user.name} (@${user.username}) • Twii`;
    const description = user.bio || "Veja as publicações e perfil no Twii.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        url: `https://twii.yasminsantana.fun/${user.username}`,
        images: [
          {
            url: user.avatarUrl || "/og.png",
            width: 1200,
            height: 630,
            alt: `${user.name} profile image`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [user.avatarUrl || "/og.png"],
      },
    };
  } catch (error) {
    return {
      title: "Erro ao carregar perfil • Twii",
      description: "Ocorreu um erro ao tentar carregar o perfil.",
      openGraph: { images: ["/og.png"] },
    };
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  let userData = null;

  try {
    userData = await getCachedUserByUsername(username);
  } catch (error) {
    console.error("Erro ao carregar perfil para ProfilePage:", error);
  }

  return <ProfileClient initialUser={userData} />;
}
