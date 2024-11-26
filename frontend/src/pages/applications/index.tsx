// import { useState } from 'react';
// import { FileText, Plus, Search, Calculator } from 'lucide-react';
// import Input from '../../components/Input';
// import Button from '../../components/Button';
// import { useStore } from '../../store';
// import AddApplicationModal from './AddApplicationModal';
// import EditApplicationModal from './EditApplicationModal';
// import HisabKitabModal from '../../components/HisabKitabModal';
// import DataTable from '../../components/DataTable';
// import { countries } from '../../utils/countries';
// import type { Application } from '../../types';

// export default function VisaApplicantsPage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isHisabKitabOpen, setIsHisabKitabOpen] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
//   const { applications, deleteApplication } = useStore();

//   // Filter applications based on search query and country
//   const filteredApplications = applications.filter(app => {
//     const matchesSearch = app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          app.type.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCountry = !selectedCountry || app.country === selectedCountry;
//     return matchesSearch && matchesCountry;
//   });

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this application?')) {
//       deleteApplication(id);
//     }
//   };

//   const columns = [
//     {
//       key: 'clientName',
//       label: 'Client',
//       render: (value: string, item: Application) => (
//         <div>
//           <p className="font-medium">{value}</p>
//           <p className="text-sm text-gray-500">{item.type} - {item.country}</p>
//         </div>
//       ),
//     },
//     {
//       key: 'visaStatus',
//       label: 'Status',
//       render: (value: string) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value === 'Approved' ? 'bg-green-100 text-green-700' :
//           value === 'Rejected' ? 'bg-red-100 text-red-700' :
//           'bg-blue-100 text-blue-700'
//         }`}>
//           {value}
//         </span>
//       ),
//     },
//     {
//       key: 'deadline',
//       label: 'Deadline',
//       render: (value: string) => (
//         <span className="text-sm">
//           {new Date(value).toLocaleDateString()}
//         </span>
//       ),
//     },
//     {
//       key: 'payment',
//       label: 'Payment',
//       render: (value: any) => (
//         <div>
//           <p className="text-sm">Total: ¥{(value?.total || 0).toLocaleString()}</p>
//           <p className="text-sm text-gray-500">Paid: ¥{(value?.paidAmount || 0).toLocaleString()}</p>
//         </div>
//       ),
//     },
//     {
//       key: 'id',
//       label: 'Actions',
//       render: (_: string, item: Application) => (
//         <div className="flex justify-end gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setSelectedApplication(item);
//               setIsHisabKitabOpen(true);
//             }}
//             title="View HisabKitab"
//           >
//             <Calculator className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setSelectedApplication(item);
//               setIsEditModalOpen(true);
//             }}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleDelete(item.id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <FileText className="h-6 w-6 text-gray-400" />
//             <h1 className="text-xl font-semibold text-gray-900">Visa Applications</h1>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 type="search"
//                 placeholder="Search applications..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <select
//               value={selectedCountry}
//               onChange={(e) => setSelectedCountry(e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//             >
//               <option value="">All Countries</option>
//               {countries.map((country) => (
//                 <option key={country.code} value={country.name}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>

//             <Button onClick={() => setIsAddModalOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               New Application
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <DataTable
//           columns={columns}
//           data={filteredApplications}
//           searchable={false}
//         />
//       </div>

//       <AddApplicationModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//       />

//       {selectedApplication && (
//         <>
//           <EditApplicationModal
//             isOpen={isEditModalOpen}
//             onClose={() => {
//               setIsEditModalOpen(false);
//               setSelectedApplication(null);
//             }}
//             application={selectedApplication}
//           />

//           <HisabKitabModal
//             isOpen={isHisabKitabOpen}
//             onClose={() => {
//               setIsHisabKitabOpen(false);
//               setSelectedApplication(null);
//             }}
//             application={selectedApplication}
//           />
//         </>
//       )}
//     </div>
//   );
// }






// **********NEW CODE*********

// import { useState, useEffect } from 'react';
// import { FileText, Plus, Search, Calculator, Import } from 'lucide-react';
// import Input from '../../components/Input';
// import Button from '../../components/Button';
// import AddApplicationModal from './AddApplicationModal';
// import EditApplicationModal from './EditApplicationModal';
// import HisabKitabModal from '../../components/HisabKitabModal';
// import DataTable from '../../components/DataTable';
// import { countries } from '../../utils/countries';
// import { Application } from '../../types';
// import axios from 'axios';

// export default function VisaApplicantsPage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isHisabKitabOpen, setIsHisabKitabOpen] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
//   const [applications, setApplications] = useState<Application[]>([]);  // State to hold applications data
  
//   // Fetch the applications from API
//   useEffect(() => {axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/visaApplication/getAllVisaApplication`)
//       .then((response) => {
//         setApplications(response.data.data);  // Assuming the response contains a data field with the applications
//       })
//       .catch((error) => {
//         console.error('Error fetching applications:', error);
//       });
//   }, []);

//   // Filter applications based on search query and selected country
//   const filteredApplications = applications.filter(app => {
//     const matchesSearch = app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          app.type.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCountry = !selectedCountry || app.country === selectedCountry;
//     return matchesSearch && matchesCountry;
//   });

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this application?')) {
//       // Call delete function, assuming `deleteApplication` function is available
//       // If you're managing state locally, you can filter out the application by ID
//       setApplications(prevApplications => prevApplications.filter(app => app.id !== id));
//     }
//   };

