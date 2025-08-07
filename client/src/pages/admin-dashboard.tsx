import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Download, Users, FileText, TrendingUp, Calendar, Mail, LogOut, Plus, Edit, Trash2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import type { Testimonial, Activity } from "@shared/schema";
import { format, isToday, isYesterday, subDays, startOfDay } from "date-fns";
import AdminLogin from "@/components/admin-login";

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
  totalDownloads: number;
  todayDownloads: number;
  uniqueUsers: number;
  topBrochures: Array<{
    id: string;
    title: string;
    downloadCount: number;
  }>;
  recentDownloads: Array<BrochureDownload>;
  downloadsByDate: Array<{
    date: string;
    downloads: number;
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

const ADMIN_PASSWORD = "khushalipur2025"; // In production, this should be in environment variables

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [, setLocation] = useLocation();
  // Get recent activities from database instead of local state
  const { data: recentActivities = [], refetch: refetchActivities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    enabled: isAuthenticated,
  });
  
  const [localActivities, setLocalActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      title: "Site Visit Scheduled",
      description: "Mr. Rajesh Kumar scheduled a visit for tomorrow",
      date: new Date().toISOString(),
      type: "visit"
    },
    {
      id: "2",
      title: "Document Verification",
      description: "Legal documents verified for Sharma family's 3-acre plot",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "other"
    },
    {
      id: "3", 
      title: "Investment Inquiry",
      description: "New inquiry about 5-acre plots received from Delhi",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      type: "inquiry"
    },
    {
      id: "4",
      title: "Payment Completed",
      description: "₹2.5L advance payment received from Gupta family",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      type: "sale"
    },
    {
      id: "5",
      title: "Client Meeting",
      description: "Investment consultation meeting with Agarwal family",
      date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      type: "meeting"
    },
    {
      id: "6",
      title: "Plot Booking",
      description: "2-acre plot booked by Singh family",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: "sale"
    },
    {
      id: "7",
      title: "Site Visit Completed",
      description: "Conducted site tour for 6 families from Mumbai",
      date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      type: "visit"
    },
    {
      id: "8",
      title: "Infrastructure Update",
      description: "Water pipeline installation completed in Sector B",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "other"
    },
    {
      id: "9",
      title: "Follow-up Call",
      description: "Discussed investment options with Verma family",
      date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "inquiry"
    },
    {
      id: "10",
      title: "Registry Process",
      description: "Registry documentation started for 4-acre plot",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "sale"
    },
    {
      id: "11",
      title: "Group Visit Scheduled",
      description: "Corporate group visit arranged for next weekend",
      date: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "visit"
    },
    {
      id: "12",
      title: "Legal Approval",
      description: "Environmental clearance received for Phase 2",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: "other"
    },
    {
      id: "13",
      title: "Investment Query",
      description: "NRI investor inquiry for bulk purchase of 20 acres",
      date: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "inquiry"
    },
    {
      id: "14",
      title: "Client Onboarding",
      description: "Welcome meeting with new investors - Jain family",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "meeting"
    },
    {
      id: "15",
      title: "Road Development",
      description: "Main access road widening work initiated",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      type: "other"
    },
    {
      id: "16",
      title: "Plot Allocation",
      description: "Prime corner plot allocated to Kapoor family",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: "sale"
    },
    {
      id: "17",
      title: "Investor Meeting",
      description: "Quarterly review meeting with existing plot holders",
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      type: "meeting"
    },
    {
      id: "18",
      title: "Media Coverage",
      description: "Local newspaper featured Khushalipur project",
      date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      type: "other"
    }
  ]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    type: "other" as ActivityItem['type']
  });

  // Testimonial management state
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
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

  // Handle delete brochure download
  const handleDeleteDownload = (id: string) => {
    if (confirm("Are you sure you want to delete this download record?")) {
      deleteDownloadMutation.mutate(id);
    }
  };

  // Check if already authenticated on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin-authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem("admin-authenticated", "true");
    } else {
      setLoginError("Invalid password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin-authenticated");
    setLocation("/"); // Redirect to home page
  };

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      createActivityMutation.mutate({
        title: newActivity.title,
        description: newActivity.description,
        type: newActivity.type
      });
    }
  };

  const handleDeleteActivity = (id: string) => {
    // For now, keep local delete functionality
    // In production, you might want to add a DELETE API endpoint
    setLocalActivities(localActivities.filter(activity => activity.id !== id));
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

  // Only fetch data if authenticated
  const { data: stats, isLoading } = useQuery<BrochureStats>({
    queryKey: ["/api/admin/brochure-stats"],
    refetchInterval: 5000,
    enabled: isAuthenticated, // Only run query when authenticated
  });

  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<BrochureDownload[]>({
    queryKey: ["/api/admin/brochure-downloads"],
    refetchInterval: 5000,
    enabled: isAuthenticated, // Only run query when authenticated
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Khushalipur Brochure Download Analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Live Data
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalDownloads || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Today's Downloads
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.todayDownloads || 0}
              </div>
              {getDownloadTrend() !== 0 && (
                <p className={`text-xs ${getDownloadTrend() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getDownloadTrend() > 0 ? '+' : ''}{getDownloadTrend().toFixed(1)}% from yesterday
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Unique Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.uniqueUsers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Recent Activities
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {recentActivities.filter(activity => {
                  const activityDate = new Date(activity.createdAt || new Date());
                  return isToday(activityDate) || isYesterday(activityDate);
                }).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Today & yesterday activities</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="flex flex-wrap justify-center md:justify-start gap-1 w-full h-auto p-1">
            <TabsTrigger value="activity" className="flex-1 min-w-0 px-2 py-2 text-xs sm:text-sm">
              Activity
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-1 min-w-0 px-2 py-2 text-xs sm:text-sm">
              Downloads
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex-1 min-w-0 px-2 py-2 text-xs sm:text-sm">
              Popular
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 min-w-0 px-2 py-2 text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex-1 min-w-0 px-2 py-2 text-xs sm:text-sm">
              Customer Stories
            </TabsTrigger>
          </TabsList>

          {/* Recent Activity */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <CardTitle>Recent Activity</CardTitle>
                  </div>
                  <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Activity</DialogTitle>
                        <DialogDescription>
                          Add a new activity to track recent events and updates.
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
                            onClick={() => setShowAddActivity(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddActivity}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Add Activity
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
                    {recentActivities.slice(0, 10).map((activity) => (
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Brochure</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {downloads.slice(0, 10).map((download) => (
                          <TableRow key={download.id}>
                            <TableCell className="font-medium">
                              {formatRelativeDate(new Date(download.downloadedAt))}
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(download.downloadedAt), "HH:mm")}
                              </div>
                            </TableCell>
                            <TableCell>{download.userName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {download.userEmail}
                              </div>
                            </TableCell>
                            <TableCell>{download.userPhone}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {download.brochureTitle}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDownload(download.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                disabled={deleteDownloadMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
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
                  <div className="space-y-4">
                    {stats.topBrochures.map((brochure, index) => (
                      <div key={brochure.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
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
                        <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                          {brochure.downloadCount} downloads
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
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
                  <div className="space-y-4">
                    {stats.downloadsByDate.slice(-7).map((day) => (
                      <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {format(new Date(day.date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${stats.totalDownloads > 0 ? (day.downloads / stats.totalDownloads) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="font-bold text-green-600 dark:text-green-400 min-w-[3rem] text-right">
                            {day.downloads}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Stories Management */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <CardTitle>Customer Stories Management</CardTitle>
                  </div>
                  <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer Story
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingTestimonial ? "Edit Customer Story" : "Add New Customer Story"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingTestimonial 
                            ? "Update the customer story details below." 
                            : "Add a new customer success story to showcase on the website."
                          }
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...testimonialForm}>
                        <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
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

                          <div className="grid grid-cols-3 gap-4">
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
        </Tabs>
      </div>
    </div>
  );
}