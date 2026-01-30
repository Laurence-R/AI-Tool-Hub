import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import type { Provider } from "next-auth/providers"

// 動態建構 providers 列表
const providers: Provider[] = [
  // Email/密碼認證 - 始終啟用
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("請提供 Email 和密碼")
      }

      const email = credentials.email as string
      const password = credentials.password as string

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        throw new Error("找不到此帳號，請先註冊")
      }

      // 檢查帳號是否被停用
      if (user.status === "SUSPENDED") {
        throw new Error("此帳號已被停用，請聯繫管理員")
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw new Error("密碼錯誤")
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    },
  }),
]

// 只有在設置了 OAuth 憑證時才添加對應的提供者
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers,
  callbacks: {
    // OAuth 登入時檢查帳號狀態
    async signIn({ user, account }) {
      // 跳過 credentials 登入（已在 authorize 中檢查）
      if (account?.provider === "credentials") {
        return true
      }
      
      // OAuth 登入：檢查用戶是否被停用
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { status: true },
        })
        
        if (dbUser?.status === "SUSPENDED") {
          // 返回錯誤 URL
          return "/login?error=AccountSuspended"
        }
      }
      
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
      }

      // 處理 session 更新
      if (trigger === "update" && session) {
        token.name = session.name
        token.image = session.image
      }

      // 定期檢查帳號狀態 (每次 JWT 更新時)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { status: true },
        })
        
        // 如果帳號被停用，標記 token 為無效
        if (dbUser?.status === "SUSPENDED") {
          token.suspended = true
        } else {
          token.suspended = false
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        
        // 如果帳號被停用，返回空 session 強制登出
        if (token.suspended) {
          return { ...session, user: undefined, expires: new Date(0).toISOString() }
        }
      }
      return session
    },
  },
})
