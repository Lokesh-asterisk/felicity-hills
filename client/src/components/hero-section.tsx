import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, MapPin } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            <img 
              src="/attached_assets/front_1754569110815.jpg" 
              alt="Khushalipur Agricultural Plots - Real site showing entrance gates and development" 
              className="rounded-2xl shadow-2xl w-full"
            />
            
            {/* Recent Activity Card */}
            <Card className="shadow-lg mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Ram Singh booked 300 sq yd plot</div>
                        <div className="text-xs text-gray-500">2 hours ago • ₹24.3 लाख</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">23</div>
                      <div className="text-xs text-gray-600">Site Visits Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">7</div>
                      <div className="text-xs text-gray-600">Plots Booked</div>
                    </div>
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
