"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export type UserRole = "USER" | "ADMIN"

interface UseUserRoleResult {
  role: UserRole | null
  isAdmin: boolean
  isLoading: boolean
}

export function useUserRole(): UseUserRoleResult {
  const { data: session, status } = useSession()
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      if (status === "loading") return
      
      if (!session?.user?.id) {
        setRole(null)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/user/role")
        if (response.ok) {
          const data = await response.json()
          setRole(data.role)
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRole()
  }, [session?.user?.id, status])

  return {
    role,
    isAdmin: role === "ADMIN",
    isLoading: isLoading || status === "loading",
  }
}
