import React, { Suspense } from "react";
import AuthMainView from "@/mainViews/authMainView/AuthMainView";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-semibold text-secondary">Loading...</div>}>
      <AuthMainView type="reset-password" />
    </Suspense>
  );
}
