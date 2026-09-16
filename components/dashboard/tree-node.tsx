import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { TreeNode } from '@/types';

export function TreeNodeView({
  node,
  currentUserId,
}: {
  node: TreeNode;
  currentUserId?: string;
}) {
  const hasChildren = node.children.length > 0;
  const isYou = node.id === currentUserId;

  return (
    <li className="relative">
      <div className="flex items-center gap-2 py-1.5">
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', isYou ? 'bg-moss' : 'bg-stone-300')} />
        <span className={cn('text-sm', isYou ? 'font-medium text-ink' : 'text-ink')}>{node.name}</span>
        {isYou && <Badge>You</Badge>}
      </div>
      {hasChildren && (
        <ul className="ml-[3px] border-l border-line pl-4">
          {node.children.map((child) => (
            <TreeNodeView key={child.id} node={child} currentUserId={currentUserId} />
          ))}
        </ul>
      )}
    </li>
  );
}
