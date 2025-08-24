import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Clock, User, AlertTriangle, CheckCircle, Edit, Trash2, Search } from "lucide-react";
import type { FollowUp, Lead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const followUpSchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  assignedTo: z.string().optional(),
});

type FollowUpFormData = z.infer<typeof followUpSchema>;

const followUpPriorities = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

const followUpStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function CRMFollowUps() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followUps, isLoading } = useQuery<FollowUp[]>({
    queryKey: ["/api/follow-ups", searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      
      const response = await fetch(`/api/follow-ups?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch follow-ups");
      return response.json();
    },
  });

  const { data: leads } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      leadId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
      assignedTo: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FollowUpFormData) => {
      const followUpData = {
        ...data,
        dueDate: new Date(data.dueDate),
        assignedTo: data.assignedTo || null,
      };
      await apiRequest("POST", "/api/follow-ups", followUpData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Follow-up created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create follow-up",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FollowUpFormData> }) => {
      const followUpData: any = { ...data };
      if (data.dueDate) {
        followUpData.dueDate = new Date(data.dueDate);
      }
      if (data.assignedTo === "") {
        followUpData.assignedTo = null;
      }
      await apiRequest("PUT", `/api/follow-ups/${id}`, followUpData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      setEditingFollowUp(null);
      form.reset();
      toast({
        title: "Success",
        description: "Follow-up updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update follow-up",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/follow-ups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      toast({
        title: "Success",
        description: "Follow-up deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete follow-up",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FollowUpFormData) => {
    if (editingFollowUp) {
      updateMutation.mutate({ id: editingFollowUp.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (followUp: FollowUp) => {
    const dueDate = new Date(followUp.dueDate);
    setEditingFollowUp(followUp);
    form.reset({
      leadId: followUp.leadId,
      title: followUp.title,
      description: followUp.description || "",
      dueDate: dueDate.toISOString().split('T')[0],
      priority: followUp.priority,
      status: followUp.status,
      assignedTo: followUp.assignedTo || "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (followUpId: string) => {
    if (confirm("Are you sure you want to delete this follow-up?")) {
      deleteMutation.mutate(followUpId);
    }
  };

  const handleComplete = (followUpId: string) => {
    updateMutation.mutate({ 
      id: followUpId, 
      data: { status: "completed" } 
    });
  };

  const getPriorityColor = (priority: string) => {
    return followUpPriorities.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    return followUpStatuses.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityLabel = (priority: string) => {
    return followUpPriorities.find(p => p.value === priority)?.label || priority;
  };

  const getStatusLabel = (status: string) => {
    return followUpStatuses.find(s => s.value === status)?.label || status;
  };

  const getLeadName = (leadId: string) => {
    const lead = leads?.find(l => l.id === leadId);
    return lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown Lead';
  };

  const isOverdue = (dueDate: string | Date) => {
    const due = new Date(dueDate);
    return due < new Date() && due.toDateString() !== new Date().toDateString();
  };

  const openCreateDialog = () => {
    setEditingFollowUp(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  // Filter follow-ups based on search and filters
  const filteredFollowUps = followUps?.filter((followUp) => {
    const matchesSearch = 
      followUp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLeadName(followUp.leadId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || followUp.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Follow-up Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track and complete follow-up tasks
            </p>
          </div>
          <div className="flex space-x-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} data-testid="button-new-followup">
                  <Plus className="w-4 h-4 mr-2" />
                  New Follow-up
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingFollowUp ? "Edit Follow-up" : "Create New Follow-up"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingFollowUp ? "Update follow-up information" : "Create a new follow-up task for a lead"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="leadId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lead</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-lead">
                                <SelectValue placeholder="Select a lead" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leads?.map((lead) => (
                                <SelectItem key={lead.id} value={lead.id}>
                                  {lead.firstName} {lead.lastName} - {lead.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Follow up on property interest" {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-due-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-priority">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {followUpPriorities.map((priority) => (
                                  <SelectItem key={priority.value} value={priority.value}>
                                    {priority.label}
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
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {followUpStatuses.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., John Doe" {...field} data-testid="input-assigned-to" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional details about the follow-up..." {...field} data-testid="textarea-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-save-followup"
                      >
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingFollowUp ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search follow-ups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {followUpStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-priority">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {followUpPriorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
            Clear Filters
          </Button>
        </div>

        {/* Follow-ups List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading follow-ups...</div>
            </div>
          ) : filteredFollowUps && filteredFollowUps.length > 0 ? (
            filteredFollowUps.map((followUp) => (
              <Card key={followUp.id} className={`cursor-pointer hover:shadow-md transition-shadow ${isOverdue(followUp.dueDate) && followUp.status === 'pending' ? 'border-red-200' : ''}`} data-testid={`card-followup-${followUp.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {followUp.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(followUp.priority)}>
                            {getPriorityLabel(followUp.priority)}
                          </Badge>
                          <Badge className={getStatusColor(followUp.status)}>
                            {getStatusLabel(followUp.status)}
                          </Badge>
                          {isOverdue(followUp.dueDate) && followUp.status === 'pending' && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {getLeadName(followUp.leadId)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Due: {new Date(followUp.dueDate).toLocaleDateString()}
                        </div>
                        {followUp.assignedTo && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Assigned to: {followUp.assignedTo}
                          </div>
                        )}
                      </div>
                      
                      {followUp.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {followUp.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {followUp.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleComplete(followUp.id)}
                          data-testid={`button-complete-followup-${followUp.id}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(followUp)}
                        data-testid={`button-edit-followup-${followUp.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(followUp.id)}
                        data-testid={`button-delete-followup-${followUp.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No follow-ups found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first follow-up task.
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Follow-up
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}