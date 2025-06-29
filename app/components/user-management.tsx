"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Edit, Trash2, Shield } from "lucide-react"

interface UserManagementProps {
  currentUser: { username: string; role: string }
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "admin",
      email: "admin@company.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 10:30:00",
    },
    {
      id: "2",
      username: "operator",
      email: "operator@company.com",
      role: "operator",
      status: "active",
      lastLogin: "2024-01-15 09:15:00",
    },
    {
      id: "3",
      username: "viewer",
      email: "viewer@company.com",
      role: "viewer",
      status: "active",
      lastLogin: "2024-01-14 16:45:00",
    },
    {
      id: "4",
      username: "john.doe",
      email: "john.doe@company.com",
      role: "operator",
      status: "inactive",
      lastLogin: "2024-01-10 14:20:00",
    },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "viewer" as const,
    password: "",
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "operator":
        return "default"
      case "viewer":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  const handleAddUser = () => {
    if (newUser.username && newUser.email && newUser.password) {
      const user = {
        id: Date.now().toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        lastLogin: "Never",
      }
      setUsers([...users, user])
      setNewUser({ username: "", email: "", role: "viewer", password: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const canManageUsers = currentUser.role === "admin"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage system users and their access permissions</CardDescription>
            </div>
            {canManageUsers && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with appropriate permissions</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-username">Username</Label>
                      <Input
                        id="new-username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email</Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="operator">Operator</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddUser} className="w-full">
                      Create User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                {canManageUsers && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{user.lastLogin}</TableCell>
                  {canManageUsers && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleUserStatus(user.id)}>
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.username === currentUser.username}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>Overview of role-based access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-red-600 mb-2">Admin</h4>
              <ul className="text-sm space-y-1">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• Topology configuration</li>
                <li>• Device control</li>
                <li>• System settings</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">Operator</h4>
              <ul className="text-sm space-y-1">
                <li>• View all sections</li>
                <li>• Device monitoring</li>
                <li>• Basic device control</li>
                <li>• Alert management</li>
                <li>• Performance monitoring</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-600 mb-2">Viewer</h4>
              <ul className="text-sm space-y-1">
                <li>• Read-only access</li>
                <li>• View topology</li>
                <li>• View device status</li>
                <li>• View alerts</li>
                <li>• View performance data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
