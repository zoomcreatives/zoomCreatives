// import { useState } from 'react';
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
// import PaymentSection from './components/PaymentSection';

// const applicationSchema = z.object({
//   // Client Information
//   clientId: z.string().min(1, 'Client is required'),
//   mobileNo: z.string(),
//   date: z.date(),
//   deadline: z.date(),
//   handledBy: z.string().min(1, 'Handler is required'),
//   package: z.enum(['Standard Package', 'Premium Package']),
//   noOfApplicants: z.number().min(1),
//   reasonForVisit: z.enum(['General Visit', 'Baby Care', 'Program Attendance', 'Other']),
//   otherReason: z.string().optional(),

//   // Financial Details
//   amount: z.number().min(0),
//   paidAmount: z.number().min(0),
//   discount: z.number().min(0),
//   deliveryCharge: z.number().min(0),
//   dueAmount: z.number(),
//   paymentStatus: z.enum(['Due', 'Paid']),
//   paymentMethod: z.enum(['Bank Furicomy', 'Counter Cash', 'Credit Card', 'Paypay', 'Line Pay']).optional(),
//   modeOfDelivery: z.enum(['Office Pickup', 'PDF', 'Normal Delivery', 'Blue Letterpack', 'Red Letterpack']),

//   // Additional Information
//   notes: z.string().optional(),
// });

// type ApplicationFormData = z.infer<typeof applicationSchema>;

// interface AddApplicationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
//   const { clients, addJapanVisitApplication } = useStore();
//   const { admins } = useAdminStore();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<ApplicationFormData>({
//     resolver: zodResolver(applicationSchema),
//     defaultValues: {
//       date: new Date(),
//       deadline: new Date(),
//       package: 'Standard Package',
//       noOfApplicants: 1,
//       amount: 0,
//       paidAmount: 0,
//       discount: 0,
//       deliveryCharge: 0,
//       dueAmount: 0,
//       paymentStatus: 'Due',
//       modeOfDelivery: 'Office Pickup',
//     },
//   });

//   const clientId = watch('clientId');
//   const selectedClient = clients.find(c => c.id === clientId);

//   // Filter out super_admin from the handlers list
//   const subAdmins = admins.filter(admin => admin.role !== 'super_admin');



//   const onSubmit = (data: ApplicationFormData) => {
//     const client = clients.find(c => c.id === data.clientId);
//     if (client) {
//       addJapanVisitApplication({
//         ...data,
//         clientName: client.name,
//         submissionDate: new Date().toISOString(),
//       });
//       reset();
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">New Japan Visit Application</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//           {/* Client Information Section */}
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium border-b pb-2">Client Information</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Client</label>
//                 <SearchableSelect
//                   options={clients.map(client => ({
//                     value: client.id,
//                     label: client.name
//                   }))}
//                   value={watch('clientId')}
//                   onChange={(value) => {
//                     setValue('clientId', value);
//                     const client = clients.find(c => c.id === value);
//                     if (client) {
//                       setValue('mobileNo', client.phone);
//                     }
//                   }}
//                   placeholder="Select client"
//                   className="mt-1"
//                   error={errors.clientId?.message}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Mobile No</label>
//                 <Input 
//                   value={selectedClient?.phone || ''}
//                   className="mt-1 bg-gray-50" 
//                   disabled 
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Project Start Date</label>
//                 <DatePicker
//                   selected={watch('date')}
//                   onChange={(date) => setValue('date', date as Date)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                   dateFormat="yyyy-MM-dd"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Deadline</label>
//                 <DatePicker
//                   selected={watch('deadline')}
//                   onChange={(date) => setValue('deadline', date as Date)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                   dateFormat="yyyy-MM-dd"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Handled By</label>
//                 <select
//                   {...register('handledBy')}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                 >
//                   <option value="">Select handler</option>
//                   {subAdmins.map((admin) => (
//                     <option key={admin.id} value={admin.name}>
//                       {admin.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Package</label>
//                 <select
//                   {...register('package')}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                 >
//                   <option value="Standard Package">Standard Package</option>
//                   <option value="Premium Package">Premium Package</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">No of Applicants</label>
//                 <Input
//                   type="number"
//                   min="1"
//                   {...register('noOfApplicants', { valueAsNumber: true })}
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Project Reason</label>
//                 <select
//                   {...register('reasonForVisit')}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//                 >
//                   <option value="General Visit">General Visit</option>
//                   <option value="Baby Care">Baby Care</option>
//                   <option value="Program Attendance">Program Attendance</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Financial Details Section */}
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium border-b pb-2">Financial Details</h3>
//             <PaymentSection 
//               register={register} 
//               watch={watch} 
//               setValue={setValue}
//               errors={errors} 
//             />
//           </div>

