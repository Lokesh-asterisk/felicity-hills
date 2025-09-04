import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Star, ArrowRight, TrendingUp, Users } from "lucide-react";
import type { Project } from "@shared/schema";
import Navigation from "../components/navigation";
import TestimonialsSection from "../components/testimonials-section";
import ContactSection from "../components/contact-section";
import Footer from "../components/footer";

export default function Home() {
  // Set page title for SEO
  useEffect(() => {
    document.title = "Felicity Hills - Premium Real Estate Investment Opportunities";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover premium real estate investment opportunities with Felicity Hills. From agricultural land to luxury plots, exceptional growth potential in prime locations.');
    }
  }, []);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Company Hero Section */}
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
      
      {/* Featured Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated portfolio of premium real estate investments
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <Building className="w-16 h-16 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{project.type}</Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                    <CardDescription className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </CardDescription>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{project.pricePerSqYd.toLocaleString()}</span>
                        <span className="text-gray-600 text-sm ml-1">per sq yd</span>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {project.expectedReturns}% Returns
                      </Badge>
                    </div>
                    <Link href={`/project/${project.id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/portfolio">
              <Button variant="outline" size="lg">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <ContactSection />
      <Footer />
      
      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/918588834221" 
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label="WhatsApp icon">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
        </svg>
      </a>
    </div>
  );
}
