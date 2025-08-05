import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleClick = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    console.log('🔄 Toggle clicked! Current:', theme, 'New:', newTheme)
    console.log('🧪 Testing setTheme call...')
    setTheme(newTheme)
    console.log('🧪 setTheme called successfully')
  }

  console.log('🎨 ThemeToggle render - current theme:', theme)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="h-9 w-9 rounded-md border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
      data-testid="theme-toggle"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}