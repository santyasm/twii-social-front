"use client";

import { useState } from "react";
import { twiiApi } from "@/lib/twii-api";
import { toast } from "sonner";

export function CreatePostForm({
  onPostCreated,
}: {
  onPostCreated?: () => void;
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("O conteúdo do post é obrigatório.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await twiiApi.createPost(formData);
      toast.success("Post criado com sucesso!");
      setContent("");
      setImage(null);
      onPostCreated?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#2d2d2d] rounded-2xl p-5 mb-6 flex flex-col gap-4"
    >
      <textarea
        placeholder="O que está acontecendo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-transparent text-white text-sm resize-none outline-none min-h-[80px] placeholder:text-gray-500"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="text-sm text-gray-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="self-end bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
