"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Collection, CreateCollectionData, UpdateCollectionData } from "@/types"

interface CollectionsContextType {
  // 我的合集
  myCollections: Collection[]
  isLoading: boolean
  // 操作
  fetchMyCollections: () => Promise<void>
  createCollection: (data: CreateCollectionData) => Promise<Collection | null>
  updateCollection: (id: string, data: UpdateCollectionData) => Promise<Collection | null>
  deleteCollection: (id: string) => Promise<boolean>
  addToolToCollection: (collectionId: string, toolId: number | string, note?: string) => Promise<boolean>
  removeToolFromCollection: (collectionId: string, toolId: number | string) => Promise<boolean>
  // 工具函數
  isToolInCollection: (collectionId: string, toolId: number | string) => boolean
  getCollectionsWithTool: (toolId: number | string) => Collection[]
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [myCollections, setMyCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 取得我的合集
  const fetchMyCollections = useCallback(async () => {
    if (!session?.user?.id) {
      setMyCollections([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/collections?type=my")
      if (response.ok) {
        const data = await response.json()
        setMyCollections(data.collections)
      }
    } catch (error) {
      console.error("取得合集失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // 建立合集
  const createCollection = useCallback(async (data: CreateCollectionData): Promise<Collection | null> => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "建立合集失敗")
        return null
      }

      setMyCollections((prev) => [result.collection, ...prev])
      toast.success("合集建立成功")
      return result.collection
    } catch (error) {
      console.error("建立合集失敗:", error)
      toast.error("建立合集失敗")
      return null
    }
  }, [])

  // 更新合集
  const updateCollection = useCallback(async (id: string, data: UpdateCollectionData): Promise<Collection | null> => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "更新合集失敗")
        return null
      }

      setMyCollections((prev) =>
        prev.map((c) => (c.id === id ? result.collection : c))
      )
      toast.success("合集更新成功")
      return result.collection
    } catch (error) {
      console.error("更新合集失敗:", error)
      toast.error("更新合集失敗")
      return null
    }
  }, [])

  // 刪除合集
  const deleteCollection = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        toast.error(result.error || "刪除合集失敗")
        return false
      }

      setMyCollections((prev) => prev.filter((c) => c.id !== id))
      toast.success("合集刪除成功")
      return true
    } catch (error) {
      console.error("刪除合集失敗:", error)
      toast.error("刪除合集失敗")
      return false
    }
  }, [])

  // 新增工具到合集
  const addToolToCollection = useCallback(async (
    collectionId: string,
    toolId: number | string,
    note?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, note }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "加入合集失敗")
        return false
      }

      // 更新本地狀態
      setMyCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            const numericToolId = typeof toolId === "string" ? parseInt(toolId) : toolId
            return {
              ...c,
              itemCount: c.itemCount + 1,
              toolIds: [...c.toolIds, numericToolId],
            }
          }
          return c
        })
      )

      toast.success("已加入合集")
      return true
    } catch (error) {
      console.error("加入合集失敗:", error)
      toast.error("加入合集失敗")
      return false
    }
  }, [])

  // 從合集移除工具
  const removeToolFromCollection = useCallback(async (
    collectionId: string,
    toolId: number | string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "移除失敗")
        return false
      }

      // 更新本地狀態
      setMyCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            const numericToolId = typeof toolId === "string" ? parseInt(toolId) : toolId
            return {
              ...c,
              itemCount: c.itemCount - 1,
              toolIds: c.toolIds.filter((id) => id !== numericToolId),
            }
          }
          return c
        })
      )

      toast.success("已從合集移除")
      return true
    } catch (error) {
      console.error("移除失敗:", error)
      toast.error("移除失敗")
      return false
    }
  }, [])

  // 檢查工具是否在合集中
  const isToolInCollection = useCallback((collectionId: string, toolId: number | string): boolean => {
    const numericToolId = typeof toolId === "string" ? parseInt(toolId) : toolId
    const collection = myCollections.find((c) => c.id === collectionId)
    return collection ? collection.toolIds.includes(numericToolId) : false
  }, [myCollections])

  // 取得包含指定工具的所有合集
  const getCollectionsWithTool = useCallback((toolId: number | string): Collection[] => {
    const numericToolId = typeof toolId === "string" ? parseInt(toolId) : toolId
    return myCollections.filter((c) => c.toolIds.includes(numericToolId))
  }, [myCollections])

  return (
    <CollectionsContext.Provider
      value={{
        myCollections,
        isLoading,
        fetchMyCollections,
        createCollection,
        updateCollection,
        deleteCollection,
        addToolToCollection,
        removeToolFromCollection,
        isToolInCollection,
        getCollectionsWithTool,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  )
}

export function useCollections() {
  const context = useContext(CollectionsContext)
  if (!context) {
    throw new Error("useCollections must be used within CollectionsProvider")
  }
  return context
}
