import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SidebarContent } from './SidebarContent';

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
}

export const MobileSidebar = ({ isOpen, onOpenChange, onNavigate }: MobileSidebarProps) => {
  const handleNavigate = (path: string) => {
    onNavigate(path);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
        <SidebarContent onNavigate={handleNavigate} />
      </SheetContent>
    </Sheet>
  );
};