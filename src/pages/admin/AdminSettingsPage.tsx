import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export function AdminSettingsPage() {
  const { admin } = useAuth();

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">
        Settings
      </h1>

      <Card className="p-5 max-w-md">
        <h2 className="font-heading font-bold mb-4">Account</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft dark:text-paper/60">Name</dt>
            <dd className="font-medium">{admin?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft dark:text-paper/60">Email</dt>
            <dd className="font-medium">{admin?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft dark:text-paper/60">Role</dt>
            <dd className="font-medium capitalize">{admin?.role}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
