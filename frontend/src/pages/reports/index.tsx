import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users as UsersIcon, 
  FileText, 
  Shield,
  Calendar, 
  Clock,
  Bell 
} from 'lucide-react';
import { useStore } from '../../store';
import { useAdminStore } from '../../store/adminStore';
import StatsCard from './components/StatsCard';
import OngoingTasks from './components/OngoingTasks';
import WorkloadDistribution from './components/WorkloadDistribution';
import SalesReport from './components/SalesReport';
import { useServiceRequestStore } from '../../store/serviceRequestStore';
import ServiceRequestsList from './components/ServiceRequestsList';
import Button from '../../components/Button';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { currentAdmin, admins } = useAdminStore();
  const isSuper = currentAdmin?.role === 'super_admin';

  const { 
    clients, 
    applications, 
    japanVisitApplications, 
    translations, 
    graphicDesignJobs,
    epassportApplications,
    otherServices,
    appointments 
  } = useStore();

  const { requests: serviceRequests } = useServiceRequestStore();
  const pendingRequests = serviceRequests.filter(req => req.status === 'pending');

  // Filter out completed tasks
  const activeTasks = {
    applications: applications.filter(app => !['Completed', 'Approved'].includes(app.visaStatus)),
    japanVisit: japanVisitApplications.filter(app => app.applicationStatus !== 'Completed'),
    translations: translations.filter(t => !['Completed', 'Delivered'].includes(t.translationStatus)),
    designs: graphicDesignJobs.filter(job => job.status === 'In Progress'),
    epassport: epassportApplications.filter(app => app.applicationStatus !== 'Completed'),
    otherServices: otherServices.filter(service => service.jobStatus !== 'Completed')
  };

  // Calculate total revenue
  const totalRevenue = isSuper ? [
    ...applications.map(app => app.payment?.total || 0),
    ...japanVisitApplications.map(app => app.amount || 0),
    ...translations.map(t => t.amount || 0),
    ...graphicDesignJobs.map(job => job.amount || 0),
    ...epassportApplications.map(app => app.amount || 0),
    ...otherServices.map(service => service.amount || 0)
  ].reduce((sum, amount) => sum + amount, 0) : 0;

  // Calculate revenue trend
  const lastMonthRevenue = totalRevenue * 0.88; // Example calculation
  const revenueGrowth = ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // Calculate active clients percentage
  const activeClients = clients.filter(c => c.status === 'active');
  const lastMonthActiveClients = Math.floor(activeClients.length * 0.95); // Example calculation
  const clientGrowth = ((activeClients.length - lastMonthActiveClients) / lastMonthActiveClients) * 100;

  // Redirect non-super admins
  if (!isSuper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Shield className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Access Restricted</h2>
        <p className="text-gray-500 mb-4">Only Super Administrators can access the Reports section.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-brand-black hover:text-brand-yellow transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          label="Active Clients"
          value={activeClients.length}
          icon={UsersIcon}
          trend="up"
          trendValue={`${clientGrowth.toFixed(1)}% this month`}
        />
        <StatsCard
          label="Total Tasks"
          value={Object.values(activeTasks).reduce((sum, tasks) => sum + tasks.length, 0)}
          icon={FileText}
        />
        <StatsCard
          label="Completed Tasks"
          value={Object.values(activeTasks).reduce((sum, tasks) => 
            sum + tasks.filter(task => 
              task.status === 'Completed' || 
              task.status === 'Delivered' || 
              task.visaStatus === 'Approved' ||
              task.jobStatus === 'Completed'
            ).length, 0
          )}
          icon={Clock}
        />
        <StatsCard
          label="Total Revenue"
          value={`¥${totalRevenue.toLocaleString()}`}
          icon={Calendar}
          trend="up"
          trendValue={`${revenueGrowth.toFixed(1)}% this month`}
        />
      </div>

      {/* Tasks Overview and Workload Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Tasks Overview</h2>
          <OngoingTasks tasks={activeTasks} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Workload Distribution</h2>
          <WorkloadDistribution 
            tasks={activeTasks} 
            handlers={admins.filter(admin => admin.role !== 'super_admin')} 
          />
        </div>
      </div>

      {/* Sales Report */}
      <SalesReport tasks={activeTasks} />

      {/* Service Requests */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Recent Service Requests</h2>
        <ServiceRequestsList itemsPerPage={2} />
      </div>
    </div>
  );
}