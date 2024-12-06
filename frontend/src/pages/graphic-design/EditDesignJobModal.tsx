// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { X } from 'lucide-react';
// import Button from '../../components/Button';
// import Input from '../../components/Input';
// import SearchableSelect from '../../components/SearchableSelect';
// import { useStore } from '../../store';
// import { DESIGN_TYPES } from '../../constants/designTypes';
// import type { GraphicDesignJob } from '../../types/graphicDesign';

// const designJobSchema = z.object({
//   clientId: z.string().min(1, 'Client is required'),
//   businessName: z.string().min(1, 'Business name is required'),
//   mobileNo: z.string(),
//   landlineNo: z.string().optional(),
//   address: z.string().min(1, 'Address is required'),
//   designType: z.enum(DESIGN_TYPES),
//   amount: z.number().min(0, 'Amount must be positive'),
//   advancePaid: z.number().min(0, 'Advance paid must be positive'),
//   remarks: z.string().optional(),
//   status: z.enum(['In Progress', 'Completed', 'Cancelled']),
// });

// type DesignJobFormData = z.infer<typeof designJobSchema>;

// interface EditDesignJobModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   job: GraphicDesignJob;
// }

// export default function EditDesignJobModal({
//   isOpen,
//   onClose,
//   job,
// }: EditDesignJobModalProps) {
//   const { clients, updateGraphicDesignJob } = useStore();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<DesignJobFormData>({
//     resolver: zodResolver(designJobSchema),
//     defaultValues: {
//       ...job,
//     },
//   });

//   const amount = watch('amount') || 0;
//   const advancePaid = watch('advancePaid') || 0;
//   const dueAmount = amount - advancePaid;

//   const clientId = watch('clientId');
//   const selectedClient = clients.find(c => c.id === clientId);

//   const onSubmit = (data: DesignJobFormData) => {
//     const client = clients.find(c => c.id === data.clientId);
//     if (client) {
//       updateGraphicDesignJob(job.id, {
//         ...data,
//         clientName: client.name,
//         dueAmount,
//         paymentStatus: dueAmount > 0 ? 'Due' : 'Paid',
//         updatedAt: new Date().toISOString(),
//       });
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Edit Design Job</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Client</label>
//               <SearchableSelect
//                 options={clients.map(client => ({
//                   value: client.id,
//                   label: client.name
//                 }))}
//                 value={watch('clientId')}
//                 onChange={(value) => {
//                   setValue('clientId', value);
//                   const client = clients.find(c => c.id === value);
//                   if (client) {
//                     setValue('mobileNo', client.phone);
//                   }
//                 }}
//                 placeholder="Select client"
//                 className="mt-1"
//                 error={errors.clientId?.message}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Business Name</label>
//               <Input {...register('businessName')} className="mt-1" />
//               {errors.businessName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
//               <Input 
//                 value={selectedClient?.phone || ''}
//                 className="mt-1 bg-gray-50" 
//                 disabled 
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Landline Number</label>
//               <Input {...register('landlineNo')} className="mt-1" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Design Type</label>
//               <select
//                 {...register('designType')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 {DESIGN_TYPES.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <Input {...register('address')} className="mt-1" />
//               {errors.address && (
//                 <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Amount (¥)</label>
//               <Input
//                 type="number"
//                 min="0"
//                 {...register('amount', { valueAsNumber: true })}
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Advance Paid (¥)</label>
//               <Input
//                 type="number"
//                 min="0"
//                 {...register('advancePaid', { valueAsNumber: true })}
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Due Amount (¥)</label>
//               <Input
//                 type="number"
//                 value={dueAmount}
//                 className="mt-1 bg-gray-50"
//                 disabled
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <select
//                 {...register('status')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>

//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Remarks</label>
//               <textarea
//                 {...register('remarks')}
//                 rows={3}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                 placeholder="Add any additional notes..."
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">Save Changes</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }





// ***************NEW CODE************

import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SearchableSelect from '../../components/SearchableSelect';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DESIGN_TYPES } from '../../constants/designTypes';

interface EditDesignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchGraphicDesignJobs : () => void;
  job: any; // You can replace 'any' with a more specific type if needed
}

export default function EditDesignJobModal({
  isOpen,
  onClose,
  job,
  fetchGraphicDesignJobs,
}: EditDesignJobModalProps) {
  const [clients, setClients] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      ...job,
    },
  });

  const amount = watch('amount') || 0;
  const advancePaid = watch('advancePaid') || 0;
  const dueAmount = amount - advancePaid;

  const clientId = watch('clientId');
  const selectedClient = clients.find(c => c.id === clientId);

  useEffect(() => {
    if (isOpen) {
      axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/client/getClient`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setClients(response.data);
          } else {
            console.error('Expected an array, received:', response.data);
            setClients([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching clients:', error);
          setClients([]);
        });
    }
  }, [isOpen]);

  const onSubmit = (data: any) => {
    let clientName = '';
  
    // Check if the client is selected
    const client = clients.find(c => c._id === data.clientId);
    if (client) {
      clientName = client.name;
    }
  
    // Ensure that deadline is defined and is a valid Date object
    let deadline;
    if (data.deadline) {
      // If the deadline exists, ensure it is a valid Date object
      deadline = new Date(data.deadline);
      if (isNaN(deadline.getTime())) {
        console.error('Invalid deadline:', data.deadline);
        deadline = new Date(); // Fallback to current date if invalid
      }
    } else {
      // If no deadline is provided, use the current date as a fallback
      deadline = new Date();
    }
  
    // Update the job, even without a selected client
    axios.put(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/graphicDesign/updateGraphicDesign/${job._id}`,
      {
        ...data,
        clientName: clientName || 'Default Client', // If no client selected, use a default value
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(), // Ensure `date` is valid
        deadline: deadline.toISOString(), // Now it is safe to call toISOString
      }
    )
    .then((response) => {
      console.log('Design job updated successfully', response.data);
      toast.success(response.data.message);
      fetchGraphicDesignJobs();
      onClose();  // Close the modal after successful update
    })
    .catch((error: any) => {
      console.error('Error updating design job:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      toast.error(errorMessage);
    });
  };
  
  
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Design Job</h2>
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <Input {...register('businessName')} className="mt-1" />
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
                {DESIGN_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Input {...register('address')} className="mt-1" />
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
