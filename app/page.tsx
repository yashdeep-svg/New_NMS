"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Monitor,
  Network,
  Router,
  Server,
  Shield,
  TrendingUp,
  Users,
  Wifi,
  XCircle,
  Zap,
  LogOut,
  Settings,
} from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { NetworkTopology } from "./components/network-topology"
import { LoginForm } from "./components/login-form"
import { UserManagement } from "./components/user-management"
import { TopologyConfig } from "./components/topology-config"

// Mock user database
const users = {
  admin: { password: "admin123", role: "admin", email: "admin@company.com" },
  operator: { password: "op123", role: "operator", email: "operator@company.com" },
  viewer: { password: "view123", role: "viewer", email: "viewer@company.com" },
}

// Mock data generators
const generateNetworkData = () => ({
  timestamp: new Date().toLocaleTimeString(),
  bandwidth: Math.floor(Math.random() * 100) + 50,
  latency: Math.floor(Math.random() * 50) + 10,
  packetLoss: Math.random() * 2,
  throughput: Math.floor(Math.random() * 1000) + 500,
  connections: Math.floor(Math.random() * 500) + 200,
})

const devices = [
  {
    id: 1,
    name: "Core Router 01",
    type: "Router",
    ip: "192.168.1.1",
    status: "online",
    uptime: "99.9%",
    location: "Data Center A",
  },
  {
    id: 2,
    name: "Switch 01",
    type: "Switch",
    ip: "192.168.1.10",
    status: "online",
    uptime: "99.8%",
    location: "Floor 1",
  },
  {
    id: 3,
    name: "Firewall 01",
    type: "Firewall",
    ip: "192.168.1.254",
    status: "warning",
    uptime: "98.5%",
    location: "DMZ",
  },
  {
    id: 4,
    name: "Access Point 01",
    type: "WiFi",
    ip: "192.168.1.50",
    status: "online",
    uptime: "99.2%",
    location: "Office A",
  },
  {
    id: 5,
    name: "Server 01",
    type: "Server",
    ip: "192.168.1.100",
    status: "offline",
    uptime: "95.1%",
    location: "Data Center B",
  },
  {
    id: 6,
    name: "Load Balancer",
    type: "Load Balancer",
    ip: "192.168.1.200",
    status: "online",
    uptime: "99.9%",
    location: "Data Center A",
  },
]

const alerts = [
  { id: 1, severity: "critical", message: "Server 01 is offline", timestamp: "2 minutes ago", device: "Server 01" },
  {
    id: 2,
    severity: "warning",
    message: "High CPU usage on Firewall 01",
    timestamp: "5 minutes ago",
    device: "Firewall 01",
  },
  {
    id: 3,
    severity: "info",
    message: "Scheduled maintenance completed",
    timestamp: "1 hour ago",
    device: "Core Router 01",
  },
  {
    id: 4,
    severity: "warning",
    message: "Bandwidth threshold exceeded",
    timestamp: "2 hours ago",
    device: "Switch 01",
  },
]

