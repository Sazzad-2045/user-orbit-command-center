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
  { title: "User Profile", url: "/user-profile", icon: Users },
  { title: "Plan Management", url: "/plan-management", icon: Package },
  { title: "Billing & Payments", url: "/billing", icon: CreditCard },
  { title: "QR Code Monitoring", url: "/qr-monitoring", icon: QrCode },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  {
    title: "Admin Permission",
    url: "/admin-permission",
    icon: Shield,
    children: [
      { title: "Add User", url: "/admin-permission/add-user" },
      { title: "Assign User", url: "/admin-permission/assign-user" },
    ],
    showSubmenu: false,
  },
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
                item.title === "Admin Permission" ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <button type="button" onClick={e => {
                        e.preventDefault();
                        // Toggle submenu visibility
                        item.showSubmenu = !item.showSubmenu;
                        // Force re-render
                        window.location.hash = Math.random();
                      }}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                    {/* Submenu: only show if toggled */}
                    {item.showSubmenu && (
                      <SidebarMenu style={{ paddingLeft: isCollapsed ? 0 : 32 }}>
                        {item.children.map((child) => (
                          <SidebarMenuItem key={child.title}>
                            <SidebarMenuButton asChild isActive={isActive(child.url)} tooltip={isCollapsed ? child.title : undefined}>
                              <NavLink to={child.url}>
                                <span>{child.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    )}
                  </SidebarMenuItem>
                ) : (
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
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}