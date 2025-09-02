"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Automatischer Redirect zur Dashboard-Seite
    router.replace("/dashboard")
  }, [router])

  // Loading state während des Redirects
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Weiterleitung zum Dashboard...</p>
      </div>
    </div>
  )
}