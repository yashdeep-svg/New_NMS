"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Router, Network, Server, Monitor, Wifi, Shield, Globe } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

interface NetworkDevice {
  id: string
  name: string
  type: "router" | "switch" | "server" | "host" | "firewall" | "access-point" | "internet"
  x: number
  y: number
  status: "online" | "offline" | "warning"
  ip?: string
  connections: string[]
  lan?: string
}

interface LANGroup {
  id: string
  name: string
  color: string
  x: number
  y: number
  width: number
  height: number
}

const networkDevices: NetworkDevice[] = [
  // Internet Gateway
  {
    id: "internet",
    name: "Internet",
    type: "internet",
    x: 400,
    y: 50,
    status: "online",
    connections: ["router1"],
  },

  // Core Infrastructure
  {
    id: "router1",
    name: "Core Router",
    type: "router",
    x: 400,
    y: 150,
    status: "online",
    ip: "192.168.1.1",
    connections: ["firewall1", "switch1", "switch2"],
  },
  {
    id: "firewall1",
    name: "Firewall",
    type: "firewall",
    x: 250,
    y: 150,
    status: "warning",
    ip: "192.168.1.254",
    connections: ["switch3"],
  },

  // Distribution Layer
  {
    id: "switch1",
    name: "Switch 1",
    type: "switch",
    x: 200,
    y: 280,
    status: "online",
    ip: "192.168.1.10",
    connections: ["host1", "host2", "ap1"],
    lan: "lan1",
  },
  {
    id: "switch2",
    name: "Switch 2",
    type: "switch",
    x: 600,
    y: 280,
    status: "online",
    ip: "192.168.2.10",
    connections: ["host3", "host4", "server1"],
    lan: "lan2",
  },
  {
    id: "switch3",
    name: "DMZ Switch",
    type: "switch",
    x: 250,
    y: 280,
    status: "online",
    ip: "192.168.100.10",
    connections: ["server2", "server3"],
    lan: "dmz",
  },

  // Access Layer - LAN 1
  {
    id: "host1",
    name: "Workstation 1",
    type: "host",
    x: 100,
    y: 400,
    status: "online",
    ip: "192.168.1.101",
    connections: [],
    lan: "lan1",
  },
  {
    id: "host2",
    name: "Workstation 2",
    type: "host",
    x: 200,
    y: 400,
    status: "online",
    ip: "192.168.1.102",
    connections: [],
    lan: "lan1",
  },
  {
    id: "ap1",
    name: "Access Point 1",
    type: "access-point",
    x: 300,
    y: 400,
    status: "online",
    ip: "192.168.1.50",
    connections: ["mobile1", "laptop1"],
    lan: "lan1",
  },
  {
    id: "mobile1",
    name: "Mobile Device",
    type: "host",
    x: 280,
    y: 480,
    status: "online",
    ip: "192.168.1.201",
    connections: [],
    lan: "lan1",
  },
  {
    id: "laptop1",
    name: "Laptop",
    type: "host",
    x: 320,
    y: 480,
    status: "online",
    ip: "192.168.1.202",
    connections: [],
    lan: "lan1",
  },

  // Access Layer - LAN 2
  {
    id: "host3",
    name: "Workstation 3",
    type: "host",
    x: 550,
    y: 400,
    status: "online",
    ip: "192.168.2.101",
    connections: [],
    lan: "lan2",
  },
  {
    id: "host4",
    name: "Workstation 4",
    type: "host",
    x: 650,
    y: 400,
    status: "offline",
    ip: "192.168.2.102",
    connections: [],
    lan: "lan2",
  },
  {
    id: "server1",
    name: "File Server",
    type: "server",
    x: 700,
    y: 400,
    status: "online",
    ip: "192.168.2.200",
    connections: [],
    lan: "lan2",
  },

  // DMZ
  {
    id: "server2",
    name: "Web Server",
    type: "server",
    x: 200,
    y: 400,
    status: "online",
    ip: "192.168.100.10",
    connections: [],
    lan: "dmz",
  },
  {
    id: "server3",
    name: "Mail Server",
    type: "server",
    x: 300,
    y: 400,
    status: "online",
    ip: "192.168.100.11",
    connections: [],
    lan: "dmz",
  },
]

const lanGroups: LANGroup[] = [
  {
    id: "lan1",
    name: "Office LAN 1",
    color: "rgba(59, 130, 246, 0.1)",
    x: 50,
    y: 350,
    width: 300,
    height: 180,
  },
  {
    id: "lan2",
    name: "Office LAN 2",
    color: "rgba(16, 185, 129, 0.1)",
    x: 500,
    y: 350,
    width: 250,
    height: 180,
  },
  {
    id: "dmz",
    name: "DMZ",
    color: "rgba(245, 101, 101, 0.1)",
    x: 150,
    y: 350,
    width: 200,
    height: 100,
  },
]

