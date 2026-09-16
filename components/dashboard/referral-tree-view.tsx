import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TreeNodeView } from './tree-node';
import type { TreeNode } from '@/types';

const DEPTH_OPTIONS = [
  { label: '3 levels', value: 3 },
  { label: '5 levels', value: 5 },
  { label: 'Full network', value: 50 },
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
    <Card>
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-sm font-medium text-stone-600">Network</h2>
        <select
          value={depth}
          onChange={(e) => onDepthChange(Number(e.target.value))}
          className="rounded-sm border border-border bg-white px-2 py-1 text-sm text-stone-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {DEPTH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="ml-4 h-5 w-32" />
            <Skeleton className="ml-8 h-5 w-28" />
          </div>
        ) : tree.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-ink">No one&apos;s joined the network yet.</p>
            <p className="mt-1 text-sm text-stone-500">Once you invite someone, they&apos;ll show up here.</p>
          </div>
        ) : (
          <ul>
            {tree.map((root) => (
              <TreeNodeView key={root.id} node={root} currentUserId={currentUserId} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
