import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden min-h-screen">
      {/* Background pattern with multiple project images */}
      <div className="absolute inset-0 opacity-20">
        <div 
          style={{
            backgroundImage: `url('/khushalipur-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="inline-flex items-center mb-6 bg-accent/10 text-accent hover:bg-accent/20">
            <Building className="w-4 h-4 mr-2" />
            Premium Real Estate Investment Opportunities
          </Badge>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 mb-6">
            <span className="text-primary">Felicity Hills</span><br />
            Real Estate Excellence
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover premium investment opportunities in prime locations. From agricultural land to luxury plots, 
            we offer carefully curated properties with exceptional growth potential.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">2+</div>
              <div className="text-gray-600">Premium Projects</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">15-25%</div>
              <div className="text-gray-600">Expected Returns</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Happy Investors</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">₹8K+</div>
              <div className="text-gray-600">Starting Price/sq yd</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/portfolio">
            <Button 
              size="lg"
              className="bg-primary hover:bg-secondary text-lg px-10 py-6"
            >
              <Building className="w-5 h-5 mr-2" />
              Explore Projects
            </Button>
          </Link>
          
          <Link href="/book-visit">
            <Button 
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-10 py-6"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Book Site Visit
            </Button>
          </Link>
        </div>

        {/* Company Overview Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Felicity Hills?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">High Growth Potential</h3>
              <p className="text-gray-600">Strategic locations with excellent connectivity and infrastructure development</p>
            </div>
            
            <div className="p-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trusted by Investors</h3>
              <p className="text-gray-600">500+ satisfied customers with transparent processes and timely delivery</p>
            </div>
            
            <div className="p-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
              <p className="text-gray-600">Carefully selected properties near major highways and developing infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
