"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp, CheckCircle2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 pb-16">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950" />
            
            {/* Dynamic Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            {/* Floating Gradient Orbs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-orange-500/15 dark:bg-orange-500/10 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-float-slow" />

            <div className="relative max-w-7xl mx-auto z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 border border-blue-200 dark:border-blue-900 animate-fade-in-up">
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-body">
                                100+ AI 工具精選
                            </span>
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">NEW</span>
                        </div>

                        {/* Kinetic Typography - Main Heading */}
                        <div className="space-y-4 animate-fade-in-up animation-delay-100">
                            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white leading-tight">
                                探索最強大的
                                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                                    AI 工具生態系統
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl font-body leading-relaxed">
                                從 <span className="font-semibold text-blue-600 dark:text-blue-400">對話 AI</span> 到 <span className="font-semibold text-purple-600 dark:text-purple-400">圖像生成</span>，一站式比較、評價、選擇最適合你的 AI 工具。
                            </p>
                        </div>

                        {/* Trust Indicators with Icons */}
                        <div className="flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in-up animation-delay-200">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">10,000+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">活躍用戶</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">每日更新</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">最新工具</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">真實評價</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">用戶驗證</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
                            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 transition-all duration-200 group">
                                <Link href="/tools">
                                    <Zap className="w-5 h-5 mr-2" />
                                    開始探索
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Link href="#demo">
                                    <Play className="w-5 h-5 mr-2" />
                                    觀看演示
                                </Link>
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 font-body">
                                <span className="font-semibold text-slate-900 dark:text-white">2,500+</span> 位開發者正在使用
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Interactive Product Demo */}
                    <div className="relative lg:block hidden animate-fade-in-up animation-delay-200">
                        {/* Main Demo Card */}
                        <div className="relative">
                            {/* Floating Mini Cards */}
                            <div className="absolute -top-20 -left-8 glass-card rounded-2xl p-4 shadow-xl border border-blue-200 dark:border-blue-900 animate-float w-48 hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                        <Image
                                            src="/tools/chatgpt.png"
                                            alt="ChatGPT"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">ChatGPT</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">AI 對話</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">4.8</span>
                                </div>
                            </div>

                            <div className="absolute -top-4 -right-50 glass-card rounded-2xl p-4 shadow-xl border border-purple-200 dark:border-purple-900 animate-float-delayed w-48 hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                        <Image
                                            src="/tools/midjourney.png"
                                            alt="Midjourney"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Midjourney</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">圖像生成</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">4.9</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-50 left-12 glass-card rounded-2xl p-4 shadow-xl border border-orange-200 dark:border-orange-900 animate-float-slow w-48 hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                        <Image
                                            src="/tools/claude.png"
                                            alt="Claude"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Claude</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">AI 助理</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">4.9</span>
                                </div>
                            </div>

                            {/* Central Dashboard Mockup */}
                            <div className="glass-card rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-white">工具儀表板</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">即時數據分析</p>
                                        </div>
                                        <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            即時
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">156</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">已收藏工具</div>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 border border-purple-100 dark:border-purple-900">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">42</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">本週評價</div>
                                        </div>
                                    </div>

                                    {/* Activity List */}
                                    <div className="space-y-3">
                                        {[
                                            { name: "ChatGPT", action: "已評價", time: "2 分鐘前", color: "blue" },
                                            { name: "Midjourney", action: "已收藏", time: "15 分鐘前", color: "purple" },
                                            { name: "Claude", action: "已比較", time: "1 小時前", color: "orange" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
                                                <div className={`w-8 h-8 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</div>
                                                    <div className="text-xs text-slate-600 dark:text-slate-400">{item.action}</div>
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-500">{item.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-orange-500/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
        </section>
    )
}
