// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { X } from 'lucide-react';
// import Button from '../../components/Button';
// import Input from '../../components/Input';
// import SearchableSelect from '../../components/SearchableSelect';
// import { useStore } from '../../store';
// import { useAdminStore } from '../../store/adminStore';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import TodoList from '../../components/TodoList';
// import PaymentSection from './components/PaymentSection';
// import type { JapanVisitApplication } from '../../types';

// const applicationSchema = z.object({
//   clientId: z.string().min(1, 'Client is required'),
//   mobileNo: z.string(),
//   date: z.date(),
//   deadline: z.date(),
//   handledBy: z.string().min(1, 'Handler is required'),
//   package: z.enum(['Standard Package', 'Premium Package']),
//   noOfApplicants: z.number().min(1),
//   reasonForVisit: z.enum(['General Visit', 'Baby Care', 'Program Attendance', 'Other']),
//   otherReason: z.string().optional(),
//   amount: z.number().min(0),
//   paidAmount: z.number().min(0),
//   discount: z.number().min(0),
//   deliveryCharge: z.number().min(0),
//   dueAmount: z.number(),
//   paymentStatus: z.enum(['Due', 'Paid']),
//   paymentMethod: z.enum(['Bank Furicomy', 'Counter Cash', 'Credit Card', 'Paypay', 'Line Pay']).optional(),
//   modeOfDelivery: z.enum(['Office Pickup', 'PDF', 'Normal Delivery', 'Blue Letterpack', 'Red Letterpack']),
//   applicationStatus: z.enum(['Details Pending', 'Ready to Process', 'Under Progress', 'Cancelled', 'Completed']),
//   dataSentStatus: z.enum(['Not Sent', 'Sent']),
//   notes: z.string().optional(),
//   todos: z.array(z.object({
//     id: z.string(),
//     task: z.string(),
//     completed: z.boolean(),
//     priority: z.enum(['Low', 'Medium', 'High']),
//     dueDate: z.date().optional(),
//   })).optional(),
// });

// export type JapanVisitFormData = z.infer<typeof applicationSchema>;

// interface EditApplicationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   application: JapanVisitApplication;
// }

// export default function EditApplicationModal({
//   isOpen,
//   onClose,
//   application,
// }: EditApplicationModalProps) {
//   const { clients, updateJapanVisitApplication } = useStore();
//   const { admins } = useAdminStore();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<JapanVisitFormData>({
//     resolver: zodResolver(applicationSchema),
//     defaultValues: {
//       ...application,
//       date: new Date(application.date),
//       deadline: new Date(application.deadline),
//       todos: application.todos?.map(todo => ({
//         ...todo,
//         id: todo.id || crypto.randomUUID(),
//         dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
//       })) || [],
//     },
//   });

//   const handlers = admins.filter(admin => admin.role !== 'super_admin');

//   const onSubmit = (data: JapanVisitFormData) => {
//     const client = clients.find(c => c.id === data.clientId);
//     if (client) {
//       updateJapanVisitApplication(application.id, {
//         ...data,
//         clientName: client.name,
//       });
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Edit Japan Visit Application</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Client</label>
//               <SearchableSelect
//                 options={clients.map(client => ({
//                   value: client.id,
//                   label: client.name
//                 }))}
//                 value={watch('clientId')}
//                 onChange={(value) => setValue('clientId', value)}
//                 placeholder="Select client"
//                 className="mt-1"
//                 error={errors.clientId?.message}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile No</label>
//               <Input {...register('mobileNo')} className="mt-1" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Date</label>
//               <DatePicker
//                 selected={watch('date')}
//                 onChange={(date) => setValue('date', date as Date)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                 dateFormat="yyyy-MM-dd"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Handled By</label>
//               <select
//                 {...register('handledBy')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 <option value="">Select handler</option>
//                 {handlers.map((admin) => (
//                   <option key={admin.id} value={admin.name}>
//                     {admin.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Package</label>
//               <select
//                 {...register('package')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 <option value="Standard Package">Standard Package</option>
//                 <option value="Premium Package">Premium Package</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">No of Applicants</label>
//               <Input
//                 type="number"
//                 min="1"
//                 {...register('noOfApplicants', { valueAsNumber: true })}
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Deadline</label>
//               <DatePicker
//                 selected={watch('deadline')}
//                 onChange={(date) => setValue('deadline', date as Date)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                 dateFormat="yyyy-MM-dd"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
//               <select
//                 {...register('reasonForVisit')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 <option value="General Visit">General Visit</option>
//                 <option value="Baby Care">Baby Care</option>
//                 <option value="Program Attendance">Program Attendance</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Application Status</label>
//               <select
//                 {...register('applicationStatus')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 <option value="Details Pending">Details Pending</option>
//                 <option value="Ready to Process">Ready to Process</option>
//                 <option value="Under Progress">Under Progress</option>
//                 <option value="Cancelled">Cancelled</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Data Sent Status</label>
//               <select
//                 {...register('dataSentStatus')}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               >
//                 <option value="Not Sent">Not Sent</option>
//                 <option value="Sent">Sent</option>
//               </select>
//             </div>
//           </div>

//           {/* Payment Section */}
//           <PaymentSection register={register} watch={watch} setValue={setValue} errors={errors} />

//           {/* Todo List */}
//           <div className="space-y-4">
//             <h3 className="font-medium">To-Do List</h3>
//             <TodoList
//               todos={watch('todos') || []}
//               onTodosChange={(newTodos) => setValue('todos', newTodos)}
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Notes</label>
//             <textarea
//               {...register('notes')}
//               rows={3}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//               placeholder="Add any additional notes..."
//             />
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





//**************NEW CODE***************

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PaymentSection from './components/PaymentSection';
import { toast } from 'react-hot-toast'; // Importing React Hot Toast
import axios from 'axios';  // Importing Axios

export default function EditApplicationModal({
  isOpen,
  onClose,
  application,
  clients,
  fetchApplications
}) {
  // Early return if modal is not open
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset, // Reset form on modal close
  } = useForm({
    defaultValues: {
      ...application,
      date: application ? new Date(application.date) : undefined,
      deadline: application ? new Date(application.deadline) : undefined,
      todos: application?.todos?.map(todo => ({
        ...todo,
        id: todo.id || crypto.randomUUID(),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      })) || [],
    },
  });

  // Clear form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // API call to update the application
  const onSubmit = async (data: any) => {
    try {
      // console.log('Sending data to the backend:', { ...data });

      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/japanVisit/updateJapanVisitApplication/${application._id}`,
        { ...data }
      );

      if (response.data.success) {
        toast.success('Application updated successfully!');
        onClose(); // Close the modal after success
        fetchApplications();
      } else {
        toast.error('Failed to update application.');
      }
    } catch (error) {
      toast.error('Failed to update application. Please try again.');
      console.error('Error updating application:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Japan Visit Application</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile No</label>
              <Input {...register('mobileNo')} className="mt-1" disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <DatePicker
                selected={watch('date')}
                onChange={(date) => setValue('date', date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>

          {/* Payment Section */}
          <PaymentSection register={register} watch={watch} setValue={setValue} />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

//Note:---> need to work on this component make sure add typescript and fix some buges like not auto updated while modal edit 