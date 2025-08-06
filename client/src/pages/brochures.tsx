import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, FileText, Calendar, Database, BarChart3, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Brochure } from "@shared/schema";

const downloadFormSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userEmail: z.string().email("Please enter a valid email address"),
  userPhone: z.string().optional(),
});

type DownloadFormData = z.infer<typeof downloadFormSchema>;

export default function BrochuresPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBrochure, setSelectedBrochure] = useState<Brochure | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const { data: brochures, isLoading } = useQuery<Brochure[]>({
    queryKey: ["/api/brochures"],
  });

  const { data: downloadStats } = useQuery<any>({
    queryKey: ["/api/admin/brochure-stats"],
    enabled: showAdminPanel,
  });

  const { data: downloads } = useQuery<any[]>({
    queryKey: ["/api/admin/brochure-downloads"],
    enabled: showAdminPanel,
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
      return await apiRequest(
        "POST",
        `/api/brochures/${data.brochureId}/download`,
        {
          userName: data.userName,
          userEmail: data.userEmail,
          userPhone: data.userPhone,
        }
      );
    },
    onSuccess: (response) => {
      toast({
        title: "Download Started",
        description: "Your download request has been processed successfully.",
      });
      
      // Reset form and close dialog
      form.reset();
      setSelectedBrochure(null);
      
      // Refresh admin data if panel is open
      if (showAdminPanel) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/brochure-stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/brochure-downloads"] });
      }
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
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-green-600"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showAdminPanel ? "Hide Admin Panel" : "View Analytics"}
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Admin Panel */}
        {showAdminPanel && downloadStats && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{downloadStats.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">All time downloads</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popular Brochures</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {downloadStats.downloadsByBrochure?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active brochures</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {downloadStats.recentDownloads?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Recent downloads</p>
              </CardContent>
            </Card>
          </div>
        )}

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setSelectedBrochure(brochure)}
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

        {/* Downloads Analytics Table */}
        {showAdminPanel && downloads && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Recent Downloads</CardTitle>
                <CardDescription>Track user engagement with your brochures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Brochure</th>
                        <th className="text-left p-2">Downloaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {downloads.slice(0, 10).map((download: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{download.userName}</td>
                          <td className="p-2 text-gray-600">{download.userEmail}</td>
                          <td className="p-2">{download.brochureTitle}</td>
                          <td className="p-2 text-gray-500">
                            {new Date(download.downloadedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Schedule Site Visit
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}