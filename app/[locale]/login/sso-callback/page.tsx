"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { RippleLoader } from "@/components/ui/ripple-loader"

export default function SSOCallbackPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <RippleLoader size="lg" />
      <AuthenticateWithRedirectCallback />
      {/* Required for sign-up flows — Clerk bot protection */}
      <div id="clerk-captcha" />
    </div>
  )
}
