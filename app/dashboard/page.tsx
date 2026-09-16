"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Share2, Building2 } from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { referralsService } from "@/services/referrals.service";
import { extractErrorMessage } from "@/lib/api-client";

import { StatStrip } from "@/components/dashboard/stat-strip";
import { MyCodeCard } from "@/components/dashboard/my-code-card";
import { InviteDialog } from "@/components/dashboard/invite-dialog";
import { ReferralTreeView } from "@/components/dashboard/referral-tree-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import type { ReferralStats, TreeNode } from "@/types";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);

  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [depth, setDepth] = useState(5);

  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Controls the InviteDialog
  const [inviteOpen, setInviteOpen] = useState(false);

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
    if (!user) return;

    loadStats();
    loadTree(depth);
  }, [user, depth, loadStats, loadTree]);

  function handleDepthChange(nextDepth: number) {
    setDepth(nextDepth);
  }

  function handleInvited() {
    loadStats();
    loadTree(depth);
    setInviteOpen(false);
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl text-ink">Referral network</h1>
          <p className="text-sm text-stone-500">
            Signed in as{" "}
            <span className="font-medium text-stone-700">{user.name}</span>
          </p>

          {/* 👇 School Badge - Dedicated & Highlighted */}
          {user.school && (
            <div className="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 border border-stone-200">
              <Building2 className="h-4 w-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">
                {user.school.name}
              </span>
            </div>
          )}
        </div>

        {/* Invite button */}
        <Button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="shrink-0 bg-stone-900 text-stone-50 hover:bg-stone-800"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Invite someone
        </Button>

        {/* Invite dialog */}
        <InviteDialog
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          referralCode={user.referralCode}
        />
      </div>

      {/* Stats */}
      {loadingStats || !stats ? (
        <div className="flex gap-3">
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
        </div>
      ) : (
        <StatStrip stats={stats} />
      )}

      {/* My referral code */}
      <MyCodeCard code={user.referralCode} />

      {/* Referral tree */}
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
