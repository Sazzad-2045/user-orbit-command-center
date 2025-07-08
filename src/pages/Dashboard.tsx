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

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Super Admin Backend. Here's what's happening.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                {" "}from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'qr' ? 'bg-purple-500' :
                    activity.type === 'moderation' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-foreground">{activity.message}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-yellow-600">Degraded</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">QR Service</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}