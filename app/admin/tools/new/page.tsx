import { ToolForm } from "../ToolForm"

export const metadata = {
  title: "新增工具",
}

export default function NewToolPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">新增工具</h1>
        <p className="text-muted-foreground mt-1">
          填寫表單來新增一個 AI 工具
        </p>
      </div>
      <ToolForm />
    </div>
  )
}
