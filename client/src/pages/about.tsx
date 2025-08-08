import { useEffect } from "react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Award, Zap, Home, TrendingUp, Shield, Clock, ChevronRight, Star, CheckCircle, Phone } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  // Set page title for SEO
  useEffect(() => {
    document.title = "About Felicity Hills - Leading Real Estate Developer | Khushalipur Project";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Felicity Hills, a trusted real estate developer with 15+ years experience. Discover our journey, values, and commitment to premium land investments in Uttarakhand and Himachal Pradesh.');
    }
  }, []);

  const stats = [
    { number: "8+", label: "Active Projects", icon: Home },
    { number: "500+", label: "Happy Families", icon: Users },
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "1000+", label: "Acres Developed", icon: TrendingUp }
  ];

  const projects = [
    { name: "Khushalipur", location: "Dehradun, UK", status: "Active", type: "Agricultural Plots" },
    { name: "Green Valley", location: "Rishikesh, UK", status: "Active", type: "Residential Plots" },
    { name: "Hill View Estates", location: "Mussoorie, UK", status: "Active", type: "Premium Villas" },
    { name: "River Side", location: "Haridwar, UK", status: "Active", type: "Eco-friendly Plots" },
    { name: "Pine Woods", location: "Shimla, HP", status: "Planning", type: "Hill Station Plots" },
    { name: "Valley Heights", location: "Manali, HP", status: "Active", type: "Luxury Apartments" },
    { name: "Mountain View", location: "Dharamshala, HP", status: "Planning", type: "Resort Plots" },
    { name: "Serene Gardens", location: "Kasauli, HP", status: "Active", type: "Gated Community" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Complete legal documentation and transparent pricing with no hidden costs."
    },
    {
      icon: Award,
      title: "Quality Development",
      description: "Premium infrastructure with modern amenities and sustainable development practices."
    },
    {
      icon: TrendingUp,
      title: "Investment Growth",
      description: "Proven track record of delivering 15-20% annual returns on land investments."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Dedicated support team ensuring complete satisfaction throughout your investment journey."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-teal-600 to-green-700 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 500+ Families
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              About <span className="text-yellow-300">Felicity Hills</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Leading real estate developer specializing in premium land investments 
              and sustainable development projects across India's most scenic hill regions.
            </p>
            <div className="flex items-center justify-center text-lg bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-flex">
              <MapPin className="w-6 h-6 mr-2 text-yellow-300" />
              <span>Serving Uttarakhand & Himachal Pradesh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Track Record</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Numbers that speak for our commitment and success in real estate development</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up hover:transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-green-100 to-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <stat.icon className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Clock className="w-4 h-4 mr-2" />
                15+ Years of Excellence
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Our <span className="text-green-600">Journey</span> & <span className="text-teal-600">Vision</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p className="relative pl-6">
                  <CheckCircle className="w-5 h-5 text-green-500 absolute left-0 top-1" />
                  Founded with a vision to transform land investment opportunities across hill regions, 
                  Felicity Hills has emerged as a trusted name in real estate development in 
                  Uttarakhand and Himachal Pradesh.
                </p>
                <p className="relative pl-6">
                  <CheckCircle className="w-5 h-5 text-green-500 absolute left-0 top-1" />
                  Our expertise lies in identifying premium locations with high growth potential, 
                  particularly in agricultural and residential sectors where natural beauty meets investment opportunity.
                </p>
                <p className="relative pl-6">
                  <CheckCircle className="w-5 h-5 text-green-500 absolute left-0 top-1" />
                  With over 15 years of experience, we have successfully delivered 8 major projects, 
                  helping more than 500 families achieve their dreams of land ownership and 
                  profitable investments.
                </p>
                <p className="relative pl-6">
                  <CheckCircle className="w-5 h-5 text-green-500 absolute left-0 top-1" />
                  Khushalipur, our flagship project near Dehradun, exemplifies our commitment to 
                  quality development, offering agricultural plots with modern infrastructure 
                  and promising returns of 15-20% annually.
                </p>
              </div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Card className="bg-gradient-to-br from-green-600 to-teal-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Why Choose Hill Regions?</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <div className="bg-white/20 p-2 rounded-lg mr-4 mt-0.5 group-hover:bg-white/30 transition-colors">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold">Infrastructure Growth</span>
                        <p className="text-green-100 text-sm mt-1">Rapidly developing infrastructure and connectivity</p>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="bg-white/20 p-2 rounded-lg mr-4 mt-0.5 group-hover:bg-white/30 transition-colors">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold">High Returns</span>
                        <p className="text-green-100 text-sm mt-1">Proven appreciation rates of 15-20% annually</p>
                      </div>
                    </li>
                    <li className="flex items-start group">
                      <div className="bg-white/20 p-2 rounded-lg mr-4 mt-0.5 group-hover:bg-white/30 transition-colors">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold">Secure Investment</span>
                        <p className="text-green-100 text-sm mt-1">Clear legal titles and government approvals</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2">
              Our Foundation
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The principles that guide every decision we make and every project we develop, 
              ensuring trust and excellence in everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-green-100 to-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                    <value.icon className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-teal-100 text-teal-800 px-4 py-2">
              Our Portfolio
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Project Showcase</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse range of real estate projects across Uttarakhand and Himachal Pradesh, 
              each designed to offer exceptional investment opportunities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Project Header */}
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg group-hover:scale-105 transition-transform">
                        {project.name}
                      </h3>
                      <Badge 
                        className={`${
                          project.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        } shadow-sm`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-green-100 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{project.location}</span>
                    </div>
                  </div>
                  
                  {/* Project Details */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 font-medium">{project.type}</p>
                    {project.name === 'Khushalipur' ? (
                      <Link href="/">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          <span className="mr-2">View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                        disabled
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-teal-600 to-green-700 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-lg">
              <Star className="w-5 h-5 mr-2" />
              Start Your Investment Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Ready to Invest with <span className="text-yellow-300">Felicity Hills</span>?
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              Join hundreds of satisfied investors who have chosen Felicity Hills for their 
              land investment journey in Uttarakhand and Himachal Pradesh's most promising locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/">
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl px-8 py-4 text-lg font-semibold"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Explore Khushalipur Project
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+918588834221">
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 hover:text-green-700 hover:scale-105 transition-all duration-300 shadow-xl px-8 py-4 text-lg font-semibold border-2 border-white"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +91 85888 34221
                </Button>
              </a>
            </div>
            <div className="mt-8 text-center">
              <p className="text-green-100 text-sm">
                Free consultation • Site visits arranged • Expert guidance available
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}