"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Image as LImage, X } from "lucide-react";
import { User } from "@/@types/users";
import { twiiApi } from "@/lib/twii-api";
import { toast } from "sonner";
import { getInitials } from "@/utils/string-formatter";

const MAX_CHARS = 280;
const WARNING_THRESHOLD = 10;

export function CreatePostCard({
  user,
  onPostCreated,
}: {
  user: User;
  onPostCreated?: () => void;
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;
  const charsRemaining = MAX_CHARS - charCount;
  const isWarning = charsRemaining <= WARNING_THRESHOLD && charsRemaining >= 0;
  const isOverLimit = charsRemaining < 0;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
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
      setPreview(null);
      onPostCreated?.();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar post.");
    } finally {
      setLoading(false);
    }
  };

  let counterStyle = "text-gray-400";
  if (isWarning) counterStyle = "text-yellow-500";
  if (isOverLimit) counterStyle = "text-red-500 font-bold";

  if (!user) return null;

  return (
    <div className="bg-card rounded-2xl p-4 mb-6 shadow-md">
      <div className="flex gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatarUrl} className="rounded-full" />
          <AvatarFallback>
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="What is happening?"
          className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder:text-gray-500 
                     resize-none overflow-hidden h-auto pt-2"
          value={content}
          onChange={handleChange}
          maxLength={MAX_CHARS + 50}
        />
      </div>

      {preview && (
        <div className="relative mb-3">
          <img
            src={preview}
            alt="Preview da imagem"
            className="w-full max-h-96 object-cover rounded-xl border border-white/10"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
            <LImage className="w-4 h-4" />
            <span className="text-xs">Media Content</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          {(isWarning || isOverLimit) && (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${counterStyle} border-current text-xs`}
            >
              {charsRemaining}
            </div>
          )}

          {isOverLimit && (
            <span className="text-red-500 text-sm ml-2">Limite excedido!</span>
          )}

          <Button
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-9 rounded-lg"
            disabled={(charCount === 0 && !image) || isOverLimit || loading}
            onClick={handleSubmit}
          >
            {loading ? "Postando..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
