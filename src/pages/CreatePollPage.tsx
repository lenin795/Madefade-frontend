import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Trash2, Copy, Check, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { createPrivatePoll } from '../services/privatePolls';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../services/api';

const schema = z.object({
  name: z.string().min(2, 'Give your poll a name.').max(80),
  questions: z
    .array(z.object({ text: z.string().min(2, 'Question is too short.').max(200) }))
    .min(1, 'Add at least one question.')
    .max(5, 'You can add up to 5 questions.'),
});

type FormValues = z.infer<typeof schema>;

export function CreatePollPage() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', questions: [{ text: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });
  const watchedName = useWatch({ control, name: 'name' }) || '';
  const watchedQuestions = useWatch({ control, name: 'questions' }) || [];

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { shareUrl: url } = await createPrivatePoll({
        name: values.name,
        questions: values.questions.map((q) => q.text),
      });
      setShareUrl(`${window.location.origin}${url}`);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (shareUrl) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-made/15 text-made mb-5">
            <Check className="size-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
            Your poll is live
          </h1>
          <p className="text-ink-soft dark:text-paper/60 mb-7">
            Share this link with friends. The poll closes automatically after 5 votes.
          </p>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between rounded-xl border-2 border-dashed border-made bg-made/5 px-4 py-3 mb-4 transition-colors hover:bg-made/10 text-left"
          >
            <span className="text-sm font-medium truncate">{shareUrl}</span>
            {copied ? <Check className="size-4 text-made shrink-0 ml-2" /> : <Copy className="size-4 text-made shrink-0 ml-2" />}
          </button>

          <a href={shareUrl}>
            <Button className="w-full">
              View Poll <ArrowRight className="size-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-2">
          Create Your Own Poll
        </h1>
        <p className="text-ink-soft dark:text-paper/60 mb-8">
          Ask up to 5 questions, get a shareable link, and watch the verdict roll in. No account
          needed.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Poll name"
            placeholder="Should I get bangs?"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium">Questions</label>
              <span className="text-xs text-ink-soft dark:text-paper/50">{fields.length}/5</span>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder={`Question ${index + 1}`}
                    error={errors.questions?.[index]?.text?.message}
                    {...register(`questions.${index}.text`)}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="shrink-0 size-10 rounded-xl flex items-center justify-center text-fade hover:bg-fade/10 transition-colors"
                      aria-label="Remove question"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {fields.length < 5 && (
              <button
                type="button"
                onClick={() => append({ text: '' })}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-made hover:text-made-deep"
              >
                <Plus className="size-4" /> Add question
              </button>
            )}
            {errors.questions?.root && (
              <p className="mt-1.5 text-xs text-fade font-medium">{errors.questions.root.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Creating…' : 'Generate Poll Link'}
          </Button>
        </form>
      </div>

      {/* Live preview — fills the wide desktop viewport and previews the
          ballot-style voting card the recipient will actually see. */}
      <div className="hidden lg:block sticky top-24">
        <PollPreview name={watchedName} questions={watchedQuestions} />
      </div>
    </div>
  );
}

function PollPreview({ name, questions }: { name: string; questions: { text: string }[] }) {
  const firstQuestion = questions.find((q) => q.text.trim().length > 0)?.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-card border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-7 shadow-sm"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-paper/50 mb-3">
        Live preview
      </div>
      <h3 className="font-display font-extrabold text-2xl tracking-tight mb-4 min-h-[2.5rem]">
        {name.trim() || 'Your poll name'}
      </h3>
      <p className="font-heading font-bold text-lg mb-6 min-h-[3.5rem]">
        {firstQuestion || 'Your first question will show up here as you type.'}
      </p>
      <div className="grid grid-cols-2 gap-3 pointer-events-none">
        <div className="rounded-2xl bg-made/10 dark:bg-made/15 py-7 text-center font-display font-extrabold text-xl text-made">
          MADE
        </div>
        <div className="rounded-2xl bg-fade/10 dark:bg-fade/15 py-7 text-center font-display font-extrabold text-xl text-fade">
          FADE
        </div>
      </div>
      <p className="mt-5 text-xs text-ink-soft dark:text-paper/50 text-center">
        This is what your friends will see when they open the link.
      </p>
    </motion.div>
  );
}
