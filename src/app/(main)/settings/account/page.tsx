"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twiiApi } from "@/lib/twii-api";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Carregando informações da conta...
      </div>
    );
  }

  async function handleDeleteAccount() {
    if (!user) return;

    const confirmed = confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await twiiApi.deleteUser(user.id);

      toast.success("Conta excluída com sucesso!");

      await logout();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir a conta. Tente novamente mais tarde.");
    } finally {
      setIsDeleting(false);
    }
  }

  const profileUrl = user ? `/${user.username}` : "/";

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-medium text-foreground">
          Informações básicas
        </h3>

        <Link
          href={profileUrl}
          className="flex justify-between items-center p-4 bg-muted rounded-lg transition-colors hover:bg-muted/80 cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-foreground font-medium">Editar Perfil</p>
            <p className="text-muted-foreground text-sm">
              Nome, nome de usuário, biografia e foto de perfil.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Link>

        {/* <Link
          href="/settings/email"
          className="flex justify-between items-center p-4 bg-muted rounded-lg transition-colors hover:bg-muted/80 cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-foreground font-medium">Email</p>
            <p className="text-muted-foreground text-sm">
              Altere o endereço de email associado à sua conta.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Link> */}

        {/* <Link
          href="/settings/password"
          className="flex justify-between items-center p-4 bg-muted rounded-lg transition-colors hover:bg-muted/80 cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-foreground font-medium">Alterar Senha</p>
            <p className="text-muted-foreground text-sm">
              Mantenha sua conta segura redefinindo sua senha regularmente.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Link> */}
      </section>

      {/* Seção de exclusão de conta */}
      <section className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-xl font-medium text-foreground">Ações de Conta</h3>

        <div className="flex justify-between items-center p-4 bg-destructive/10 rounded-lg">
          <div className="space-y-1">
            <p className="text-destructive font-medium">Excluir Conta</p>
            <p className="text-muted-foreground text-sm">
              Isto irá deletar permanentemente a sua conta e todos os seus dados.
            </p>
          </div>

          <Button
            variant="destructive"
            className="text-white"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
