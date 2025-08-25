import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Download, Users, FileText, TrendingUp, Calendar, Mail, LogOut, Plus, Edit, Trash2, Star, Settings, Lock, Eye, EyeOff, FileSpreadsheet, BarChart3, ArrowLeft, Menu, Home, ChevronRight, Clock, UserCheck, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import * as XLSX from 'xlsx';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial, Activity, SiteVisit } from "@shared/schema";
import { format, isToday, isYesterday, subDays, startOfDay } from "date-fns";
import AdminLogin from "@/components/admin-login";
import CRMDashboard from "@/pages/crm-dashboard";
import CRMLeads from "@/pages/crm-leads";
import CRMAppointments from "@/pages/crm-appointments";
import CRMFollowUps from "@/pages/crm-followups";
import CRMReports from "@/pages/crm-reports";

interface BrochureDownload {
  id: string;
  brochureId: string;
  brochureTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  downloadedAt: Date;
}

interface BrochureStats {
  total: number;
  thisMonth: number;
  thisWeek: number;
  uniqueUsers?: number;
  topBrochures?: Array<{
    id: string;
    title: string;
    downloadCount: number;
  }>;
  recentDownloads?: Array<BrochureDownload>;
  downloadsByDate?: Array<{
    date: string;
    downloads: number;
  }>;
}

interface SiteVisitStats {
  totalVisits: number;
  todayVisits: number;
  weekVisits: number;
  recentVisits: Array<SiteVisit>;
  visitsByDate: Array<{
    date: string;
    visits: number;
  }>;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'visit' | 'inquiry' | 'sale' | 'meeting' | 'other';
}

const testimonialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  investment: z.number().min(1, "Investment amount is required"),
  plotSize: z.number().min(1, "Plot size is required"),
  returns: z.number().min(1, "Returns percentage is required"),
  duration: z.string().min(1, "Duration is required"),
  review: z.string().min(10, "Review should be at least 10 characters"),
});

// Project management form schema
const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(1, "Short description is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["residential", "commercial", "agricultural", "mixed"]),
  status: z.enum(["active", "completed", "upcoming", "suspended"]).default("active"),
  featured: z.boolean().default(false),
  images: z.string().optional(),
  amenities: z.string().optional(),
  features: z.string().optional(),
  priceRange: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  totalUnits: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  sortOrder: z.string().optional().transform((val) => val ? parseInt(val) : 0)
});

