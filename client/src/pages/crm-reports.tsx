import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Target, Phone, Mail, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">CRM Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your sales pipeline and performance</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-1 w-full h-auto p-1">
            <TabsTrigger value="overview" className="px-4 py-2 text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="px-4 py-2 text-sm">
              Lead Analytics
            </TabsTrigger>
            <TabsTrigger value="appointments" className="px-4 py-2 text-sm">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="performance" className="px-4 py-2 text-sm">
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{leadStats?.total || 0}</p>
                      <p className="text-xs text-blue-600 mt-1">All time</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {leadStats?.total > 0 ? Math.round(((leadStats?.converted || 0) / leadStats.total) * 100) : 0}%
                      </p>
                      <p className="text-xs text-green-600 mt-1">Current rate</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                      <p className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
                      <p className="text-xs text-purple-600 mt-1">All time</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{getTotalBudgetValue().toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Total budget</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Sources */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getLeadSourceBreakdown().map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{item.source}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / (leads?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getRecentActivity().map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {activity.type === 'lead' ? <Users className="h-4 w-4 text-blue-600" /> : <Calendar className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
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
          <TabsContent value="leads" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Status Breakdown */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">New Leads</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total > 0 ? ((leadStats?.new || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{leadStats?.new || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Qualified</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total > 0 ? ((leadStats?.qualified || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{leadStats?.qualified || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Converted</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total > 0 ? ((leadStats?.converted || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{leadStats?.converted || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Lost</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-red-600 h-3 rounded-full" 
                            style={{ width: `${leadStats?.total > 0 ? ((leadStats?.lost || 0) / leadStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{leadStats?.lost || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Rate by Source */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Conversion Rate by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getConversionRateBySource().map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">{item.source}</span>
                          <span className="text-sm font-bold text-gray-900">{item.rate}%</span>
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
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Status */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getAppointmentStatusBreakdown().map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / (appointments?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
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
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{item.priority} Priority</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.priority === 'high' ? 'bg-red-600' :
                                item.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${(item.count / (followUps?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Success Rate</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {leadStats?.total > 0 ? Math.round(((leadStats?.converted || 0) / leadStats.total) * 100) : 0}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Total Leads</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{leadStats?.total || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Appointments</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{appointments?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Follow-ups</span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">{followUps?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Sources */}
              <Card className="border border-gray-200 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getConversionRateBySource()
                      .sort((a, b) => b.rate - a.rate)
                      .slice(0, 5)
                      .map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            index === 0 ? 'bg-yellow-100' :
                            index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                          }`}>
                            <TrendingUp className={`h-4 w-4 ${
                              index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-gray-600' : 'text-orange-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{item.source}</p>
                            <p className="text-sm text-gray-500">{item.converted} conversions from {item.total} leads</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{item.rate}%</p>
                          <p className="text-sm text-gray-500">conversion rate</p>
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
  );
}