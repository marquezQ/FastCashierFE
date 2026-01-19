import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-accent"
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 transition-all" />
            ) : (
                <Sun className="h-5 w-5 transition-all" />
            )}
        </Button>
    );
};
