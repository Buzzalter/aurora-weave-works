import {
  Image,
  Paintbrush,
  Video,
  PersonStanding,
  Mic,
  Sparkles,
  LayoutGrid,
  Sun,
  Moon,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
  { title: 'Image Generation', url: '/', icon: Image },
  { title: 'Image Editing', url: '/edit', icon: Paintbrush },
  { title: 'Video Generation', url: '/video', icon: Video },
  { title: 'Full Body Animation', url: '/animate', icon: PersonStanding },
  { title: 'Voice Generation', url: '/voice', icon: Mic },
  { title: 'LTX A/V Studio', url: '/studio', icon: Sparkles },
  { title: 'Gallery', url: '/gallery', icon: LayoutGrid },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { isDark, toggle } = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {!collapsed && 'AI Media Studio'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="hover:bg-accent/60"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button variant="ghost" size="icon" onClick={toggle} className="mx-auto">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
