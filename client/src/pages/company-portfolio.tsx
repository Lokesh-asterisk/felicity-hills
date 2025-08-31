import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Building, Star, ArrowRight } from 'lucide-react';
import type { Project } from '@shared/schema';

// Import existing components
import Navigation from '../components/navigation';
import ContactSection from '../components/contact-section';
import Footer from '../components/footer';

export default function CompanyPortfolio() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Header */}
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Felicity Hills
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Premium Real Estate Development Company
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
              We specialize in creating exceptional agricultural land investments and residential projects 
              near Dehradun. With a focus on sustainable development and premium amenities, we transform 
              land into thriving communities.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Portfolio Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Project Portfolio
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our carefully curated collection of premium real estate projects, 
            each designed to offer exceptional value and lifestyle experiences.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Projects Available
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              We're working on exciting new projects. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      className={`text-xs font-medium ${
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
                    {project.featured && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                    {project.name}
                  </CardTitle>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.shortDescription}
                  </CardDescription>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{project.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price Range:</span>
                      <span className="text-sm text-green-600 dark:text-green-400 font-bold">{project.priceRange}</span>
                    </div>

                    {project.features && project.features.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.features.slice(0, 3).map((feature, index) => (
                            <Badge 
                              key={index}
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {project.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              +{project.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/project/${project.id}`}
                    className="block w-full"
                  >
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-700 transition-colors"
                      data-testid={`view-project-${project.id}`}
                    >
                      <span>View Project Details</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Company Stats Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">{projects.length}+</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Projects</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">500+</h3>
              <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">1000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Acres Developed</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">5+</h3>
              <p className="text-gray-600 dark:text-gray-400">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section with Booking Form */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
      
      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/918588834221" 
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
        data-testid="whatsapp-float"
      >
        📱
      </a>
    </div>
  );
}