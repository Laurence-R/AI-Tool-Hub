import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ToolForm } from "../../ToolForm"

export const metadata = {
  title: "編輯工具",
}

interface EditToolPageProps {
  params: Promise<{ id: string }>
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { id } = await params
  const toolId = parseInt(id)

  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
  })

  if (!tool) {
    notFound()
  }

  const initialData = {
    ...tool,
    features: tool.features ? JSON.parse(tool.features) : [],
    tags: tool.tags ? JSON.parse(tool.tags) : [],
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">編輯工具</h1>
        <p className="text-muted-foreground mt-1">
          修改「{tool.name}」的資訊
        </p>
      </div>
      <ToolForm initialData={initialData} isEditing />
    </div>
  )
}
