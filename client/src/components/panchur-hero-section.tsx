import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, MapPin } from "lucide-react";
import panchurBgImage from "@assets/panchur-media/panchur-image-2.jpg";
import panchurHeroImage from "@assets/panchur-media/panchur-image-3.jpg";

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
      <div className="absolute inset-0 opacity-15">
        <div 
          style={{
            backgroundImage: `url(${panchurBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="w-full h-full"
        />
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
            <div className="relative">
              <img 
                src={panchurHeroImage} 
                alt="Panchur Hills - Premium mountain plots with stunning Himalayan views" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              {/* Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3">
                <p className="text-base font-bold text-white text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)'}}>
                  Panchur Hills - Premium mountain plots with stunning Himalayan views
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}