"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_CONFIG, getApiUrl } from "@/lib/config";

const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verificando seu email...");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    if (typeof token !== "string") {
      setStatus("error");
      setMessage("Token de verificação inválido.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_EMAIL) +
            `?token=${encodeURIComponent(token)}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (response.ok) {
          setStatus("success");
          setMessage("Email verificado com sucesso! Sua conta está ativa.");
        } else {
          const errorData = await response.json();
          setStatus("error");
          setMessage(
            errorData.message ||
              "Falha na verificação do email. Tente novamente."
          );
        }
      } catch {
        setStatus("error");
        setMessage("Erro de conexão ao verificar o email.");
      }
    };

    verifyToken();
  }, [token]);

  const iconClass = "w-16 h-16 mb-6";
  const buttonClass =
    "px-6 py-3 font-semibold rounded-lg transition duration-150";

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        <p className="mt-4 text-lg">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center">
      <div className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-md w-full text-gray-900 dark:text-white">
        {status === "success" ? (
          <>
            <svg
              className={`${iconClass} text-green-500 mx-auto`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Sucesso!</h1>
          </>
        ) : (
          <>
            <svg
              className={`${iconClass} text-red-500 mx-auto`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Erro na Verificação</h1>
          </>
        )}

        <p className="text-gray-500 mb-8">{message}</p>

        <div className="flex flex-col space-y-4">
          <Link
            href="/auth/login"
            className={`${buttonClass} bg-primary text-white hover:bg-primary/90`}
          >
            Ir para o Login
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-center"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
