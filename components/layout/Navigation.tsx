"use client"

import Link from "next/link"
import { Moon, Sun, Search, User, Menu, LogOut, Settings, UserCircle, GitCompare, Heart, Loader2, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchDialog, NotificationBell } from "@/components/shared"
import { NAV_LINKS } from "@/constants"
import { useCompare, useFavorites } from "@/contexts"
import { useUserRole } from "@/hooks"

export function Navigation() {
    const { theme, setTheme } = useTheme()
    const { data: session, status } = useSession()
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    
    // 比較和收藏狀態
    const { compareCount } = useCompare()
    const { favoritesCount } = useFavorites()
    
    // 用戶角色
    const { isAdmin } = useUserRole()

    const isLoggedIn = status === "authenticated"
    const isLoading = status === "loading"

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" })
    }

    useEffect(() => {
        setMounted(true)
        
        // 鍵盤快捷鍵 Ctrl+K 或 Cmd+K 開啟搜尋
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setSearchOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <>
            {/* Skip Link for keyboard navigation */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                跳至主要內容
            </a>
            <nav className="fixed top-4 left-4 right-4 z-[60]" aria-label="主要導航">
                <div className="max-w-7xl mx-auto">
                    {/* Glassmorphism Navigation */}
                <div className="glass-card rounded-2xl shadow-lg transition-colors duration-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">AI</span>
                                </div>
                                <span className="font-heading font-bold text-xl text-foreground">
                                    AI Tool Hub
                                </span>
                            </Link>

                            {/* Desktop Navigation Links */}
                            <div className="hidden md:flex items-center space-x-8">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-foreground hover:text-primary transition-colors duration-200 font-body font-medium cursor-pointer"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center space-x-2">
                                {/* Compare Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative text-foreground hover:text-primary"
                                    aria-label="比較工具"
                                    asChild
                                >
                                    <Link href="/compare">
                                        <GitCompare className="w-5 h-5" />
                                        {isLoggedIn && compareCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {compareCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>

                                {/* Favorites Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative text-foreground hover:text-red-500"
                                    aria-label="收藏"
                                    asChild
                                >
                                    <Link href="/favorites">
                                        <Heart className="w-5 h-5" />
                                        {isLoggedIn && favoritesCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {favoritesCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>

                                {/* Notification Bell */}
                                <NotificationBell />

                                {/* Search Icon */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:text-primary"
                                    aria-label="搜尋"
                                    onClick={() => setSearchOpen(true)}
                                >
                                    <Search className="w-5 h-5" />
                                </Button>

                                {/* Theme Toggle */}
                                {mounted && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleTheme}
                                        className="text-foreground hover:text-primary hover:rotate-12 transition-all duration-300"
                                        aria-label="切換主題"
                                    >
                                        {theme === "dark" ? (
                                            <Sun className="w-5 h-5" />
                                        ) : (
                                            <Moon className="w-5 h-5" />
                                        )}
                                    </Button>
                                )}

                                {/* User Menu - Desktop */}
                                {isLoading ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hidden md:flex"
                                        disabled
                                    >
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </Button>
                                ) : isLoggedIn ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hidden md:flex text-foreground hover:text-primary"
                                            >
                                                {session?.user?.image ? (
                                                    <img
                                                        src={session.user.image}
                                                        alt={session.user.name || "User"}
                                                        className="w-7 h-7 rounded-full"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 z-[70] bg-background/95 backdrop-blur-xl border-border/50">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col">
                                                    <span>{session?.user?.name || "使用者"}</span>
                                                    <span className="text-xs text-muted-foreground font-normal">
                                                        {session?.user?.email}
                                                    </span>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    <UserCircle className="w-4 h-4 mr-2" />
                                                    個人中心
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    設定
                                                </Link>
                                            </DropdownMenuItem>
                                            {isAdmin && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin/submissions" className="cursor-pointer text-primary">
                                                            <Shield className="w-4 h-4 mr-2" />
                                                            管理面板
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                                className="cursor-pointer text-destructive focus:text-destructive"
                                                onClick={handleSignOut}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                登出
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="hidden md:flex"
                                    >
                                        <Link href="/login">
                                            <User className="w-5 h-5 mr-2" />
                                            登入
                                        </Link>
                                    </Button>
                                )}

                                {/* Mobile Menu Toggle */}
                                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden text-foreground hover:text-primary"
                                            aria-label="選單"
                                        >
                                            <Menu className="w-6 h-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-border/50">
                                        <SheetHeader>
                                            <SheetTitle>選單</SheetTitle>
                                        </SheetHeader>
                                        <div className="flex flex-col space-y-4 mt-8">
                                            {NAV_LINKS.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="text-foreground hover:text-primary transition-colors duration-200 font-body font-medium text-lg"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                            <div className="pt-4 border-t border-border/50">
                                                {isLoggedIn ? (
                                                    <>
                                                        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-border/30">
                                                            {session?.user?.image ? (
                                                                <img
                                                                    src={session.user.image}
                                                                    alt={session.user.name || "User"}
                                                                    className="w-10 h-10 rounded-full"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-primary" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{session?.user?.name || "使用者"}</p>
                                                                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                                                            </div>
                                                        </div>
                                                        <Link
                                                            href="/dashboard"
                                                            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-body font-medium text-lg mb-4"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <UserCircle className="w-5 h-5" />
                                                            <span>個人中心</span>
                                                        </Link>
                                                        <Link
                                                            href="/dashboard"
                                                            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-body font-medium text-lg mb-4"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <Settings className="w-5 h-5" />
                                                            <span>設定</span>
                                                        </Link>
                                                        {isAdmin && (
                                                            <Link
                                                                href="/admin/submissions"
                                                                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200 font-body font-medium text-lg mb-4"
                                                                onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                <Shield className="w-5 h-5" />
                                                                <span>管理面板</span>
                                                            </Link>
                                                        )}
                                                        <button
                                                            className="flex items-center space-x-2 text-destructive hover:text-destructive/80 transition-colors duration-200 font-body font-medium text-lg w-full"
                                                            onClick={() => {
                                                                setMobileMenuOpen(false)
                                                                handleSignOut()
                                                            }}
                                                        >
                                                            <LogOut className="w-5 h-5" />
                                                            <span>登出</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Link
                                                        href="/login"
                                                        className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-body font-medium text-lg"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <User className="w-5 h-5" />
                                                        <span>登入</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Dialog */}
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
            </nav>
        </>
    )
}
