import { useState } from 'react';
import { Briefcase, Plus, Search, Calculator } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useStore } from '../../store';
import AddServiceModal from './AddServiceModal';
import EditServiceModal from './EditServiceModal';
import HisabKitabModal from '../../components/HisabKitabModal';
import DataTable from '../../components/DataTable';
import type { OtherService } from '../../types/otherService';
import { SERVICE_TYPES } from '../../constants/serviceTypes';

export default function OtherServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHisabKitabOpen, setIsHisabKitabOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<OtherService | null>(null);
  
  const { otherServices = [], deleteOtherService } = useStore();

  // Filter services based on search query and type
  const filteredServices = otherServices.filter(service => {
    const matchesSearch = service.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (service.serviceTypes || []).some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !selectedType || (service.serviceTypes || []).includes(selectedType as any);
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteOtherService(id);
    }
  };

  const formatPhoneForViber = (phone: string | undefined | null): string => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  const columns = [
    {
      key: 'clientName' as keyof OtherService,
      label: 'Client',
      render: (value: string) => (
        <div>
          <p className="font-medium">{value}</p>
        </div>
      ),
    },
    {
      key: 'mobileNo' as keyof OtherService,
      label: 'Contact',
      render: (value: string | undefined | null) => {
        if (!value) return <span className="text-gray-400">No contact</span>;
        return (
          <a 
            href={`viber://chat?number=${formatPhoneForViber(value)}`}
            className="text-brand-black hover:text-brand-yellow"
          >
            {value}
          </a>
        );
      },
    },
    {
      key: 'serviceTypes' as keyof OtherService,
      label: 'Service Types',
      render: (value: string[], item: OtherService) => (
        <div className="space-y-1">
          {(value || []).map((type, index) => (
            <span 
              key={`${item.id}-${index}`}
              className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow/10 text-brand-black mr-1 mb-1"
            >
              {type}
            </span>
          ))}
          {item.otherServiceDetails && (
            <p className="text-sm text-gray-500">{item.otherServiceDetails}</p>
          )}
        </div>
      ),
    },
    {
      key: 'amount' as keyof OtherService,
      label: 'Amount',
      render: (value: number) => (
        <span className="text-sm">¥{value?.toLocaleString() ?? 0}</span>
      ),
    },
    {
      key: 'paymentStatus' as keyof OtherService,
      label: 'Payment',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'jobStatus' as keyof OtherService,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-700' :
          value === 'Under Process' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'id' as keyof OtherService,
      label: 'Actions',
      render: (_: string, item: OtherService) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedService(item);
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
              setSelectedService(item);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item.id)}
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
            <Briefcase className="h-6 w-6 text-gray-400" />
            <h1 className="text-xl font-semibold text-gray-900">Other Services</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
            >
              <option value="">All Services</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Service
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredServices}
          searchable={false}
        />
      </div>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedService && (
        <>
          <EditServiceModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
          />

          <HisabKitabModal
            isOpen={isHisabKitabOpen}
            onClose={() => {
              setIsHisabKitabOpen(false);
              setSelectedService(null);
            }}
            application={selectedService}
          />
        </>
      )}
    </div>
  );
}