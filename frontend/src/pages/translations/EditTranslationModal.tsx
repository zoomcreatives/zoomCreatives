import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Copy, Check } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SearchableSelect from '../../components/SearchableSelect';
import { useStore } from '../../store';
import { useAdminStore } from '../../store/adminStore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import type { Translation } from '../../types';

const translationSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  sourceLanguage: z.enum(['English', 'Japanese', 'Nepali', 'Hindi']),
  targetLanguage: z.enum(['English', 'Japanese', 'Nepali', 'Hindi']),
  nameInTargetScript: z.string().min(1, 'Name in target script is required'),
  pages: z.number().min(1, 'Number of pages must be at least 1'),
  amount: z.number().min(0, 'Amount must be positive'),
  paymentStatus: z.enum(['Due', 'Paid']),
  paymentMethod: z.enum(['Counter Cash', 'Bank Transfer', 'Credit Card', 'Paypay', 'Line Pay']).optional(),
  handledBy: z.string().min(1, 'Handler is required'),
  deadline: z.date(),
  translationStatus: z.enum(['Not Started', 'Processing', 'Completed', 'Delivered']),
  deliveryType: z.enum(['Office Pickup', 'Sent on Email', 'Sent on Viber', 'Sent on Facebook', 'By Post']),
});

type TranslationFormData = z.infer<typeof translationSchema>;

interface EditTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  translation: Translation;
}

export default function EditTranslationModal({
  isOpen,
  onClose,
  translation,
}: EditTranslationModalProps) {
  const { clients, updateTranslation } = useStore();
  const { admins } = useAdminStore();
  const [showPaymentMethod, setShowPaymentMethod] = useState(translation.paymentStatus === 'Paid');
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TranslationFormData>({
    resolver: zodResolver(translationSchema),
    defaultValues: {
      ...translation,
      deadline: new Date(translation.deadline),
    },
  });

  const paymentStatus = watch('paymentStatus');
  const sourceLanguage = watch('sourceLanguage');
  const targetLanguage = watch('targetLanguage');
  const nameInTargetScript = watch('nameInTargetScript');

  const handlers = admins.filter(admin => admin.role !== 'super_admin');

  useEffect(() => {
    setShowPaymentMethod(paymentStatus === 'Paid');
  }, [paymentStatus]);

  const handleCopyName = () => {
    if (nameInTargetScript) {
      navigator.clipboard.writeText(nameInTargetScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = (data: TranslationFormData) => {
    const client = clients.find(c => c.id === data.clientId);
    if (client) {
      updateTranslation(translation.id, {
        ...data,
        clientName: client.name,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Translation</h2>
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
              <label className="block text-sm font-medium text-gray-700">From</label>
              <select
                {...register('sourceLanguage')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="English">English</option>
                <option value="Japanese">Japanese</option>
                <option value="Nepali">Nepali</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">To</label>
              <select
                {...register('targetLanguage')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Japanese">Japanese</option>
                <option value="English">English</option>
                <option value="Nepali">Nepali</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {sourceLanguage === 'English' && targetLanguage === 'Japanese' ? 'Name in Katakana' :
                 sourceLanguage === 'Japanese' && targetLanguage === 'English' ? 'Name in English' :
                 'Name in Target Script'}
              </label>
              <div className="mt-1 relative">
                <Input {...register('nameInTargetScript')} className="pr-10" />
                <button
                  type="button"
                  onClick={handleCopyName}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.nameInTargetScript && (
                <p className="mt-1 text-sm text-red-600">{errors.nameInTargetScript.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pages</label>
              <Input
                type="number"
                min="1"
                {...register('pages', { valueAsNumber: true })}
                className="mt-1"
              />
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
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                {...register('paymentStatus')}
                onChange={(e) => {
                  register('paymentStatus').onChange(e);
                  setShowPaymentMethod(e.target.value === 'Paid');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Due">Due</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {showPaymentMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  {...register('paymentMethod')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                >
                  <option value="Counter Cash">Counter Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Paypay">Paypay</option>
                  <option value="Line Pay">Line Pay</option>
                </select>
              </div>
            )}

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
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <DatePicker
                selected={watch('deadline')}
                onChange={(date) => setValue('deadline', date as Date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Translation Status</label>
              <select
                {...register('translationStatus')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Not Started">Not Started</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Type</label>
              <select
                {...register('deliveryType')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow"
              >
                <option value="Office Pickup">Office Pickup</option>
                <option value="Sent on Email">Sent on Email</option>
                <option value="Sent on Viber">Sent on Viber</option>
                <option value="Sent on Facebook">Sent on Facebook</option>
                <option value="By Post">By Post</option>
              </select>
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