import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { name, username, currentBio } = await req.json();

        if (!name || !username) {
            return NextResponse.json(
                { error: "Nome e username são obrigatórios." },
                { status: 400 }
            );
        }

        const prompt = currentBio
            ? `
      Gere **uma única bio curta e criativa**, com **máximo 150 caracteres**, para um perfil social,
      inspirada nesta bio existente: "${currentBio}".
      Nome: ${name}
      Username: ${username}
      - Sem explicações, sem múltiplas opções, apenas o texto da bio.
      - Mantenha tom neutro e simpático, sem referências exageradas ou repetitivas.
      `
            : `
      Gere **uma única bio curta e criativa**, com **máximo 150 caracteres**, para um perfil social.
      Nome: ${name}
      Username: ${username}
      - Sem explicações, sem múltiplas opções, apenas o texto da bio.
      - Mantenha tom neutro e simpático.
      `;


        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente criativo que escreve bios curtas e cativantes.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const bio = response.choices[0]?.message?.content?.trim() || "";

        return NextResponse.json({ bio });
    } catch (error: any) {
        console.error("❌ Erro ao gerar bio:", error);
        return NextResponse.json(
            { error: "Erro ao gerar bio." },
            { status: 500 }
        );
    }
}
