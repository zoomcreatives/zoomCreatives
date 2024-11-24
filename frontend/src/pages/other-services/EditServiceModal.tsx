import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SearchableSelect from '../../components/SearchableSelect';
import { useStore } from '../../store';
import { useAdminStore } from '../../store/adminStore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SERVICE_TYPES } from '../../constants/serviceTypes';
import type { OtherService } from '../../types/otherService';

const serviceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  serviceTypes: z.array(z.enum(SERVICE_TYPES)).min(1, 'At least one service type is required'),
  otherServiceDetails: z.string().optional(),
  contactChannel: z.enum(['Viber', 'Facebook', 'WhatsApp', 'Friend', 'Office Visit']),
  deadline: z.date(),
  amount: z.number().min(0, 'Amount must be positive'),
  paidAmount: z.number().min(0, 'Paid amount must be positive'),
  discount: z.number().min(0, 'Discount must be positive'),
  paymentMethod: z.enum(['Bank Furicomy', 'Counter Cash', 'Credit Card', 'Paypay', 'Line Pay']).optional(),
  handledBy: z.string().min(1, 'Handler is required'),
  jobStatus: z.enum(['Details Pending', 'Under Process', 'Completed']),
  remarks: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: OtherService;
}

export default function EditServiceModal({
  isOpen,
  onClose,
  service,
}: EditServiceModalProps) {
  const { clients, updateOtherService } = useStore();
  const { admins } = useAdminStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      ...service,
      deadline: new Date(service.deadline),
    },
  });

  const amount = watch('amount') || 0;
  const paidAmount = watch('paidAmount') || 0;
  const discount = watch('discount') || 0;
  const dueAmount = amount - (paidAmount + discount);

  const clientId = watch('clientId');
  const selectedClient = clients.find(c => c.id === clientId);
  const selectedTypes = watch('serviceTypes') || [];

  const handlers = admins.filter(admin => admin.role !== 'super_admin');

  const onSubmit = (data: ServiceFormData) => {
    const client = clients.find(c => c.id === data.clientId);
    if (client) {
      updateOtherService(service.id, {
        ...data,
        clientName: client.name,
        mobileNo: client.phone,
        dueAmount,
        paymentStatus: dueAmount > 0 ? 'Due' : 'Paid',
        deadline: data.deadline.toISOString(),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <SearchableSelect
                options={clients.map(client => ({
                  value: client.id,
                  label: client.name
                }))}
                value={watch('clientId')}
                onChange={(value) => setValue('clientId', value)}
                placeholder="Select client"
                className="mt-1"
                error={errors.clientId?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <Input 
                value={selectedClient?.phone || ''}
                className="mt-1 bg-gray-50" 
                disabled 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Channel</label>
              <select
                {...register('contactChannel')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Viber">Viber</option>
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Friend">Friend</option>
                <option value="Office Visit">Office Visit</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Service Types</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SERVICE_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={type}
                      {...register('serviceTypes')}
                      className="rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              {errors.serviceTypes && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceTypes.message as string}</p>
              )}
            </div>

            {selectedTypes.includes('Other') && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Details
                </label>
                <Input
                  {...register('otherServiceDetails')}
                  placeholder="Please specify the service"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <DatePicker
                selected={watch('deadline')}
                onChange={(date) => setValue('deadline', date as Date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Handled By</label>
              <select
                {...register('handledBy')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="">Select handler</option>
                {handlers.map((admin) => (
                  <option key={admin.id} value={admin.name}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (¥)</label>
              <Input
                type="number"
                min="0"
                {...register('amount', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Paid Amount (¥)</label>
              <Input
                type="number"
                min="0"
                {...register('paidAmount', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (¥)</label>
              <Input
                type="number"
                min="0"
                {...register('discount', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Amount (¥)</label>
              <Input
                type="number"
                value={dueAmount}
                className="mt-1 bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                {...register('paymentMethod')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Bank Furicomy">Bank Furicomy</option>
                <option value="Counter Cash">Counter Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Paypay">Paypay</option>
                <option value="Line Pay">Line Pay</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Status</label>
              <select
                {...register('jobStatus')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Details Pending">Details Pending</option>
                <option value="Under Process">Under Process</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                {...register('remarks')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}