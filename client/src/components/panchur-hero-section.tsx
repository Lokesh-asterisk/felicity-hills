import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, MapPin } from "lucide-react";

export default function PanchurHeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-green-100/30 to-teal-100/30"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <Badge variant="secondary" className="inline-flex items-center mb-6 bg-accent/10 text-accent hover:bg-accent/20">
              <Flame className="w-4 h-4 mr-2" />
              Premium Mountain Plots - Book Site Visit Today!
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-primary">Panchur Hills</span><br />
              Premium Plots
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              1,115m Elevation • Pauri Garhwal, Uttarakhand
            </p>

            
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-1">₹3,900</div>
                  <div className="text-gray-600">Starting from per sq ft</div>
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
                  <div className="text-2xl font-bold text-primary mb-1">1,115m</div>
                  <div className="text-gray-600">Elevation Level</div>
                </CardContent>
              </Card>
            </div>


            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('contact')}
                size="lg"
                className="bg-primary hover:bg-secondary text-lg px-8 py-6"
                data-testid="book-site-visit"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Site Visit
              </Button>
              <Button 
                onClick={() => scrollToSection('amenities')}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-6"
                data-testid="view-amenities"
              >
                <MapPin className="w-5 h-5 mr-2" />
                View Amenities
              </Button>
            </div>
          </div>

          
          <div className="lg:pl-12 animate-fade-in">
            <div className="relative bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl shadow-2xl p-12 text-center">
              <div className="text-6xl mb-4">🏔️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Himalayan Views</h3>
              <p className="text-gray-600">Premium mountain plots with stunning panoramic views</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}