"use client"

import { useState } from "react"
import { FolderPlus, Loader2, Globe, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useCollections } from "@/contexts"

interface CreateCollectionDialogProps {
  trigger?: React.ReactNode
  onSuccess?: (collectionId: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateCollectionDialog({ trigger, onSuccess, open: controlledOpen, onOpenChange }: CreateCollectionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // 支援受控和非受控模式
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const { createCollection } = useCollections()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("請輸入合集名稱")
      return
    }

    setIsSubmitting(true)
    const collection = await createCollection({
      name: name.trim(),
      description: description.trim() || undefined,
      isPublic,
    })
    setIsSubmitting(false)

    if (collection) {
      setOpen(false)
      setName("")
      setDescription("")
      setIsPublic(false)
      onSuccess?.(collection.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 只在非受控模式下顯示觸發器 */}
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              建立合集
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            建立新合集
          </DialogTitle>
          <DialogDescription>
            建立一個新的工具合集來整理你喜歡的 AI 工具
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                合集名稱 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：我的最愛 AI 工具"
                maxLength={50}
              />
              <p className="text-xs text-foreground/50 text-right">{name.length}/50</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述（選填）</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="簡單描述這個合集的用途..."
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-foreground/50 text-right">{description.length}/200</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
              <div className="flex items-center gap-2">
                {isPublic ? (
                  <Globe className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-foreground/50" />
                )}
                <div>
                  <Label htmlFor="isPublic" className="cursor-pointer">
                    {isPublic ? "公開合集" : "私人合集"}
                  </Label>
                  <p className="text-xs text-foreground/50">
                    {isPublic ? "任何人都可以查看" : "只有你可以查看"}
                  </p>
                </div>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500" role="alert">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  建立中...
                </>
              ) : (
                "建立合集"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
