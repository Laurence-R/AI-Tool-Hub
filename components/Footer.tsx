"use client"

import Link from "next/link"
import { Github, Mail, MessageCircle } from "lucide-react"

export function Footer() {
    return (
        <footer className="relative border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center space-x-2 mb-4 cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <span className="font-heading font-bold text-xl text-foreground">
                                AI Tool Hub
                            </span>
                        </Link>
                        <p className="font-body text-sm text-foreground/60 max-w-md mb-6">
                            探索、比較、管理最優質的 AI 工具。打造你的專屬高效工作流，提升工作效率。
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all duration-200 cursor-pointer"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all duration-200 cursor-pointer"
                                aria-label="Discord"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all duration-200 cursor-pointer"
                                aria-label="X (Twitter)"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all duration-200 cursor-pointer"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">
                            快速連結
                        </h3>
                        <ul className="space-y-3 font-body text-sm">
                            <li>
                                <Link
                                    href="/tools"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    探索工具
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    工具分類
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/compare"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    比較工具
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    部落格
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-4">
                        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">
                            資源
                        </h3>
                        <ul className="space-y-3 font-body text-sm">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    關於我們
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    聯絡我們
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    隱私政策
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-foreground/60 hover:text-primary transition-colors duration-200 cursor-pointer"
                                >
                                    服務條款
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 py-8 border-t border-border">
                <p className="text-center font-body text-sm text-foreground/50">
                    © 2026 AI Tool Hub. All rights reserved.
                </p>
            </div>
        </footer >
    )
}
