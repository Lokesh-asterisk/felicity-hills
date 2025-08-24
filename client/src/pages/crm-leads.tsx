import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Edit, Trash2, Users, Upload } from "lucide-react";
import type { Lead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  source: z.string().min(1, "Source is required"),
  interestLevel: z.string().min(1, "Interest level is required"),
  propertyInterests: z.array(z.string()).default([]),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const leadStatuses = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  { value: "qualified", label: "Qualified", color: "bg-green-100 text-green-800" },
  { value: "showing_scheduled", label: "Showing Scheduled", color: "bg-purple-100 text-purple-800" },
  { value: "not_interested", label: "Not Interested", color: "bg-red-100 text-red-800" },
  { value: "converted", label: "Converted", color: "bg-green-100 text-green-800" },
];

const leadSources = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "advertising", label: "Advertising" },
  { value: "cold_call", label: "Cold Call" },
  { value: "walk_in", label: "Walk-in" },
  { value: "import", label: "CSV Import" },
];

const interestLevels = [
  { value: "low", label: "Low Interest", color: "bg-gray-100 text-gray-800" },
  { value: "medium", label: "Medium Interest", color: "bg-blue-100 text-blue-800" },
  { value: "high", label: "High Interest", color: "bg-orange-100 text-orange-800" },
  { value: "very_high", label: "Very High Interest", color: "bg-red-100 text-red-800" },
];

export default function CRMLeads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "website",
      interestLevel: "medium",
      propertyInterests: [],
      budget: "",
      notes: "",
    },
  });

  // Fetch leads
  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    retry: false,
  });

  // Helper function to get budget value as number
  const getBudgetValue = (budget: string | number | undefined | null) => {
    if (!budget) return 0;
    const budgetStr = budget.toString().replace(/[^\d.-]/g, '');
    const num = parseFloat(budgetStr);
    return isNaN(num) ? 0 : num;
  };

  // Filter and sort leads
  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    let matchesBudget = true;
    if (budgetFilter === "with_budget") {
      matchesBudget = getBudgetValue(lead.budget) > 0;
    } else if (budgetFilter === "no_budget") {
      matchesBudget = getBudgetValue(lead.budget) === 0;
    }
    
    return matchesSearch && matchesStatus && matchesSource && matchesBudget;
  })?.sort((a, b) => {
    // Sort by budget in descending order when budget filter is active
    if (budgetFilter === "with_budget") {
      return getBudgetValue(b.budget) - getBudgetValue(a.budget);
    }
    return 0; // No sorting for other filters
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      await apiRequest('POST', '/api/leads', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      await apiRequest('PUT', `/api/leads/${editingLead?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsCreateDialogOpen(false);
      setEditingLead(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to delete lead with ID:', id);
      const response = await apiRequest('DELETE', `/api/leads/${id}`);
      console.log('Delete response:', response);
      return response;
    },
    onSuccess: (_, variables) => {
      console.log('Lead deleted successfully:', variables);
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    },
    onError: (error, variables) => {
      console.error('Delete error:', error, 'Lead ID:', variables);
      toast({
        title: "Error",
        description: `Failed to delete lead: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Import failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully imported ${data.count} leads`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsImportDialogOpen(false);
      setImportFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to import leads: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: LeadFormData) => {
    if (editingLead) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    form.reset({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || "",
      phone: lead.phone,
      company: lead.company || "",
      status: lead.status,
      source: lead.source,
      interestLevel: lead.interestLevel || "medium",
      budget: lead.budget?.toString() || "",
      notes: lead.notes || "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const lead = leads?.find(l => l.id === id);
    const leadName = lead ? `${lead.firstName} ${lead.lastName}` : 'this lead';
    
    if (confirm(`Are you sure you want to delete ${leadName}? This action cannot be undone.`)) {
      console.log('User confirmed delete for lead:', id);
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    return leadStatuses.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    return leadStatuses.find(s => s.value === status)?.label || status;
  };

  const getSourceLabel = (source: string) => {
    return leadSources.find(s => s.value === source)?.label || source;
  };

  const getInterestLevelColor = (interestLevel: string) => {
    return interestLevels.find(i => i.value === interestLevel)?.color || "bg-gray-100 text-gray-800";
  };

  const getInterestLevelLabel = (interestLevel: string) => {
    return interestLevels.find(i => i.value === interestLevel)?.label || interestLevel;
  };

  const handleImport = () => {
    if (!importFile) return;
    importMutation.mutate(importFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const validMimeTypes = [
        'text/csv',
        'application/csv',
        'text/plain',
        'application/vnd.ms-excel',
        'text/comma-separated-values'
      ];
      
      const isValidExtension = fileName.endsWith('.csv');
      const isValidMimeType = validMimeTypes.includes(file.type) || file.type === '';
      
      if (isValidExtension && (isValidMimeType || file.type === '')) {
        setImportFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please select a valid CSV file (.csv extension required)",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Statuses</option>
            {leadStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Sources</option>
            {leadSources.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
          <select 
            value={budgetFilter} 
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Budgets</option>
            <option value="with_budget">With Budget (High to Low)</option>
            <option value="no_budget">No Budget</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              All Leads ({filteredLeads?.length || 0})
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Leads
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setEditingLead(null);
                  form.reset();
                  setIsCreateDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : leads && leads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm mb-6">No leads found</p>
              <p className="text-gray-400 text-sm mb-6">Get started by adding your first lead</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Lead
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads?.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</h3>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                    <div className="flex items-center mt-1 space-x-4 text-xs text-gray-400">
                      <span>{getSourceLabel(lead.source)}</span>
                      <span>{lead.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(lead.status)}>
                      {getStatusLabel(lead.status)}
                    </Badge>
                    <Badge className={getInterestLevelColor(lead.interestLevel || 'medium')}>
                      {getInterestLevelLabel(lead.interestLevel || 'medium')}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(lead)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleteMutation.isPending}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        {deleteMutation.isPending ? (
                          <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Lead Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLead ? "Edit Lead" : "Create New Lead"}
            </DialogTitle>
            <DialogDescription>
              {editingLead ? "Update lead information" : "Add a new lead to your CRM"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          {leadStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          {leadSources.map((source) => (
                            <option key={source.value} value={source.value}>
                              {source.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="interestLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Level</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        {interestLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Expected budget range" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes about the lead..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingLead ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Import Leads Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Leads</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple leads at once. The CSV should have columns: firstName, lastName, email, phone, company, status, source, interestLevel, budget, notes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-csv-file"
              />
            </div>
            {importFile && (
              <div className="text-sm text-gray-600">
                Selected: {importFile.name} ({Math.round(importFile.size / 1024)} KB)
              </div>
            )}
            <div className="text-xs text-gray-500">
              <p className="mb-1"><strong>CSV Format Example:</strong></p>
              <p>firstName,lastName,email,phone,company,status,source,interestLevel,budget,notes</p>
              <p>John,Doe,john@example.com,1234567890,ABC Corp,new,website,high,50000,Interested in plots</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importFile || importMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-import"
            >
              {importMutation.isPending ? "Importing..." : "Import Leads"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}