import type { Metadata } from "next";
import ProfileClient from "./profile-client";
import { twiiApi } from "@/lib/twii-api";


export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  try {
    const user = await twiiApi.findUserByUsername(username);

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
        url: `https://twii.vercel.app/${user.username}`,
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
    console.error("Erro ao gerar metadata:", error);
    return {
      title: "Erro ao carregar perfil • Twii",
      description: "Ocorreu um erro ao tentar carregar o perfil.",
      openGraph: { images: ["/og.png"] },
    };
  }
}

export default function ProfilePage() {
  return <ProfileClient />;
}
