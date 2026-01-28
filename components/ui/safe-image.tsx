"use client"

import Image from "next/image"
import { useState } from "react"
import { ImageOff } from "lucide-react"

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  width: number
  height: number
  className?: string
  fallbackClassName?: string
}

/**
 * 安全的圖片組件，帶有錯誤處理和 fallback
 * 當圖片載入失敗時顯示預設的 placeholder
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackClassName = "",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 如果沒有 src 或已經載入失敗，顯示 fallback
  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${fallbackClassName || className}`}
        style={{ width, height }}
      >
        <ImageOff className="w-6 h-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-muted animate-pulse ${fallbackClassName || className}`}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        unoptimized // 對於用戶提交的圖片，跳過 Next.js 的圖片優化以避免問題
      />
    </div>
  )
}
