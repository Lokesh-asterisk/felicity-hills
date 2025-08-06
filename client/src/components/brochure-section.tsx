import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2 } from "lucide-react";
import type { Brochure } from "@shared/schema";

export default function BrochureSection() {
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

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="brochures" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Download Brochures
          </h2>
          <p className="text-xl text-gray-600">
            Get detailed information about our investment opportunities
          </p>
          <Button 
            onClick={() => window.location.href = '/brochures'}
            variant="outline" 
            className="mt-4 border-primary text-primary hover:bg-primary hover:text-white"
          >
            View All Brochures
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {brochures?.slice(0, 2).map((brochure, index) => (
            <Card 
              key={brochure.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0 bg-gradient-to-br from-green-50 to-teal-50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    PDF • {brochure.fileSize}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {brochure.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {brochure.description}
                </p>
                
                <Button 
                  onClick={() => handleDownload(brochure)}
                  className="w-full bg-primary hover:bg-secondary"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-secondary animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Explore All Brochures
            </h3>
            <p className="text-green-100 mb-6">
              Visit our dedicated brochures page to download all available project documents, pricing details, and legal documentation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/brochures'}
                className="bg-white text-primary hover:bg-gray-100" 
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                View All Brochures
              </Button>
              <Button asChild className="bg-green-500 text-white hover:bg-green-600" size="lg">
                <a 
                  href="https://wa.me/918588834221?text=Hello%2C%20I%20need%20brochure%20information%20about%20Khushalipur%20project" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}