export function NetworkTopology() {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null)

  const getDeviceIcon = (type: string, size = 24) => {
    const iconProps = { size, className: "text-current" }
    switch (type) {
      case "router":
        return <Router {...iconProps} />
      case "switch":
        return <Network {...iconProps} />
      case "server":
        return <Server {...iconProps} />
      case "host":
        return <Monitor {...iconProps} />
      case "firewall":
        return <Shield {...iconProps} />
      case "access-point":
        return <Wifi {...iconProps} />
      case "internet":
        return <Globe {...iconProps} />
      default:
        return <Monitor {...iconProps} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "offline":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getDeviceColor = (type: string) => {
    switch (type) {
      case "router":
        return "#3b82f6"
      case "switch":
        return "#8b5cf6"
      case "server":
        return "#f59e0b"
      case "host":
        return "#6b7280"
      case "firewall":
        return "#ef4444"
      case "access-point":
        return "#10b981"
      case "internet":
        return "#06b6d4"
      default:
        return "#6b7280"
    }
  }

  const renderConnections = () => {
    const connections: JSX.Element[] = []

    networkDevices.forEach((device) => {
      device.connections.forEach((targetId) => {
        const target = networkDevices.find((d) => d.id === targetId)
        if (target) {
          const isHighlighted = hoveredDevice === device.id || hoveredDevice === targetId
          connections.push(
            <line
              key={`${device.id}-${targetId}`}
              x1={device.x}
              y1={device.y}
              x2={target.x}
              y2={target.y}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={isHighlighted ? 3 : 2}
              strokeDasharray={device.type === "access-point" && target.type === "host" ? "5,5" : "none"}
            />,
          )
        }
      })
    })

    return connections
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Network Topology</CardTitle>
          <CardDescription>Interactive network infrastructure diagram</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <span className="text-sm">Wired</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-0.5 bg-gray-300"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, transparent, transparent 2px, #d1d5db 2px, #d1d5db 4px)",
                }}
              ></div>
              <span className="text-sm">Wireless</span>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <TooltipProvider>
              <svg width="800" height="550" className="w-full">
                {/* LAN Groups */}
                {lanGroups.map((lan) => (
                  <g key={lan.id}>
                    <rect
                      x={lan.x}
                      y={lan.y}
                      width={lan.width}
                      height={lan.height}
                      fill={lan.color}
                      stroke="#d1d5db"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                      rx={8}
                    />
                    <text x={lan.x + 10} y={lan.y + 20} className="text-sm font-medium fill-gray-700">
                      {lan.name}
                    </text>
                  </g>
                ))}

                {/* Connections */}
                {renderConnections()}

                {/* Devices */}
                {networkDevices.map((device) => (
                  <Tooltip key={device.id}>
                    <TooltipTrigger asChild>
                      <g
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredDevice(device.id)}
                        onMouseLeave={() => setHoveredDevice(null)}
                        onClick={() => setSelectedDevice(device)}
                      >
                        {/* Device Background */}
                        <circle
                          cx={device.x}
                          cy={device.y}
                          r={hoveredDevice === device.id ? 28 : 25}
                          fill="white"
                          stroke={getDeviceColor(device.type)}
                          strokeWidth={hoveredDevice === device.id ? 3 : 2}
                          className="transition-all duration-200"
                        />

                        {/* Status Indicator */}
                        <circle
                          cx={device.x + 18}
                          cy={device.y - 18}
                          r={6}
                          fill={getStatusColor(device.status)}
                          stroke="white"
                          strokeWidth={2}
                        />

                        {/* Device Icon */}
                        <foreignObject x={device.x - 12} y={device.y - 12} width={24} height={24}>
                          <div
                            className="flex items-center justify-center w-full h-full"
                            style={{ color: getDeviceColor(device.type) }}
                          >
                            {getDeviceIcon(device.type)}
                          </div>
                        </foreignObject>

                        {/* Device Label */}
                        <text
                          x={device.x}
                          y={device.y + 45}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-700"
                        >
                          {device.name}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm">Type: {device.type}</p>
                        {device.ip && <p className="text-sm">IP: {device.ip}</p>}
                        <p className="text-sm">
                          Status: <span className="capitalize">{device.status}</span>
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </svg>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Device Details Panel */}
      {selectedDevice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getDeviceIcon(selectedDevice.type)}
              {selectedDevice.name}
              <Badge
                variant={
                  selectedDevice.status === "online"
                    ? "default"
                    : selectedDevice.status === "warning"
                      ? "secondary"
                      : "destructive"
                }
              >
                {selectedDevice.status}
              </Badge>
            </CardTitle>
            <CardDescription>Device configuration and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Device Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Type:</span> {selectedDevice.type}
                  </p>
                  {selectedDevice.ip && (
                    <p>
                      <span className="font-medium">IP Address:</span> {selectedDevice.ip}
                    </p>
                  )}
                  {selectedDevice.lan && (
                    <p>
                      <span className="font-medium">Network:</span> {selectedDevice.lan.toUpperCase()}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">{selectedDevice.status}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Connections</h4>
                <div className="space-y-1">
                  {selectedDevice.connections.length > 0 ? (
                    selectedDevice.connections.map((connId) => {
                      const connectedDevice = networkDevices.find((d) => d.id === connId)
                      return connectedDevice ? (
                        <div key={connId} className="flex items-center gap-2 text-sm">
                          {getDeviceIcon(connectedDevice.type, 16)}
                          <span>{connectedDevice.name}</span>
                        </div>
                      ) : null
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No outgoing connections</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">Configure</Button>
              <Button size="sm" variant="outline">
                Monitor
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedDevice(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkDevices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {networkDevices.filter((d) => d.status === "online").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warning Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {networkDevices.filter((d) => d.status === "warning").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {networkDevices.filter((d) => d.status === "offline").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
