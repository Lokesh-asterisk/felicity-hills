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

        {/* Appointments List */}
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
      </div>
    </div>
  );
}