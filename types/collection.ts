// 合集相關類型定義

export interface Collection {
  id: string
  userId: string
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  itemCount: number
  toolIds: number[]
  isOwner?: boolean
}

export interface CollectionItem {
  id: string
  collectionId: string
  toolId: number
  note: string | null
  order: number
  createdAt: string
}

export interface CollectionWithItems extends Collection {
  items: CollectionItem[]
}

export interface CollectionsResponse {
  collections: Collection[]
  total: number
  hasMore: boolean
}

export interface CollectionResponse {
  collection: CollectionWithItems
}

export interface CreateCollectionData {
  name: string
  description?: string
  isPublic?: boolean
}

export interface UpdateCollectionData {
  name?: string
  description?: string
  isPublic?: boolean
}

export interface AddToCollectionData {
  toolId: number | string
  note?: string
}
