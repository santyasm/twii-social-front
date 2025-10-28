"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { twiiApi } from "@/lib/twii-api";
import { toast } from "sonner";

export default function ProfileSettingsModal() {
  const router = useRouter();
  const { user, fetchCurrentUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || "");
    }
  }, [user]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await twiiApi.updateProfile(user.id, formData as any);
      await fetchCurrentUser();
      toast.success("Perfil atualizado com sucesso!");
      router.back();
    } catch (error) {
      toast.error("Não foi possível atualizar o perfil. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <form onSubmit={handleUpdateProfile}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold">
                Editar Perfil
              </DialogTitle>
              <DialogDescription>
                Atualize sua foto e detalhes pessoais aqui.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 space-y-4">
              <div className="flex justify-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar className="w-24 h-24 border-2 border-primary ">
                    <AvatarImage
                      src={avatarPreview || user?.avatarUrl}
                      className="object-cover"
                      alt={user?.name}
                    />
                    <AvatarFallback>
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  className="min-h-[100px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                <Button
                  type="button"
                  variant="secondary"
                  disabled={isGeneratingBio}
                  onClick={async () => {
                    try {
                      setIsGeneratingBio(true);
                      const res = await fetch("/api/generate-bio", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, username: user?.username, currentBio: user?.bio }),
                      });
                      const data = await res.json();
                      if (data.bio) {
                        setBio(data.bio);
                        toast.success("Bio gerada com sucesso!");
                      } else {
                        toast.error("Não foi possível gerar a bio.");
                      }
                    } catch {
                      toast.error("Erro ao gerar bio.");
                    } finally {
                      setIsGeneratingBio(false);
                    }
                  }}
                >
                  {isGeneratingBio ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerar bio com IA"}
                </Button>


              </div>
            </div>

            <DialogFooter className="bg-secondary/50 px-6 py-4 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar alterações
              </Button>
            </DialogFooter>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