export default function NetworkDashboard() {
  const [networkData, setNetworkData] = useState<any[]>([])
  const [currentMetrics, setCurrentMetrics] = useState(generateNetworkData())
  const [activeTab, setActiveTab] = useState("overview")
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; email: string } | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateNetworkData()
      setCurrentMetrics(newData)
      setNetworkData((prev) => [...prev.slice(-19), newData])
    }, 2000)

    // Initialize with some data
    const initialData = Array.from({ length: 20 }, () => generateNetworkData())
    setNetworkData(initialData)

    return () => clearInterval(interval)
  }, [])

  const handleLogin = (username: string, password: string): boolean => {
    const user = users[username as keyof typeof users]
    if (user && user.password === password) {
      setCurrentUser({
        username,
        role: user.role,
        email: user.email,
      })
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveTab("overview")
  }

  const canAccessTopology = () => {
    if (!currentUser) return false
    return currentUser.role === "admin" || currentUser.role === "operator" || currentUser.role === "viewer"
  }

  const canConfigureTopology = () => {
    if (!currentUser) return false
    return currentUser.role === "admin" || currentUser.role === "operator"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Router":
        return <Router className="h-4 w-4" />
      case "Switch":
        return <Network className="h-4 w-4" />
      case "Firewall":
        return <Shield className="h-4 w-4" />
      case "WiFi":
        return <Wifi className="h-4 w-4" />
      case "Server":
        return <Server className="h-4 w-4" />
      case "Load Balancer":
        return <Zap className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "default"
      case "info":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-2">
            <Network className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Network Management System</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600">
              <Activity className="mr-1 h-3 w-3" />
              System Healthy
            </Badge>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{currentUser.role}</Badge>
              <span className="text-sm text-gray-600">{currentUser.username}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <nav className="space-y-2 p-4">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "devices" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("devices")}
            >
              <Router className="mr-2 h-4 w-4" />
              Devices
            </Button>
            <Button
              variant={activeTab === "alerts" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("alerts")}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alerts
            </Button>
            <Button
              variant={activeTab === "performance" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("performance")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance
            </Button>
            <Button
              variant={activeTab === "topology" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                if (canAccessTopology()) {
                  setActiveTab("topology")
                } else {
                  alert("Access denied. Please contact your administrator.")
                }
              }}
              disabled={!canAccessTopology()}
            >
              <Globe className="mr-2 h-4 w-4" />
              Topology
            </Button>
            <Button
              variant={activeTab === "config" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("config")}
              disabled={!canConfigureTopology()}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
              disabled={currentUser.role !== "admin"}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                <Router className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.connections}</div>
                <p className="text-xs text-muted-foreground">Real-time count</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.bandwidth}%</div>
                <Progress value={currentMetrics.bandwidth} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.latency}ms</div>
                <p className="text-xs text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="topology" disabled={!canAccessTopology()}>
                Topology
              </TabsTrigger>
              <TabsTrigger value="config" disabled={!canConfigureTopology()}>
                Configure
              </TabsTrigger>
              <TabsTrigger value="users" disabled={currentUser.role !== "admin"}>
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Traffic</CardTitle>
                    <CardDescription>Real-time bandwidth utilization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        bandwidth: {
                          label: "Bandwidth %",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={networkData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="bandwidth"
                            stroke="var(--color-bandwidth)"
                            fill="var(--color-bandwidth)"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Network Latency</CardTitle>
                    <CardDescription>Response time monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        latency: {
                          label: "Latency (ms)",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={networkData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="latency" stroke="var(--color-latency)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest network notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <Alert key={alert.id} className="border-l-4 border-l-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex justify-between items-center">
                            <span>{alert.message}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Network Devices</CardTitle>
                  <CardDescription>Manage and monitor all network devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {devices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell className="flex items-center space-x-2">
                            {getDeviceIcon(device.type)}
                            <span className="font-medium">{device.name}</span>
                          </TableCell>
                          <TableCell>{device.type}</TableCell>
                          <TableCell className="font-mono">{device.ip}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(device.status)}
                              <span className="capitalize">{device.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{device.uptime}</TableCell>
                          <TableCell>{device.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>All network alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.severity === "critical"
                                ? "text-red-500"
                                : alert.severity === "warning"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-muted-foreground">Device: {alert.device}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                          <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Throughput Analysis</CardTitle>
                    <CardDescription>Data transfer rates over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        throughput: {
                          label: "Throughput (Mbps)",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={networkData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="throughput" fill="var(--color-throughput)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Packet Loss</CardTitle>
                    <CardDescription>Network reliability metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        packetLoss: {
                          label: "Packet Loss %",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={networkData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="packetLoss" stroke="var(--color-packetLoss)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Current network performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm">45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm">67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Disk Usage</span>
                        <span className="text-sm">23%</span>
                      </div>
                      <Progress value={23} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="topology" className="space-y-4">
              {canAccessTopology() ? (
                <NetworkTopology />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                    <p className="text-gray-600">You need appropriate privileges to access the network topology.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <TopologyConfig userRole={currentUser.role} />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {currentUser.role === "admin" ? (
                <UserManagement currentUser={currentUser} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h3>
                    <p className="text-gray-600">Only administrators can manage users.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
