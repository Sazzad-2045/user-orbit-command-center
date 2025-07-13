import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar as CalendarIcon,
  Users,
  Filter,
  History,
  ArrowLeft,
  User,
  Package
} from "lucide-react"

// Types
interface Plan {
  id: number
  name: string
  description: string
  features: string
  qrCodeLimit: number
  pricing: number
  billingCycle: string
  status: string
  subscriberCount: number
}

// Mock data
const mockPlans: Plan[] = [
  {
    id: 1,
    name: "Free",
    description: "Basic plan for individuals",
    features: "5 QR codes, Basic analytics",
    qrCodeLimit: 5,
    pricing: 0,
    billingCycle: "monthly",
    status: "active",
    subscriberCount: 1523
  },
  {
    id: 2,
    name: "Basic",
    description: "Perfect for small businesses",
    features: "50 QR codes, Advanced analytics, Custom branding",
    qrCodeLimit: 50,
    pricing: 9.99,
    billingCycle: "monthly",
    status: "active",
    subscriberCount: 856
  },
  {
    id: 3,
    name: "Premium",
    description: "Ideal for growing businesses",
    features: "500 QR codes, Premium analytics, Priority support",
    qrCodeLimit: 500,
    pricing: 29.99,
    billingCycle: "monthly",
    status: "active",
    subscriberCount: 342
  },
  {
    id: 4,
    name: "Enterprise",
    description: "For large organizations",
    features: "Unlimited QR codes, Enterprise analytics, Dedicated support",
    qrCodeLimit: -1,
    pricing: 99.99,
    billingCycle: "monthly",
    status: "active",
    subscriberCount: 89
  }
]

const mockUsers = [
  { id: 1, email: "john@example.com", name: "John Doe", currentPlan: "Basic" },
  { id: 2, email: "jane@example.com", name: "Jane Smith", currentPlan: "Premium" },
  { id: 3, email: "bob@example.com", name: "Bob Johnson", currentPlan: "Free" },
  { id: 4, email: "alice@example.com", name: "Alice Brown", currentPlan: "Enterprise" },
]

const mockPlanHistory = [
  {
    id: 1,
    planName: "Premium",
    action: "Updated QR Code Limit",
    oldValue: "200",
    newValue: "500",
    changedBy: "Admin",
    date: new Date("2024-01-15"),
    affectedUsers: 45
  },
  {
    id: 2,
    planName: "Basic",
    action: "Price Updated",
    oldValue: "$7.99",
    newValue: "$9.99",
    changedBy: "Admin",
    date: new Date("2024-01-10"),
    affectedUsers: 856
  }
]

// Form schemas
const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  features: z.string().min(1, "Features are required"),
  qrCodeLimit: z.number().min(1, "QR code limit must be at least 1"),
  pricing: z.number().min(0, "Pricing must be non-negative"),
  billingCycle: z.enum(["monthly", "quarterly", "biannual"]),
  status: z.enum(["active", "inactive"]),
  type: z.enum(["Dynamic", "Static"]),
  expiryDate: z.date().optional(), // Add expiryDate field
})

const assignPlanSchema = z.object({
  userId: z.string().min(1, "User selection is required"),
  planId: z.string().min(1, "Plan selection is required"),
  startDate: z.date().optional(),
  expiryDate: z.date().optional(),
})

type CreatePlanForm = z.infer<typeof createPlanSchema>;
type AssignPlanForm = z.infer<typeof assignPlanSchema>;

// Remove duplicate import and ensure React is imported for JSX

