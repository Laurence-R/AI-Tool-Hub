"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface FavoritesContextType {
  // 收藏清單 (存儲 tool IDs)
  favorites: string[]
  // 加入收藏
  addToFavorites: (toolId: string) => void
  // 從收藏移除
  removeFromFavorites: (toolId: string) => void
  // 切換收藏狀態
  toggleFavorite: (toolId: string) => void
  // 檢查工具是否已收藏
  isFavorite: (toolId: string) => boolean
  // 收藏數量
  favoritesCount: number
  // 載入狀態
  isLoading: boolean
  // 同步狀態
  isSyncing: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// localStorage key 前綴
const FAVORITES_STORAGE_PREFIX = 'ai-tool-hub-favorites'

// 根據用戶 ID 生成 localStorage key
const getFavoritesStorageKey = (userId: string) => `${FAVORITES_STORAGE_PREFIX}-${userId}`

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  
  // 追蹤當前用戶 ID，用於檢測用戶切換
  const currentUserIdRef = useRef<string | null>(null)
  const isInitializedRef = useRef(false)

  // 從 localStorage 載入收藏
  const loadFromLocalStorage = useCallback((key: string): string[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.map(String)
        }
      }
    } catch (error) {
      console.warn('Error reading favorites from localStorage:', error)
    }
    return []
  }, [])

  // 儲存到 localStorage
  const saveToLocalStorage = useCallback((key: string, data: string[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Error saving favorites to localStorage:', error)
    }
  }, [])

  // 處理用戶狀態變化（登入/登出/切換帳號）
  useEffect(() => {
    const userId = session?.user?.id || null
    const previousUserId = currentUserIdRef.current
    
    // 如果用戶改變（包括登出）
    if (userId !== previousUserId) {
      currentUserIdRef.current = userId
      isInitializedRef.current = true
      
      if (status === 'authenticated' && userId) {
        // 已登入：從後端載入收藏
        loadFavoritesFromServer()
      } else if (status === 'unauthenticated') {
        // 未登入：清空收藏（因為未登入用戶無法使用收藏功能）
        setFavorites([])
      }
    }
  }, [status, session?.user?.id])

  // 從後端載入收藏
  const loadFavoritesFromServer = async () => {
    if (!session?.user?.id) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        const serverFavorites: string[] = data.favorites || []
        setFavorites(serverFavorites)
        
        // 同時更新 localStorage（用於離線體驗）
        saveToLocalStorage(getFavoritesStorageKey(session.user.id), serverFavorites)
      }
    } catch (error) {
      console.error('Error loading favorites from server:', error)
      // 如果載入失敗，嘗試從 localStorage 恢復
      const cached = loadFromLocalStorage(getFavoritesStorageKey(session.user.id))
      setFavorites(cached)
    } finally {
      setIsLoading(false)
    }
  }

  // 當收藏清單變化時，同步到 localStorage（僅限已登入用戶）
  useEffect(() => {
    if (isInitializedRef.current && session?.user?.id && typeof window !== 'undefined') {
      saveToLocalStorage(getFavoritesStorageKey(session.user.id), favorites)
    }
  }, [favorites, session?.user?.id, saveToLocalStorage])

  // 加入收藏
  const addToFavorites = useCallback(async (toolId: string) => {
    // 樂觀更新 UI
    setFavorites(prev => {
      if (prev.includes(toolId)) return prev
      return [...prev, toolId]
    })

    // 如果已登入，同步到後端
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId }),
        })
        
        if (!response.ok) {
          // 如果失敗，回滾 UI
          setFavorites(prev => prev.filter(id => id !== toolId))
          console.error('Failed to add favorite to server')
        }
      } catch (error) {
        // 如果失敗，回滾 UI
        setFavorites(prev => prev.filter(id => id !== toolId))
        console.error('Error adding favorite:', error)
      }
    }
  }, [status])

  // 從收藏移除
  const removeFromFavorites = useCallback(async (toolId: string) => {
    // 樂觀更新 UI
    setFavorites(prev => prev.filter(id => id !== toolId))

    // 如果已登入，同步到後端
    if (status === 'authenticated') {
      try {
        const response = await fetch(`/api/favorites?toolId=${toolId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          // 如果失敗，回滾 UI
          setFavorites(prev => [...prev, toolId])
          console.error('Failed to remove favorite from server')
        }
      } catch (error) {
        // 如果失敗，回滾 UI
        setFavorites(prev => [...prev, toolId])
        console.error('Error removing favorite:', error)
      }
    }
  }, [status])

  // 切換收藏狀態
  const toggleFavorite = useCallback((toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFromFavorites(toolId)
    } else {
      addToFavorites(toolId)
    }
  }, [favorites, addToFavorites, removeFromFavorites])

  // 檢查工具是否已收藏
  const isFavorite = useCallback((toolId: string): boolean => {
    return favorites.includes(toolId)
  }, [favorites])

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
    isLoading,
    isSyncing,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Hook for using favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
