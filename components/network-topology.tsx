"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Router, Network, Server, Monitor, Wifi, Shield, Globe, HardDrive, Activity } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

interface NetworkDevice {
  id: string
  name: string
  type: "router" | "switch" | "server" | "host" | "firewall" | "access-point" | "internet" | "cloud"
  x: number
  y: number
  status: "online" | "offline" | "warning"
  ip?: string
  connections: string[]
  model?: string
  ports?: number
}

const networkDevices: NetworkDevice[] = [
  // Internet/Cloud
  {
    id: "internet",
    name: "Internet",
    type: "cloud",
    x: 400,
    y: 80,
    status: "online",
    connections: ["router1"],
  },

  // Core Infrastructure
  {
    id: "router1",
    name: "R1-Core",
    type: "router",
    x: 400,
    y: 200,
    status: "online",
    ip: "10.0.0.1",
    model: "Cisco 2911",
    ports: 4,
    connections: ["router2", "router3", "firewall1"],
  },
  {
    id: "router2",
    name: "R2-Branch",
    type: "router",
    x: 200,
    y: 320,
    status: "online",
    ip: "10.0.1.1",
    model: "Cisco 1941",
    ports: 2,
    connections: ["switch1"],
  },
  {
    id: "router3",
    name: "R3-Branch",
    type: "router",
    x: 600,
    y: 320,
    status: "online",
    ip: "10.0.2.1",
    model: "Cisco 1941",
    ports: 2,
    connections: ["switch2"],
  },

  // Security
  {
    id: "firewall1",
    name: "FW1-ASA",
    type: "firewall",
    x: 400,
    y: 320,
    status: "warning",
    ip: "192.168.100.1",
    model: "ASA 5506-X",
    connections: ["switch3"],
  },

  // Distribution Switches
  {
    id: "switch1",
    name: "SW1-Access",
    type: "switch",
    x: 200,
    y: 450,
    status: "online",
    ip: "10.0.1.10",
    model: "Catalyst 2960",
    ports: 24,
    connections: ["host1", "host2", "ap1"],
  },
  {
    id: "switch2",
    name: "SW2-Access",
    type: "switch",
    x: 600,
    y: 450,
    status: "online",
    ip: "10.0.2.10",
    model: "Catalyst 2960",
    ports: 24,
    connections: ["host3", "host4", "server1"],
  },
  {
    id: "switch3",
    name: "SW3-DMZ",
    type: "switch",
    x: 400,
    y: 450,
    status: "online",
    ip: "192.168.100.10",
    model: "Catalyst 3560",
    ports: 48,
    connections: ["server2", "server3"],
  },

  // End Devices - LAN 1
  {
    id: "host1",
    name: "PC1",
    type: "host",
    x: 100,
    y: 580,
    status: "online",
    ip: "10.0.1.101",
    connections: [],
  },
  {
    id: "host2",
    name: "PC2",
    type: "host",
    x: 200,
    y: 580,
    status: "online",
    ip: "10.0.1.102",
    connections: [],
  },
  {
    id: "ap1",
    name: "AP1-Wireless",
    type: "access-point",
    x: 300,
    y: 580,
    status: "online",
    ip: "10.0.1.50",
    model: "Aironet 2702i",
    connections: ["mobile1", "laptop1"],
  },

  // Wireless Devices
  {
    id: "mobile1",
    name: "Mobile-01",
    type: "host",
    x: 280,
    y: 680,
    status: "online",
    ip: "10.0.1.201",
    connections: [],
  },
  {
    id: "laptop1",
    name: "Laptop-01",
    type: "host",
    x: 320,
    y: 680,
    status: "online",
    ip: "10.0.1.202",
    connections: [],
  },

  // End Devices - LAN 2
  {
    id: "host3",
    name: "PC3",
    type: "host",
    x: 550,
    y: 580,
    status: "online",
    ip: "10.0.2.101",
    connections: [],
  },
  {
    id: "host4",
    name: "PC4",
    type: "host",
    x: 650,
    y: 580,
    status: "offline",
    ip: "10.0.2.102",
    connections: [],
  },
  {
    id: "server1",
    name: "File-Server",
    type: "server",
    x: 700,
    y: 580,
    status: "online",
    ip: "10.0.2.200",
    model: "Dell R740",
    connections: [],
  },

  // DMZ Servers
  {
    id: "server2",
    name: "Web-Server",
    type: "server",
    x: 350,
    y: 580,
    status: "online",
    ip: "192.168.100.10",
    model: "Dell R640",
    connections: [],
  },
  {
    id: "server3",
    name: "Mail-Server",
    type: "server",
    x: 450,
    y: 580,
    status: "online",
    ip: "192.168.100.11",
    model: "Dell R630",
    connections: [],
  },
]

