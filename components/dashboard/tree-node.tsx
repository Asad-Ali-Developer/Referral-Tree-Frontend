import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types";
import { Users } from "lucide-react";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TreeNodeView({
  node,
  currentUserId,
  isRoot = false,
}: {
  node: TreeNode;
  currentUserId?: string;
  isRoot?: boolean;
}) {
  const hasChildren = node.children.length > 0;
  const isYou = node.id === currentUserId;

  return (
    <li className={cn("relative", !isRoot && "pl-8")}>
      {/* Horizontal connector from parent */}
      {!isRoot && (
        <span
          className="absolute left-0 top-7 h-px w-8 bg-stone-200"
          aria-hidden="true"
        />
      )}

      {/* Person node */}
      <div
        className={cn(
          "group relative flex w-fit min-w-[240px] items-center gap-3 rounded-xl border px-3.5 py-3 transition-all",
          isYou
            ? "border-stone-900 bg-stone-900 text-white shadow-sm"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm",
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            isYou ? "bg-white text-stone-900" : "bg-stone-100 text-stone-700",
          )}
        >
          {getInitials(node.name)}
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "truncate text-sm font-medium",
                isYou ? "text-white" : "text-stone-900",
              )}
            >
              {node.name}
            </p>

            {isYou && (
              <Badge className="shrink-0 border-0 bg-white/15 text-[10px] text-white hover:bg-white/15">
                You
              </Badge>
            )}
          </div>

          <p
            className={cn(
              "mt-0.5 text-xs",
              isYou ? "text-white/60" : "text-stone-500",
            )}
          >
            {hasChildren
              ? `${node.children.length} direct ${
                  node.children.length === 1 ? "referral" : "referrals"
                }`
              : "No direct referrals"}
          </p>
        </div>

        {/* Children count */}
        {hasChildren && (
          <div
            className={cn(
              "flex h-7 min-w-7 items-center justify-center gap-1 rounded-full px-2 text-xs",
              isYou ? "bg-white/10 text-white" : "bg-stone-100 text-stone-600",
            )}
          >
            <Users className="h-3.5 w-3.5" />
            <span>{node.children.length}</span>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <ul className="relative ml-5 mt-3 space-y-3 border-l border-stone-200 pl-0">
          {node.children.map((child) => (
            <TreeNodeView
              key={child.id}
              node={child}
              currentUserId={currentUserId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
