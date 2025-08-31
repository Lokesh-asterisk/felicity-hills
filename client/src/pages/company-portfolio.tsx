import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Building, Star, ArrowRight, Trophy, Shield, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import type { Project } from '@shared/schema';

// Import existing components
import Navigation from '../components/navigation';
import ContactSection from '../components/contact-section';
import Footer from '../components/footer';
import backgroundImage from '@assets/image_1756640331916.png';

// Add floating animation keyframes
const floatingStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.1); }
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = floatingStyles;
  document.head.appendChild(styleSheet);
}

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
    <div className="min-h-screen">
      {/* Navigation Header */}
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-screen md:min-h-screen overflow-hidden flex items-center">
        {/* Beautiful Landscape Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-green-400 to-green-600"></div>
        
        {/* Mountain Silhouettes */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 1200 600" className="absolute bottom-0 w-full h-full">
            {/* Back mountains */}
            <polygon 
              points="0,300 200,180 400,220 600,160 800,200 1000,140 1200,180 1200,600 0,600" 
              fill="rgba(34, 197, 94, 0.3)"
            />
            {/* Middle mountains */}
            <polygon 
              points="0,350 150,250 350,280 550,220 750,260 950,200 1200,240 1200,600 0,600" 
              fill="rgba(34, 197, 94, 0.5)"
            />
            {/* Front mountains */}
            <polygon 
              points="0,400 100,320 300,350 500,300 700,340 900,280 1200,320 1200,600 0,600" 
              fill="rgba(34, 197, 94, 0.7)"
            />
          </svg>
        </div>
        
        {/* Rolling Hills */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-500/60 to-transparent"></div>
        
        {/* Clouds */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full transform rotate-12"></div>
          <div className="absolute top-16 left-20 w-24 h-12 bg-white rounded-full"></div>
          <div className="absolute top-32 right-32 w-40 h-20 bg-white rounded-full transform -rotate-6"></div>
          <div className="absolute top-28 right-40 w-28 h-14 bg-white rounded-full"></div>
          <div className="absolute top-40 left-1/3 w-36 h-18 bg-white rounded-full transform rotate-3"></div>
        </div>
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/70 via-blue-600/70 to-purple-600/70"></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 60px 60px'
        }}></div>
        
        {/* Building/House Icons Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/20 text-4xl"
              style={{
                left: `${(i % 4) * 25 + 10}%`,
                top: `${Math.floor(i / 4) * 30 + 15}%`,
                transform: `rotate(${i * 15}deg)`,
                animation: `float ${3 + (i % 3)}s ease-in-out infinite`
              }}
            >
              🏠
            </div>
          ))}
        </div>
        
        {/* Investment Icons */}
        <div className="absolute inset-0 opacity-15">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/30 text-2xl"
              style={{
                left: `${(i % 4) * 25 + 5}%`,
                top: `${Math.floor(i / 4) * 40 + 25}%`,
                animation: `pulse ${2 + (i % 2)}s ease-in-out infinite`
              }}
            >
              {i % 4 === 0 ? '🌱' : i % 4 === 1 ? '💰' : i % 4 === 2 ? '📈' : '🏆'}
            </div>
          ))}
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-700"></div>
          
          {/* Additional geometric shapes */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-white/5 transform rotate-45"></div>
          <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-white/10 transform rotate-12 animate-pulse delay-300"></div>
          <div className="absolute bottom-1/3 left-1/6 w-6 h-6 bg-white/15 rounded-full animate-bounce delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-8 md:py-12 text-center text-white w-full">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 md:mb-6">
              <Badge className="bg-white/20 text-white border-white/30 text-xs md:text-sm px-3 md:px-4 py-2 mb-3 md:mb-4">
                🏆 Trusted by 500+ Investors
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Felicity Hills
            </h1>
            
            <p className="text-lg md:text-2xl lg:text-3xl font-light mb-3 md:mb-4 text-green-100">
              Premium Real Estate Development Company
            </p>
            
            <p className="text-base md:text-lg lg:text-xl text-green-50 leading-relaxed mb-6 md:mb-8 max-w-3xl mx-auto px-2">
              Transform your investment dreams into reality with our carefully curated portfolio of 
              agricultural land investments and residential projects near Dehradun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Building className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Explore Projects
              </Button>
              <Button 
                size="lg" 
                className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-white font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Users className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Book Site Visit
              </Button>
            </div>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 px-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
                <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-green-200 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">15-20% Returns</h3>
                <p className="text-sm md:text-base text-green-100">Guaranteed annual returns on agricultural investments</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
                <Shield className="h-8 w-8 md:h-12 md:w-12 text-blue-200 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Secure Investment</h3>
                <p className="text-sm md:text-base text-blue-100">Legal documentation and transparent processes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
                <Award className="h-8 w-8 md:h-12 md:w-12 text-purple-200 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Prime Locations</h3>
                <p className="text-sm md:text-base text-purple-100">Strategic locations near Delhi-Dehradun Expressway</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Portfolio Section */}
      <div id="projects" className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              Award-Winning Projects
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Our Premium Project Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of premium real estate projects, 
              each designed to offer exceptional value, lifestyle experiences, and guaranteed returns.
            </p>
          </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="h-16 w-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Exciting Projects Coming Soon
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              We're developing amazing new investment opportunities. Stay tuned for exceptional projects!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white border-0 shadow-lg overflow-hidden relative ${
                  project.featured ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      FEATURED
                    </div>
                  </div>
                )}

                {/* Project Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge 
                      className={`text-xs font-medium shadow-lg ${
                        project.status === 'active' 
                          ? 'bg-green-500 text-white'
                          : project.status === 'coming_soon'
                          ? 'bg-blue-500 text-white'
                          : project.status === 'completed'
                          ? 'bg-purple-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {project.status === 'active' ? '🟢 Available Now' :
                       project.status === 'coming_soon' ? '🔵 Coming Soon' :
                       project.status === 'completed' ? '🟣 Completed' : '🟠 Sold Out'}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors flex items-center gap-2">
                    {project.name}
                    {project.featured && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                  </CardTitle>
                  
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-sm font-medium">{project.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-700 mb-4 leading-relaxed">
                    {project.shortDescription}
                  </CardDescription>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Type:
                        </span>
                        <span className="text-sm text-gray-900 font-semibold">{project.type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Investment:
                        </span>
                        <span className="text-sm text-green-600 font-bold text-lg">{project.priceRange}</span>
                      </div>
                    </div>

                    {project.features && project.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Key Highlights:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {project.features.slice(0, 3).map((feature, index) => (
                            <Badge 
                              key={index}
                              className="text-xs bg-green-100 text-green-800 border-green-200"
                            >
                              ✓ {feature}
                            </Badge>
                          ))}
                          {project.features.length > 3 && (
                            <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                              +{project.features.length - 3} more benefits
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
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      data-testid={`view-project-${project.id}`}
                    >
                      <span>Explore This Investment</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Company Stats Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-20 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Our track record speaks for itself - delivering exceptional results and building lasting relationships
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {projects.length}+
                </h3>
                <p className="text-green-100 font-medium">Premium Projects</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  500+
                </h3>
                <p className="text-blue-100 font-medium">Happy Investors</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  1000+
                </h3>
                <p className="text-purple-100 font-medium">Acres Developed</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  5+
                </h3>
                <p className="text-yellow-100 font-medium">Years Excellence</p>
              </div>
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