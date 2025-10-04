"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Image as LImage } from "lucide-react";
import { User } from "@/@types/users";

const MAX_CHARS = 280;
const WARNING_THRESHOLD = 10;

export default function CreatePostCard({ user }: { user: User }) {
  const [content, setContent] = useState("");
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

  let counterStyle = "text-gray-400";
  if (isWarning) {
    counterStyle = "text-yellow-500";
  }
  if (isOverLimit) {
    counterStyle = "text-red-500 font-bold";
  }

  if (!!!user) {
    return;
  }

  return (
    <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-2xl p-4 mb-6">
      <div className="flex gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatarUrl} className="rounded-full" />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
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

      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
            <LImage className="w-4 h-4" />
            <span className="text-xs">Media Content</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* INDICADOR DE CONTAGEM REGRESSIVA */}
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
            disabled={charCount === 0 || isOverLimit}
            onClick={() => {
              console.log("Postando:", content);
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
