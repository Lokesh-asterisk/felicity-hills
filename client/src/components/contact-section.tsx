import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, MessageSquare, Building, MapPin, CalendarCheck, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    preferredDate: "",
    plotSize: "",
    budget: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        budget: ""
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and mobile number.",
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
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
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
                      <SelectItem value="200-300">200-300 yards</SelectItem>
                      <SelectItem value="300-500">300-500 yards</SelectItem>
                      <SelectItem value="500-800">500-800 yards</SelectItem>
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
                      <SelectItem value="15-25">₹15-25 lakh</SelectItem>
                      <SelectItem value="25-40">₹25-40 lakh</SelectItem>
                      <SelectItem value="40-60">₹40-60 lakh</SelectItem>
                      <SelectItem value="60+">₹60+ lakh</SelectItem>
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
                  <Button asChild className="w-full bg-green-600 text-white hover:bg-green-700 hover:text-white" size="lg">
                    <a href="tel:+918588834221" className="text-white hover:text-white">
                      <Phone className="w-5 h-5 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button asChild className="w-full bg-green-500 text-white hover:bg-green-600" size="lg">
                    <a 
                      href="https://wa.me/918588834221?text=Hello%2C%20I%20need%20information%20about%20Khushalipur%20project" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                      </svg>
                      WhatsApp Message
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
