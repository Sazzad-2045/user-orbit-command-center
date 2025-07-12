import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
// import Users from "./pages/Users";
import PlanManagement from "./pages/PlanManagement";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import QRMonitoring from "./pages/QRMonitoring";
import Moderation from "./pages/Moderation";
// import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import { UserProvider } from "./pages/UserProfile";
import AdminPermission from "./pages/AdminPermission";
import AssignUser from "./pages/AssignUser";
import AddUser from "./pages/AddUser";
import "@/App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/users" element={<DashboardLayout><Users /></DashboardLayout>} /> */}
            <Route path="/plan-management" element={<DashboardLayout><PlanManagement /></DashboardLayout>} />
            <Route path="/billing" element={<DashboardLayout><Billing /></DashboardLayout>} />
            <Route path="/qr-monitoring" element={<DashboardLayout><QRMonitoring /></DashboardLayout>} />
            <Route path="/moderation" element={<DashboardLayout><Moderation /></DashboardLayout>} />
            {/* <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} /> */}
            <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            <Route path="/user-profile" element={<DashboardLayout><UserProfile /></DashboardLayout>} />
            <Route path="/admin-permission" element={<DashboardLayout><AdminPermission /></DashboardLayout>} />
            <Route path="/admin-permission/assign-user" element={<DashboardLayout><AssignUser /></DashboardLayout>} />
            <Route path="/admin-permission/add-user" element={<DashboardLayout><AddUser /></DashboardLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
