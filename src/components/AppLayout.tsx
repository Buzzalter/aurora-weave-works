import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import logo from '@/assets/zaizi_logo.jpeg';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 glass sticky top-0 z-30">
            <SidebarTrigger className="mr-3" />
            <img src={logo} alt="Zaizi" className="h-8 w-8 rounded object-contain mr-3" />
            <h1 className="text-lg font-semibold truncate text-foreground">AI Media Studio</h1>
          </header>
          <main className="flex-1 p-6 max-w-5xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
