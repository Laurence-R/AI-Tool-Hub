"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
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

// localStorage key
const FAVORITES_STORAGE_KEY = 'ai-tool-hub-favorites'

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // 從 localStorage 讀取初始資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            // 轉換為字串陣列（向後兼容）
            setFavorites(parsed.map(String))
          }
        }
      } catch (error) {
        console.warn('Error reading favorites from localStorage:', error)
      }
      setIsInitialized(true)
    }
  }, [])

  // 當使用者登入時，從後端載入收藏並同步
  useEffect(() => {
    if (status === 'authenticated' && session?.user && isInitialized) {
      loadAndSyncFavorites()
    }
  }, [status, session, isInitialized])

  // 從後端載入收藏並與本地合併
  const loadAndSyncFavorites = async () => {
    setIsLoading(true)
    setIsSyncing(true)
    try {
      // 取得本地收藏
      const localFavorites = [...favorites]
      
      // 從後端載入收藏
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        const serverFavorites: string[] = data.favorites || []
        
        // 合併本地和伺服器收藏（去重）
        const merged = Array.from(new Set([...serverFavorites, ...localFavorites]))
        
        // 如果本地有新的收藏，同步到伺服器
        const newLocalFavorites = localFavorites.filter(id => !serverFavorites.includes(id))
        if (newLocalFavorites.length > 0) {
          await fetch('/api/favorites/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolIds: newLocalFavorites }),
          })
        }
        
        setFavorites(merged)
      }
    } catch (error) {
      console.error('Error loading favorites from server:', error)
    } finally {
      setIsLoading(false)
      setIsSyncing(false)
    }
  }

  // 當收藏清單變化時，同步到 localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.warn('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites, isInitialized])

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
