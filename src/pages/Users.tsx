import { useState, useMemo } from "react"
import { Search, Filter, MoreHorizontal, Eye, Edit, RotateCcw, CreditCard, UserCheck, UserX, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Premium",
    role: "Owner",
    status: "Active",
    signupDate: "2024-01-15",
    lastActive: "2024-07-07",
    country: "United States"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    plan: "Basic",
    role: "Admin",
    status: "Active",
    signupDate: "2024-02-20",
    lastActive: "2024-07-05",
    country: "Canada"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    plan: "Free",
    role: "Editor",
    status: "Inactive",
    signupDate: "2024-03-10",
    lastActive: "2024-06-20",
    country: "United Kingdom"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    plan: "Enterprise",
    role: "Viewer",
    status: "Active",
    signupDate: "2024-01-05",
    lastActive: "2024-07-08",
    country: "Australia"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    plan: "Premium",
    role: "Admin",
    status: "Active",
    signupDate: "2024-04-12",
    lastActive: "2024-07-06",
    country: "Germany"
  }
]

const plans = ["All Plans", "Free", "Basic", "Premium", "Enterprise"]
const roles = ["All Roles", "Owner", "Admin", "Editor", "Viewer"]
const statuses = ["All Status", "Active", "Inactive"]
const countries = ["All Countries", ...Array.from(new Set(mockUsers.map(user => user.country)))]
const itemsPerPageOptions = [10, 20, 50, 100]

export default function Users() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("All Plans")
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [users, setUsers] = useState(mockUsers)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  const [deleteReason, setDeleteReason] = useState("")

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlan = selectedPlan === "All Plans" || user.plan === selectedPlan
      const matchesRole = selectedRole === "All Roles" || user.role === selectedRole
      const matchesStatus = selectedStatus === "All Status" || user.status === selectedStatus
      const matchesCountry = selectedCountry === "All Countries" || user.country === selectedCountry
      
      return matchesSearch && matchesPlan && matchesRole && matchesStatus && matchesCountry
    })
  }, [users, searchTerm, selectedPlan, selectedRole, selectedStatus, selectedCountry])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleStatusToggle = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ))
    toast({
      title: "Status Updated",
      description: "User status has been successfully updated."
    })
  }

  const handleDeleteUser = () => {
    if (!deleteReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for deletion.",
        variant: "destructive"
      })
      return
    }
    
    setUsers(users.filter(user => user.id !== deletingUser.id))
    setDeletingUser(null)
    setDeleteReason("")
    toast({
      title: "User Deleted",
      description: "User account has been permanently deleted."
    })
  }

  const handleEditUser = (updatedUser: any) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user))
    setEditingUser(null)
    toast({
      title: "User Updated",
      description: "User information has been successfully updated."
    })
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Free": return "secondary"
      case "Basic": return "outline"
      case "Premium": return "default"
      case "Enterprise": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary"
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, subscriptions, and permissions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {plans.map(plan => (
                <SelectItem key={plan} value={plan}>{plan}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredUsers.length === 0 ? "No User Found" : `Showing ${filteredUsers.length} user${filteredUsers.length === 1 ? '' : 's'}`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map(option => (
                <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getPlanBadgeVariant(user.plan)}>{user.plan}</Badge>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell>{new Date(user.signupDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: "View Profile", description: "Opening user profile..." })}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Info
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Password Reset", description: "Password reset link sent to user's email." })}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Change Plan", description: "Plan change dialog would open here." })}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Change Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
                        {user.status === "Active" ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Reactivate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={() => handleEditUser(editingUser)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. Please provide a reason for deleting this account.
            </p>
            <div>
              <Label htmlFor="deleteReason">Why are you deleting this account?</Label>
              <Textarea
                id="deleteReason"
                placeholder="Enter reason for deletion..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}