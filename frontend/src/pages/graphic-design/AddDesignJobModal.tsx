import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SearchableSelect from '../../components/SearchableSelect';
import { useStore } from '../../store';
import { useAdminStore } from '../../store/adminStore';
import { DESIGN_TYPES } from '../../constants/designTypes';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const designJobSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  businessName: z.string().min(1, 'Business name is required'),
  mobileNo: z.string(),
  landlineNo: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  designType: z.enum(DESIGN_TYPES),
  amount: z.number().min(0, 'Amount must be positive'),
  advancePaid: z.number().min(0, 'Advance paid must be positive'),
  remarks: z.string().optional(),
  status: z.enum(['In Progress', 'Completed', 'Cancelled']),
  handledBy: z.string().min(1, 'Handler is required'),
  deadline: z.date(),
});

type DesignJobFormData = z.infer<typeof designJobSchema>;

interface AddDesignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDesignJobModal({
  isOpen,
  onClose,
}: AddDesignJobModalProps) {
  const { clients, addGraphicDesignJob, addAppointment } = useStore();
  const { admins } = useAdminStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DesignJobFormData>({
    resolver: zodResolver(designJobSchema),
    defaultValues: {
      amount: 0,
      advancePaid: 0,
      status: 'In Progress',
      deadline: new Date(),
    },
  });

  const amount = watch('amount') || 0;
  const advancePaid = watch('advancePaid') || 0;
  const dueAmount = amount - advancePaid;

  const clientId = watch('clientId');
  const selectedClient = clients.find(c => c.id === clientId);

  // Filter out super_admin from the handlers list
  const subAdmins = admins.filter(admin => admin.role !== 'super_admin');

  const onSubmit = (data: DesignJobFormData) => {
    const client = clients.find(c => c.id === data.clientId);
    if (client) {
      // Create the design job
      const designJob = {
        ...data,
        clientName: client.name,
        dueAmount,
        paymentStatus: dueAmount > 0 ? 'Due' : 'Paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addGraphicDesignJob(designJob);

      // Create a corresponding appointment for the deadline
      addAppointment({
        clientId: client.id,
        clientName: client.name,
        type: `Design Deadline: ${data.designType}`,
        date: data.deadline.toISOString(),
        time: '23:59',
        duration: 0,
        status: 'Scheduled',
        meetingType: 'physical',
        location: 'Office',
        notes: `Design deadline for ${data.designType} - ${data.businessName}`,
        isRecurring: false,
        handledBy: data.handledBy,
      });

      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Design Job</h2>
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
                onChange={(value) => {
                  setValue('clientId', value);
                  const client = clients.find(c => c.id === value);
                  if (client) {
                    setValue('mobileNo', client.phone);
                  }
                }}
                placeholder="Select client"
                className="mt-1"
                error={errors.clientId?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <Input {...register('businessName')} className="mt-1" />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
              )}
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
              <label className="block text-sm font-medium text-gray-700">Landline Number</label>
              <Input {...register('landlineNo')} className="mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Design Type</label>
              <select
                {...register('designType')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="">Select type</option>
                {DESIGN_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.designType && (
                <p className="mt-1 text-sm text-red-600">{errors.designType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Handled By</label>
              <select
                {...register('handledBy')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="">Select handler</option>
                {subAdmins.map((admin) => (
                  <option key={admin.id} value={admin.name}>
                    {admin.name}
                  </option>
                ))}
              </select>
              {errors.handledBy && (
                <p className="mt-1 text-sm text-red-600">{errors.handledBy.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <DatePicker
                selected={watch('deadline')}
                onChange={(date) => setValue('deadline', date as Date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Input {...register('address')} className="mt-1" />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
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
              <label className="block text-sm font-medium text-gray-700">Advance Paid (¥)</label>
              <Input
                type="number"
                min="0"
                {...register('advancePaid', { valueAsNumber: true })}
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
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
            <Button type="submit">Create Design Job</Button>
          </div>
        </form>
      </div>
    </div>
  );
}