//   const columns = [
//     {
//       key: 'clientName',
//       label: 'Client',
//       render: (value: string, item: Application) => (
//         <div>
//           <p className="font-medium">{value}</p>
//           <p className="text-sm text-gray-500">{item.type} - {item.country}</p>
//         </div>
//       ),
//     },
//     {
//       key: 'visaStatus',
//       label: 'Status',
//       render: (value: string) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value === 'Approved' ? 'bg-green-100 text-green-700' :
//           value === 'Rejected' ? 'bg-red-100 text-red-700' :
//           'bg-blue-100 text-blue-700'
//         }`}>
//           {value}
//         </span>
//       ),
//     },
//     {
//       key: 'deadline',
//       label: 'Deadline',
//       render: (value: string) => (
//         <span className="text-sm">
//           {new Date(value).toLocaleDateString()}
//         </span>
//       ),
//     },
//     {
//       key: 'payment',
//       label: 'Payment',
//       render: (value: any) => (
//         <div>
//           <p className="text-sm">Total: ¥{(value?.total || 0).toLocaleString()}</p>
//           <p className="text-sm text-gray-500">Paid: ¥{(value?.paidAmount || 0).toLocaleString()}</p>
//         </div>
//       ),
//     },
//     {
//       key: 'id',
//       label: 'Actions',
//       render: (_: string, item: Application) => (
//         <div className="flex justify-end gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setSelectedApplication(item);
//               setIsHisabKitabOpen(true);
//             }}
//             title="View HisabKitab"
//           >
//             <Calculator className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setSelectedApplication(item);
//               setIsEditModalOpen(true);
//             }}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleDelete(item.id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <FileText className="h-6 w-6 text-gray-400" />
//             <h1 className="text-xl font-semibold text-gray-900">Visa Applications</h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 type="search"
//                 placeholder="Search applications..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <select
//               value={selectedCountry}
//               onChange={(e) => setSelectedCountry(e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
//             >
//               <option value="">All Countries</option>
//               {countries.map((country) => (
//                 <option key={country.code} value={country.name}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>

//             <Button onClick={() => setIsAddModalOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               New Application
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <DataTable
//           columns={columns}
//           data={filteredApplications}
//           searchable={false}
//         />
//       </div>

//       <AddApplicationModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//       />

//       {selectedApplication && (
//         <>
//           <EditApplicationModal
//             isOpen={isEditModalOpen}
//             onClose={() => {
//               setIsEditModalOpen(false);
//               setSelectedApplication(null);
//             }}
//             application={selectedApplication}
//           />

//           <HisabKitabModal
//             isOpen={isHisabKitabOpen}
//             onClose={() => {
//               setIsHisabKitabOpen(false);
//               setSelectedApplication(null);
//             }}
//             application={selectedApplication}
//           />
//         </>
//       )}
//     </div>
//   );
// }









import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Calculator, Import } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AddApplicationModal from './AddApplicationModal';
import EditApplicationModal from './EditApplicationModal';
import HisabKitabModal from '../../components/HisabKitabModal';
import DataTable from '../../components/DataTable';
import { countries } from '../../utils/countries';
import { Application } from '../../types';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function VisaApplicantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHisabKitabOpen, setIsHisabKitabOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  // Fetch the applications from API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/visaApplication/getAllVisaApplication`)
      .then((response) => {
        setApplications(response.data.data); // Assuming the response contains a `data` field with applications
      })
      .catch((error) => {
        console.error('Error fetching applications:', error);
      });
  }, []);

  // Filter applications based on search query and selected country
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || app.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  // Function to delete an application
  const handleDelete = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
      const response =  await axios.delete(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/visaApplication/deleteVisaApplication/${_id}`);
      if(response){
        // Update state after successful deletion
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.id !== _id)
        );
        toast.success(response.data.message);

      }

        
      } catch (error:any) {
        // console.error('Error deleting application:', error);
        // alert('Failed to delete the application. Please try again.');
        if(error.response){
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const columns = [
    {
      key: 'clientName',
      label: 'Client',
      render: (value: string, item: Application) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-gray-500">{item.type} - {item.country}</p>
        </div>
      ),
    },
    {
      key: 'visaStatus',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Approved'
              ? 'bg-green-100 text-green-700'
              : value === 'Rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (value: string) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (value: any) => (
        <div>
          <p className="text-sm">Total: ¥{(value?.total || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-500">
            Paid: ¥{(value?.paidAmount || 0).toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_: string, item: Application) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedApplication(item);
              setIsHisabKitabOpen(true);
            }}
            title="View HisabKitab"
          >
            <Calculator className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedApplication(item);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item._id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-gray-400" />
            <h1 className="text-xl font-semibold text-gray-900">Visa Applications</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredApplications}
          searchable={false}
        />
      </div>

      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedApplication && (
        <>
          <EditApplicationModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedApplication(null);
            }}
            application={selectedApplication}
          />

          <HisabKitabModal
            isOpen={isHisabKitabOpen}
            onClose={() => {
              setIsHisabKitabOpen(false);
              setSelectedApplication(null);
            }}
            application={selectedApplication}
          />
        </>
      )}
    </div>
  );
}
