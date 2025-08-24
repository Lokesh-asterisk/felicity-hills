import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Target, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, Download } from "lucide-react";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  budget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  id: string;
  title: string;
  description: string;
  appointmentDate: string;
  leadId: string;
  status: string;
  type: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FollowUp {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  leadId: string;
  priority: string;
  status: string;
  type: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportData {
  leads: Lead[];
  appointments: Appointment[];
  followUps: FollowUp[];
  leadStats: {
    total: number;
    new: number;
    qualified: number;
    converted: number;
    lost: number;
  };
}

export default function CRMReports() {
  // Fetch all data for reports
  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    retry: false,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments'],
    retry: false,
  });

  const { data: followUps, isLoading: followUpsLoading } = useQuery<FollowUp[]>({
    queryKey: ['/api/follow-ups'],
    retry: false,
  });

  const { data: leadStats, isLoading: statsLoading } = useQuery<{
    total: number;
    new: number;
    qualified: number;
    converted: number;
    lost: number;
  }>({
    queryKey: ['/api/leads/stats'],
    retry: false,
  });

  const isLoading = leadsLoading || appointmentsLoading || followUpsLoading || statsLoading;

  // CSV Export Functions
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportLeads = () => {
    if (!leads) return;
    const exportData = leads.map(lead => ({
      'First Name': lead.firstName,
      'Last Name': lead.lastName,
      'Email': lead.email,
      'Phone': lead.phone,
      'Status': lead.status,
      'Source': lead.source,
      'Budget': lead.budget || '',
      'Created Date': new Date(lead.createdAt).toLocaleDateString(),
      'Notes': lead.notes || ''
    }));
    exportToCSV(exportData, 'crm-leads');
  };

  const exportAppointments = () => {
    if (!appointments) return;
    const exportData = appointments.map(appointment => ({
      'Title': appointment.title,
      'Date': new Date(appointment.appointmentDate).toLocaleDateString(),
      'Time': new Date(appointment.appointmentDate).toLocaleTimeString(),
      'Status': appointment.status,
      'Type': appointment.type,
      'Location': appointment.location || '',
      'Description': appointment.description || '',
      'Notes': appointment.notes || ''
    }));
    exportToCSV(exportData, 'crm-appointments');
  };

  const exportFollowUps = () => {
    if (!followUps) return;
    const exportData = followUps.map(followUp => ({
      'Title': followUp.title,
      'Due Date': new Date(followUp.dueDate).toLocaleDateString(),
      'Priority': followUp.priority,
      'Status': followUp.status,
      'Type': followUp.type,
      'Description': followUp.description || '',
      'Notes': followUp.notes || ''
    }));
    exportToCSV(exportData, 'crm-followups');
  };

  const exportAllData = () => {
    if (!leads || !appointments || !followUps) return;
    const summary = {
      'Report Generated': new Date().toLocaleDateString(),
      'Total Leads': leads.length,
      'Total Appointments': appointments.length,
      'Total Follow-ups': followUps.length,
      'Converted Leads': leadStats?.converted || 0,
      'Pending Follow-ups': followUps.filter(f => f.status === 'pending').length,
      'This Week Appointments': appointments.filter(a => {
        const appointmentDate = new Date(a.appointmentDate);
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      }).length
    };
    exportToCSV([summary], 'crm-summary-report');
  };

  // Calculate analytics
  const getLeadSourceBreakdown = () => {
    if (!leads) return [];
    const sources = leads.reduce((acc: Record<string, number>, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(sources).map(([source, count]) => ({ source, count }));
  };

  const getConversionRateBySource = () => {
    if (!leads) return [];
    const sourceData = leads.reduce((acc: Record<string, { total: number; converted: number }>, lead) => {
      if (!acc[lead.source]) {
        acc[lead.source] = { total: 0, converted: 0 };
      }
      acc[lead.source].total++;
      if (lead.status === 'converted') {
        acc[lead.source].converted++;
      }
      return acc;
    }, {});

    return Object.entries(sourceData).map(([source, data]) => ({
      source,
      total: data.total,
      converted: data.converted,
      rate: data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0
    }));
  };

  const getAppointmentStatusBreakdown = () => {
    if (!appointments) return [];
    const statuses = appointments.reduce((acc: Record<string, number>, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statuses).map(([status, count]) => ({ status, count }));
  };

  const getFollowUpPriorityBreakdown = () => {
    if (!followUps) return [];
    const priorities = followUps.reduce((acc: Record<string, number>, followUp) => {
      acc[followUp.priority] = (acc[followUp.priority] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(priorities).map(([priority, count]) => ({ priority, count }));
  };

  const getRecentActivity = () => {
    const activity = [];
    
    if (leads) {
      activity.push(...leads.slice(0, 5).map(lead => ({
        id: lead.id,
        type: 'lead',
        title: `New lead: ${lead.firstName} ${lead.lastName}`,
        time: new Date(lead.createdAt).toLocaleDateString(),
        status: lead.status
      })));
    }
    
    if (appointments) {
      activity.push(...appointments.slice(0, 3).map(appointment => ({
        id: appointment.id,
        type: 'appointment',
        title: `Appointment: ${appointment.title}`,
        time: new Date(appointment.appointmentDate).toLocaleDateString(),
        status: appointment.status
      })));
    }

    return activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  };

  const getTotalBudgetValue = () => {
    if (!leads) return 0;
    return leads.reduce((total, lead) => total + (lead.budget || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            * {
              max-width: 100vw !important;
              box-sizing: border-box !important;
            }
            .crm-reports-container * {
              overflow-x: hidden !important;
            }
          }
        `}
      </style>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <div className="crm-reports-container max-w-7xl mx-auto p-3 sm:p-6 w-full max-w-[100vw]">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">CRM Reports & Analytics</h1>
              <p className="text-sm sm:text-base text-gray-600">Comprehensive insights into your sales pipeline and performance</p>
            </div>
            
            {/* Export Section */}
            <Card className="border border-gray-200 shadow-sm w-full sm:w-auto">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-1 w-full max-w-full overflow-hidden">
                  <Button 
                    onClick={exportLeads}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1.5 sm:px-3 sm:py-2 h-auto"
                    data-testid="button-export-leads"
                  >
                    <Download className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    <span className="hidden sm:inline">Leads</span>
                    <span className="sm:hidden">L</span>
                  </Button>
                  <Button 
                    onClick={exportAppointments}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1.5 sm:px-3 sm:py-2 h-auto"
                    data-testid="button-export-appointments"
                  >
                    <Download className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    <span className="hidden sm:inline">Appointments</span>
                    <span className="sm:hidden">A</span>
                  </Button>
                  <Button 
                    onClick={exportFollowUps}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1.5 sm:px-3 sm:py-2 h-auto"
                    data-testid="button-export-followups"
                  >
                    <Download className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    <span className="hidden sm:inline">Follow-ups</span>
                    <span className="sm:hidden">F</span>
                  </Button>
                  <Button 
                    onClick={exportAllData}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1.5 sm:px-3 sm:py-2 h-auto"
                    data-testid="button-export-summary"
                  >
                    <Download className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    <span className="hidden sm:inline">Summary</span>
                    <span className="sm:hidden">S</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          {/* Mobile dropdown for tabs on very small screens */}
          <div className="block sm:hidden mb-4">
            <select 
              defaultValue="overview"
              className="w-full p-2 border rounded-lg bg-white text-sm max-w-full"
              onChange={(e) => {
                // Handle tab change for mobile
                const tabs = document.querySelectorAll('[data-state="active"]');
                tabs.forEach(tab => tab.setAttribute('data-state', 'inactive'));
                const targetTab = document.querySelector(`[value="${e.target.value}"]`);
                if (targetTab) targetTab.setAttribute('data-state', 'active');
              }}
            >
              <option value="overview">📊 Overview</option>
              <option value="leads">👥 Lead Analytics</option>
              <option value="appointments">📅 Appointments</option>
              <option value="performance">📈 Performance</option>
            </select>
          </div>

          {/* Regular tabs for larger screens */}
          <div className="hidden sm:block">
            <TabsList className="grid grid-cols-4 gap-1 w-full h-auto p-1 max-w-full overflow-hidden">
              <TabsTrigger value="overview" className="px-1 sm:px-4 py-2 text-xs sm:text-sm min-w-0 truncate">
                Overview
              </TabsTrigger>
              <TabsTrigger value="leads" className="px-1 sm:px-4 py-2 text-xs sm:text-sm min-w-0 truncate">
                Leads
              </TabsTrigger>
              <TabsTrigger value="appointments" className="px-1 sm:px-4 py-2 text-xs sm:text-sm min-w-0 truncate">
                Appointments
              </TabsTrigger>
              <TabsTrigger value="performance" className="px-1 sm:px-4 py-2 text-xs sm:text-sm min-w-0 truncate">
                Performance
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{leadStats?.total || 0}</p>
                      <p className="text-xs text-blue-600 mt-1">All time</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {leadStats?.total && leadStats.total > 0 ? Math.round(((leadStats?.converted || 0) / leadStats.total) * 100) : 0}%
                      </p>
                      <p className="text-xs text-green-600 mt-1">Current rate</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Appointments</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
                      <p className="text-xs text-purple-600 mt-1">All time</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Pipeline Value</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        ₹{getTotalBudgetValue().toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Total budget</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
              {/* Lead Sources */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getLeadSourceBreakdown().map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize truncate flex-1 min-w-0">{item.source}</span>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / (leads?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getRecentActivity().map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg">
                        <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                          {activity.type === 'lead' ? <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" /> : <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge className={`text-xs flex-shrink-0 ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lead Analytics Tab */}
          <TabsContent value="leads" className="space-y-4 sm:space-y-6">
            {/* Lead Export Section */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Export Lead Data</h3>
                <p className="text-xs text-gray-600">Download all lead information with status, source, and contact details</p>
              </div>
              <Button 
                onClick={exportLeads}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto self-start"
                data-testid="button-export-leads-tab"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Leads CSV
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Lead Status Breakdown */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 min-w-0 truncate">New Leads</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <div className="w-12 sm:w-20 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total && leadStats.total > 0 ? ((leadStats?.new || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{leadStats?.new || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 min-w-0 truncate">Qualified</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <div className="w-12 sm:w-20 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total && leadStats.total > 0 ? ((leadStats?.qualified || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{leadStats?.qualified || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 min-w-0 truncate">Converted</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <div className="w-12 sm:w-20 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total && leadStats.total > 0 ? ((leadStats?.converted || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{leadStats?.converted || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 min-w-0 truncate">Lost</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <div className="w-12 sm:w-20 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-red-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total && leadStats.total > 0 ? ((leadStats?.lost || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{leadStats?.lost || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Rate by Source */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Conversion Rate by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getConversionRateBySource().map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize truncate max-w-[120px] sm:max-w-none">{item.source}</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{item.rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                            style={{ width: `${item.rate}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">{item.converted} converted out of {item.total} leads</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4 sm:space-y-6">
            {/* Appointments Export Section */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Export Appointment Data</h3>
                <p className="text-xs text-gray-600">Download all appointment schedules with dates, status, and details</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={exportAppointments}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-initial"
                  data-testid="button-export-appointments-tab"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Appointments
                </Button>
                <Button 
                  onClick={exportFollowUps}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-1 sm:flex-initial"
                  data-testid="button-export-followups-tab"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Follow-ups
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Appointment Status */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getAppointmentStatusBreakdown().map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize flex-1 min-w-0 truncate">{item.status}</span>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / (appointments?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Priority */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Follow-up Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getFollowUpPriorityBreakdown().map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize flex-1 min-w-0 truncate">{item.priority} Priority</span>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.priority === 'high' ? 'bg-red-600' :
                                item.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${(item.count / (followUps?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[15px]">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            {/* Performance Export Section */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Export Performance Reports</h3>
                <p className="text-xs text-gray-600">Download comprehensive summary with key metrics and performance data</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={exportAllData}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-initial"
                  data-testid="button-export-summary-tab"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Summary
                </Button>
                <Button 
                  onClick={() => {
                    exportLeads();
                    setTimeout(() => exportAppointments(), 500);
                    setTimeout(() => exportFollowUps(), 1000);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white flex-1 sm:flex-initial"
                  data-testid="button-export-all-tab"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Performance Metrics */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">Success Rate</span>
                      </div>
                      <span className="text-sm sm:text-lg font-bold text-green-600 flex-shrink-0">
                        {leadStats?.total && leadStats.total > 0 ? Math.round(((leadStats?.converted || 0) / leadStats.total) * 100) : 0}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">Total Leads</span>
                      </div>
                      <span className="text-sm sm:text-lg font-bold text-blue-600 flex-shrink-0">{leadStats?.total || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">Appointments</span>
                      </div>
                      <span className="text-sm sm:text-lg font-bold text-purple-600 flex-shrink-0">{appointments?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">Follow-ups</span>
                      </div>
                      <span className="text-sm sm:text-lg font-bold text-orange-600 flex-shrink-0">{followUps?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Sources */}
              <Card className="border border-gray-200 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Top Performing Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {getConversionRateBySource()
                      .sort((a, b) => b.rate - a.rate)
                      .slice(0, 5)
                      .map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-2 p-2 sm:p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                          <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${
                            index === 0 ? 'bg-yellow-100' :
                            index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                          }`}>
                            <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-gray-600' : 'text-orange-600'
                            }`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 capitalize truncate">{item.source}</p>
                            <p className="text-xs text-gray-500 truncate">{item.converted} from {item.total} leads</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm sm:text-lg font-bold text-gray-900">{item.rate}%</p>
                          <p className="text-xs text-gray-500">rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </>
  );
}