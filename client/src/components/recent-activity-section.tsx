import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday } from "date-fns";
import type { Activity } from "@shared/schema";

export default function RecentActivitySection() {
  // Fetch recent activities
  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const formatRelativeTime = (date: Date) => {
    if (isToday(date)) return format(date, "h:mm a") + " today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="outline" className="text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Live Updates
            </Badge>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest developments and activities at Khushalipur
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
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
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
                        className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {activity.title}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {activity.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.createdAt ? formatRelativeTime(new Date(activity.createdAt)) : 'Recently'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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