// Password verification is now handled via API

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<"dashboard" | "crm" | "crm-leads" | "crm-appointments" | "crm-followups" | "crm-reports" | "crm-dashboard">("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Navigation items for CRM
  const crmNavItems = [
    { id: "crm" as const, label: "CRM Dashboard", icon: BarChart3, description: "Overview & analytics" },
    { id: "crm-leads" as const, label: "Leads", icon: Users, description: "Manage leads pipeline" },
    { id: "crm-appointments" as const, label: "Appointments", icon: Calendar, description: "Schedule & manage" },
    { id: "crm-followups" as const, label: "Follow-ups", icon: Clock, description: "Track tasks" },
    { id: "crm-reports" as const, label: "Reports", icon: TrendingUp, description: "Analytics & insights" },
  ];

  // Breadcrumb navigation
  const getBreadcrumb = () => {
    switch (currentView) {
      case "dashboard": return [{ label: "Admin Dashboard", href: "#" }];
      case "crm": return [
        { label: "Admin Dashboard", href: "#", onClick: () => setCurrentView("dashboard") },
        { label: "CRM Dashboard", href: "#" }
      ];
      case "crm-leads": return [
        { label: "Admin Dashboard", href: "#", onClick: () => setCurrentView("dashboard") },
        { label: "CRM Dashboard", href: "#", onClick: () => setCurrentView("crm") },
        { label: "Leads", href: "#" }
      ];
      case "crm-appointments": return [
        { label: "Admin Dashboard", href: "#", onClick: () => setCurrentView("dashboard") },
        { label: "CRM Dashboard", href: "#", onClick: () => setCurrentView("crm") },
        { label: "Appointments", href: "#" }
      ];
      case "crm-followups": return [
        { label: "Admin Dashboard", href: "#", onClick: () => setCurrentView("dashboard") },
        { label: "CRM Dashboard", href: "#", onClick: () => setCurrentView("crm") },
        { label: "Follow-ups", href: "#" }
      ];
      case "crm-reports": return [
        { label: "Admin Dashboard", href: "#", onClick: () => setCurrentView("dashboard") },
        { label: "CRM Dashboard", href: "#", onClick: () => setCurrentView("crm") },
        { label: "Reports", href: "#" }
      ];
      default: return [{ label: "Admin Dashboard", href: "#" }];
    }
  };

  // Quick navigation sidebar component
  const CRMSidebar = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-2">
      <div className="px-4 py-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">CRM Navigation</h3>
      </div>
      {crmNavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setCurrentView(item.id);
            onClose?.();
          }}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
            currentView === item.id 
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          <div>
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [, setLocation] = useLocation();
  
  // Selection state for brochure downloads
  const [selectedDownloads, setSelectedDownloads] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  // Get recent activities from database (same as home page)
  const { data: recentActivities = [], refetch: refetchActivities } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
    enabled: isAuthenticated,
  });
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    type: "other" as ActivityItem['type']
  });

  // Testimonial management state
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  // Project management state
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectFilters, setProjectFilters] = useState<{
    status?: string;
    type?: string;
    featured?: boolean;
  }>({});
  
  // Current tab state for mobile dropdown
  const [currentTab, setCurrentTab] = useState("activity");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get testimonials data
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Testimonial form
  const testimonialForm = useForm<z.infer<typeof testimonialFormSchema>>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      location: "",
      investment: 0,
      plotSize: 0,
      returns: 0,
      duration: "",
      review: "",
    },
  });
  
  // Project form
  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      type: "residential",
      status: "active",
      featured: false,
      images: "",
      amenities: "",
      priceRange: "",
      totalUnits: 0,
      sortOrder: 0
    }
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (showTestimonialDialog && editingTestimonial) {
      testimonialForm.reset({
        name: editingTestimonial.name,
        location: editingTestimonial.location,
        investment: editingTestimonial.investment,
        plotSize: editingTestimonial.plotSize,
        returns: editingTestimonial.returns,
        duration: editingTestimonial.duration,
        review: editingTestimonial.review,
      });
    } else if (!showTestimonialDialog) {
      testimonialForm.reset({
        name: "",
        location: "",
        investment: 0,
        plotSize: 0,
        returns: 0,
        duration: "",
        review: "",
      });
      setEditingTestimonial(null);
    }
  }, [showTestimonialDialog, editingTestimonial, testimonialForm]);

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: z.infer<typeof testimonialFormSchema>) => {
      await apiRequest("POST", "/api/admin/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setShowTestimonialDialog(false);
      testimonialForm.reset();
    },
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: async (data: z.infer<typeof testimonialFormSchema>) => {
      if (!editingTestimonial) throw new Error("No testimonial to update");
      await apiRequest("PUT", `/api/admin/testimonials/${editingTestimonial.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setShowTestimonialDialog(false);
      setEditingTestimonial(null);
      testimonialForm.reset();
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
  });

  // Delete site visit mutation
  const deleteSiteVisitMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/site-visits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-visit-stats"] });
    },
  });

  // Delete brochure download mutation
  const deleteDownloadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/brochure-downloads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochure-downloads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochure-stats"] });
    },
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; type: string }) => {
      await apiRequest("POST", "/api/activities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      refetchActivities();
      setNewActivity({ title: "", description: "", type: "other" });
      setShowAddActivity(false);
    },
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title: string; description: string; type: string } }) => {
      await apiRequest("PUT", `/api/activities/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      refetchActivities();
      setEditingActivity(null);
      setNewActivity({ title: "", description: "", type: "other" });
      setShowAddActivity(false);
    },
  });

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      refetchActivities();
    },
  });

  // Submit testimonial form
  const onTestimonialSubmit = (data: z.infer<typeof testimonialFormSchema>) => {
    if (editingTestimonial) {
      updateTestimonialMutation.mutate(data);
    } else {
      createTestimonialMutation.mutate(data);
    }
  };

  // Handle edit testimonial
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowTestimonialDialog(true);
  };

  // Handle delete testimonial
  const handleDeleteTestimonial = (id: string) => {
    if (confirm("Are you sure you want to delete this customer story?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  // Project management queries and mutations
  const projectsQuery = useQuery({
    queryKey: ["/api/projects", projectFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectFilters.status) params.set('status', projectFilters.status);
      if (projectFilters.type) params.set('type', projectFilters.type);
      if (projectFilters.featured !== undefined) params.set('featured', String(projectFilters.featured));
      
      const response = await apiRequest('GET', `/api/projects?${params.toString()}`);
      return response.json();
    }
  });
  
  const projects = projectsQuery.data || [];
  
  const projectSubmitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectFormSchema>) => {
      if (editingProject) {
        return apiRequest("PUT", `/api/admin/projects/${editingProject.id}`, data);
      } else {
        return apiRequest("POST", "/api/admin/projects", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setShowProjectDialog(false);
      setEditingProject(null);
      projectForm.reset();
      toast({
        title: "Success",
        description: editingProject ? "Project updated successfully" : "Project created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
  });
  
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  });
  
  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/projects/${id}/toggle-featured`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Featured status updated"
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update featured status",
        variant: "destructive"
      });
    }
  });

  // Project form handlers
  const handleProjectSubmit = (data: z.infer<typeof projectFormSchema>) => {
    // Transform comma-separated strings to arrays
    const transformedData = {
      ...data,
      images: data.images ? data.images.split(',').map(s => s.trim()).filter(s => s) : [],
      amenities: data.amenities ? data.amenities.split(',').map(s => s.trim()).filter(s => s) : [],
      features: data.features ? data.features.split(',').map(s => s.trim()).filter(s => s) : []
    };
    projectSubmitMutation.mutate(transformedData);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    projectForm.reset({
      name: project.name,
      description: project.description,
      shortDescription: project.shortDescription || '',
      location: project.location,
      type: project.type,
      status: project.status,
      featured: project.featured,
      images: project.images ? project.images.join(', ') : '',
      features: project.features ? project.features.join(', ') : '',
      amenities: project.amenities ? project.amenities.join(', ') : '',
      priceRange: project.priceRange || '',
      latitude: project.latitude || '',
      longitude: project.longitude || '',
      totalUnits: project.totalUnits || 0,
      sortOrder: project.sortOrder || 0
    });
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleToggleFeatured = (id: string) => {
    toggleFeaturedMutation.mutate(id);
  };

  // Reset project form when dialog opens/closes
  useEffect(() => {
    if (!showProjectDialog) {
      setEditingProject(null);
      projectForm.reset();
    }
  }, [showProjectDialog, projectForm]);

  // Handle delete site visit
  const handleDeleteSiteVisit = (id: string, visitorName: string) => {
    if (confirm(`Are you sure you want to delete the site visit booking for ${visitorName}?`)) {
      deleteSiteVisitMutation.mutate(id);
    }
  };

  // Handle delete brochure download
  const handleDeleteDownload = (id: string) => {
    if (confirm("Are you sure you want to delete this download record?")) {
      deleteDownloadMutation.mutate(id);
    }
  };

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      await apiRequest("POST", "/api/admin/change-password", data);
    },
    onSuccess: () => {
      setPasswordSuccess("Password changed successfully!");
      setPasswordError("");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(""), 3000);
    },
    onError: (error: any) => {
      setPasswordError(error.message || "Failed to change password");
      setPasswordSuccess("");
    },
  });

  // Handle password form submission
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
  };

  // Check if already authenticated on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin-authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (password: string) => {
    try {
      const response = await apiRequest("POST", "/api/admin/verify-password", { password });
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem("admin-authenticated", "true");
    } catch (error: any) {
      setLoginError(error.message || "Invalid password. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      // Call server logout to destroy session
      await apiRequest("POST", "/api/admin/logout", {});
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always clear client-side state regardless of server response
      setIsAuthenticated(false);
      sessionStorage.removeItem("admin-authenticated");
      setLocation("/"); // Redirect to home page
    }
  };

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      if (editingActivity) {
        // Update existing activity
        updateActivityMutation.mutate({
          id: editingActivity.id,
          data: {
            title: newActivity.title,
            description: newActivity.description,
            type: newActivity.type
          }
        });
      } else {
        // Create new activity
        createActivityMutation.mutate({
          title: newActivity.title,
          description: newActivity.description,
          type: newActivity.type
        });
      }
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setNewActivity({
      title: activity.title,
      description: activity.description,
      type: activity.type as ActivityItem['type']
    });
    setShowAddActivity(true);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setNewActivity({ title: "", description: "", type: "other" });
    setShowAddActivity(false);
  };

  const handleDeleteActivity = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the activity "${title}"?`)) {
      deleteActivityMutation.mutate(id);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Calendar className="h-4 w-4" />;
      case 'inquiry': return <Mail className="h-4 w-4" />;
      case 'sale': return <TrendingUp className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'visit': return 'text-blue-600';
      case 'inquiry': return 'text-green-600';
      case 'sale': return 'text-teal-600';
      case 'meeting': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedDownloads(new Set(downloads.map(d => d.id)));
    } else {
      setSelectedDownloads(new Set());
    }
  };

  const handleSelectDownload = (downloadId: string, checked: boolean) => {
    const newSelected = new Set(selectedDownloads);
    if (checked) {
      newSelected.add(downloadId);
    } else {
      newSelected.delete(downloadId);
    }
    setSelectedDownloads(newSelected);
    setSelectAll(newSelected.size === downloads.length);
  };

  // Excel export function
  const exportToExcel = () => {
    const selectedData = downloads.filter(download => selectedDownloads.has(download.id));
    const dataToExport = selectedData.length > 0 ? selectedData : downloads;
    
    // Prepare data for Excel export
    const exportData = dataToExport.map((download, index) => ({
      'Sr. No.': index + 1,
      'Date': format(new Date(download.downloadedAt), "yyyy-MM-dd"),
      'Time': format(new Date(download.downloadedAt), "HH:mm:ss"),
      'User Name': download.userName,
      'Email': download.userEmail,
      'Phone': download.userPhone || 'N/A',
      'Brochure': download.brochureTitle
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Brochure Downloads');
    
    // Export file
    const fileName = `brochure-downloads-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await apiRequest("DELETE", "/api/admin/brochure-downloads", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochure-downloads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochure-stats"] });
      // Clear selection after deletion
      setSelectedDownloads(new Set());
      setSelectAll(false);
    },
  });

  // Bulk delete selected downloads
  const handleBulkDelete = () => {
    const itemsToDelete = selectedDownloads.size > 0 ? selectedDownloads.size : downloads.length;
    const deleteMessage = selectedDownloads.size > 0 
      ? `Are you sure you want to delete ${selectedDownloads.size} selected download records?`
      : `Are you sure you want to delete ALL ${downloads.length} download records? This action cannot be undone.`;
      
    if (confirm(deleteMessage)) {
      const idsToDelete = selectedDownloads.size > 0 
        ? Array.from(selectedDownloads)
        : downloads.map(d => d.id);
        
      bulkDeleteMutation.mutate(idsToDelete);
    }
  };

  // Only fetch data if authenticated
  const { data: stats, isLoading } = useQuery<BrochureStats>({
    queryKey: ["/api/admin/brochure-stats"],
    enabled: isAuthenticated, // Only run query when authenticated
  });

  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<BrochureDownload[]>({
    queryKey: ["/api/admin/brochure-downloads"],
    enabled: isAuthenticated, // Only run query when authenticated
  });

  // Site visit data
  const { data: siteVisitStats, isLoading: siteVisitStatsLoading } = useQuery<SiteVisitStats>({
    queryKey: ["/api/admin/site-visit-stats"],
    enabled: isAuthenticated,
  });

  const { data: siteVisits = [], isLoading: siteVisitsLoading } = useQuery<SiteVisit[]>({
    queryKey: ["/api/admin/site-visits"],
    enabled: isAuthenticated,
  });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />;
  }

  if (isLoading || downloadsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatRelativeDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd, yyyy");
  };

  const getDownloadTrend = () => {
    if (!stats?.downloadsByDate || stats.downloadsByDate.length < 2) return 0;
    const recent = stats.downloadsByDate.slice(-2);
    const today = recent[1]?.downloads || 0;
    const yesterday = recent[0]?.downloads || 0;
    return yesterday > 0 ? ((today - yesterday) / yesterday * 100) : 0;
  };

  // Enhanced Breadcrumb Component
  const Breadcrumb = () => {
    const breadcrumbs = getBreadcrumb();
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
            {crumb.onClick ? (
              <button
                onClick={crumb.onClick}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>
    );
  };

  // CRM Top Navigation Component
  const CRMTopNav = ({ activeTab }: { activeTab: string }) => (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">🏠 Felicityhills CRM</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setCurrentView("dashboard")}
              variant="outline"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <Button
              onClick={() => {
                setIsAuthenticated(false);
                setLocation('/');
              }}
              variant="outline"
              className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setCurrentView("crm")}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "crm" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentView("crm-leads")}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "crm-leads" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            👥 Leads
          </button>
          <button
            onClick={() => setCurrentView("crm-appointments")}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "crm-appointments" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📅 Appointments
          </button>
          <button
            onClick={() => setCurrentView("crm-followups")}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "crm-followups" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 Follow-ups
          </button>
          <button
            onClick={() => setCurrentView("crm-reports")}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "crm-reports" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📊 Reports
          </button>
        </div>
      </div>
    </div>
  );

  // Handle CRM view rendering
  if (currentView === "crm") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CRMTopNav activeTab="crm" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CRMDashboard 
            onNavigateToLeads={() => setCurrentView("crm-leads")}
            onCreateNewLead={() => setCurrentView("crm-leads")}
            setCurrentView={(view: string) => setCurrentView(view as typeof currentView)}
          />
        </div>
      </div>
    );
  }

  if (currentView === "crm-leads") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CRMTopNav activeTab="crm-leads" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Leads Management</h1>
          </div>
          <CRMLeads />
        </div>
      </div>
    );
  }

  if (currentView === "crm-appointments") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CRMTopNav activeTab="crm-appointments" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CRMAppointments />
        </div>
      </div>
    );
  }

  if (currentView === "crm-followups") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CRMTopNav activeTab="crm-followups" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CRMFollowUps />
        </div>
      </div>
    );
  }

  if (currentView === "crm-reports") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CRMTopNav activeTab="crm-reports" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CRMReports />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
              Khushalipur Analytics
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs sm:text-sm">
              Live Data
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700"
                data-testid="button-crm-dashboard"
                onClick={() => setCurrentView("crm")}
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">CRM Dashboard</span>
                <span className="sm:hidden">CRM</span>
              </Button>
              
              {/* Quick CRM Access Dropdown */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView("crm-leads")}
                  className="flex items-center gap-1 text-xs"
                >
                  <Users className="h-3 w-3" />
                  Leads
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView("crm-appointments")}
                  className="flex items-center gap-1 text-xs"
                >
                  <Calendar className="h-3 w-3" />
                  Appointments
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView("crm-followups")}
                  className="flex items-center gap-1 text-xs"
                >
                  <Clock className="h-3 w-3" />
                  Follow-ups
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 ml-auto sm:ml-0"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                      Total Downloads
                    </CardTitle>
                    <Download className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {stats?.total || 0}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">All-time Downloads</p>
                  <p className="text-sm text-gray-400 mt-1">Total brochures downloaded since launch</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border-teal-200 dark:border-teal-700 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-300">
                      Today's Downloads
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {stats?.thisWeek || 0}
                    </div>
                    {getDownloadTrend() !== 0 && (
                      <p className={`text-xs ${getDownloadTrend() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getDownloadTrend() > 0 ? '+' : ''}{getDownloadTrend().toFixed(1)}% from yesterday
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">Today's Activity</p>
                  <p className="text-sm text-gray-400 mt-1">Downloads received today so far</p>
                  <p className="text-xs text-gray-500 mt-1">Updates every 5 minutes</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Unique Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {stats?.uniqueUsers || 0}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">Engaged Prospects</p>
                  <p className="text-sm text-gray-400 mt-1">Individual people who downloaded materials</p>
                  <p className="text-xs text-gray-500 mt-1">Based on unique email addresses</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Site Visit Bookings
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {siteVisitStats?.totalVisits || 0}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {siteVisitStats?.todayVisits || 0} booked today
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">Site Visit Requests</p>
                  <p className="text-sm text-gray-400 mt-1">Total booking requests received</p>
                  <p className="text-xs text-gray-500 mt-1">Includes customer contact details</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main Content */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4 sm:space-y-6">
          <div className="w-full">
            {/* Mobile dropdown for tabs on very small screens */}
            <div className="block sm:hidden mb-4">
              <select 
                value={currentTab}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 text-sm"
                onChange={(e) => {
                  setCurrentTab(e.target.value);
                }}
              >
                <option value="activity">📊 Activity</option>
                <option value="recent">💾 Downloads</option>
                <option value="popular">⭐ Popular</option>
                <option value="analytics">📈 Analytics</option>
                <option value="testimonials">💬 Stories</option>
                <option value="sitevisits">📅 Visits</option>
                <option value="projects">🏢 Projects</option>
                <option value="settings">⚙️ Settings</option>
              </select>
            </div>
            
            {/* Regular tabs for larger screens */}
            <div className="hidden sm:block">
              <TabsList className="grid grid-cols-8 gap-1 w-full h-auto p-1">
                <TabsTrigger value="activity" className="px-2 py-2 text-sm">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="recent" className="px-2 py-2 text-sm">
                  Downloads
                </TabsTrigger>
                <TabsTrigger value="popular" className="px-2 py-2 text-sm">
                  Popular
                </TabsTrigger>
                <TabsTrigger value="analytics" className="px-2 py-2 text-sm">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="px-2 py-2 text-sm">
                  Stories
                </TabsTrigger>
                <TabsTrigger value="sitevisits" className="px-2 py-2 text-sm">
                  Visits
                </TabsTrigger>
                <TabsTrigger value="projects" className="px-2 py-2 text-sm">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="settings" className="px-2 py-2 text-sm">
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Recent Activity */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                  </div>
                  <Dialog open={showAddActivity} onOpenChange={(open) => {
                    if (!open) handleCancelEdit();
                    setShowAddActivity(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Add Activity</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                        <DialogDescription className="text-sm">
                          {editingActivity ? 'Edit the activity details below' : 'Add a new activity to track recent events and updates.'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title</label>
                          <Input
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                            placeholder="Activity title..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Textarea
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            placeholder="Activity description..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Type</label>
                          <select
                            value={newActivity.type}
                            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as ActivityItem['type'] })}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="visit">Site Visit</option>
                            <option value="inquiry">Inquiry</option>
                            <option value="sale">Sale/Booking</option>
                            <option value="meeting">Meeting</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddActivity}
                            disabled={!newActivity.title || !newActivity.description || (editingActivity ? updateActivityMutation.isPending : createActivityMutation.isPending)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {editingActivity ? (updateActivityMutation.isPending ? 'Updating...' : 'Update Activity') : (createActivityMutation.isPending ? 'Adding...' : 'Add Activity')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activities</p>
                    <Button
                      onClick={() => setShowAddActivity(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      Add First Activity
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-700">
                        <div className={`${getActivityColor(activity.type)} mt-1`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {format(new Date(activity.createdAt || new Date()), "MMM dd, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditActivity(activity)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            disabled={updateActivityMutation.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteActivity(activity.id, activity.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deleteActivityMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Downloads */}
          <TabsContent value="recent" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Recent Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                {downloads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No downloads recorded yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {downloads.length} entries
                        {selectedDownloads.size > 0 && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400">
                            • {selectedDownloads.size} selected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleBulkDelete}
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1 flex-1 sm:flex-none"
                          disabled={downloads.length === 0 || bulkDeleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            {bulkDeleteMutation.isPending ? "Deleting..." : 
                             selectedDownloads.size > 0 ? `Delete (${selectedDownloads.size})` : 'Delete All'}
                          </span>
                        </Button>
                        <Button
                          onClick={exportToExcel}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 flex-1 sm:flex-none"
                          disabled={downloads.length === 0}
                        >
                          <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Excel</span>
                        </Button>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8 sm:w-12">
                            <Checkbox
                              checked={selectAll}
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all downloads"
                            />
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">Sr. No.</TableHead>
                          <TableHead className="text-xs sm:text-sm">Date</TableHead>
                          <TableHead className="text-xs sm:text-sm">User</TableHead>
                          <TableHead className="hidden md:table-cell text-xs sm:text-sm">Email</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Phone</TableHead>
                          <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Brochure</TableHead>
                          <TableHead className="text-right text-xs sm:text-sm w-16 sm:w-auto">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {downloads.map((download, index) => (
                          <TableRow key={download.id}>
                            <TableCell className="p-2 sm:p-4">
                              <Checkbox
                                checked={selectedDownloads.has(download.id)}
                                onCheckedChange={(checked) => 
                                  handleSelectDownload(download.id, checked as boolean)
                                }
                                aria-label={`Select download ${index + 1}`}
                              />
                            </TableCell>
                            <TableCell className="hidden sm:table-cell font-medium text-center text-xs sm:text-sm">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium p-2 sm:p-4">
                              <div className="text-xs sm:text-sm">
                                {formatRelativeDate(new Date(download.downloadedAt))}
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(new Date(download.downloadedAt), "HH:mm")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="p-2 sm:p-4">
                              <div className="text-xs sm:text-sm">
                                {download.userName}
                                <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                  {download.userEmail}
                                </div>
                                <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                                  {download.userPhone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell p-2 sm:p-4">
                              <div className="flex items-center gap-1 text-xs sm:text-sm">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{download.userEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell p-2 sm:p-4 text-xs sm:text-sm">
                              {download.userPhone}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell p-2 sm:p-4">
                              <Badge variant="outline" className="text-xs">
                                {download.brochureTitle}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right p-2 sm:p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDownload(download.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-6 w-6 sm:h-8 sm:w-8 p-0"
                                disabled={deleteDownloadMutation.isPending}
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Popular Brochures */}
          <TabsContent value="popular" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  Most Downloaded Brochures
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!stats?.topBrochures?.length ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No brochure data available yet</p>
                  </div>
                ) : (
                  <TooltipProvider>
                    <div className="space-y-4">
                      {stats.topBrochures.map((brochure, index) => (
                        <Tooltip key={brochure.id}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-bold">
                                  #{index + 1}
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {brochure.title}
                                  </h3>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                                  {brochure.downloadCount} downloads
                                </Badge>
                                {stats.total > 0 && (
                                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-2">
                                    <div 
                                      className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                                      style={{ 
                                        width: `${(brochure.downloadCount / stats.total) * 100}%` 
                                      }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="text-center">
                              <p className="font-semibold">{brochure.title}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {brochure.downloadCount} total downloads
                              </p>
                              {stats.total > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {((brochure.downloadCount / stats.total) * 100).toFixed(1)}% of all downloads
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Total Downloads
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {stats?.total || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total number of brochure downloads across all materials</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Unique Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {stats?.uniqueUsers || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of unique users who have downloaded materials</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Today's Downloads
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {stats?.thisWeek || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Downloads received today so far</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Download Trends (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!stats?.downloadsByDate?.length ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Not enough data for trends analysis</p>
                  </div>
                ) : (
                  <TooltipProvider>
                    <div className="space-y-4">
                      {stats.downloadsByDate!.slice(-7).map((day, index) => {
                        const maxDownloads = Math.max(...stats.downloadsByDate!.slice(-7).map(d => d.downloads));
                        const percentage = maxDownloads > 0 ? (day.downloads / maxDownloads) * 100 : 0;
                        const isToday = format(new Date(day.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                        const isYesterday = format(new Date(day.date), "yyyy-MM-dd") === format(subDays(new Date(), 1), "yyyy-MM-dd");
                        
                        return (
                          <Tooltip key={day.date}>
                            <TooltipTrigger asChild>
                              <div className={`flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                isToday ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : 
                                isYesterday ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : ''
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {isToday ? 'Today' : isYesterday ? 'Yesterday' : format(new Date(day.date), "MMM dd")}
                                  </div>
                                  {isToday && (
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                                      Today
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                                    <div 
                                      className={`h-3 rounded-full transition-all duration-500 ${
                                        isToday ? 'bg-blue-500' :
                                        day.downloads > 0 ? 'bg-green-500' : 'bg-gray-300'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className={`font-bold min-w-[3rem] text-right ${
                                    isToday ? 'text-blue-600 dark:text-blue-400' :
                                    'text-green-600 dark:text-green-400'
                                  }`}>
                                    {day.downloads}
                                  </span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="text-center">
                                <p className="font-semibold">
                                  {format(new Date(day.date), "EEEE, MMM dd, yyyy")}
                                </p>
                                <p className="text-sm mt-1">
                                  {day.downloads} {day.downloads === 1 ? 'download' : 'downloads'}
                                </p>
                                {maxDownloads > 0 && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {percentage.toFixed(1)}% of peak day ({maxDownloads} downloads)
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Stories Management */}
          <TabsContent value="testimonials" className="space-y-4 sm:space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <CardTitle className="text-base sm:text-lg">Customer Stories Management</CardTitle>
                  </div>
                  <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Add Customer Story</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">
                          {editingTestimonial ? "Edit Customer Story" : "Add New Customer Story"}
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          {editingTestimonial 
                            ? "Update the customer story details below." 
                            : "Add a new customer success story to showcase on the website."
                          }
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...testimonialForm}>
                        <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={testimonialForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Customer Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Rajesh Kumar" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={testimonialForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Delhi" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              control={testimonialForm.control}
                              name="investment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Investment (₹)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="e.g., 500000" 
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={testimonialForm.control}
                              name="plotSize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Plot Size (Sq Yd)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="e.g., 1000" 
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={testimonialForm.control}
                              name="returns"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Returns (%)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="e.g., 45" 
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={testimonialForm.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 3 years" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={testimonialForm.control}
                            name="review"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer Review</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter the customer's testimonial or review..."
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end gap-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setShowTestimonialDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {createTestimonialMutation.isPending || updateTestimonialMutation.isPending
                                ? "Saving..." 
                                : editingTestimonial ? "Update Story" : "Add Story"
                              }
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2">Loading customer stories...</p>
                  </div>
                ) : !testimonials?.length ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No customer stories added yet</p>
                    <p className="text-sm">Add your first success story to showcase on the website</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Investment</TableHead>
                          <TableHead>Plot Size</TableHead>
                          <TableHead>Returns</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testimonials.map((testimonial) => (
                          <TableRow key={testimonial.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-semibold">{testimonial.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                                  "{testimonial.review}"
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{testimonial.location}</TableCell>
                            <TableCell>
                              <div className="font-medium">₹{testimonial.investment.toLocaleString()}</div>
                            </TableCell>
                            <TableCell>{testimonial.plotSize.toLocaleString()} Sq Yd</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {testimonial.returns}%
                              </Badge>
                            </TableCell>
                            <TableCell>{testimonial.duration}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditTestimonial(testimonial)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                                  disabled={deleteTestimonialMutation.isPending}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Visits Tab */}
          <TabsContent value="sitevisits" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {siteVisitStats?.totalVisits || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Today's Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {siteVisitStats?.todayVisits || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {siteVisitStats?.weekVisits || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Site Visit Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {siteVisitsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex space-x-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : siteVisits.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Name</TableHead>
                          <TableHead className="text-xs sm:text-sm">Mobile</TableHead>
                          <TableHead className="hidden md:table-cell text-xs sm:text-sm">Email</TableHead>
                          <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Preferred Date</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Plot Size</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Budget</TableHead>
                          <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Booked On</TableHead>
                          <TableHead className="text-center text-xs sm:text-sm w-16 sm:w-auto">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {siteVisits.map((visit) => (
                          <TableRow key={visit.id}>
                            <TableCell className="font-medium p-2 sm:p-4">
                              <div className="text-xs sm:text-sm">
                                {visit.name}
                                <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                  {visit.email || 'No email'}
                                </div>
                                <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                                  {visit.preferredDate || 'Date not set'}
                                </div>
                                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400">
                                  {visit.plotSize && `Size: ${visit.plotSize}`}
                                  {visit.budget && ` • Budget: ${visit.budget}`}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="p-2 sm:p-4">
                              <a 
                                href={`tel:${visit.mobile}`}
                                className="text-blue-600 hover:underline text-xs sm:text-sm"
                              >
                                {visit.mobile}
                              </a>
                            </TableCell>
                            <TableCell className="hidden md:table-cell p-2 sm:p-4">
                              {visit.email ? (
                                <a 
                                  href={`mailto:${visit.email}`}
                                  className="text-blue-600 hover:underline text-xs sm:text-sm truncate max-w-[150px] block"
                                >
                                  {visit.email}
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs sm:text-sm">Not provided</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell p-2 sm:p-4">
                              {visit.preferredDate ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  {visit.preferredDate}
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-xs">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell p-2 sm:p-4">
                              {visit.plotSize ? (
                                <Badge variant="outline" className="text-xs">{visit.plotSize}</Badge>
                              ) : (
                                <span className="text-gray-400 text-xs">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell p-2 sm:p-4">
                              {visit.budget ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  {visit.budget}
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-xs">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-xs text-gray-500 p-2 sm:p-4">
                              {visit.createdAt ? formatRelativeDate(new Date(visit.createdAt)) : 'Unknown'}
                            </TableCell>
                            <TableCell className="text-center p-2 sm:p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSiteVisit(visit.id, visit.name)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 h-6 w-6 sm:h-8 sm:w-8 p-0"
                                disabled={deleteSiteVisitMutation.isPending}
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Site Visit Bookings
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Site visit bookings will appear here when customers book visits.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          {/* Project Showcase Management */}
          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <CardTitle className="text-base sm:text-lg">Project Showcase Management</CardTitle>
                  </div>
                  <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                        <DialogDescription>
                          {editingProject ? "Update project details" : "Create a new project showcase"}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...projectForm}>
                        <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
                          <FormField
                            control={projectForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter project name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={projectForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter project description" rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={projectForm.control}
                            name="shortDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter a brief project summary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={projectForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter location" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Type</FormLabel>
                                  <FormControl>
                                    <select {...field} className="w-full p-2 border rounded-md">
                                      <option value="">Select type</option>
                                      <option value="residential">Residential</option>
                                      <option value="commercial">Commercial</option>
                                      <option value="agricultural">Agricultural</option>
                                      <option value="mixed">Mixed Use</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={projectForm.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <FormControl>
                                    <select {...field} className="w-full p-2 border rounded-md">
                                      <option value="active">Active</option>
                                      <option value="completed">Completed</option>
                                      <option value="upcoming">Upcoming</option>
                                      <option value="suspended">Suspended</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="sortOrder"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Order</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="0" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={projectForm.control}
                            name="images"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URLs (comma separated)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter image URLs separated by commas" rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={projectForm.control}
                            name="features"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Features (comma separated)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter features separated by commas" rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={projectForm.control}
                            name="amenities"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amenities (comma separated)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter amenities separated by commas" rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={projectForm.control}
                              name="priceRange"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price Range</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., ₹50 lakh - ₹2 crore" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="totalUnits"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Total Units</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="Enter total units" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={projectForm.control}
                              name="latitude"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Latitude (for heatmap)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., 30.3165" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="longitude"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Longitude (for heatmap)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., 78.0322" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={projectForm.control}
                              name="featured"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Featured Project</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => {
                              setShowProjectDialog(false);
                              setEditingProject(null);
                              projectForm.reset();
                            }}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={projectSubmitMutation.isPending}>
                              {projectSubmitMutation.isPending ? "Saving..." : editingProject ? "Update" : "Create"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Project Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <select
                      value={projectFilters.status || ""}
                      onChange={(e) => setProjectFilters({ ...projectFilters, status: e.target.value || undefined })}
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      value={projectFilters.type || ""}
                      onChange={(e) => setProjectFilters({ ...projectFilters, type: e.target.value || undefined })}
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">All Types</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="mixed">Mixed Use</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      value={projectFilters.featured !== undefined ? (projectFilters.featured ? "true" : "false") : ""}
                      onChange={(e) => setProjectFilters({ 
                        ...projectFilters, 
                        featured: e.target.value === "" ? undefined : e.target.value === "true" 
                      })}
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">All Projects</option>
                      <option value="true">Featured Only</option>
                      <option value="false">Non-Featured</option>
                    </select>
                  </div>
                </div>

                {projectsQuery.isLoading ? (
                  <div className="text-center py-4">Loading projects...</div>
                ) : projectsQuery.error ? (
                  <div className="text-center py-4 text-red-600">Failed to load projects</div>
                ) : (
                  <div className="space-y-4">
                    {/* Desktop Table */}
                    <div className="hidden lg:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Price Range</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">{project.name}</TableCell>
                              <TableCell>
                                <Badge variant={project.type === "residential" ? "default" : "outline"}>
                                  {project.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{project.location}</TableCell>
                              <TableCell>
                                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                  {project.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleFeatured(project.id)}
                                  disabled={toggleFeaturedMutation.isPending}
                                >
                                  <Star className={`h-4 w-4 ${project.featured ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                                </Button>
                              </TableCell>
                              <TableCell>{project.totalUnits || "N/A"}</TableCell>
                              <TableCell>{project.priceRange || "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditProject(project)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteProject(project.id)}
                                    disabled={deleteProjectMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{project.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{project.location}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleFeatured(project.id)}
                                  disabled={toggleFeaturedMutation.isPending}
                                >
                                  <Star className={`h-4 w-4 ${project.featured ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProject(project.id)}
                                  disabled={deleteProjectMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={project.type === "residential" ? "default" : "outline"}>
                                {project.type}
                              </Badge>
                              <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                {project.status}
                              </Badge>
                              {project.featured && (
                                <Badge variant="default" className="bg-yellow-500">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            {project.priceRange && (
                              <p className="text-sm"><strong>Price:</strong> {project.priceRange}</p>
                            )}
                            {project.totalUnits && (
                              <p className="text-sm"><strong>Units:</strong> {project.totalUnits}</p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {projects.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No projects found. Add your first project to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <CardTitle className="text-base sm:text-lg">Admin Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Change Section */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Update your admin password for enhanced security
                  </p>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="pr-10"
                          disabled={changePasswordMutation.isPending}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Enter new password (min 6 characters)"
                          className="pr-10"
                          disabled={changePasswordMutation.isPending}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          className="pr-10"
                          disabled={changePasswordMutation.isPending}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Error/Success Messages */}
                    {passwordError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                      </div>
                    )}
                    
                    {passwordSuccess && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}
                    </Button>
                  </form>
                </div>
                
                {/* Security Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Security Tips</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Use a strong password with at least 6 characters</li>
                        <li>• Include a mix of letters, numbers, and special characters</li>
                        <li>• Don't share your admin password with anyone</li>
                        <li>• Change your password regularly for security</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}