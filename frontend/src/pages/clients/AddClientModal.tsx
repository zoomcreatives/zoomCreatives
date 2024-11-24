import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, Plus } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useStore } from '../../store';
import { fetchJapaneseAddress } from '../../services/addressService';
import { generateStrongPassword } from '../../utils/passwordGenerator';
import { countries } from '../../utils/countries';
import { createClientSchema } from '../../utils/clientValidation';
import type { ClientCategory } from '../../types';

const categories: ClientCategory[] = [
  'Visit Visa Applicant',
  'Japan Visit Visa Applicant',
  'Document Translation',
  'Student Visa Applicant',
  'Epassport Applicant',
  'Japan Visa',
  'General Consultation'
];

const optionalCategories: ClientCategory[] = [
  'Document Translation',
  'Epassport Applicant',
  'Japan Visa',
  'General Consultation'
];

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const { addClient } = useStore();
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ClientCategory>('General Consultation');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createClientSchema(selectedCategory)),
    defaultValues: {
      status: 'active',
      category: selectedCategory,
      address: {
        postalCode: '',
        prefecture: '',
        city: '',
        street: '',
        building: '',
      },
      socialMedia: {
        facebook: '',
      },
      modeOfContact: [],
      password: '',
    },
  });

  const postalCode = watch('address.postalCode');
  const selectedModes = watch('modeOfContact');

  const handlePostalCodeChange = useCallback(async () => {
    if (!postalCode || optionalCategories.includes(selectedCategory)) return;
    
    const cleanPostalCode = postalCode.replace(/\D/g, '');
    
    setAddressError(null);

    if (cleanPostalCode.length === 7) {
      setIsAddressLoading(true);
      try {
        const address = await fetchJapaneseAddress(cleanPostalCode);
        if (address) {
          setValue('address.prefecture', address.prefecture);
          setValue('address.city', address.city);
          setValue('address.street', address.town);
        } else {
          setAddressError('No address found for this postal code');
          setValue('address.prefecture', '');
          setValue('address.city', '');
          setValue('address.street', '');
        }
      } catch (error) {
        setAddressError('Failed to fetch address. Please try again.');
        console.error('Failed to fetch address:', error);
      } finally {
        setIsAddressLoading(false);
      }
    }
  }, [postalCode, setValue, selectedCategory]);

  const handleGeneratePassword = () => {
    if (optionalCategories.includes(selectedCategory)) return;
    const password = generateStrongPassword();
    setGeneratedPassword(password);
    setValue('password', password);
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhotoPreview(base64String);
        setValue('profilePhoto', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModeOfContactChange = (mode: string) => {
    const currentModes = watch('modeOfContact');
    if (currentModes.includes(mode)) {
      setValue('modeOfContact', currentModes.filter(m => m !== mode));
    } else {
      setValue('modeOfContact', [...currentModes, mode]);
    }
  };

  const handleCategoryChange = (category: ClientCategory) => {
    setSelectedCategory(category);
    // Reset form with new validation schema
    reset({
      ...watch(),
      category,
    });
  };

  const onSubmit = (data: any) => {
    addClient({
      ...data,
      dateJoined: new Date().toISOString(),
      timeline: [],
    });

    if (!optionalCategories.includes(data.category)) {
      alert(
        `Client account created!\n\nUsername: ${data.email}\nPassword: ${data.password}\n\nPlease save these credentials and share them with the client securely.`
      );
    }
    
    reset();
    setProfilePhotoPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  const isOptionalCategory = optionalCategories.includes(selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-brand-yellow rounded-full p-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Upload profile photo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input {...register('name')} className="mt-1" />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register('category')}
              onChange={(e) => handleCategoryChange(e.target.value as ClientCategory)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register('status')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email {isOptionalCategory && <span className="text-gray-500">(Optional)</span>}
            </label>
            <Input {...register('email')} type="email" className="mt-1" />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone {isOptionalCategory && <span className="text-gray-500">(Optional)</span>}
            </label>
            <Input {...register('phone')} type="tel" className="mt-1" />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
            )}
          </div>

          {!isOptionalCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex gap-2">
                <Input
                  {...register('password')}
                  type="text"
                  className="flex-1"
                  value={generatedPassword}
                  onChange={(e) => setGeneratedPassword(e.target.value)}
                />
                <Button type="button" onClick={handleGeneratePassword}>
                  Generate
                </Button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationality {isOptionalCategory && <span className="text-gray-500">(Optional)</span>}
            </label>
            <select
              {...register('nationality')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
            >
              <option value="">Select nationality</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <p className="mt-1 text-sm text-red-600">{errors.nationality.message as string}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">
              Address {isOptionalCategory && <span className="text-gray-500">(Optional)</span>}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <div className="relative">
                  <Input
                    {...register('address.postalCode')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formatted = value
                        .replace(/\D/g, '')
                        .replace(/^(\d{3})(\d{0,4})/, '$1-$2')
                        .substring(0, 8);
                      
                      setValue('address.postalCode', formatted);
                      
                      if (value.replace(/\D/g, '').length === 7) {
                        handlePostalCodeChange();
                      }
                    }}
                    placeholder="123-4567"
                    className="mt-1"
                  />
                  {isAddressLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-yellow border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {addressError && (
                  <p className="mt-1 text-sm text-red-600">{addressError}</p>
                )}
                {errors.address?.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prefecture
                </label>
                <Input
                  {...register('address.prefecture')}
                  className="mt-1"
                  disabled={isAddressLoading}
                />
                {errors.address?.prefecture && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.prefecture.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <Input
                  {...register('address.city')}
                  className="mt-1"
                  disabled={isAddressLoading}
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.city.message as string}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <Input
                  {...register('address.street')}
                  className="mt-1"
                  disabled={isAddressLoading}
                />
                {errors.address?.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.street.message as string}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Building & Apartment
                </label>
                <Input
                  {...register('address.building')}
                  placeholder="Building name, Floor, Unit number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Contact Preferences</h3>
            <div className="space-y-2">
              {(['Direct Call', 'Viber', 'WhatsApp', 'Facebook Messenger'] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedModes.includes(mode)}
                    onChange={() => handleModeOfContactChange(mode)}
                    className="rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                  />
                  <span className="text-sm text-gray-700">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook Profile</label>
            <Input
              {...register('socialMedia.facebook')}
              placeholder="Facebook profile URL"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Client</Button>
          </div>
        </form>
      </div>
    </div>
  );
}