const PlanManagement = () => {
  const [plans, setPlans] = useState(mockPlans)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("plans");
  const didHashScroll = useRef(false);

  // Handle hash navigation for assign-plan
  useEffect(() => {
    if (window.location.hash === "#assign-plan" && !didHashScroll.current) {
      setActiveTab("assign");
      // Wait for tab to render
      setTimeout(() => {
        const el = document.getElementById("assign-plan");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        didHashScroll.current = true;
      }, 200);
    }
  }, []);

  const createForm = useForm<CreatePlanForm>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      status: "active",
      billingCycle: "monthly",
      type: "Dynamic",
      expiryDate: undefined,
    },
  })

  const assignForm = useForm<AssignPlanForm>({
    resolver: zodResolver(assignPlanSchema),
  })

  const onCreatePlan = (data: CreatePlanForm) => {
    const newPlan: Plan = {
      id: plans.length + 1,
      name: data.name,
      description: data.description,
      features: data.features,
      qrCodeLimit: data.qrCodeLimit,
      pricing: data.pricing,
      billingCycle: data.billingCycle,
      status: data.status,
      subscriberCount: 0
    }
    setPlans([...plans, newPlan])
    setIsCreateDialogOpen(false)
    createForm.reset()
    toast({
      title: "Plan Created",
      description: `${data.name} plan has been created successfully.`,
    })
  }

  const onAssignPlan = (data: AssignPlanForm) => {
    setIsAssignDialogOpen(false)
    assignForm.reset()
    toast({
      title: "Plan Assigned",
      description: "Plan has been assigned to the user successfully.",
    })
  }

  const onBulkAssign = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to assign plans to.",
        variant: "destructive",
      })
      return
    }
    setIsBulkAssignDialogOpen(false)
    setSelectedUsers([])
    toast({
      title: "Bulk Assignment Complete",
      description: `Plan assigned to ${selectedUsers.length} users successfully.`,
    })
  }

  const onEditPlan = (plan: any) => {
    setEditingPlan(plan)
    createForm.reset({
      name: plan.name,
      description: plan.description,
      features: plan.features,
      qrCodeLimit: plan.qrCodeLimit === -1 ? 999999 : plan.qrCodeLimit,
      pricing: plan.pricing,
      billingCycle: plan.billingCycle,
      status: plan.status,
    })
    setIsEditDialogOpen(true)
  }

  const onUpdatePlan = (data: CreatePlanForm) => {
    setPlans(plans.map(plan => 
      plan.id === editingPlan.id 
        ? { ...plan, ...data }
        : plan
    ))
    setIsEditDialogOpen(false)
    setEditingPlan(null)
    createForm.reset()
    toast({
      title: "Plan Updated",
      description: `${data.name} plan has been updated successfully.`,
    })
  }

  const onDeletePlan = (planId: number) => {
    setPlans(plans.filter(plan => plan.id !== planId))
    toast({
      title: "Plan Deleted",
      description: "Plan has been deleted successfully.",
    })
  }

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = mockUsers.filter(user =>
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Plan Management</h1>
        <p className="text-muted-foreground">
          Manage subscription plans, assign plans to users, and track plan modifications.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plans">View Plans</TabsTrigger>
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="assign">Assign Plans</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Assignment</TabsTrigger>
          <TabsTrigger value="history">Modification History</TabsTrigger>
        </TabsList>

        {/* View Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                  <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                    {plan.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{plan.description}</CardDescription>
                  <div className="space-y-2 text-sm">
                    <div><strong>Features:</strong> {plan.features}</div>
                    <div><strong>QR Code Limit:</strong> {plan.qrCodeLimit === -1 ? "Unlimited" : plan.qrCodeLimit}</div>
                    <div><strong>Pricing:</strong> ${plan.pricing}/{plan.billingCycle}</div>
                    <div><strong>Subscribers:</strong> {plan.subscriberCount}</div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create Plan Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>
                Create a new subscription plan with custom features and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreatePlan)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter plan name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="pricing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Type Dropdown */}
                    <FormField
                      control={createForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dynamic">Dynamic</SelectItem>
                              <SelectItem value="Static">Static</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter plan description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features</FormLabel>
                        <FormControl>
                          <Textarea placeholder="List plan features" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={createForm.control}
                      name="qrCodeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>QR Code Limit</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="100" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="billingCycle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Cycle</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select billing cycle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">3 Months</SelectItem>
                              <SelectItem value="biannual">6 Months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date Field */}
                    <FormField
                      control={createForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiring Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => createForm.reset()}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Plan</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assign Plan Tab */}
        <TabsContent value="assign">
          <div id="assign-plan">
          <Card>
            <CardHeader>
              <CardTitle>Assign Plan to User</CardTitle>
              <CardDescription>
                Select a user and assign them a subscription plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...assignForm}>
                <form onSubmit={assignForm.handleSubmit(onAssignPlan)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={assignForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select User</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={assignForm.control}
                      name="planId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Plan</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {plans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                  {plan.name} - ${plan.pricing}/{plan.billingCycle}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={assignForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={assignForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => assignForm.reset()}>
                      Cancel
                    </Button>
                    <Button type="submit">Assign Plan</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Bulk Assignment Tab */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Plan Assignment</CardTitle>
              <CardDescription>
                Select multiple users and assign them a common plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-80"
                  />
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedUsers.length === filteredUsers.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUsers(filteredUsers.map(u => u.id))
                              } else {
                                setSelectedUsers([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Plan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, user.id])
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.currentPlan}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span>{selectedUsers.length} users selected</span>
                    <div className="flex items-center space-x-2">
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id.toString()}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={onBulkAssign}>
                        Assign Plan
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modification History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Plan Modification History</CardTitle>
              <CardDescription>
                Track all changes made to subscription plans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Affected Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPlanHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.planName}</TableCell>
                      <TableCell>{history.action}</TableCell>
                      <TableCell>{history.oldValue}</TableCell>
                      <TableCell>{history.newValue}</TableCell>
                      <TableCell>{history.changedBy}</TableCell>
                      <TableCell>{format(history.date, "PPP")}</TableCell>
                      <TableCell>{history.affectedUsers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update the plan details. Changes can be applied to existing subscribers.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onUpdatePlan)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter plan name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="pricing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter plan description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List plan features" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={createForm.control}
                  name="qrCodeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QR Code Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="100" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">3 Months</SelectItem>
                          <SelectItem value="biannual">6 Months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Plan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlanManagement;