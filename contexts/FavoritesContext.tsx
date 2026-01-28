"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface FavoritesContextType {
  // 收藏清單 (存儲 tool IDs)
  favorites: number[]
  // 加入收藏
  addToFavorites: (toolId: number) => void
  // 從收藏移除
  removeFromFavorites: (toolId: number) => void
  // 切換收藏狀態
  toggleFavorite: (toolId: number) => void
  // 檢查工具是否已收藏
  isFavorite: (toolId: number) => boolean
  // 收藏數量
  favoritesCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// localStorage key
const FAVORITES_STORAGE_KEY = 'ai-tool-hub-favorites'

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 從 localStorage 讀取初始資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setFavorites(parsed)
          }
        }
      } catch (error) {
        console.warn('Error reading favorites from localStorage:', error)
      }
      setIsInitialized(true)
    }
  }, [])

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
  const addToFavorites = useCallback((toolId: number) => {
    setFavorites(prev => {
      if (prev.includes(toolId)) return prev
      return [...prev, toolId]
    })
  }, [])

  // 從收藏移除
  const removeFromFavorites = useCallback((toolId: number) => {
    setFavorites(prev => prev.filter(id => id !== toolId))
  }, [])

  // 切換收藏狀態
  const toggleFavorite = useCallback((toolId: number) => {
    setFavorites(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId)
      }
      return [...prev, toolId]
    })
  }, [])

  // 檢查工具是否已收藏
  const isFavorite = useCallback((toolId: number): boolean => {
    return favorites.includes(toolId)
  }, [favorites])

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
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
