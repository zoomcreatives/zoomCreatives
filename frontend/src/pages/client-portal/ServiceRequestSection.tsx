import { useState } from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';
import ServiceRequestModal from './ServiceRequestModal';
import type { Client } from '../../types';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const SERVICES: Service[] = [
  {
    id: 'visa-assistance',
    title: 'Visa Assistance',
    description: 'Ensure smooth visa acceptance with our professional document translation services. Our expert team guarantees accurate translations, helping you secure your visa hassle-free and enjoy a worry-free journey.',
    icon: '🛂'
  },
  {
    id: 'travel-tour',
    title: 'Travel and Tour',
    description: 'Discover handpicked adventures worldwide with our tailored tour packages, promising unforgettable experiences at every turn.',
    icon: '✈️'
  },
  {
    id: 'document-translation',
    title: 'Document Translation',
    description: 'Discover seamless travel experiences with our professional document translation services. Our expert team ensures your travel documents are accurately translated, making your journeys stress-free and enjoyable.',
    icon: '📄'
  },
  {
    id: 'epassport',
    title: 'E-Passport',
    description: 'Experience the future of travel with our reliable e-passport services, ensuring your security and convenience.',
    icon: '🔐'
  },
  {
    id: 'japan-visa',
    title: 'Japan Visa and Immigration',
    description: 'Navigate the Japan visa and immigration process with ease using our expert guidance. We provide up-to-date information and step-by-step assistance to ensure a smooth application experience, helping you embark on your Japanese adventure without hassle.',
    icon: '🗾'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'We deliver stunning visuals that elevate your brand, guaranteeing excellence and creativity in every detail.',
    icon: '🎨'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'We drive engagement and growth with targeted campaigns, ensuring your brand\'s success in the digital landscape',
    icon: '📱'
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'We design and build websites that are not only stunning but also ensure top performance and user experience.',
    icon: '💻'
  },
  {
    id: 'seo',
    title: 'Search Engine Optimization',
    description: 'Our proven strategies guarantee improved visibility and engagement, ensuring your online success.',
    icon: '🔍'
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Our dedicated photographers deliver exceptional images, ensuring your memories are cherished forever.',
    icon: '📸'
  }
];

interface ServiceRequestSectionProps {
  client: Client;
}

export default function ServiceRequestSection({ client }: ServiceRequestSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-gray-400" />
        <h2 className="text-xl font-semibold">Our Services</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{service.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <Button
                  onClick={() => handleRequestService(service)}
                  variant="outline"
                  className="w-full justify-center"
                >
                  Request Service
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <ServiceRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          client={client}
        />
      )}
    </div>
  );
}