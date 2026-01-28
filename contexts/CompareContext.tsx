"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
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

// localStorage key
const COMPARE_STORAGE_KEY = 'ai-tool-hub-compare'

interface CompareProviderProps {
  children: ReactNode
}

export function CompareProvider({ children }: CompareProviderProps) {
  const [compareList, setCompareList] = useState<ToolBase[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 從 localStorage 讀取初始資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(COMPARE_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setCompareList(parsed.slice(0, MAX_COMPARE_ITEMS))
          }
        }
      } catch (error) {
        console.warn('Error reading compare list from localStorage:', error)
      }
      setIsInitialized(true)
    }
  }, [])

  // 當比較清單變化時，同步到 localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList))
      } catch (error) {
        console.warn('Error saving compare list to localStorage:', error)
      }
    }
  }, [compareList, isInitialized])

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
