'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { referralsService } from '@/services/referrals.service';
import { extractErrorMessage } from '@/lib/api-client';
import { StatStrip } from '@/components/dashboard/stat-strip';
import { MyCodeCard } from '@/components/dashboard/my-code-card';
import { InviteDialog } from '@/components/dashboard/invite-dialog';
import { ReferralTreeView } from '@/components/dashboard/referral-tree-view';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReferralStats, TreeNode } from '@/types';

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);

  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [depth, setDepth] = useState(5);
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user) return;
    setLoadingStats(true);
    try {
      const data = await referralsService.getStats(user.schoolId, user.id);
      setStats(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingStats(false);
    }
  }, [user]);

  const loadTree = useCallback(
    async (nextDepth: number) => {
      if (!user) return;
      setLoadingTree(true);
      try {
        const data = await referralsService.getTree(user.schoolId, nextDepth);
        setTree(data);
      } catch (err) {
        toast.error(extractErrorMessage(err));
      } finally {
        setLoadingTree(false);
      }
    },
    [user],
  );

  useEffect(() => {
    loadStats();
    loadTree(depth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleDepthChange(nextDepth: number) {
    setDepth(nextDepth);
    loadTree(nextDepth);
  }

  function handleInvited() {
    loadStats();
    loadTree(depth);
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Referral network</h1>
          <p className="mt-1 text-sm text-stone-500">Signed in as {user.name}</p>
        </div>
        <InviteDialog
          schoolId={user.schoolId}
          schoolName="your school"
          referralCode={user.referralCode}
          onInvited={handleInvited}
        />
      </div>

      {loadingStats || !stats ? (
        <div className="flex gap-3">
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
        </div>
      ) : (
        <StatStrip stats={stats} />
      )}

      <MyCodeCard code={user.referralCode} />

      <ReferralTreeView
        tree={tree}
        loading={loadingTree}
        depth={depth}
        onDepthChange={handleDepthChange}
        currentUserId={user.id}
      />
    </div>
  );
}
