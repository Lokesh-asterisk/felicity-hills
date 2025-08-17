import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users, TrendingUp, Wifi, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import type { Activity } from "@shared/schema";

export default function RecentActivitySection() {
  // Fetch recent activities
  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Badge className="text-sm bg-green-100 text-green-800 border-green-200 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
              <Wifi className="w-4 h-4 mr-1" />
              Live Data Stream
            </Badge>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Live Activity Feed
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time business activities and customer engagements happening now
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {activitiesLoading ? (
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : recentActivities.length > 0 ? (
            <div className="relative">
              {/* Live indicator overlay */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  LIVE
                </div>
              </div>
              
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 mr-1 text-green-500" />
                      <span>Auto-refreshing every 5 seconds</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {recentActivities.filter(activity => 
                        activity.createdAt && isToday(new Date(activity.createdAt))
                      ).length} activities today
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentActivities.map((activity, index) => {
                    const getActivityIcon = (type: string) => {
                      switch (type) {
                        case 'visit': return { icon: Calendar, color: 'blue' };
                        case 'sale': return { icon: TrendingUp, color: 'green' };
                        case 'inquiry': return { icon: Users, color: 'purple' };
                        case 'meeting': return { icon: Users, color: 'orange' };
                        default: return { icon: Clock, color: 'gray' };
                      }
                    };
                    const { icon: Icon, color } = getActivityIcon(activity.type);
                    
                    return (
                      <div 
                        key={activity.id} 
                        className={`relative flex items-center p-4 bg-gradient-to-r from-gray-50 to-white hover:from-${color}-50 hover:to-white rounded-lg transition-all duration-300 border border-gray-200 hover:border-${color}-200 hover:shadow-md animate-fade-in-up group`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Live indicator for very recent activities */}
                        {activity.createdAt && new Date().getTime() - new Date(activity.createdAt).getTime() < 300000 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        )}
                        
                        <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate group-hover:text-gray-700">
                            {activity.title}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {activity.description}
                          </div>
                          <div className={`text-xs font-medium mt-1 ${
                            activity.createdAt && new Date().getTime() - new Date(activity.createdAt).getTime() < 60000 
                              ? 'text-green-600' 
                              : activity.createdAt && new Date().getTime() - new Date(activity.createdAt).getTime() < 300000
                              ? 'text-orange-600'
                              : 'text-gray-500'
                          }`}>
                            {activity.createdAt ? formatRelativeTime(new Date(activity.createdAt)) : 'Recently'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No recent activity
                </h3>
                <p className="text-gray-500">
                  Check back later for updates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}