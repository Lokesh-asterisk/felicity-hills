import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, MapPin, Download, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday } from "date-fns";

interface BrochureStats {
  totalDownloads: number;
  todayDownloads: number;
  uniqueUsers: number;
  topBrochures: Array<{
    id: string;
    title: string;
    downloadCount: number;
  }>;
  recentDownloads: Array<{
    id: string;
    brochureId: string;
    brochureTitle: string;
    userName: string;
    userEmail: string;
    downloadedAt: Date;
  }>;
}

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch real brochure stats for recent activity
  const { data: stats, isLoading } = useQuery<BrochureStats>({
    queryKey: ["/api/admin/brochure-stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatRelativeTime = (date: Date) => {
    if (isToday(date)) return format(date, "h:mm a") + " today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd");
  };

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <Badge variant="secondary" className="inline-flex items-center mb-6 bg-accent/10 text-accent hover:bg-accent/20">
              <Flame className="w-4 h-4 mr-2" />
              Limited Plots Available - Book Site Visit Today!
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-primary">Khushalipur</span><br />
              Your Safe Investment
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Near Delhi-Dehradun Expressway • Only 13 km from Dehradun ISBT
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-1">₹8,100</div>
                  <div className="text-gray-600">Starting from per sq yd</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-1">15-20%</div>
                  <div className="text-gray-600">Expected Annual Returns</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-1">200-800</div>
                  <div className="text-gray-600">Plot Sizes sq yd</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('contact')}
                size="lg"
                className="bg-primary hover:bg-secondary text-lg px-8 py-6"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Site Visit
              </Button>
              <Button 
                onClick={() => scrollToSection('plots')}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-6"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View Plots
              </Button>
            </div>
          </div>
          
          <div className="lg:pl-12 animate-fade-in">
            <div className="relative">
              <img 
                src="/khushalipur-site.jpg" 
                alt="Khushalipur Agricultural Plots - Real site showing entrance gates and development" 
                className="rounded-2xl shadow-2xl w-full"
              />
              {/* Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3">
                <p className="text-base font-bold text-white text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)'}}>
                  Khushalipur Agricultural Plots - Real site showing entrance gates and development
                </p>
              </div>
            </div>
            
            {/* Recent Activity Card */}
            <Card className="shadow-lg mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Site visit scheduled
                      </div>
                      <div className="text-xs text-gray-500">
                        Today • Rajesh Kumar
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Plot booking confirmed
                      </div>
                      <div className="text-xs text-gray-500">
                        Yesterday • Singh Family
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {isLoading ? "..." : stats?.totalDownloads || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {isLoading ? "..." : stats?.todayDownloads || 0}
                    </div>
                    <div className="text-xs text-gray-600">Today's Downloads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
