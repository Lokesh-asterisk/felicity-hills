import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Users, FileText, TrendingUp, Calendar, Mail } from "lucide-react";
import { format, isToday, isYesterday, subDays, startOfDay } from "date-fns";

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

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<BrochureStats>({
    queryKey: ["/api/admin/brochure-stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<BrochureDownload[]>({
    queryKey: ["/api/admin/brochure-downloads"],
    refetchInterval: 30000,
  });

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
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Live Data
          </Badge>
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
                Top Brochures
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.topBrochures?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Downloads</TabsTrigger>
            <TabsTrigger value="popular">Popular Brochures</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

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