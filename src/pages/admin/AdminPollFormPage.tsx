import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Toggle';
import { ImageUploadField } from '../../components/admin/ImageUploadField';
import { useToast } from '../../components/ui/Toast';
import { fetchAdminPoll, createPoll, updatePoll } from '../../services/polls';
import { getErrorMessage } from '../../services/api';
import { Link } from 'react-router-dom';

const offerSchema = z.object({
  discountCode: z.string().min(1, 'Required'),
  buttonText: z.string().min(1, 'Required'),
  affiliateUrl: z.string().url('Enter a valid URL'),
  disclosure: z.string().min(1, 'Required'),
});

const schema = z.object({
  title: z.string().min(2, 'Title is required.'),
  description: z.string().optional(),
  question: z.string().min(2, 'Question is required.'),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  offerEnabled: z.boolean(),
  emailRequired: z.boolean(),
  homepageVisible: z.boolean(),
  status: z.enum(['draft', 'published', 'paused', 'archived']),
  offers: z.array(offerSchema),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_OFFER = {
  discountCode: '',
  buttonText: 'Shop Now',
  affiliateUrl: '',
  disclosure: 'This link may earn us a commission at no extra cost to you.',
};

export function AdminPollFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: existingPoll } = useQuery({
    queryKey: ['admin-poll', id],
    queryFn: () => fetchAdminPoll(id!),
    enabled: isEditing,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      question: '',
      image: '',
      videoUrl: '',
      offerEnabled: true,
      emailRequired: true,
      homepageVisible: true,
      status: 'draft',
      offers: [DEFAULT_OFFER],
    },
  });

  useEffect(() => {
    if (existingPoll) {
      reset({
        title: existingPoll.title,
        description: existingPoll.description,
        question: existingPoll.question,
        image: existingPoll.image,
        videoUrl: existingPoll.videoUrl,
        offerEnabled: existingPoll.offerEnabled,
        emailRequired: existingPoll.emailRequired,
        homepageVisible: existingPoll.homepageVisible,
        status: existingPoll.status,
        offers: existingPoll.offers.length > 0 ? existingPoll.offers : [DEFAULT_OFFER],
      });
    }
  }, [existingPoll, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: 'offers' });
  const image = watch('image');
  const offerEnabled = watch('offerEnabled');
  const emailRequired = watch('emailRequired');
  const homepageVisible = watch('homepageVisible');

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updatePoll(id!, values);
        showToast('Poll updated.', 'success');
      } else {
        await createPoll(values);
        showToast('Poll created.', 'success');
      }
      navigate('/admin/polls');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/polls"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft dark:text-paper/60 hover:text-ink dark:hover:text-paper mb-4"
      >
        <ChevronLeft className="size-4" /> Back to polls
      </Link>

      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">
        {isEditing ? 'Edit Poll' : 'New Poll'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-5 space-y-4">
          <Input label="Title" placeholder="Oversized Denim Jacket" error={errors.title?.message} {...register('title')} />
          <Textarea
            label="Description"
            placeholder="A short description of the product…"
            rows={2}
            {...register('description')}
          />
          <Input
            label="Question"
            placeholder="Would you wear this oversized denim jacket?"
            error={errors.question?.message}
            {...register('question')}
          />
          <ImageUploadField value={image || ''} onChange={(url) => setValue('image', url)} />
          <Input label="Video URL (optional)" placeholder="https://…" {...register('videoUrl')} />
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold mb-1">Visibility & settings</h2>
          <div className="divide-y divide-line dark:divide-white/10">
            <Toggle
              checked={offerEnabled}
              onChange={(v) => setValue('offerEnabled', v)}
              label="Offer enabled"
              description="Show an unlock-offer button after voting."
            />
            <Toggle
              checked={emailRequired}
              onChange={(v) => setValue('emailRequired', v)}
              label="Email required to unlock"
              description="Capture an email before revealing the discount code."
            />
            <Toggle
              checked={homepageVisible}
              onChange={(v) => setValue('homepageVisible', v)}
              label="Show on homepage"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select
              {...register('status')}
              className="w-full rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-made/40 focus:border-made"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold">Offer</h2>
            {fields.length < 3 && (
              <button
                type="button"
                onClick={() => append(DEFAULT_OFFER)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-made"
              >
                <Plus className="size-4" /> Add offer
              </button>
            )}
          </div>

          <div className="space-y-5">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 pb-5 border-b border-line dark:border-white/10 last:border-0 last:pb-0">
                {fields.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-fade text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                )}
                <Input
                  label="Discount code"
                  placeholder="SAVE15"
                  error={errors.offers?.[index]?.discountCode?.message}
                  {...register(`offers.${index}.discountCode`)}
                />
                <Input
                  label="Button text"
                  placeholder="Shop Now"
                  error={errors.offers?.[index]?.buttonText?.message}
                  {...register(`offers.${index}.buttonText`)}
                />
                <Input
                  label="Affiliate URL"
                  placeholder="https://example.com/product"
                  error={errors.offers?.[index]?.affiliateUrl?.message}
                  {...register(`offers.${index}.affiliateUrl`)}
                />
                <Textarea
                  label="Disclosure"
                  rows={2}
                  error={errors.offers?.[index]?.disclosure?.message}
                  {...register(`offers.${index}.disclosure`)}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Poll'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/polls')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
