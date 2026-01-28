"use client"

import Link from "next/link"
import { Moon, Sun, Search, User, Menu, LogOut, Settings, UserCircle, GitCompare, Heart } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { NAV_LINKS, SEARCH_ITEMS } from "@/constants"
import { useCompare, useFavorites } from "@/contexts"

export function Navigation() {
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [isLoggedIn] = useState(false) // 模擬登入狀態
    
    // 比較和收藏狀態
    const { compareCount } = useCompare()
    const { favoritesCount } = useFavorites()

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

    const handleSearch = (href: string) => {
        setSearchOpen(false)
        router.push(href)
    }

    return (
        <nav className="fixed top-4 left-4 right-4 z-50">
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
                                        {compareCount > 0 && (
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
                                        {favoritesCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {favoritesCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>

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
                                {isLoggedIn ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hidden md:flex text-foreground hover:text-primary"
                                            >
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border/50">
                                            <DropdownMenuLabel>我的帳號</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile" className="cursor-pointer">
                                                    <UserCircle className="w-4 h-4 mr-2" />
                                                    個人資料
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/settings" className="cursor-pointer">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    設定
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
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
                                                        <Link
                                                            href="/profile"
                                                            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-body font-medium text-lg mb-4"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <UserCircle className="w-5 h-5" />
                                                            <span>個人資料</span>
                                                        </Link>
                                                        <Link
                                                            href="/settings"
                                                            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-body font-medium text-lg mb-4"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <Settings className="w-5 h-5" />
                                                            <span>設定</span>
                                                        </Link>
                                                        <button
                                                            className="flex items-center space-x-2 text-destructive hover:text-destructive/80 transition-colors duration-200 font-body font-medium text-lg w-full"
                                                            onClick={() => setMobileMenuOpen(false)}
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
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="p-4 gap-0 bg-background/95 backdrop-blur-xl border-border/50" showCloseButton={false}>
                    <DialogHeader className="sr-only">
                        <DialogTitle>搜尋</DialogTitle>
                    </DialogHeader>
                    <Command className="bg-transparent">
                        <CommandInput 
                            placeholder="搜尋頁面或分類... (Ctrl+K)" 
                            className="border-0 focus:ring-0 bg-"
                        />
                        <CommandList>
                            <CommandEmpty>找不到相關結果</CommandEmpty>
                            {Object.entries(
                                SEARCH_ITEMS.reduce((acc, item) => {
                                    if (!acc[item.category]) acc[item.category] = []
                                    acc[item.category].push(item)
                                    return acc
                                }, {} as Record<string, typeof SEARCH_ITEMS>)
                            ).map(([category, items]) => (
                                <CommandGroup key={category} heading={category}>
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.href}
                                            onSelect={() => handleSearch(item.href)}
                                            className="cursor-pointer"
                                        >
                                            <Search className="w-4 h-4 mr-2" />
                                            {item.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </nav >
    )
}
