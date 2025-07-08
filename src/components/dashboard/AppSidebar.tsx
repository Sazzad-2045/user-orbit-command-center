import { NavLink, useLocation } from "react-router-dom"
import { 
  Users, 
  CreditCard, 
  QrCode, 
  Shield, 
  BarChart3, 
  Bell, 
  Settings,
  Home,
  Building2,
  Package
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Plan Management", url: "/plan-management", icon: Package },
  { title: "Billing & Payments", url: "/billing", icon: CreditCard },
  { title: "QR Code Monitoring", url: "/qr-monitoring", icon: QrCode },
  { title: "Content Moderation", url: "/moderation", icon: Shield },
  { title: "Analytics & Reports", url: "/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Building2 className="h-8 w-8 text-sidebar-primary" />
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Super Admin</h2>
              <p className="text-xs text-sidebar-foreground/70">Backend Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}