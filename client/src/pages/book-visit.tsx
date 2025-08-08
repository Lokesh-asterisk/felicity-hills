import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertSiteVisitSchema } from "@shared/schema";
import type { InsertSiteVisit } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Phone, Mail, IndianRupee, Clock, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Link } from "wouter";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

// Enhanced validation schema with proper mobile and email validation
const bookingFormSchema = insertSiteVisitSchema.extend({
  email: z.string().optional().or(z.literal("")).refine(
    (email) => {
      if (!email || email === "") return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    { message: "Please enter a valid email address" }
  ),
  mobile: z.string()
    .min(1, "Mobile number is required")
    .refine(
      (mobile) => {
        // Remove all non-digit characters except +
        const cleanMobile = mobile.replace(/[^\d+]/g, '');
        // Check for Indian mobile number format: +91 followed by 10 digits starting with 6-9
        const indianMobileRegex = /^(\+91)?[6-9]\d{9}$/;
        return indianMobileRegex.test(cleanMobile);
      },
      { message: "Please enter a valid Indian mobile number (10 digits starting with 6-9)" }
    ),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookVisit() {
  // Set page title for SEO
  useEffect(() => {
    document.title = "Book Site Visit - Khushalipur Agricultural Land | Felicity Hills";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Schedule your site visit to Khushalipur agricultural land project. Book a free guided tour and explore the investment opportunities with our expert team.');
    }
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      preferredDate: "",
      plotSize: "",
      budget: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertSiteVisit) => {
      const response = await apiRequest("POST", "/api/site-visits", data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setIsSubmitted(true);
      const emailStatus = data?.emailStatus || {};
      
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your site visit has been booked successfully. ${
          emailStatus.userNotified 
            ? "Check your email for confirmation details." 
            : "Our team will contact you shortly."
        }`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Visit Booked Successfully!
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for your interest in Khushalipur Agricultural Plots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">What's Next?</h3>
                <div className="text-sm text-green-600 dark:text-green-300 space-y-1">
                  <p>📞 Our team will contact you within 24 hours</p>
                  <p>📧 Check your email for detailed confirmation</p>
                  <p>🗺️ We'll provide directions to the site location</p>
                  <p>☕ Enjoy refreshments during your visit</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Khushalipur Village, Near Delhi-Dehradun Expressway</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Site visits available from 9 AM to 5 PM</span>
                </div>
              </div>

              <Button 
                onClick={() => setIsSubmitted(false)} 
                variant="outline"
                className="mt-6"
              >
                Book Another Visit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
              Book Your Site Visit
            </CardTitle>
            <CardDescription className="text-lg">
              Schedule a personal tour of Khushalipur Agricultural Plots and discover your next investment opportunity
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      {...form.register("name")}
                      className={form.formState.errors.name ? "border-red-500" : ""}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      {...form.register("mobile")}
                      onChange={(e) => {
                        // Allow only numbers, +, spaces, and hyphens while typing
                        const value = e.target.value.replace(/[^\d+\s-]/g, '');
                        form.setValue("mobile", value);
                      }}
                      className={form.formState.errors.mobile ? "border-red-500" : ""}
                      maxLength={15}
                    />
                    {form.formState.errors.mobile && (
                      <p className="text-sm text-red-500">{form.formState.errors.mobile.message}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Enter 10-digit Indian mobile number (starting with 6, 7, 8, or 9)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    📧 Provide email to receive detailed confirmation and directions
                  </p>
                </div>
              </div>

              {/* Visit Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-green-600" />
                  Visit Preferences
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Visit Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    {...form.register("preferredDate")}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-gray-500">
                    Our team will confirm availability and arrange the visit
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plotSize">Interested Plot Size</Label>
                    <Select onValueChange={(value) => form.setValue("plotSize", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plot size" />
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

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select onValueChange={(value) => form.setValue("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
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
                </div>
              </div>

              {/* Site Information */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Site Information
                </h3>
                <div className="text-sm text-green-600 dark:text-green-300 space-y-1">
                  <p>📍 Location: Khushalipur Village, Near Delhi-Dehradun Expressway</p>
                  <p>🕒 Visit Duration: 2-3 hours (including refreshments)</p>
                  <p>🚗 Free pickup/drop available from Dehradun</p>
                  <p>📋 Documents and investment guidance provided on-site</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Booking Your Visit...
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Book Site Visit
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-gray-500">
                * Fields marked with asterisk are required
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}