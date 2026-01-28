// Email 發送工具
// 注意：這是一個簡化的實作，生產環境請使用 Resend、SendGrid 或其他 Email 服務

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  // 開發環境：僅記錄到 console
  if (process.env.NODE_ENV === "development") {
    console.log("========== Email 模擬發送 ==========")
    console.log(`收件者: ${to}`)
    console.log(`主題: ${subject}`)
    console.log(`內容: ${html.substring(0, 200)}...`)
    console.log("====================================")
    return true
  }

  // 生產環境：使用 Resend API
  // 如果您要使用 Resend，請安裝 resend 套件並設定 RESEND_API_KEY
  /*
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: "AI Tool Hub <noreply@aitoolhub.com>",
      to,
      subject,
      html,
    })
    
    return true
  } catch (error) {
    console.error("Resend 發送失敗:", error)
    return false
  }
  */

  // 目前使用 console 記錄
  console.log(`[Email] To: ${to}, Subject: ${subject}`)
  return true
}

// 預設的 Email 模板
export const emailTemplates = {
  submissionApproved: (toolName: string, toolId: number) => ({
    subject: `🎉 您的工具「${toolName}」已通過審核`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #60A5FA, #818CF8); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; background: #60A5FA; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 恭喜！</h1>
            </div>
            <div class="content">
              <h2>您的工具已通過審核</h2>
              <p>您提交的工具「<strong>${toolName}</strong>」已通過審核並正式上架到 AI Tool Hub！</p>
              <p>感謝您對平台的貢獻，讓更多人能發現這個優秀的工具。</p>
              <a href="${process.env.NEXTAUTH_URL}/tools/${toolId}" class="button">查看工具頁面</a>
            </div>
            <div class="footer">
              <p>此郵件由 AI Tool Hub 自動發送，請勿直接回覆。</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  submissionRejected: (toolName: string, reason?: string) => ({
    subject: `您的工具「${toolName}」審核結果通知`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6b7280; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .reason { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #60A5FA; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>審核結果通知</h1>
            </div>
            <div class="content">
              <h2>您的工具未通過審核</h2>
              <p>很抱歉，您提交的工具「<strong>${toolName}</strong>」未通過審核。</p>
              ${reason ? `
                <div class="reason">
                  <strong>原因：</strong>${reason}
                </div>
              ` : ""}
              <p>您可以根據反饋修改後重新提交，我們期待看到改進後的版本！</p>
              <a href="${process.env.NEXTAUTH_URL}/submit" class="button">重新提交</a>
            </div>
            <div class="footer">
              <p>此郵件由 AI Tool Hub 自動發送，請勿直接回覆。</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