//           {/* Notes Section */}
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium border-b pb-2">Notes</h3>
//             <div>
//               <textarea
//                 {...register('notes')}
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
//             <Button type="submit">Create Application</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }






// **************NEW CODE**********

import { useEffect, useState } from 'react';
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
import PaymentSection from './components/PaymentSection';
import axios from 'axios';
import toast from 'react-hot-toast';

const applicationSchema = z.object({
  // Client Information
  clientId: z.string().min(1, 'Client is required'),
  mobileNo: z.string(),
  date: z.date(),
  deadline: z.date(),
  handledBy: z.string().min(1, 'Handler is required'),
  package: z.enum(['Standard Package', 'Premium Package']),
  noOfApplicants: z.number().min(1),
  reasonForVisit: z.enum(['General Visit', 'Baby Care', 'Program Attendance', 'Other']),
  otherReason: z.string().optional(),

  // Financial Details
  amount: z.number().min(0),
  paidAmount: z.number().min(0),
  discount: z.number().min(0),
  deliveryCharge: z.number().min(0),
  dueAmount: z.number(),
  paymentStatus: z.enum(['Due', 'Paid']),
  paymentMethod: z.enum(['Bank Furicomy', 'Counter Cash', 'Credit Card', 'Paypay', 'Line Pay']).optional(),
  modeOfDelivery: z.enum(['Office Pickup', 'PDF', 'Normal Delivery', 'Blue Letterpack', 'Red Letterpack']),

  // Additional Information
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface AddApplicationModalProps {
  isOpen: boolean;
  fetchApplications : () => void;
  onClose: () => void;
}
export default function AddApplicationModal({ isOpen, onClose, fetchApplications }: AddApplicationModalProps) {
  const { admins } = useAdminStore();
  const [clients, setClients] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      date: new Date(),
      deadline: new Date(),
      package: 'Standard Package',
      noOfApplicants: 1,
      amount: 0,
      paidAmount: 0,
      discount: 0,
      deliveryCharge: 0,
      dueAmount: 0,
      paymentStatus: 'Due',
      modeOfDelivery: 'Office Pickup',
    },
  });

  const clientId = watch('clientId');
  const selectedClient = clients.find(c => c._id === clientId);

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

  const handleApplicationCreation = async () => {
    const formData = watch();
    console.log('Form Data:', formData); // Debugging the form data before sending to the server

    try {
      const client = clients.find(c => c._id === formData.clientId);
      if (client) {
        const payload = {
          ...formData,
          clientName: client.name,
          clientPhone: client.phone,
          submissionDate: new Date().toISOString(),
        };

        console.log('Payload to be sent to the API:', payload); // Debugging the payload

        // const response = await axios.post('http://localhost:3000/api/v1/japanVisit/createJapanVisitApplication', payload);
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/japanVisit/createJapanVisitApplication`, payload);

        if (response.data.success) {
          // console.log('Application created successfully:', response.data);
          reset(); // Reset form after successful submission
          onClose(); // Close the modal
          toast.success('Application created successfully!');
          fetchApplications();
        } else {
          console.error('Failed to create application:', response.data);
          toast.error('Failed to create application.');
        }
      }
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Error creating application.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Japan Visit Application</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-8">
          {/* Client Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <SearchableSelect
                  options={clients.map(client => ({
                    value: client._id,
                    label: client.name
                  }))}
                  value={watch('clientId')}
                  onChange={(value) => {
                    setValue('clientId', value);
                    const client = clients.find(c => c._id === value);
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
                <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                <Input
                  value={selectedClient?.phone || ''}
                  className="mt-1 bg-gray-50"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project Start Date</label>
                <DatePicker
                  selected={watch('date')}
                  onChange={(date) => setValue('date', date as Date)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

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
                <label className="block text-sm font-medium text-gray-700">Package</label>
                <select
                  {...register('package')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                >
                  <option value="Standard Package">Standard Package</option>
                  <option value="Premium Package">Premium Package</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">No of Applicants</label>
                <Input
                  type="number"
                  min="1"
                  {...register('noOfApplicants', { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project Reason</label>
                <select
                  {...register('reasonForVisit')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                >
                  <option value="General Visit">General Visit</option>
                  <option value="Baby Care">Baby Care</option>
                  <option value="Program Attendance">Program Attendance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Financial Details</h3>
            <PaymentSection
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          </div>

          {/* Notes Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Notes</h3>
            <div>
              <textarea
                {...register('notes')}
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
            <Button type="button" onClick={handleApplicationCreation}>
              Create Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
