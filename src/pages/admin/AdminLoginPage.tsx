import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../services/auth';
import { getErrorMessage } from '../../services/api';

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type FormValues = z.infer<typeof schema>;

export function AdminLoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const admin = await login(values.email, values.password);
      setAdmin(admin);
      const from = (location.state as { from?: Location })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-paper dark:bg-ink">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-ink dark:bg-paper text-paper dark:text-ink mb-4">
            <Lock className="size-5" />
          </div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Admin Login</h1>
          <p className="text-sm text-ink-soft dark:text-paper/60 mt-1">
            Made<span className="text-made">or</span>Fade dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            placeholder="admin@madeorfade.app"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {serverError && (
            <p className="text-sm text-fade font-medium text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
