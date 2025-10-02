"use client";

import { Suspense } from "react";
import VerifyEmailPage from "./verify-email-content";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
