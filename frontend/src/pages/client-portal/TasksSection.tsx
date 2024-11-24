import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, DollarSign, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store';
import { useTaskManagementStore } from '../../store/taskManagementStore';
import type { Application } from '../../types';

interface TasksSectionProps {
  applications: Application[];
  clientId: string;
}

export default function TasksSection({ applications, clientId }: TasksSectionProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const { 
    japanVisitApplications, 
    translations, 
    graphicDesignJobs, 
    epassportApplications,
    otherServices 
  } = useStore();

  const { getClientProcesses, getTemplateById } = useTaskManagementStore();
  const clientProcesses = getClientProcesses(clientId);

  // Get all tasks for this client with proper type mapping
  const clientTasks = {
    applications: applications.filter(app => app.clientId === clientId).map(app => ({
      ...app,
      processType: 'us_visa',
      displayType: `${app.type} - ${app.country}`,
      status: app.visaStatus,
      deadline: app.deadline
    })),
    japanVisit: japanVisitApplications.filter(app => app.clientId === clientId).map(app => ({
      ...app,
      processType: 'japan_visa',
      displayType: 'Japan Visit Application',
      status: app.applicationStatus,
      deadline: app.deadline
    })),
    translations: translations.filter(t => t.clientId === clientId).map(t => ({
      ...t,
      processType: 'translation',
      displayType: `Translation: ${t.sourceLanguage} → ${t.targetLanguage}`,
      status: t.translationStatus,
      deadline: t.deadline
    })),
    designs: graphicDesignJobs.filter(job => job.clientId === clientId).map(job => ({
      ...job,
      processType: 'design',
      displayType: `Design: ${job.designType}`,
      status: job.status,
      deadline: job.deadline
    })),
    epassport: epassportApplications.filter(app => app.clientId === clientId).map(app => ({
      ...app,
      processType: 'epassport',
      displayType: `ePassport: ${app.applicationType}`,
      status: app.applicationStatus,
      deadline: app.deadline
    })),
    otherServices: otherServices.filter(service => service.clientId === clientId).map(service => ({
      ...service,
      processType: 'other',
      displayType: service.serviceTypes.join(', '),
      status: service.jobStatus,
      deadline: service.deadline
    }))
  };

  // Get task process
  const getTaskProcess = (task: any, category: string) => {
    return clientProcesses.find(process => {
      const template = getTemplateById(process.templateId);
      return template?.serviceType === task.processType;
    });
  };

  // Separate active and completed tasks
  const getTaskStatus = (task: any) => {
    const status = task.status;
    return status === 'Completed' || 
           status === 'Delivered' || 
           status === 'Approved' ||
           status === 'Completed';
  };

  const separateTasks = (tasks: any[]) => {
    return {
      active: tasks.filter(task => !getTaskStatus(task)),
      completed: tasks.filter(task => getTaskStatus(task))
    };
  };

  const separatedTasks = Object.entries(clientTasks).reduce((acc, [category, tasks]) => {
    acc[category] = separateTasks(tasks);
    return acc;
  }, {} as Record<string, { active: any[]; completed: any[] }>);

  // Get payment history
  const paymentHistory = [
    ...clientTasks.applications.map(app => ({
      id: `visa-${app.id}`,
      date: app.submissionDate,
      type: app.displayType,
      amount: app.payment.total,
      paidAmount: app.payment.paidAmount,
      status: app.payment.paidAmount >= app.payment.total ? 'Paid' : 'Due'
    })),
    ...clientTasks.japanVisit.map(app => ({
      id: `japan-${app.id}`,
      date: app.date,
      type: app.displayType,
      amount: app.amount,
      paidAmount: app.paidAmount,
      status: app.paymentStatus
    })),
    ...clientTasks.translations.map(t => ({
      id: `trans-${t.id}`,
      date: t.createdAt,
      type: t.displayType,
      amount: t.amount,
      paidAmount: t.amount - (t.amount * 0),
      status: t.paymentStatus
    })),
    ...clientTasks.designs.map(job => ({
      id: `design-${job.id}`,
      date: job.createdAt,
      type: job.displayType,
      amount: job.amount,
      paidAmount: job.advancePaid,
      status: job.paymentStatus
    })),
    ...clientTasks.epassport.map(app => ({
      id: `epass-${app.id}`,
      date: app.date,
      type: app.displayType,
      amount: app.amount,
      paidAmount: app.paidAmount,
      status: app.paymentStatus
    })),
    ...clientTasks.otherServices.map(service => ({
      id: `other-${service.id}`,
      date: service.createdAt,
      type: service.displayType,
      amount: service.amount,
      paidAmount: service.paidAmount,
      status: service.paymentStatus
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderTaskTimeline = (task: any, category: string) => {
    const process = getTaskProcess(task, category);
    if (!process) return null;

    return (
      <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
        {process.steps.map((step) => (
          <div key={step.id} className="relative">
            <div className="absolute -left-[25px] mt-1">
              <div className={`h-4 w-4 rounded-full ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'in_progress' ? 'bg-blue-500' :
                step.status === 'blocked' ? 'bg-red-500' :
                'bg-gray-300'
              }`} />
            </div>
            <div className="ml-2">
              <h4 className="font-medium">{step.name}</h4>
              <p className="text-sm text-gray-500">{step.description}</p>
              {step.startDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Started: {format(new Date(step.startDate), 'MMM d, yyyy')}
                </p>
              )}
              {step.completedAt && (
                <p className="text-xs text-green-600 mt-1">
                  Completed: {format(new Date(step.completedAt), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'applications':
        return 'Visa Applications';
      case 'japanVisit':
        return 'Japan Visit Applications';
      case 'translations':
        return 'Document Translations';
      case 'designs':
        return 'Design Projects';
      case 'epassport':
        return 'ePassport Applications';
      case 'otherServices':
        return 'Other Services';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 px-4 border-b-2 text-sm font-medium ${
            activeTab === 'active'
              ? 'border-brand-yellow text-brand-black'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Active Tasks
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 border-b-2 text-sm font-medium ${
            activeTab === 'completed'
              ? 'border-brand-yellow text-brand-black'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Previous Tasks
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-2 px-4 border-b-2 text-sm font-medium ${
            activeTab === 'payments'
              ? 'border-brand-yellow text-brand-black'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Payments
        </button>
      </div>

      {/* Content */}
      {(activeTab === 'active' || activeTab === 'completed') && (
        <div className="space-y-4">
          {Object.entries(separatedTasks).map(([category, { active, completed }]) => {
            const tasks = activeTab === 'active' ? active : completed;
            if (tasks.length === 0) return null;
            
            return (
              <div key={category} className="space-y-2">
                <h3 className="font-medium text-gray-900">
                  {getCategoryLabel(category)}
                </h3>
                {tasks.map((task: any) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{task.displayType}</h4>
                          <p className="text-sm text-gray-500">
                            {activeTab === 'active' ? 'Deadline' : 'Completed'}: {
                              format(new Date(task.deadline || task.completedAt), 'MMM d, yyyy')
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'Completed' || task.status === 'Delivered' || task.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'Cancelled' || task.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.status}
                          </span>
                          {expandedTask === task.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedTask === task.id && renderTaskTimeline(task, category)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{payment.type}</h4>
                  <p className="text-sm text-gray-500">
                    {format(new Date(payment.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">¥{payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    Paid: ¥{payment.paidAmount.toLocaleString()}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'Paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}