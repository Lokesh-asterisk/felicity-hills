import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users, AlertTriangle, Plus, Phone, Mail, TrendingUp, ArrowUpRight, ChevronRight, Target, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import type { Appointment, FollowUp, Lead } from "@shared/schema";

interface CRMDashboardProps {
  onNavigateToLeads?: () => void;
  onCreateNewLead?: () => void;
  setCurrentView?: (view: string) => void;
}

export default function CRMDashboard({ onNavigateToLeads, onCreateNewLead, setCurrentView }: CRMDashboardProps) {
  const { data: todaysAppointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/today"],
  });

  const { data: overdueFollowUps, isLoading: followUpsLoading } = useQuery<FollowUp[]>({
    queryKey: ["/api/follow-ups/overdue"],
  });

  const { data: leadStats, isLoading: statsLoading } = useQuery<{
    total: number;
    new: number;
    qualified: number;
    converted: number;
  }>({
    queryKey: ["/api/leads/stats"],
  });

  const { data: recentLeads, isLoading: recentLeadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    retry: false,
  });

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'showing_scheduled': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'not_interested': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              CRM Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage your leads, appointments, and follow-ups with ease
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data updates</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <Button 
              data-testid="button-new-lead" 
              onClick={onCreateNewLead || onNavigateToLeads}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Lead
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              data-testid="button-new-appointment" 
              onClick={() => setCurrentView?.("crm-appointments")}
              className="border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-leads" className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Leads</CardTitle>
              <div className="p-2 bg-white/20 rounded-full">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Skeleton className="h-8 w-16 bg-white/20" /> : leadStats?.total || 0}
              </div>
              <div className="flex items-center mt-2 text-blue-100 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Active pipeline</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-new-leads" className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">New Leads</CardTitle>
              <div className="p-2 bg-white/20 rounded-full">
                <Plus className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Skeleton className="h-8 w-16 bg-white/20" /> : leadStats?.new || 0}
              </div>
              <div className="flex items-center mt-2 text-green-100 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>This month</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-qualified-leads" className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Qualified</CardTitle>
              <div className="p-2 bg-white/20 rounded-full">
                <Target className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Skeleton className="h-8 w-16 bg-white/20" /> : leadStats?.qualified || 0}
              </div>
              <div className="flex items-center mt-2 text-orange-100 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Ready to convert</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-converted-leads" className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Converted</CardTitle>
              <div className="p-2 bg-white/20 rounded-full">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Skeleton className="h-8 w-16 bg-white/20" /> : leadStats?.converted || 0}
              </div>
              <div className="flex items-center mt-2 text-purple-100 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Success rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <Card data-testid="card-todays-appointments">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Appointments
              </CardTitle>
              <CardDescription>
                Scheduled appointments for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (todaysAppointments?.length ?? 0) === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No appointments scheduled for today
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysAppointments?.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`appointment-${appointment.id}`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(appointment.appointmentDate)}
                          </span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/crm/appointments/${appointment.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-appointment-${appointment.id}`}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link href="/crm/appointments">
                  <Button variant="outline" className="w-full" data-testid="button-view-all-appointments">
                    View All Appointments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Follow-ups */}
          <Card data-testid="card-overdue-followups">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Overdue Follow-ups
              </CardTitle>
              <CardDescription>
                Follow-ups that are past their due date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {followUpsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (overdueFollowUps?.length ?? 0) === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No overdue follow-ups
                </div>
              ) : (
                <div className="space-y-4">
                  {overdueFollowUps?.map((followUp) => (
                    <div 
                      key={followUp.id} 
                      className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20"
                      data-testid={`followup-${followUp.id}`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{followUp.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {followUp.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm text-red-600">
                            Due: {formatDate(followUp.dueDate)}
                          </span>
                          <Badge className={getPriorityColor(followUp.priority)}>
                            {followUp.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/crm/follow-ups/${followUp.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-followup-${followUp.id}`}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link href="/crm/follow-ups">
                  <Button variant="outline" className="w-full" data-testid="button-view-all-followups">
                    View All Follow-ups
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent New Leads */}
        <Card className="mt-8" data-testid="card-recent-leads">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent New Leads
            </CardTitle>
            <CardDescription>
              Newest leads requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeadsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (recentLeads?.length ?? 0) === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent new leads
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads?.filter(lead => lead.status === 'new').slice(0, 5).map((lead) => (
                  <div 
                    key={lead.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`lead-${lead.id}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {lead.firstName} {lead.lastName}
                      </h4>
                      <div className="flex items-center mt-1 space-x-4">
                        {lead.email && (
                          <span className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-1" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-2 space-x-4">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Source: {lead.source}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button variant="outline" size="sm" data-testid={`button-view-lead-${lead.id}`} onClick={onNavigateToLeads}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" data-testid="button-view-all-leads" onClick={onNavigateToLeads}>
                View All Leads
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20" 
            data-testid="card-manage-leads" 
            onClick={onNavigateToLeads}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl mr-4">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xl font-semibold">Manage Leads</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
              <CardDescription className="ml-16 text-base">
                View, create, and update lead information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20" 
            data-testid="card-manage-appointments" 
            onClick={() => setCurrentView?.("crm-appointments")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl mr-4">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xl font-semibold">Appointments</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
              <CardDescription className="ml-16 text-base">
                Schedule and manage client appointments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-orange-500 bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20" 
            data-testid="card-manage-followups" 
            onClick={() => setCurrentView?.("crm-followups")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl mr-4">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xl font-semibold">Follow-ups</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
              <CardDescription className="ml-16 text-base">
                Track and complete follow-up tasks
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}