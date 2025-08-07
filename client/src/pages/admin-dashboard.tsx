import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Users, FileText, TrendingUp, Calendar, Mail, LogOut, Plus, Edit, Trash2 } from "lucide-react";
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

const ADMIN_PASSWORD = "khushalipur2025"; // In production, this should be in environment variables

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      title: "Site Visit Scheduled",
      description: "Mr. Rajesh Kumar scheduled a visit for tomorrow",
      date: new Date().toISOString(),
      type: "visit"
    },
    {
      id: "2", 
      title: "Investment Inquiry",
      description: "New inquiry about 5-acre plots received",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: "inquiry"
    },
    {
      id: "3",
      title: "Plot Booking",
      description: "2-acre plot booked by Singh family",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "sale"
    }
  ]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    type: "other" as ActivityItem['type']
  });

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
  };

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      const activity: ActivityItem = {
        id: Date.now().toString(),
        title: newActivity.title,
        description: newActivity.description,
        date: new Date().toISOString(),
        type: newActivity.type
      };
      setRecentActivities([activity, ...recentActivities]);
      setNewActivity({ title: "", description: "", type: "other" });
      setShowAddActivity(false);
    }
  };

  const handleDeleteActivity = (id: string) => {
    setRecentActivities(recentActivities.filter(activity => activity.id !== id));
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'visit': return <Calendar className="h-4 w-4" />;
      case 'inquiry': return <Mail className="h-4 w-4" />;
      case 'sale': return <TrendingUp className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
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
    refetchInterval: 30000,
    enabled: isAuthenticated, // Only run query when authenticated
  });

  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<BrochureDownload[]>({
    queryKey: ["/api/admin/brochure-downloads"],
    refetchInterval: 30000,
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
                {recentActivities.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manual activities tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="recent">Downloads</TabsTrigger>
            <TabsTrigger value="popular">Popular Brochures</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                            {format(new Date(activity.date), "MMM dd, yyyy 'at' h:mm a")}
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
        </Tabs>
      </div>
    </div>
  );
}