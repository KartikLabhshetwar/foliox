"use client"

import { Moon, Sun, Palette, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

type ThemeFamily = "default" | "vintage" | "mono" | "neobrutalism" | "t3chat"

const THEME_FAMILIES: { value: ThemeFamily; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "vintage", label: "Vintage" },
  { value: "mono", label: "Mono" },
  { value: "neobrutalism", label: "Neobrutalism" },
  { value: "t3chat", label: "T3 Chat" },
]

type LayoutType = "classic" | "bento"

export function PortfolioControls() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [userSelectedTheme, setUserSelectedTheme] = useState<ThemeFamily | null>(() => {
    if (typeof window === "undefined") return null
    const savedFamily = localStorage.getItem("theme-family") as ThemeFamily
    return savedFamily && THEME_FAMILIES.some(t => t.value === savedFamily) 
      ? savedFamily 
      : null
  })
  const currentLayout = (searchParams.get("layout") || "classic") as LayoutType

  const selectedTheme = useMemo<ThemeFamily>(() => {
    if (userSelectedTheme) return userSelectedTheme
    
    if (!theme) return "default"
    const themeName = theme.replace("-light", "").replace("-dark", "")
    if (themeName === "light" || themeName === "dark") {
      return "default"
    }
    if (THEME_FAMILIES.some(t => t.value === themeName)) {
      return themeName as ThemeFamily
    }
    return "default"
  }, [userSelectedTheme, theme])

  const isDark = theme === "dark" || theme?.endsWith("-dark")

  const toggleLightDark = () => {
    if (selectedTheme === "default") {
      setTheme(isDark ? "light" : "dark")
    } else {
      setTheme(isDark ? `${selectedTheme}-light` : `${selectedTheme}-dark`)
    }
  }

  const selectThemeFamily = (family: ThemeFamily) => {
    setUserSelectedTheme(family)
    localStorage.setItem("theme-family", family)
    
    if (family === "default") {
      setTheme(isDark ? "dark" : "light")
    } else {
      setTheme(isDark ? `${family}-dark` : `${family}-light`)
    }
  }

  const currentThemeLabel = THEME_FAMILIES.find(t => t.value === selectedTheme)?.label || "Default"

  const toggleLayout = () => {
    const newLayout = currentLayout === "classic" ? "bento" : "classic"
    const params = new URLSearchParams(searchParams.toString())
    
    if (newLayout === "classic") {
      params.delete("layout")
    } else {
      params.set("layout", newLayout)
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-full border border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-7 px-3 gap-1.5"
              title="Select Theme"
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{currentThemeLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {THEME_FAMILIES.map((themeFamily) => (
                        <DropdownMenuItem
            key={themeFamily.value}
            onClick={() => selectThemeFamily(themeFamily.value)}
            className={`cursor-pointer ${selectedTheme === themeFamily.value ? "bg-primary text-primary-foreground font-semibold" : ""}`}
          >
            {themeFamily.label}
          </DropdownMenuItem>

            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-full border border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLayout}
          title={currentLayout === "classic" ? "Switch to Bento Layout" : "Switch to Classic Layout"}
          className="rounded-full h-7 w-7"
        >
          {currentLayout === "classic" ? (
            <LayoutGrid className="h-3.5 w-3.5" />
          ) : (
            <LayoutList className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-full border border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLightDark}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-full h-7 w-7"
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}
