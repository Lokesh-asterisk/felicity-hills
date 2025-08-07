import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Award, Zap, Home, TrendingUp, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { number: "8+", label: "Active Projects", icon: Home },
    { number: "500+", label: "Happy Families", icon: Users },
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "1000+", label: "Acres Developed", icon: TrendingUp }
  ];

  const projects = [
    { name: "Khushalipur", location: "Dehradun", status: "Active", type: "Agricultural Plots" },
    { name: "Green Valley", location: "Rishikesh", status: "Active", type: "Residential Plots" },
    { name: "Hill View Estates", location: "Mussoorie", status: "Active", type: "Premium Villas" },
    { name: "River Side", location: "Haridwar", status: "Active", type: "Eco-friendly Plots" },
    { name: "Pine Woods", location: "Nainital", status: "Planning", type: "Hill Station Plots" },
    { name: "Valley Heights", location: "Dehradun", status: "Active", type: "Luxury Apartments" },
    { name: "Mountain View", location: "Almora", status: "Planning", type: "Resort Plots" },
    { name: "Serene Gardens", location: "Haldwani", status: "Active", type: "Gated Community" }
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
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Felicity Hills
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Leading real estate developer in Uttarakhand, specializing in premium land investments 
            and sustainable development projects across hill border areas.
          </p>
          <div className="flex items-center justify-center text-lg">
            <MapPin className="w-6 h-6 mr-2" />
            <span>Serving Uttarakhand & Hill Border Regions</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded with a vision to transform land investment opportunities in Uttarakhand, 
                  Felicity Hills has emerged as a trusted name in real estate development across 
                  the beautiful hill regions of North India.
                </p>
                <p>
                  Our expertise lies in identifying premium locations with high growth potential, 
                  particularly in agricultural and residential sectors. We focus on areas near 
                  hill borders where natural beauty meets investment opportunity.
                </p>
                <p>
                  With over 15 years of experience, we have successfully delivered 8 major projects, 
                  helping more than 500 families achieve their dreams of land ownership and 
                  profitable investments.
                </p>
                <p>
                  Khushalipur, our flagship project near Dehradun, exemplifies our commitment to 
                  quality development, offering agricultural plots with modern infrastructure 
                  and promising returns of 15-20% annually.
                </p>
              </div>
            </div>
            <div className="bg-green-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Why Choose Uttarakhand?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                  <span>Rapidly developing infrastructure and connectivity</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                  <span>High appreciation rates in land values</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                  <span>Strategic location near major hill stations</span>
                </li>
                <li className="flex items-start">
                  <Shield className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                  <span>Stable investment environment with clear titles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every project we develop
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Projects Portfolio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of real estate projects across Uttarakhand and hill border areas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <p className="text-sm text-gray-500">{project.type}</p>
                  {project.name === 'Khushalipur' && (
                    <Link href="/">
                      <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                        View Details
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Invest with Felicity Hills?</h2>
          <p className="text-xl mb-8">
            Join hundreds of satisfied investors who have chosen Felicity Hills for their 
            land investment journey in Uttarakhand's most promising locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                Explore Khushalipur Project
              </Button>
            </Link>
            <a href="tel:+918588834221">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Call: +91 85888 34221
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}