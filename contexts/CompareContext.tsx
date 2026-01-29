"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react'
import { useSession } from 'next-auth/react'
import type { ToolBase } from '@/types'

// 最大比較數量
export const MAX_COMPARE_ITEMS = 4

interface CompareContextType {
  // 比較清單
  compareList: ToolBase[]
  // 加入比較
  addToCompare: (tool: ToolBase) => boolean
  // 從比較移除
  removeFromCompare: (toolId: number) => void
  // 清空比較清單
  clearCompare: () => void
  // 檢查工具是否在比較清單中
  isInCompare: (toolId: number) => boolean
  // 是否已達上限
  isFull: boolean
  // 比較數量
  compareCount: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

// localStorage key 前綴
const COMPARE_STORAGE_PREFIX = 'ai-tool-hub-compare'

// 根據用戶 ID 生成 localStorage key
const getCompareStorageKey = (userId: string) => `${COMPARE_STORAGE_PREFIX}-${userId}`

interface CompareProviderProps {
  children: ReactNode
}

export function CompareProvider({ children }: CompareProviderProps) {
  const { data: session, status } = useSession()
  const [compareList, setCompareList] = useState<ToolBase[]>([])
  
  // 追蹤當前用戶 ID，用於檢測用戶切換
  const currentUserIdRef = useRef<string | null>(null)
  const isInitializedRef = useRef(false)

  // 從 localStorage 載入比較清單
  const loadFromLocalStorage = useCallback((key: string): ToolBase[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_COMPARE_ITEMS)
        }
      }
    } catch (error) {
      console.warn('Error reading compare list from localStorage:', error)
    }
    return []
  }, [])

  // 儲存到 localStorage
  const saveToLocalStorage = useCallback((key: string, data: ToolBase[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Error saving compare list to localStorage:', error)
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
        // 已登入：從 localStorage 載入該用戶的比較清單
        const savedCompareList = loadFromLocalStorage(getCompareStorageKey(userId))
        setCompareList(savedCompareList)
      } else if (status === 'unauthenticated') {
        // 未登入：清空比較清單（因為未登入用戶無法使用比較功能）
        setCompareList([])
      }
    }
  }, [status, session?.user?.id, loadFromLocalStorage])

  // 當比較清單變化時，同步到 localStorage（僅限已登入用戶）
  useEffect(() => {
    if (isInitializedRef.current && session?.user?.id && typeof window !== 'undefined') {
      saveToLocalStorage(getCompareStorageKey(session.user.id), compareList)
    }
  }, [compareList, session?.user?.id, saveToLocalStorage])

  // 加入比較
  const addToCompare = useCallback((tool: ToolBase): boolean => {
    // 檢查是否已達上限
    if (compareList.length >= MAX_COMPARE_ITEMS) {
      return false
    }
    // 檢查是否已存在
    if (compareList.some(t => t.id === tool.id)) {
      return false
    }
    setCompareList(prev => [...prev, tool])
    return true
  }, [compareList])

  // 從比較移除
  const removeFromCompare = useCallback((toolId: number) => {
    setCompareList(prev => prev.filter(t => t.id !== toolId))
  }, [])

  // 清空比較清單
  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  // 檢查工具是否在比較清單中
  const isInCompare = useCallback((toolId: number): boolean => {
    return compareList.some(t => t.id === toolId)
  }, [compareList])

  const value: CompareContextType = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    isFull: compareList.length >= MAX_COMPARE_ITEMS,
    compareCount: compareList.length,
  }

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

// Hook for using compare context
export function useCompare() {
  const context = useContext(CompareContext)
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
