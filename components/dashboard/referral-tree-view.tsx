import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TreeNodeView } from "./tree-node";
import type { TreeNode } from "@/types";
import { Network, Users } from "lucide-react";

const DEPTH_OPTIONS = [
  { label: "1 level", value: 1 },
  { label: "2 levels", value: 2 },
  { label: "3 levels", value: 3 },
  { label: "4 levels", value: 4 },
  { label: "5 levels", value: 5 },
  { label: "Full network", value: 50 },
];

export function ReferralTreeView({
  tree,
  loading,
  depth,
  onDepthChange,
  currentUserId,
}: {
  tree: TreeNode[];
  loading: boolean;
  depth: number;
  onDepthChange: (depth: number) => void;
  currentUserId?: string;
}) {
  return (
    <Card className="overflow-hidden border-stone-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
            <Network className="h-5 w-5 text-stone-700" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Referral network
            </h2>

            <p className="mt-0.5 text-sm text-stone-500">
              View your network by referral level
            </p>
          </div>
        </div>

        <select
          value={depth}
          onChange={(e) => onDepthChange(Number(e.target.value))}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 font-medium text-stone-600 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
        >
          {DEPTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tree area */}
      <div className="overflow-x-auto p-5">
        {loading ? (
          <TreeSkeleton />
        ) : tree.length === 0 ? (
          <EmptyNetwork />
        ) : (
          <div className="min-w-max">
            {/* Tree legend */}
            <div className="mb-5 flex items-center gap-4 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-900" />
                <span>You</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-300" />
                <span>Referral</span>
              </div>
            </div>

            {/* Actual tree */}
            <ul className="space-y-4">
              {tree.map((root) => (
                <TreeNodeView
                  key={root.id}
                  node={root}
                  currentUserId={currentUserId}
                  isRoot
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

function TreeSkeleton() {
  return (
    <div className="min-w-[500px] space-y-4">
      {/* Root */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Level 2 */}
      <div className="ml-12 flex gap-4">
        <Skeleton className="h-20 w-56 rounded-xl" />
        <Skeleton className="h-20 w-56 rounded-xl" />
      </div>

      {/* Level 3 */}
      <div className="ml-24 flex gap-4">
        <Skeleton className="h-20 w-56 rounded-xl" />
        <Skeleton className="h-20 w-56 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyNetwork() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
        <Users className="h-5 w-5 text-stone-500" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-stone-900">
        Your network is empty
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-stone-500">
        Invite someone using your referral link and they&apos;ll appear in your
        network here.
      </p>
    </div>
  );
}
