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
import { Plus, Calendar, Clock, MapPin, User, Edit, Trash2, Search } from "lucide-react";
import type { Appointment, Lead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const appointmentSchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  location: z.string().min(1, "Location is required"),
  status: z.string().min(1, "Status is required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const appointmentStatuses = [
  { value: "scheduled", label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "no_show", label: "No Show", color: "bg-red-100 text-red-800" },
];

export default function CRMAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      
      const response = await fetch(`/api/appointments?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
  });

  const { data: leads } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      leadId: "",
      title: "",
      description: "",
      appointmentDate: "",
      appointmentTime: "",
      duration: 60,
      location: "",
      status: "scheduled",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
      const appointmentData = {
        leadId: data.leadId,
        title: data.title,
        description: data.description,
        appointmentDate: appointmentDateTime,
        duration: Number(data.duration),
        location: data.location,
        status: data.status,
      };
      await apiRequest("POST", "/api/appointments", appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AppointmentFormData> }) => {
      const appointmentData: any = { ...data };
      if (data.appointmentDate && data.appointmentTime) {
        const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
        appointmentData.appointmentDate = appointmentDateTime;
      }
      if (data.duration) {
        appointmentData.duration = Number(data.duration);
      }
      await apiRequest("PUT", `/api/appointments/${id}`, appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setEditingAppointment(null);
      form.reset();
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: AppointmentFormData) => {
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    setEditingAppointment(appointment);
    form.reset({
      leadId: appointment.leadId,
      title: appointment.title,
      description: appointment.description || "",
      appointmentDate: appointmentDate.toISOString().split('T')[0],
      appointmentTime: appointmentDate.toTimeString().substring(0, 5),
      duration: appointment.duration ?? 60,
      location: appointment.location ?? "",
      status: appointment.status,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteMutation.mutate(appointmentId);
    }
  };

  const getStatusColor = (status: string) => {
    return appointmentStatuses.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    return appointmentStatuses.find(s => s.value === status)?.label || status;
  };

  const getLeadName = (leadId: string) => {
    const lead = leads?.find(l => l.id === leadId);
    return lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown Lead';
  };

  const openCreateDialog = () => {
    setEditingAppointment(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Appointment Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule and manage client appointments with ease
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg border">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                📋 List
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={viewMode === "calendar" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                📅 Calendar
              </Button>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700" data-testid="button-new-appointment">
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAppointment ? "Edit Appointment" : "Schedule New Appointment"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAppointment ? "Update appointment information" : "Schedule a new appointment with a lead"}
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
                            <Input placeholder="e.g., Property Viewing" {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="appointmentTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="15" 
                                step="15" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-duration"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                {appointmentStatuses.map((status) => (
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
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 123 Main St, Conference Room A" {...field} data-testid="input-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes about the appointment..." {...field} data-testid="textarea-description" />
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
                        data-testid="button-save-appointment"
                      >
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingAppointment ? "Update" : "Schedule"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              Search & Filter Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-green-400 transition-colors"
                    data-testid="input-search"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-2 focus:border-teal-400 transition-colors" data-testid="select-filter-status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {appointmentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${status.color.includes('blue') ? 'bg-blue-500' : status.color.includes('green') ? 'bg-green-500' : status.color.includes('yellow') ? 'bg-yellow-500' : status.color.includes('red') ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300"
                data-testid="button-clear-filters"
              >
                <Search className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments View */}
        {viewMode === "list" ? (
          /* List View */
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading appointments...</div>
              </div>
            ) : appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Card key={appointment.id} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`card-appointment-${appointment.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {appointment.title}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {getLeadName(appointment.leadId)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} ({appointment.duration} min)
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {appointment.location}
                          </div>
                        </div>
                        
                        {appointment.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {appointment.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(appointment)}
                          data-testid={`button-edit-appointment-${appointment.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(appointment.id)}
                          data-testid={`button-delete-appointment-${appointment.id}`}
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
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No appointments found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get started by scheduling your first appointment.
                  </p>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, index) => {
                const today = new Date();
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const startOfWeek = new Date(startOfMonth);
                startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());
                
                const currentDate = new Date(startOfWeek);
                currentDate.setDate(startOfWeek.getDate() + index);
                
                const dayAppointments = appointments?.filter(appointment => {
                  const appointmentDate = new Date(appointment.appointmentDate);
                  return appointmentDate.toDateString() === currentDate.toDateString();
                }) || [];
                
                const isCurrentMonth = currentDate.getMonth() === today.getMonth();
                const isToday = currentDate.toDateString() === today.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-gray-100 ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'ring-2 ring-green-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {currentDate.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map(appointment => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 rounded bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
                          onClick={() => handleEdit(appointment)}
                          title={`${appointment.title} - ${getLeadName(appointment.leadId)}`}
                        >
                          <div className="font-medium truncate">{appointment.title}</div>
                          <div className="text-green-600">
                            {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {(!appointments || appointments.length === 0) && (
              <div className="text-center py-12 mt-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No appointments scheduled
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start by scheduling your first appointment.
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}