"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

// 最大搜尋歷史數量
const MAX_SEARCH_HISTORY = 10

interface SearchContextType {
  // 搜尋歷史
  searchHistory: string[]
  // 新增搜尋歷史
  addToHistory: (query: string) => void
  // 移除單個歷史
  removeFromHistory: (query: string) => void
  // 清空搜尋歷史
  clearHistory: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// localStorage key
const SEARCH_HISTORY_KEY = 'ai-tool-hub-search-history'

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 從 localStorage 讀取初始資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setSearchHistory(parsed.slice(0, MAX_SEARCH_HISTORY))
          }
        }
      } catch (error) {
        console.warn('Error reading search history from localStorage:', error)
      }
      setIsInitialized(true)
    }
  }, [])

  // 當搜尋歷史變化時，同步到 localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory))
      } catch (error) {
        console.warn('Error saving search history to localStorage:', error)
      }
    }
  }, [searchHistory, isInitialized])

  // 新增搜尋歷史
  const addToHistory = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    setSearchHistory(prev => {
      // 移除重複項
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase())
      // 加到開頭，並限制數量
      return [trimmed, ...filtered].slice(0, MAX_SEARCH_HISTORY)
    })
  }, [])

  // 移除單個歷史
  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory(prev => prev.filter(item => item !== query))
  }, [])

  // 清空搜尋歷史
  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  const value: SearchContextType = {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

// Hook for using search context
export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
