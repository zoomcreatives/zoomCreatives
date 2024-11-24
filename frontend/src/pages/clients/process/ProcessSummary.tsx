import { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import type { ClientProcess } from '../../../types/taskManagement';

interface ProcessSummaryProps {
  process: ClientProcess;
}

export default function ProcessSummary({ process }: ProcessSummaryProps) {
  // Calculate statistics
  const stats = {
    steps: {
      total: process.steps.length,
      completed: process.steps.filter(s => s.status === 'completed').length,
      blocked: process.steps.filter(s => s.status === 'blocked').length,
    },
    documents: {
      total: process.documents.length,
      verified: process.documents.filter(d => d.status === 'verified').length,
      rejected: process.documents.filter(d => d.status === 'rejected').length,
    },
    payments: {
      total: process.payments.reduce((sum, p) => sum + p.amount, 0),
      paid: process.payments.reduce((sum, p) => sum + p.paidAmount, 0),
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Steps Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="font-medium">Steps Progress</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Completed</span>
            <span className="font-medium">{stats.steps.completed}/{stats.steps.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${(stats.steps.completed / stats.steps.total) * 100}%`
              }}
            />
          </div>
          {stats.steps.blocked > 0 && (
            <p className="text-sm text-red-600">
              {stats.steps.blocked} step(s) blocked
            </p>
          )}
        </div>
      </div>

      {/* Documents Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Documents Status</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Verified</span>
            <span className="font-medium">{stats.documents.verified}/{stats.documents.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${(stats.documents.verified / stats.documents.total) * 100}%`
              }}
            />
          </div>
          {stats.documents.rejected > 0 && (
            <p className="text-sm text-red-600">
              {stats.documents.rejected} document(s) rejected
            </p>
          )}
        </div>
      </div>

      {/* Payment Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Payment Progress</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Paid</span>
            <span className="font-medium">
              ¥{stats.payments.paid.toLocaleString()} / ¥{stats.payments.total.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{
                width: `${(stats.payments.paid / stats.payments.total) * 100}%`
              }}
            />
          </div>
          {stats.payments.total > stats.payments.paid && (
            <p className="text-sm text-yellow-600">
              ¥{(stats.payments.total - stats.payments.paid).toLocaleString()} remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}