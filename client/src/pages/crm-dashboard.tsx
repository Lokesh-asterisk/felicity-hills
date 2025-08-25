import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar, Clock, CheckCircle, TrendingUp, Eye, EyeOff, BarChart3, Activity } from "lucide-react";

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

interface CRMDashboardProps {
  onNavigateToLeads?: () => void;
  onCreateNewLead?: () => void;
  setCurrentView?: (view: string) => void;
}

export default function CRMDashboard({ 
  onNavigateToLeads, 
  onCreateNewLead, 
  setCurrentView 
}: CRMDashboardProps) {

  // Widget visibility state for customizable dashboard
  const [widgets, setWidgets] = useState({
    stats: true,
    schedule: true,
    recentLeads: true,
    taskSummary: true
  });

  const toggleWidget = (widgetKey: keyof typeof widgets) => {
    setWidgets(prev => ({ ...prev, [widgetKey]: !prev[widgetKey] }));
  };

  // Fetch leads stats
  const { data: leadStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/leads/stats'],
    retry: false,
  });

  // Fetch recent leads
  const { data: recentLeads, isLoading: recentLeadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    retry: false,
  });

  // Fetch today's appointments
  const { data: todaysAppointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments/today'],
    retry: false,
  });

  // Fetch follow-ups
  const { data: followUps, isLoading: followUpsLoading } = useQuery({
    queryKey: ['/api/follow-ups'],
    retry: false,
  });

  // Get pending and overdue follow-ups
  const getPendingFollowUps = () => {
    if (!followUps) return [];
    const now = new Date();
    return followUps.filter((followUp: any) => {
      if (followUp.status === 'completed') return false;
      const dueDate = new Date(followUp.dueDate);
      return dueDate >= now || dueDate.toDateString() === now.toDateString();
    }).slice(0, 3);
  };

  const getOverdueFollowUps = () => {
    if (!followUps) return [];
    const now = new Date();
    return followUps.filter((followUp: any) => {
      if (followUp.status === 'completed') return false;
      const dueDate = new Date(followUp.dueDate);
      return dueDate < now && dueDate.toDateString() !== now.toDateString();
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Enhanced color coding system for better visual distinction
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm';
      case 'contacted': return 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm';
      case 'qualified': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm';
      case 'converted': return 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm';
      case 'lost': return 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
      case 'scheduled': return 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm';
      case 'completed': return 'bg-green-50 text-green-700 border border-green-200 shadow-sm';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200 shadow-sm';
    }
  };

  // Priority color coding for tasks
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'low': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Widget Customization Controls */}
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">CRM Dashboard</h2>
              <p className="text-sm text-gray-500">Customize your dashboard widgets</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={widgets.stats ? "default" : "outline"}
                size="sm"
                onClick={() => toggleWidget('stats')}
                className="text-xs"
              >
                {widgets.stats ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                Stats
              </Button>
              <Button
                variant={widgets.schedule ? "default" : "outline"}
                size="sm"
                onClick={() => toggleWidget('schedule')}
                className="text-xs"
              >
                {widgets.schedule ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                Schedule
              </Button>
              <Button
                variant={widgets.recentLeads ? "default" : "outline"}
                size="sm"
                onClick={() => toggleWidget('recentLeads')}
                className="text-xs"
              >
                {widgets.recentLeads ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                Leads
              </Button>
              <Button
                variant={widgets.taskSummary ? "default" : "outline"}
                size="sm"
                onClick={() => toggleWidget('taskSummary')}
                className="text-xs"
              >
                {widgets.taskSummary ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                Tasks
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {widgets.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : leadStats?.total || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">↗ 12% this month</p>
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
                  <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : leadStats?.qualified || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">↗ 8% this month</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointmentsLoading ? "..." : todaysAppointments?.length || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">📅 No appointments</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending Follow-ups</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : "8"}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">📋 3 due today</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Today's Schedule */}
          {widgets.schedule && (
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Today's Schedule</CardTitle>
                <Button variant="link" className="text-blue-600 text-sm font-medium p-0" onClick={() => setCurrentView?.("crm-appointments")}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (todaysAppointments?.length ?? 0) === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm mb-6">No appointments scheduled for today</p>
                  <Button 
                    onClick={() => setCurrentView?.("crm-appointments")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule New Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysAppointments?.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{appointment.title}</p>
                        <p className="text-sm text-gray-500">{formatTime(appointment.appointmentDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Recent Leads */}
          {widgets.recentLeads && (
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Leads</CardTitle>
                <Button variant="link" className="text-blue-600 text-sm font-medium p-0" onClick={() => setCurrentView?.("crm-leads")}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentLeadsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (recentLeads?.length ?? 0) === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm mb-6">No leads found</p>
                  <Button 
                    onClick={onCreateNewLead || onNavigateToLeads}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Lead
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLeads?.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </div>

        {/* Task & Activity Summary */}
        {widgets.taskSummary && (
        <div className="mt-6 sm:mt-8">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Task & Activity Summary</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setCurrentView?.("crm-followups")}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                  <Button variant="link" className="text-blue-600 text-sm font-medium p-0" onClick={() => setCurrentView?.("crm-followups")}>
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Today's Activities */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Today's Activities</h3>
                  
                  {/* Today's Follow-ups */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Follow-ups</h4>
                    {followUpsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    ) : getPendingFollowUps().filter((followUp: any) => {
                      const dueDate = new Date(followUp.dueDate);
                      return dueDate.toDateString() === new Date().toDateString();
                    }).length === 0 ? (
                      <p className="text-xs text-gray-500">No follow-ups today</p>
                    ) : (
                      <div className="space-y-2">
                        {getPendingFollowUps().filter((followUp: any) => {
                          const dueDate = new Date(followUp.dueDate);
                          return dueDate.toDateString() === new Date().toDateString();
                        }).slice(0, 3).map((followUp: any) => (
                          <div key={followUp.id} className="p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                            <p className="font-medium text-gray-900">{followUp.title}</p>
                            <p className="text-orange-600">Due Today</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Today's Appointments */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Appointments</h4>
                    {appointmentsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (todaysAppointments?.length ?? 0) === 0 ? (
                      <p className="text-xs text-gray-500">No appointments today</p>
                    ) : (
                      <div className="space-y-2">
                        {todaysAppointments?.slice(0, 3).map((appointment) => (
                          <div key={appointment.id} className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                            <p className="font-medium text-gray-900">{appointment.title}</p>
                            <p className="text-blue-600">{formatTime(appointment.appointmentDate)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Activities */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Upcoming</h3>
                  
                  {/* Upcoming Follow-ups */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Next Follow-ups</h4>
                    {followUpsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    ) : getPendingFollowUps().filter((followUp: any) => {
                      const dueDate = new Date(followUp.dueDate);
                      const today = new Date();
                      return dueDate > today;
                    }).length === 0 ? (
                      <p className="text-xs text-gray-500">No upcoming follow-ups</p>
                    ) : (
                      <div className="space-y-2">
                        {getPendingFollowUps().filter((followUp: any) => {
                          const dueDate = new Date(followUp.dueDate);
                          const today = new Date();
                          return dueDate > today;
                        }).slice(0, 3).map((followUp: any) => (
                          <div key={followUp.id} className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                            <p className="font-medium text-gray-900">{followUp.title}</p>
                            <p className="text-green-600">{new Date(followUp.dueDate).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => setCurrentView?.("crm-appointments")}
                        size="sm"
                        variant="outline"
                        className="h-auto p-2 flex flex-col items-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Schedule</span>
                      </Button>
                      <Button 
                        onClick={() => setCurrentView?.("crm-leads")}
                        size="sm"
                        variant="outline"
                        className="h-auto p-2 flex flex-col items-center gap-1"
                      >
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Add Lead</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Overdue & Urgent */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Overdue & Urgent</h3>
                  
                  {/* Overdue Tasks */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Overdue Tasks</h4>
                    {followUpsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    ) : getOverdueFollowUps().length === 0 ? (
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <p className="text-green-600 font-medium">✓ No overdue tasks</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {getOverdueFollowUps().slice(0, 3).map((followUp: any) => (
                          <div key={followUp.id} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                            <p className="font-medium text-gray-900">{followUp.title}</p>
                            <p className="text-red-600">Overdue since {new Date(followUp.dueDate).toLocaleDateString()}</p>
                          </div>
                        ))}
                        {getOverdueFollowUps().length > 3 && (
                          <p className="text-xs text-red-600 font-medium">
                            +{getOverdueFollowUps().length - 3} more overdue tasks
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Summary Stats */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Summary</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Total tasks:</span>
                        <span className="font-medium">{followUps?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Today's activities:</span>
                        <span className="font-medium">
                          {(getPendingFollowUps().filter((f: any) => new Date(f.dueDate).toDateString() === new Date().toDateString()).length + (todaysAppointments?.length || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600">Overdue:</span>
                        <span className="font-medium text-red-600">{getOverdueFollowUps().length}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
        )}
        
      </div>
    </div>
  );
}