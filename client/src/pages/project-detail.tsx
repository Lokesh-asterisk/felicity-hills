import React from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Star, Calendar, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@shared/schema';

// Import the existing home components
import Navigation from '../components/navigation';
import HeroSection from '../components/hero-section';
import RecentActivitySection from '../components/recent-activity-section';
import LocationAdvantages from '../components/location-advantages';
import ComparisonTable from '../components/comparison-table';
import FAQSection from '../components/faq-section';
import ContactSection from '../components/contact-section';
import Footer from '../components/footer';

interface ProjectDetailParams {
  id: string;
}

export default function ProjectDetail() {
  const params = useParams<ProjectDetailParams>();
  const [, setLocation] = useLocation();
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  const project = projects.find(p => p.id === params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if this is the Khushalipur project (current landing page)
  const isKhushalipurProject = project.name.toLowerCase().includes('khushali') || 
                              project.location.toLowerCase().includes('khushali') ||
                              project.id === 'khushalipur' ||
                              project.name.toLowerCase().includes('hills');

  // If it's Khushalipur, render the full landing page
  if (isKhushalipurProject) {
    return (
      <div className="min-h-screen">
        {/* Back to Portfolio Button */}
        <div className="fixed top-4 left-4 z-50">
          <Link href="/">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              data-testid="back-to-portfolio"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
          </Link>
        </div>

        <Navigation />
        <HeroSection />
        <RecentActivitySection />
        <LocationAdvantages />
        <ComparisonTable />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    );
  }

  // For other projects, render a detailed project page
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                data-testid="back-to-portfolio"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Button>
            </Link>
            
            <Badge 
              className={`text-sm font-medium ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : project.status === 'coming_soon'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : project.status === 'completed'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              }`}
            >
              {project.status === 'active' ? 'Available Now' :
               project.status === 'coming_soon' ? 'Coming Soon' :
               project.status === 'completed' ? 'Completed' : 'Sold Out'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Project Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">{project.name}</h1>
              {project.featured && (
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
              )}
            </div>
            
            <div className="flex items-center justify-center text-green-100 mb-6">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{project.location}</span>
            </div>
            
            <p className="text-xl text-green-100 leading-relaxed max-w-3xl mx-auto">
              {project.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Project Type</h3>
                    <p className="text-gray-900 dark:text-white">{project.type}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Price Range</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{project.priceRange}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Status</h3>
                    <p className="text-gray-900 dark:text-white capitalize">{project.status.replace('_', ' ')}</p>
                  </div>
                  
                  {project.latitude && project.longitude && (
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300">Location</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`, '_blank');
                        }}
                        className="mt-2"
                      >
                        📍 View on Google Maps
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            {((project.features && project.features.length > 0) || (project.amenities && project.amenities.length > 0)) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features & Amenities</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.features && project.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Key Features</h3>
                      <div className="space-y-2">
                        {project.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.amenities && project.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Amenities</h3>
                      <div className="space-y-2">
                        {project.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${project.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Get More Information</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Interested in this project? Get in touch with our team for detailed information and site visits.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Site Visit
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Request Brochure
                </Button>
                
                <Button variant="outline" className="w-full">
                  📞 Call Now
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Facts</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Project Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.type}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{project.status.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Price Range</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{project.priceRange}</span>
                </div>
                
                {project.featured && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Featured Project</span>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}