export function NetworkTopology() {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null)

  const [deviceStatuses, setDeviceStatuses] = useState<Record<string, "online" | "offline" | "warning">>(
    networkDevices.reduce(
      (acc, device) => {
        acc[device.id] = device.status
        return acc
      },
      {} as Record<string, "online" | "offline" | "warning">,
    ),
  )

  const toggleDeviceStatus = (deviceId: string) => {
    setDeviceStatuses((prev) => {
      const currentStatus = prev[deviceId]
      const newStatus = currentStatus === "online" ? "offline" : "online"

      // Update connected devices status based on critical infrastructure
      const updatedStatuses = { ...prev, [deviceId]: newStatus }

      // If it's a critical device (router, switch, firewall), affect connected devices
      const device = networkDevices.find((d) => d.id === deviceId)
      if (device && (device.type === "router" || device.type === "switch" || device.type === "firewall")) {
        device.connections.forEach((connId) => {
          const connectedDevice = networkDevices.find((d) => d.id === connId)
          if (connectedDevice && connectedDevice.type !== "internet") {
            if (newStatus === "offline") {
              // If critical device goes offline, connected devices show warning or offline
              updatedStatuses[connId] = connectedDevice.type === "host" ? "offline" : "warning"
            } else {
              // If critical device comes online, restore connected devices
              updatedStatuses[connId] = "online"
            }
          }
        })
      }

      return updatedStatuses
    })
  }

  const getDeviceIcon = (type: string, size = 32) => {
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
      case "cloud":
        return <Globe {...iconProps} />
      default:
        return <Monitor {...iconProps} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22c55e"
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
        return "#1e40af"
      case "switch":
        return "#7c3aed"
      case "server":
        return "#dc2626"
      case "host":
        return "#374151"
      case "firewall":
        return "#dc2626"
      case "access-point":
        return "#059669"
      case "cloud":
        return "#0891b2"
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
          const isWireless = device.type === "access-point" || target.type === "access-point"

          const sourceStatus = deviceStatuses[device.id]
          const targetStatus = deviceStatuses[targetId]
          const isConnectionDown = sourceStatus === "offline" || targetStatus === "offline"

          connections.push(
            <line
              key={`${device.id}-${targetId}`}
              x1={device.x}
              y1={device.y}
              x2={target.x}
              y2={target.y}
              stroke={isConnectionDown ? "#ef4444" : isHighlighted ? "#3b82f6" : "#64748b"}
              strokeWidth={isHighlighted ? 3 : 2}
              strokeDasharray={isConnectionDown ? "3,3" : isWireless ? "8,4" : "none"}
              opacity={isConnectionDown ? 0.4 : 0.8}
            />,
          )
        }
      })
    })

    return connections
  }

  const renderDevice = (device: NetworkDevice) => {
    const isHovered = hoveredDevice === device.id
    const deviceColor = getDeviceColor(device.type)
    const currentStatus = deviceStatuses[device.id]
    const statusColor = getStatusColor(currentStatus)
    const isOffline = currentStatus === "offline"

    return (
      <Tooltip key={device.id}>
        <TooltipTrigger asChild>
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredDevice(device.id)}
            onMouseLeave={() => setHoveredDevice(null)}
            onClick={() => setSelectedDevice(device)}
          >
            {/* Device Shadow */}
            <rect
              x={device.x - 35}
              y={device.y - 35}
              width={70}
              height={70}
              rx={8}
              fill="rgba(0,0,0,0.1)"
              transform="translate(2,2)"
              opacity={isOffline ? 0.3 : 1}
            />

            {/* Device Background */}
            <rect
              x={device.x - 35}
              y={device.y - 35}
              width={70}
              height={70}
              rx={8}
              fill={isOffline ? "#f3f4f6" : "white"}
              stroke={deviceColor}
              strokeWidth={isHovered ? 3 : 2}
              strokeDasharray={isOffline ? "5,5" : "none"}
              opacity={isOffline ? 0.6 : 1}
              className="transition-all duration-200"
            />

            {/* Device Type Indicator */}
            <rect
              x={device.x - 35}
              y={device.y - 35}
              width={70}
              height={12}
              rx={8}
              fill={deviceColor}
              opacity={isOffline ? 0.4 : 0.8}
            />

            {/* Status Indicator */}
            <circle cx={device.x + 25} cy={device.y - 25} r={6} fill={statusColor} stroke="white" strokeWidth={2} />

            {/* Power Button */}
            <circle
              cx={device.x - 25}
              cy={device.y - 25}
              r={8}
              fill={currentStatus === "online" ? "#22c55e" : "#ef4444"}
              stroke="white"
              strokeWidth={2}
              className="cursor-pointer hover:opacity-80"
              onClick={(e) => {
                e.stopPropagation()
                toggleDeviceStatus(device.id)
              }}
            />
            <text
              x={device.x - 25}
              y={device.y - 21}
              textAnchor="middle"
              className="text-xs font-bold fill-white pointer-events-none"
            >
              {currentStatus === "online" ? "●" : "○"}
            </text>

            {/* Shutdown Button */}
            <circle
              cx={device.x + 25}
              cy={device.y + 25}
              r={8}
              fill="#ef4444"
              stroke="white"
              strokeWidth={2}
              className="cursor-pointer hover:opacity-80"
              onClick={(e) => {
                e.stopPropagation()
                if (currentStatus === "online") {
                  toggleDeviceStatus(device.id)
                }
              }}
            />
            <text
              x={device.x + 25}
              y={device.y + 29}
              textAnchor="middle"
              className="text-xs font-bold fill-white pointer-events-none"
            >
              ⏻
            </text>

            {/* Shutdown Label */}
            {currentStatus === "online" && (
              <text
                x={device.x + 25}
                y={device.y + 45}
                textAnchor="middle"
                className="text-xs fill-red-600 font-medium"
              >
                SHUT
              </text>
            )}

            {/* Device Icon */}
            <foreignObject x={device.x - 16} y={device.y - 16} width={32} height={32}>
              <div
                className="flex items-center justify-center w-full h-full transition-all duration-200"
                style={{
                  color: isOffline ? "#9ca3af" : deviceColor,
                  opacity: isOffline ? 0.5 : 1,
                }}
              >
                {getDeviceIcon(device.type)}
              </div>
            </foreignObject>

            {/* Offline Indicator */}
            {isOffline && (
              <text x={device.x} y={device.y + 5} textAnchor="middle" className="text-xs font-bold fill-red-500">
                OFFLINE
              </text>
            )}

            {/* Device Label */}
            <text
              x={device.x}
              y={device.y + 50}
              textAnchor="middle"
              className={`text-xs font-semibold ${isOffline ? "fill-gray-400" : "fill-gray-800"}`}
            >
              {device.name}
            </text>

            {/* IP Address */}
            {device.ip && (
              <text
                x={device.x}
                y={device.y + 65}
                textAnchor="middle"
                className={`text-xs font-mono ${isOffline ? "fill-gray-400" : "fill-gray-600"}`}
              >
                {device.ip}
              </text>
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{device.name}</p>
            <p className="text-sm">Type: {device.type.charAt(0).toUpperCase() + device.type.slice(1)}</p>
            {device.model && <p className="text-sm">Model: {device.model}</p>}
            {device.ip && <p className="text-sm font-mono">IP: {device.ip}</p>}
            {device.ports && <p className="text-sm">Ports: {device.ports}</p>}
            <p className="text-sm">
              Status:{" "}
              <span className="capitalize font-medium" style={{ color: statusColor }}>
                {currentStatus}
              </span>
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Left button: Toggle power</p>
              <p>• Right button: Emergency shutdown</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Topology - GNS3 Style
          </CardTitle>
          <CardDescription>Interactive network infrastructure diagram with professional layout</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm">Router</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span className="text-sm">Switch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm">Server/Firewall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-sm">Host/PC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm">Access Point</span>
            </div>
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
              <div className="w-6 h-0.5 bg-gray-600"></div>
              <span className="text-sm">Wired</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-0.5 bg-gray-600"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, #4b5563 0, #4b5563 4px, transparent 4px, transparent 8px)",
                }}
              ></div>
              <span className="text-sm">Wireless</span>
            </div>
          </div>

          {/* Network Diagram */}
          <div
            className="border-2 border-gray-200 rounded-lg p-6 bg-white"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
              backgroundSize: "20px 20px",
            }}
          >
            <TooltipProvider>
              <svg width="800" height="750" className="w-full">
                {/* Network Zones */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Zone Labels */}
                <text x={50} y={30} className="text-lg font-bold fill-blue-700">
                  Internet
                </text>
                <text x={50} y={180} className="text-lg font-bold fill-green-700">
                  Core Network
                </text>
                <text x={50} y={300} className="text-lg font-bold fill-purple-700">
                  Distribution Layer
                </text>
                <text x={50} y={430} className="text-lg font-bold fill-orange-700">
                  Access Layer
                </text>
                <text x={50} y={560} className="text-lg font-bold fill-gray-700">
                  End Devices
                </text>

                {/* Zone Separators */}
                <line x1={0} y1={120} x2={800} y2={120} stroke="#e5e7eb" strokeWidth={2} strokeDasharray="10,5" />
                <line x1={0} y1={260} x2={800} y2={260} stroke="#e5e7eb" strokeWidth={2} strokeDasharray="10,5" />
                <line x1={0} y1={390} x2={800} y2={390} stroke="#e5e7eb" strokeWidth={2} strokeDasharray="10,5" />
                <line x1={0} y1={520} x2={800} y2={520} stroke="#e5e7eb" strokeWidth={2} strokeDasharray="10,5" />

                {/* Connections */}
                {renderConnections()}

                {/* Devices */}
                {networkDevices.map(renderDevice)}
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
              {getDeviceIcon(selectedDevice.type, 24)}
              {selectedDevice.name}
              <Badge
                variant={
                  deviceStatuses[selectedDevice.id] === "online"
                    ? "default"
                    : deviceStatuses[selectedDevice.id] === "warning"
                      ? "secondary"
                      : "destructive"
                }
              >
                {deviceStatuses[selectedDevice.id]}
              </Badge>
              <Button
                size="sm"
                variant={deviceStatuses[selectedDevice.id] === "online" ? "destructive" : "default"}
                onClick={() => toggleDeviceStatus(selectedDevice.id)}
                className="ml-auto"
              >
                {deviceStatuses[selectedDevice.id] === "online" ? "Power Off" : "Power On"}
              </Button>
            </CardTitle>
            <CardDescription>Device configuration and network information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Device Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{selectedDevice.type}</span>
                    </div>
                    {selectedDevice.model && (
                      <div className="flex justify-between">
                        <span className="font-medium">Model:</span>
                        <span>{selectedDevice.model}</span>
                      </div>
                    )}
                    {selectedDevice.ip && (
                      <div className="flex justify-between">
                        <span className="font-medium">IP Address:</span>
                        <span className="font-mono">{selectedDevice.ip}</span>
                      </div>
                    )}
                    {selectedDevice.ports && (
                      <div className="flex justify-between">
                        <span className="font-medium">Ports:</span>
                        <span>{selectedDevice.ports}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span
                        className="capitalize font-medium"
                        style={{ color: getStatusColor(deviceStatuses[selectedDevice.id]) }}
                      >
                        {deviceStatuses[selectedDevice.id]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Impact Analysis */}
                {deviceStatuses[selectedDevice.id] === "offline" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-1">Impact Analysis</h5>
                    <p className="text-sm text-red-700">This device is offline. Connected devices may be affected.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Connected Devices</h4>
                  <div className="space-y-2">
                    {selectedDevice.connections.length > 0 ? (
                      selectedDevice.connections.map((connId) => {
                        const connectedDevice = networkDevices.find((d) => d.id === connId)
                        const connectedStatus = deviceStatuses[connId]
                        return connectedDevice ? (
                          <div key={connId} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div style={{ color: getDeviceColor(connectedDevice.type) }}>
                              {getDeviceIcon(connectedDevice.type, 16)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{connectedDevice.name}</div>
                              {connectedDevice.ip && (
                                <div className="text-xs text-gray-600 font-mono">{connectedDevice.ip}</div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getStatusColor(connectedStatus) }}
                              ></div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleDeviceStatus(connId)}
                                className="h-6 px-2 text-xs"
                              >
                                {connectedStatus === "online" ? "Off" : "On"}
                              </Button>
                            </div>
                          </div>
                        ) : null
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No outgoing connections</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button size="sm">
                <Monitor className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Monitor
              </Button>
              <Button size="sm" variant="outline">
                <HardDrive className="w-4 h-4 mr-2" />
                Logs
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedDevice(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Router className="w-4 h-4" />
              Routers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {networkDevices.filter((d) => d.type === "router").length}
            </div>
            <div className="text-xs text-gray-500">
              {networkDevices.filter((d) => d.type === "router" && deviceStatuses[d.id] === "online").length} online
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="w-4 h-4" />
              Switches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {networkDevices.filter((d) => d.type === "switch").length}
            </div>
            <div className="text-xs text-gray-500">
              {networkDevices.filter((d) => d.type === "switch" && deviceStatuses[d.id] === "online").length} online
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="w-4 h-4" />
              Servers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {networkDevices.filter((d) => d.type === "server").length}
            </div>
            <div className="text-xs text-gray-500">
              {networkDevices.filter((d) => d.type === "server" && deviceStatuses[d.id] === "online").length} online
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Hosts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {networkDevices.filter((d) => d.type === "host").length}
            </div>
            <div className="text-xs text-gray-500">
              {networkDevices.filter((d) => d.type === "host" && deviceStatuses[d.id] === "online").length} online
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(deviceStatuses).filter((status) => status === "online").length}/{networkDevices.length}
            </div>
            <div className="text-xs text-gray-500">devices online</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
