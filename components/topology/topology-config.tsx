"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Plus, Network, Router, Server, Monitor, Wifi, Shield, Save, Download, Upload } from "lucide-react"

interface TopologyConfigProps {
  userRole: string
}

export function TopologyConfig({ userRole }: TopologyConfigProps) {
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "router",
    ip: "",
    model: "",
    x: 400,
    y: 300,
  })

  const canConfigure = userRole === "admin" || userRole === "operator"

  const deviceTypes = [
    { value: "router", label: "Router", icon: Router },
    { value: "switch", label: "Switch", icon: Network },
    { value: "server", label: "Server", icon: Server },
    { value: "host", label: "Host/PC", icon: Monitor },
    { value: "firewall", label: "Firewall", icon: Shield },
    { value: "access-point", label: "Access Point", icon: Wifi },
  ]

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.ip) {
      // Here you would add the device to your topology state
      console.log("Adding device:", newDevice)
      setNewDevice({ name: "", type: "router", ip: "", model: "", x: 400, y: 300 })
      setIsAddDeviceOpen(false)
    }
  }

  const handleExportTopology = () => {
    // Export topology configuration
    const config = {
      devices: [], // Your devices array
      connections: [], // Your connections array
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "network-topology.json"
    a.click()
  }

  if (!canConfigure) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Topology Configuration
          </CardTitle>
          <CardDescription>Configure network topology and devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You need admin or operator privileges to configure the topology.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Topology Configuration
              </CardTitle>
              <CardDescription>Configure network topology and devices</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportTopology}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devices" className="space-y-4">
            <TabsList>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Device Management</h3>
                <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Device
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Device</DialogTitle>
                      <DialogDescription>Configure a new network device for the topology</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="device-name">Device Name</Label>
                        <Input
                          id="device-name"
                          value={newDevice.name}
                          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                          placeholder="e.g., R1-Core, SW1-Access"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device-type">Device Type</Label>
                        <Select
                          value={newDevice.type}
                          onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {deviceTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device-ip">IP Address</Label>
                        <Input
                          id="device-ip"
                          value={newDevice.ip}
                          onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                          placeholder="e.g., 192.168.1.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device-model">Model (Optional)</Label>
                        <Input
                          id="device-model"
                          value={newDevice.model}
                          onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                          placeholder="e.g., Cisco 2911, Catalyst 2960"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="device-x">X Position</Label>
                          <Input
                            id="device-x"
                            type="number"
                            value={newDevice.x}
                            onChange={(e) => setNewDevice({ ...newDevice, x: Number.parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="device-y">Y Position</Label>
                          <Input
                            id="device-y"
                            type="number"
                            value={newDevice.y}
                            onChange={(e) => setNewDevice({ ...newDevice, y: Number.parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddDevice} className="w-full">
                        Add Device
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deviceTypes.map((type) => (
                  <Card key={type.value}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <type.icon className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-gray-600">Available for deployment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Connection Management</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center py-8">
                    <Network className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Connection Editor</h4>
                    <p className="text-gray-600">Drag and drop to create connections between devices</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-medium">Topology Settings</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Display Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show Grid</Label>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show Labels</Label>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show IP Addresses</Label>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Network Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Subnet</Label>
                      <Input placeholder="192.168.1.0/24" />
                    </div>
                    <div className="space-y-2">
                      <Label>SNMP Community</Label>
                      <Input placeholder="public" />
                    </div>
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
