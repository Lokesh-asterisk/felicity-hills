import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Building, Calendar, TreePine, Mountain, Waves, Home, Star, CheckCircle, Phone, ChevronRight, Clock } from "lucide-react";
import { Link } from "wouter";

export default function ProjectShowcase() {
  const projects = [
    {
      id: 1,
      name: "Khushalipur",
      location: "Dehradun, Uttarakhand",
      status: "Active",
      type: "Agricultural Plots",
      description: "Premium agricultural land investment opportunity near Delhi-Dehradun Expressway with excellent connectivity and high returns.",
      features: ["Water facility", "Main road access", "15-20% returns", "Complete approvals"],
      priceRange: "₹8,100/sq yd onwards",
      icon: TreePine,
      color: "from-green-500 to-green-600",
      link: "/",
      isMain: true
    },
    {
      id: 2,
      name: "Green Valley",
      location: "Rishikesh, Uttarakhand",
      status: "Active",
      type: "Residential Plots",
      description: "Peaceful residential plots in the spiritual city of Rishikesh, perfect for those seeking tranquility and natural beauty.",
      features: ["River proximity", "Hill views", "Spiritual environment", "Investment potential"],
      priceRange: "₹12,000/sq yd onwards",
      icon: Waves,
      color: "from-blue-500 to-blue-600",
      link: null,
      isMain: false
    },
    {
      id: 3,
      name: "Hill View Estates",
      location: "Mussoorie, Uttarakhand",
      status: "Active",
      type: "Premium Villas",
      description: "Luxury villa plots in the Queen of Hills with breathtaking mountain views and cool climate year-round.",
      features: ["Mountain views", "Cool climate", "Premium location", "Villa development"],
      priceRange: "₹25,000/sq yd onwards",
      icon: Mountain,
      color: "from-purple-500 to-purple-600",
      link: null,
      isMain: false
    },
    {
      id: 4,
      name: "River Side",
      location: "Haridwar, Uttarakhand",
      status: "Active",
      type: "Eco-friendly Plots",
      description: "Environmentally conscious development near the holy Ganges river with sustainable living features.",
      features: ["River proximity", "Eco-friendly", "Sustainable design", "Religious significance"],
      priceRange: "₹10,500/sq yd onwards",
      icon: Waves,
      color: "from-teal-500 to-teal-600",
      link: null,
      isMain: false
    },
    {
      id: 5,
      name: "Pine Woods",
      location: "Shimla, Himachal Pradesh",
      status: "Planning",
      type: "Hill Station Plots",
      description: "Upcoming development in the summer capital with pine forest surroundings and pleasant weather.",
      features: ["Pine forest", "Cool weather", "Tourist location", "Future potential"],
      priceRange: "Coming Soon",
      icon: TreePine,
      color: "from-green-700 to-green-800",
      link: null,
      isMain: false
    },
    {
      id: 6,
      name: "Valley Heights",
      location: "Manali, Himachal Pradesh",
      status: "Active",
      type: "Luxury Apartments",
      description: "Premium apartment complex in the adventure capital with stunning valley views and modern amenities.",
      features: ["Valley views", "Adventure sports", "Modern amenities", "Tourist hub"],
      priceRange: "₹35,000/sq ft onwards",
      icon: Building,
      color: "from-indigo-500 to-indigo-600",
      link: null,
      isMain: false
    },
    {
      id: 7,
      name: "Mountain View",
      location: "Dharamshala, Himachal Pradesh",
      status: "Planning",
      type: "Resort Plots",
      description: "Future resort development in the Dalai Lama's residence with spiritual significance and tourism potential.",
      features: ["Spiritual location", "Tourism potential", "Mountain views", "Resort development"],
      priceRange: "Coming Soon",
      icon: Mountain,
      color: "from-orange-500 to-orange-600",
      link: null,
      isMain: false
    },
    {
      id: 8,
      name: "Serene Gardens",
      location: "Kasauli, Himachal Pradesh",
      status: "Active",
      type: "Gated Community",
      description: "Exclusive gated community in the cantonment town with colonial charm and peaceful environment.",
      features: ["Gated community", "Colonial charm", "Peaceful location", "Exclusive living"],
      priceRange: "₹18,000/sq yd onwards",
      icon: Home,
      color: "from-pink-500 to-pink-600",
      link: null,
      isMain: false
    }
  ];

  const stats = [
    { number: "8+", label: "Active Projects", icon: Building },
    { number: "2", label: "States Covered", icon: MapPin },
    { number: "500+", label: "Happy Families", icon: Users },
    { number: "1000+", label: "Acres Developed", icon: TreePine }
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
              <Building className="w-4 h-4 mr-2" />
              Premium Real Estate Portfolio
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Our <span className="text-yellow-300">Project</span> Showcase
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Discover our diverse portfolio of premium real estate projects across 
              Uttarakhand and Himachal Pradesh's most scenic and promising locations.
            </p>
            <div className="flex items-center justify-center text-lg bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-flex">
              <MapPin className="w-6 h-6 mr-2 text-yellow-300" />
              <span>Uttarakhand & Himachal Pradesh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Project Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From agricultural investments to luxury developments, explore our comprehensive 
              range of real estate opportunities designed for every investor and lifestyle preference.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg overflow-hidden animate-fade-in-up ${project.isMain ? 'md:col-span-2 lg:col-span-2 xl:col-span-2' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Project Header */}
                  <div className={`bg-gradient-to-r ${project.color} p-6 text-white relative overflow-hidden`}>
                    {project.isMain && (
                      <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 border-yellow-300">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                          <project.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl group-hover:scale-105 transition-transform">
                            {project.name}
                          </h3>
                          <div className="flex items-center text-white/90 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{project.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          project.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        } shadow-sm`}
                      >
                        {project.status === 'Active' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-white/90 text-sm font-medium">{project.type}</p>
                  </div>
                  
                  {/* Project Details */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Starting Price</div>
                      <div className="font-bold text-lg text-gray-900">{project.priceRange}</div>
                    </div>
                    
                    {/* Action Button */}
                    {project.link ? (
                      <Link href={project.link}>
                        <Button className={`w-full bg-gradient-to-r ${project.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                          <span className="mr-2">Explore Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : project.status === 'Active' ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => {
                          // Scroll to contact section on home page
                          window.location.href = '/#contact';
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Get Information
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
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
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-lg">
              <Star className="w-5 h-5 mr-2" />
              Ready to Invest?
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Find Your Perfect <span className="text-yellow-300">Investment</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              Explore our diverse portfolio and discover the ideal real estate investment 
              opportunity that matches your goals and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="tel:+918588834221">
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl px-8 py-4 text-lg font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +91 85888 34221
                </Button>
              </a>
              <Link href="/book-visit">
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 hover:text-green-700 hover:scale-105 transition-all duration-300 shadow-xl px-8 py-4 text-lg font-semibold border-2 border-white"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Site Visit
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 text-center">
              <p className="text-green-100 text-sm">
                Free consultation • Expert guidance • Customized investment solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}