import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar, Clock, CheckCircle, TrendingUp } from "lucide-react";

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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Today's Schedule</CardTitle>
                <Button variant="link" className="text-blue-600 text-sm font-medium p-0">View All</Button>
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

          {/* Recent Leads */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Leads</CardTitle>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-200 rounded px-2 py-1">
                    <option>All Sources</option>
                  </select>
                  <Button variant="link" className="text-blue-600 text-sm font-medium p-0">View All</Button>
                </div>
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
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Follow-up Tasks */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Follow-up Tasks</CardTitle>
                <Button variant="link" className="text-blue-600 text-sm font-medium p-0" onClick={() => setCurrentView?.("crm-followups")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {followUpsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : getPendingFollowUps().length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No pending follow-ups</p>
                  <Button 
                    onClick={() => setCurrentView?.("crm-followups")}
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Follow-up
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {getPendingFollowUps().map((followUp: any) => {
                    const isOverdue = getOverdueFollowUps().some((o: any) => o.id === followUp.id);
                    const dueDate = new Date(followUp.dueDate);
                    const isToday = dueDate.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={followUp.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{followUp.title}</p>
                          <p className="text-sm text-gray-500">
                            Due: {dueDate.toLocaleDateString()} 
                            {isToday && <span className="text-orange-600 font-medium ml-1">(Today)</span>}
                            {isOverdue && <span className="text-red-600 font-medium ml-1">(Overdue)</span>}
                          </p>
                        </div>
                        <Badge className={`text-xs ${
                          isOverdue ? 'bg-red-100 text-red-800' : 
                          isToday ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {followUp.priority}
                        </Badge>
                      </div>
                    );
                  })}
                  {getOverdueFollowUps().length > 0 && (
                    <div className="mt-2 text-sm text-red-600 font-medium">
                      {getOverdueFollowUps().length} overdue task{getOverdueFollowUps().length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setCurrentView?.("crm-leads")}
                  className="bg-green-600 hover:bg-green-700 text-white h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Add Lead</span>
                </Button>
                
                <Button 
                  onClick={() => setCurrentView?.("crm-appointments")}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Schedule</span>
                </Button>
                
                <Button 
                  onClick={() => setCurrentView?.("crm-followups")}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-auto p-4 flex flex-col items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Follow-up</span>
                </Button>
                
                <Button 
                  onClick={() => setCurrentView?.("crm-reports")}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-auto p-4 flex flex-col items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}