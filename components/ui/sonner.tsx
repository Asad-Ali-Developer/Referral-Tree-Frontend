'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster"
      toastOptions={{
        classNames: {
          toast: 'rounded-md border border-border bg-white text-ink shadow-sm',
          description: 'text-stone-500',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-secondary text-foreground',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
