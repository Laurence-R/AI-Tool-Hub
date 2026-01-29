import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CollectionDetailClient } from "./CollectionDetailClient"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true },
      },
    },
  })

  if (!collection || !collection.isPublic) {
    return {
      title: "合集不存在 | AI Tool Hub",
    }
  }

  return {
    title: `${collection.name} | AI Tool Hub`,
    description: collection.description || `由 ${collection.user.name || "使用者"} 建立的工具合集`,
    openGraph: {
      title: `${collection.name} | AI Tool Hub`,
      description: collection.description || `由 ${collection.user.name || "使用者"} 建立的工具合集`,
    },
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params
  
  const collection = await prisma.collection.findUnique({
    where: { id },
  })

  if (!collection) {
    notFound()
  }

  return <CollectionDetailClient collectionId={id} />
}
