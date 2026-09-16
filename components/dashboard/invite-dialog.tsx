"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Share2,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
}

export function InviteDialog({
  open,
  onOpenChange,
  referralCode,
}: InviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?ref=${encodeURIComponent(referralCode)}`
      : "";

  const shareText = `Join our school network using my referral link: ${shareLink}`;

  const handleCopy = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);

      setCopied(true);
      toast.success("Referral link copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy the referral link.");
    }
  };

  const handleShare = async () => {
    if (!shareLink) return;

    // Native share sheet on supported mobile browsers
    if (navigator.share) {
      try {
        setSharing(true);

        await navigator.share({
          title: "Join our school network",
          text: "Join using my referral link:",
          url: shareLink,
        });
      } catch (error) {
        // AbortError means the user simply closed the share sheet.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        toast.error("Unable to share the referral link.");
      } finally {
        setSharing(false);
      }

      return;
    }

    // Desktop/browser fallback
    await handleCopy();
  };

  const handleWhatsApp = () => {
    if (!shareLink) return;

    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-stone-200 bg-white">
        <DialogHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
            <Share2 className="h-5 w-5 text-stone-800" />
          </div>

          <div>
            <DialogTitle className="font-serif text-xl text-ink">
              Invite someone
            </DialogTitle>

            <DialogDescription className="mt-1.5 text-sm leading-6 text-stone-500">
              Share your personal referral link. Anyone who joins through it
              will be connected to your referral network.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Referral link */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
              <LinkIcon className="h-3.5 w-3.5" />
              Your referral link
            </div>

            <div className="break-all font-mono text-xs leading-5 text-stone-700">
              {shareLink}
            </div>
          </div>

          {/* Primary actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="h-11 bg-stone-900 text-stone-50 hover:bg-stone-800"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {sharing ? "Sharing..." : "Share link"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="h-11 border-stone-200"
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}

              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>

          {/* WhatsApp */}
          <Button
            type="button"
            variant="outline"
            onClick={handleWhatsApp}
            className="h-11 w-full border-stone-200"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>

          {/* Referral code */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="text-xs text-stone-500">Your referral code</div>

            <div className="mt-1 flex items-center justify-between gap-4">
              <span className="font-mono text-lg font-semibold tracking-wide text-stone-900">
                {referralCode}
              </span>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(referralCode);
                    toast.success("Referral code copied!");
                  } catch {
                    toast.error("Failed to copy referral code.");
                  }
                }}
                className="text-xs font-medium text-stone-500 transition hover:text-stone-900"
              >
                Copy code
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
