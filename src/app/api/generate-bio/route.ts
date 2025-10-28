import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {

        console.log("API KEY:", process.env.GROQ_API_KEY ? "OK" : "MISSING");

        const { name, username } = await req.json();

        if (!name || !username) {
            return NextResponse.json(
                { error: "Nome e username são obrigatórios." },
                { status: 400 }
            );
        }

        const prompt = `
      Gere uma bio curta e criativa (máximo 150 caracteres) para um perfil social.
      Nome: ${name}
      Username: ${username}
      Se não souber o gênero, mantenha um tom neutro.
      Seja simpático, humano e autêntico.
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
