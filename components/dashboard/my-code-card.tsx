'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MyCodeCard({ code }: { code: string }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    toast.success('Code copied');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your referral code</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="font-mono text-base tracking-wide text-ink">{code}</span>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          Copy
        </Button>
      </CardContent>
    </Card>
  );
}
