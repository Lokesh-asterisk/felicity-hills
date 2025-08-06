import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2, ArrowLeft, Calendar } from "lucide-react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import type { Brochure } from "@shared/schema";

export default function BrochuresPage() {
  const { data: brochures, isLoading } = useQuery<Brochure[]>({
    queryKey: ["/api/brochures"],
  });

  const handleDownload = (brochure: Brochure) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = brochure.downloadUrl;
    link.download = `${brochure.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goHome = () => {
    window.location.href = '/';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <Button 
              onClick={goHome}
              variant="outline" 
              className="mb-6 border-primary text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Download Brochures
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get comprehensive information about our Khushalipur agricultural land investment project. 
              Download detailed brochures with plot layouts, pricing, legal documentation, and investment guides.
            </p>
          </div>
        </div>
      </section>

      {/* Brochures Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Available Brochures ({brochures?.length})
                </h2>
                <p className="text-gray-600">
                  Download PDF brochures with complete project information
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {brochures?.map((brochure, index) => (
                  <Card 
                    key={brochure.id}
                    className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0 bg-gradient-to-br from-green-50 to-teal-50 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <Badge variant="secondary" className="bg-primary/10 text-primary mb-2 w-fit">
                            PDF • {brochure.fileSize}
                          </Badge>
                          {brochure.createdAt && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(brochure.createdAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-4">
                        {brochure.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {brochure.description}
                      </p>
                      
                      <Button 
                        onClick={() => handleDownload(brochure)}
                        className="w-full bg-primary hover:bg-secondary group-hover:scale-105 transition-transform"
                        size="lg"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {brochures?.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No brochures available
                  </h3>
                  <p className="text-gray-600">
                    Brochures will be available soon. Please check back later.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's Inside Our Brochures
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive information to help you make informed investment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📍",
                title: "Location Details",
                description: "Strategic location near Delhi-Dehradun Expressway with connectivity maps"
              },
              {
                icon: "💰",
                title: "Pricing & Returns",
                description: "Detailed pricing structure, expected returns, and investment calculations"
              },
              {
                icon: "📋",
                title: "Legal Documentation",
                description: "Complete legal clarity, approvals, and documentation details"
              },
              {
                icon: "🏗️",
                title: "Plot Layouts",
                description: "Individual plot specifications, sizes, and infrastructure plans"
              }
            ].map((feature, index) => (
              <Card 
                key={feature.title}
                className="shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need More Information?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Our team is ready to provide personalized assistance and answer all your questions about our agricultural land investment project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-primary hover:bg-gray-100" size="lg">
              <a href="tel:+918588834221">
                Call +91 85888 34221
              </a>
            </Button>
            <Button asChild className="bg-green-500 text-white hover:bg-green-600" size="lg">
              <a 
                href="https://wa.me/918588834221?text=Hello%2C%20I%20downloaded%20your%20brochure%20and%20need%20more%20information" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
            </Button>
            <Button 
              onClick={goHome}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary" 
              size="lg"
            >
              Book Site Visit
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}