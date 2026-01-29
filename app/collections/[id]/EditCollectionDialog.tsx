"use client"

import { useState, useEffect } from "react"
import { Edit2, Loader2, Globe, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useCollections } from "@/contexts"
import { CollectionWithItems } from "@/types"

interface EditCollectionDialogProps {
  collection: CollectionWithItems
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (collection: CollectionWithItems) => void
}

export function EditCollectionDialog({ 
  collection, 
  open, 
  onOpenChange,
  onUpdate 
}: EditCollectionDialogProps) {
  const [name, setName] = useState(collection.name)
  const [description, setDescription] = useState(collection.description || "")
  const [isPublic, setIsPublic] = useState(collection.isPublic)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const { updateCollection } = useCollections()

  // 當對話框開啟時重置表單
  useEffect(() => {
    if (open) {
      setName(collection.name)
      setDescription(collection.description || "")
      setIsPublic(collection.isPublic)
      setError("")
    }
  }, [open, collection])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("請輸入合集名稱")
      return
    }

    setIsSubmitting(true)
    const updated = await updateCollection(collection.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      isPublic,
    })
    setIsSubmitting(false)

    if (updated) {
      onUpdate({
        ...collection,
        ...updated,
        items: collection.items,
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-primary" />
            編輯合集
          </DialogTitle>
          <DialogDescription>
            修改合集的名稱、描述或可見性設定
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                合集名稱 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：我的最愛 AI 工具"
                maxLength={50}
              />
              <p className="text-xs text-foreground/50 text-right">{name.length}/50</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">描述（選填）</Label>
              <Textarea
                id="edit-description"
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
                  <Label htmlFor="edit-isPublic" className="cursor-pointer">
                    {isPublic ? "公開合集" : "私人合集"}
                  </Label>
                  <p className="text-xs text-foreground/50">
                    {isPublic ? "任何人都可以查看" : "只有你可以查看"}
                  </p>
                </div>
              </div>
              <Switch
                id="edit-isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500" role="alert">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  更新中...
                </>
              ) : (
                "儲存變更"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
