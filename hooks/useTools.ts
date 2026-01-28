"use client"

import { useState, useEffect, useCallback } from "react"
import type { Tool } from "@/types"

interface UseToolsOptions {
  category?: string
  pricing?: string
  search?: string
}

interface UseToolsResult {
  tools: Tool[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTools(options: UseToolsOptions = {}): UseToolsResult {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTools = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (options.category && options.category !== "all") {
        params.append("category", options.category)
      }
      if (options.pricing && options.pricing !== "all") {
        params.append("pricing", options.pricing)
      }
      if (options.search) {
        params.append("search", options.search)
      }

      const url = `/api/tools${params.toString() ? `?${params.toString()}` : ""}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("獲取工具列表失敗")
      }

      const data = await response.json()
      setTools(data.tools || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤")
      // 如果 API 失敗，回退到靜態數據
      console.error("API 獲取失敗，使用靜態數據:", err)
    } finally {
      setIsLoading(false)
    }
  }, [options.category, options.pricing, options.search])

  useEffect(() => {
    fetchTools()
  }, [fetchTools])

  return {
    tools,
    isLoading,
    error,
    refetch: fetchTools,
  }
}
