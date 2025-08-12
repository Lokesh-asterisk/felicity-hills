import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, FileText, Calendar, ArrowLeft, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Brochure } from "@shared/schema";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const downloadFormSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userEmail: z.string().email("Please enter a valid email address"),
  userPhone: z.string().optional(),
});

type DownloadFormData = z.infer<typeof downloadFormSchema>;

export default function BrochuresPage() {
  // Set page title for SEO
  useEffect(() => {
    document.title = "Download Brochures - Khushalipur Project Information | Felicity Hills";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Download detailed brochures and project information for Khushalipur agricultural land investment. Get comprehensive details about pricing, amenities, and investment returns.');
    }
  }, []);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBrochure, setSelectedBrochure] = useState<Brochure | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: brochures, isLoading } = useQuery<Brochure[]>({
    queryKey: ["/api/brochures"],
  });



  const form = useForm<DownloadFormData>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      userPhone: "",
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (data: DownloadFormData & { brochureId: string }) => {
      const response = await apiRequest(
        "POST",
        `/api/brochures/${data.brochureId}/download`,
        {
          userName: data.userName,
          userEmail: data.userEmail,
          userPhone: data.userPhone,
        }
      );
      
      if (!response.ok) {
        throw new Error('Download request failed');
      }
      
      const result = await response.json();
      return result as { success: boolean; downloadUrl: string; message: string };
    },
    onSuccess: (response) => {
      toast({
        title: "Download Started",
        description: "Your download request has been processed successfully.",
      });
      
      // Trigger the actual file download
      if (response.success && response.downloadUrl) {
        // Create a proper download link with full URL
        const downloadUrl = response.downloadUrl.startsWith('http') 
          ? response.downloadUrl 
          : `${window.location.origin}${response.downloadUrl}`;
        
        // Try multiple approaches to ensure download works
        try {
          // Method 1: Create a temporary anchor element to trigger download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = selectedBrochure?.title?.replace(/[^a-zA-Z0-9\s]/g, '') || 'brochure';
          link.target = '_blank';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Method 2: Also try window.open as backup
          setTimeout(() => {
            window.open(downloadUrl, '_blank');
          }, 100);
          
        } catch (error) {

          // Fallback: just open in new tab
          window.open(downloadUrl, '_blank');
        }
      } else {

        toast({
          title: "Download Error", 
          description: "Invalid response from server",
          variant: "destructive"
        });
      }
      
      // Reset form and close dialog
      form.reset();
      setSelectedBrochure(null);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Download Failed",
        description: "There was an error processing your download request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DownloadFormData) => {
    if (selectedBrochure) {
      downloadMutation.mutate({
        ...data,
        brochureId: selectedBrochure.id,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700">Loading brochures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Back to Home Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/">
          <Button variant="outline" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Project Documentation
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Download comprehensive brochures, legal documents, and project information 
            to make an informed investment decision in Khushalipur agricultural plots.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Brochures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brochures?.map((brochure) => (
            <Card key={brochure.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm text-gray-500">{brochure.fileSize}</span>
                </div>
                <CardTitle className="text-xl">{brochure.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {brochure.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen && selectedBrochure?.id === brochure.id} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedBrochure(brochure);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Download {brochure.title}</DialogTitle>
                      <DialogDescription>
                        Please provide your details to download this brochure. We'll track your download for analytics purposes.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="userEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="userPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              form.reset();
                              setSelectedBrochure(null);
                              setIsDialogOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={downloadMutation.isPending}
                          >
                            {downloadMutation.isPending ? "Processing..." : "Download"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need More Information?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team is ready to answer your questions and provide personalized guidance 
            for your investment in Khushalipur agricultural plots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-visit">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Site Visit
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.open('tel:+918588834221', '_self')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Sales Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}