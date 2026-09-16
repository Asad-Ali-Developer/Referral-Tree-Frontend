import { Card } from '@/components/ui/card';
import type { ReferralStats } from '@/types';

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card className="flex-1 px-5 py-4">
      <p className="font-serif text-3xl text-ink">{value}</p>
      <p className="mt-0.5 text-sm text-stone-500">{label}</p>
    </Card>
  );
}

export function StatStrip({ stats }: { stats: ReferralStats }) {
  const levels = Object.entries(stats.referralsByLevel).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Stat value={stats.directReferrals} label="Direct referrals" />
        <Stat value={stats.totalReferrals} label="Total in network" />
      </div>
      {levels.length > 0 && (
        <Card className="px-5 py-4">
          <p className="text-sm text-stone-500">By level</p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {levels.map(([level, count]) => (
              <span key={level} className="text-sm text-ink">
                Level {level} <span className="text-stone-400">·</span> {count}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
