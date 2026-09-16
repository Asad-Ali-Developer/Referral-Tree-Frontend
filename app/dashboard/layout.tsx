import { AuthGuard } from '@/components/layout/auth-guard';
import { AppHeader } from '@/components/layout/app-header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </AuthGuard>
  );
}
