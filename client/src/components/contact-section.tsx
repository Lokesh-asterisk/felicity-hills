import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, MessageSquare, Building, MapPin, CalendarCheck, Loader2 } from "lucide-react";
import type { Project } from "@shared/schema";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    preferredDate: "",
    plotSize: "",
    budget: "",
    projectId: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const createSiteVisit = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/site-visits", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Site Visit Booked Successfully!",
        description: "Our team will contact you shortly to confirm the details.",
      });
      setFormData({
        name: "",
        mobile: "",
        email: "",
        preferredDate: "",
        plotSize: "",
        budget: "",
        projectId: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-visits"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  // Validation functions
  const validateMobile = (mobile: string): string | null => {
    // Remove all non-digit characters except +
    const cleanMobile = mobile.replace(/[^\d+]/g, '');
    
    // Check for Indian mobile number format
    const indianMobileRegex = /^(\+91)?[6-9]\d{9}$/;
    
    if (!cleanMobile) {
      return "Mobile number is required";
    }
    
    if (!indianMobileRegex.test(cleanMobile)) {
      return "Please enter a valid Indian mobile number (10 digits starting with 6-9)";
    }
    
    return null;
  };
  
  const validateEmail = (email: string): string | null => {
    if (!email) return null; // Email is optional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.mobile) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and mobile number.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate mobile number
    const mobileError = validateMobile(formData.mobile);
    if (mobileError) {
      toast({
        title: "Invalid Mobile Number",
        description: mobileError,
        variant: "destructive",
      });
      return;
    }
    
    // Validate email if provided
    const emailError = validateEmail(formData.email);
    if (emailError) {
      toast({
        title: "Invalid Email Address",
        description: emailError,
        variant: "destructive",
      });
      return;
    }
    
    createSiteVisit.mutate(formData);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Number",
      primary: "+91 85888 34221",
      secondary: "9 AM to 7 PM",
      link: "tel:+918588834221"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      primary: "+91 85888 34221",
      secondary: "For instant response",
      link: "https://wa.me/918588834221"
    },
    {
      icon: Building,
      title: "Company",
      primary: "Felicity Hills",
      secondary: "Dehradun, Uttarakhand",
      link: null
    },
    {
      icon: MapPin,
      title: "Project Location",
      primary: "Khushalipur",
      secondary: "Near Delhi-Dehradun Expressway",
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600">Book your site visit today</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl animate-fade-in-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Site Visit Booking</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => {
                      // Allow only numbers, +, spaces, and hyphens while typing
                      const value = e.target.value.replace(/[^\d+\s-]/g, '');
                      setFormData(prev => ({ ...prev, mobile: value }));
                    }}
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1"
                    maxLength={15}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit Indian mobile number</p>
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send booking confirmation to this email</p>
                </div>

                <div>
                  <Label>Select Project</Label>
                  {projectsLoading ? (
                    <div className="flex items-center gap-2 p-3 border rounded-md mt-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-500">Loading projects...</span>
                    </div>
                  ) : (
                    <Select value={formData.projectId} onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose the project you want to visit" />
                      </SelectTrigger>
                      <SelectContent>
                        {(projects as Project[])?.map((project: Project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{project.name}</span>
                              <span className="text-sm text-gray-500">{project.location} • {project.type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Choose the specific project you're interested in visiting</p>
                </div>

                <div>
                  <Label htmlFor="date">Preferred Visit Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Interested Plot Size</Label>
                  <Select value={formData.plotSize} onValueChange={(value) => setFormData(prev => ({ ...prev, plotSize: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Plot Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200-300">200-300 sq yd</SelectItem>
                      <SelectItem value="300-500">300-500 sq yd</SelectItem>
                      <SelectItem value="500-800">500-800 sq yd</SelectItem>
                      <SelectItem value="800+">800+ sq yd</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15-25L">₹15-25 Lakh</SelectItem>
                      <SelectItem value="25-40L">₹25-40 Lakh</SelectItem>
                      <SelectItem value="40-60L">₹40-60 Lakh</SelectItem>
                      <SelectItem value="60L+">₹60+ Lakh</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-secondary"
                  size="lg"
                  disabled={createSiteVisit.isPending}
                >
                  {createSiteVisit.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-5 h-5 mr-2" />
                      Book Site Visit
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-white shadow-lg border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={info.title} className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <info.icon className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold">{info.title}</div>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="text-primary hover:text-secondary transition-colors"
                            {...(info.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          >
                            {info.primary}
                          </a>
                        ) : (
                          <div className="text-gray-700">{info.primary}</div>
                        )}
                        <div className="text-gray-500 text-sm">{info.secondary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Buttons */}
            <Card className="bg-white shadow-lg border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 relative overflow-hidden group" size="lg">
                    <a href="tel:+918588834221">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Phone className="w-5 h-5 mr-2 relative z-10" />
                      <span className="relative z-10">Call Now</span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    </a>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 relative overflow-hidden group" size="lg">
                    <a 
                      href="https://wa.me/918588834221?text=Hello%2C%20I%20need%20information%20about%20Khushalipur%20project" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg className="w-5 h-5 mr-2 relative z-10" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 223.8-99.6 223.9-222 .1-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                      <span className="relative z-10">WhatsApp Message</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
