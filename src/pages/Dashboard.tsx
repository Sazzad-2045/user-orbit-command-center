import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, QrCode, Shield, TrendingUp, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,843",
    change: "+8.2%",
    icon: Users,
    description: "Active registered users"
  },
  {
    title: "Monthly Revenue",
    value: "$24,532",
    change: "+12.5%",
    icon: CreditCard,
    description: "Subscription & one-time payments"
  },
  {
    title: "QR Codes Generated",
    value: "45,231",
    change: "+18.7%",
    icon: QrCode,
    description: "This month"
  },
  {
    title: "Content Moderated",
    value: "2,143",
    change: "-5.2%",
    icon: Shield,
    description: "Items reviewed"
  }
]

const recentActivity = [
  { type: "user", message: "New user registered: john.doe@example.com", time: "2 minutes ago" },
  { type: "payment", message: "Payment received: $99 Premium subscription", time: "15 minutes ago" },
  { type: "qr", message: "Bulk QR code generation completed (500 codes)", time: "1 hour ago" },
  { type: "moderation", message: "Content flagged for review by user reports", time: "2 hours ago" },
  { type: "system", message: "Daily backup completed successfully", time: "3 hours ago" },
]

import { useNavigate } from "react-router-dom"

// Dummy metrics for demonstration
const metrics = {
  totalUsers: 12843,
  activeUsers: 523,
  plans: {
    Free: 4000,
    Basic: 3500,
    Premium: 4000,
    Enterprise: 1343,
  },
  totalQRCodes: 45231,
  activeQRCodes: 32000,
  scansToday: 1875,
};

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Centralized interface to monitor and manage all user-related activities.
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total QR Codes Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalQRCodes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeQRCodes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {Object.entries(metrics.plans).map(([plan, count]) => (
                <div key={plan} className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{plan}</span>
                  <span className="text-2xl font-bold text-blue-700">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Scans Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.scansToday.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
          onClick={() => navigate("/users")}
        >
          View User List
        </button>
        <button
          className="px-6 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
          onClick={() => navigate("/analytics")}
        >
          Generate Reports
        </button>
        <button
          className="px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
          onClick={() => navigate("/plan-management")}
        >
          Manage Subscriptions
        </button>
      </div>
    </div>
  );
}