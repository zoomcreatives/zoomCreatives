import { useState } from 'react';
import { Plus, ChevronRight, Clock, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import { useTaskManagementStore } from '../../store/taskManagementStore';
import { useAdminStore } from '../../store/adminStore';
import { useStore } from '../../store';
import type { Client } from '../../types';
import CreateProcessModal from './CreateProcessModal';
import ProcessDetails from './ProcessDetails';

interface ProcessFlowTabProps {
  client: Client;
}

export default function ProcessFlowTab({ client }: ProcessFlowTabProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const { currentAdmin } = useAdminStore();
  
  const { 
    getClientProcesses, 
    getActiveTemplates,
    getTemplateById,
    deleteClientProcess
  } = useTaskManagementStore();

  const { 
    applications, 
    japanVisitApplications, 
    translations, 
    graphicDesignJobs, 
    epassportApplications,
    otherServices 
  } = useStore();

  // Check if client has any active tasks
  const hasActiveTasks = 
    applications.some(app => app.clientId === client.id) ||
    japanVisitApplications.some(app => app.clientId === client.id) ||
    translations.some(trans => trans.clientId === client.id) ||
    graphicDesignJobs.some(job => job.clientId === client.id) ||
    epassportApplications.some(app => app.clientId === client.id) ||
    otherServices.some(service => service.clientId === client.id);

  const clientProcesses = getClientProcesses(client.id);
  const activeTemplates = getActiveTemplates();

  const getProcessStatus = (process: any) => {
    const completedSteps = process.steps.filter(s => s.status === 'completed').length;
    const totalSteps = process.steps.length;
    const progress = Math.round((completedSteps / totalSteps) * 100);

    return {
      label: process.status === 'completed' ? 'Completed' : `${progress}% Complete`,
      color: process.status === 'completed' 
        ? 'text-green-600' 
        : process.status === 'blocked'
        ? 'text-red-600'
        : 'text-blue-600'
    };
  };

  const handleDeleteProcess = (processId: string) => {
    if (window.confirm('Are you sure you want to delete this process flow? This action cannot be undone.')) {
      deleteClientProcess(processId);
    }
  };

  if (!currentAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Process Flows</h3>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!hasActiveTasks}
          title={!hasActiveTasks ? "Client must have active tasks to create a process flow" : ""}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Process
        </Button>
      </div>

      {/* No Tasks Message */}
      {!hasActiveTasks && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No active tasks found for this client.</p>
          <p className="text-sm text-gray-400 mt-2">
            Create a task (Visa Application, Translation, etc.) to enable process flows.
          </p>
        </div>
      )}

      {/* Process List */}
      {hasActiveTasks && clientProcesses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No processes started yet.</p>
          <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4"
          >
            Start New Process
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {clientProcesses.map((process) => {
            const template = getTemplateById(process.templateId);
            const status = getProcessStatus(process);
            
            return (
              <div
                key={process.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-brand-yellow transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {template?.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Started on {new Date(process.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProcess(process.id)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProcess(process.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {/* Steps */}
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="text-sm">
                        <p className="font-medium">
                          {process.steps.filter(s => s.status === 'completed').length} / {process.steps.length}
                        </p>
                        <p className="text-gray-500">Steps Completed</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        process.documents.some(d => d.status === 'required')
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`} />
                      <div className="text-sm">
                        <p className="font-medium">
                          {process.documents.filter(d => d.status === 'verified').length} / {process.documents.length}
                        </p>
                        <p className="text-gray-500">Documents Verified</p>
                      </div>
                    </div>

                    {/* Payments */}
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        process.payments.some(p => p.status === 'pending')
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`} />
                      <div className="text-sm">
                        <p className="font-medium">
                          {process.payments.filter(p => p.status === 'completed').length} / {process.payments.length}
                        </p>
                        <p className="text-gray-500">Payments Completed</p>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <p className="font-medium">
                          ¥{process.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                        <p className="text-gray-500">Total Amount</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateProcessModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        client={client}
        templates={activeTemplates}
      />

      {selectedProcess && (
        <ProcessDetails
          processId={selectedProcess}
          onClose={() => setSelectedProcess(null)}
        />
      )}
    </div>
  );
}