import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';

interface UnlockOfferModalProps {
  open: boolean;
  onClose: () => void;
  emailRequired: boolean;
  onSubmit: (email?: string) => Promise<{ discountCode: string; buttonText: string; affiliateUrl: string; disclosure: string } | null>;
  onShopNowClick?: () => void;
}

export function UnlockOfferModal({ open, onClose, emailRequired, onSubmit, onShopNowClick }: UnlockOfferModalProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState<{ discountCode: string; buttonText: string; affiliateUrl: string; disclosure: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRequired && !email.includes('@')) {
      showToast('Enter a valid email to unlock this offer.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const result = await onSubmit(email || undefined);
      setRevealed(result);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!revealed) return;
    navigator.clipboard.writeText(revealed.discountCode);
    setCopied(true);
    showToast('Code copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setRevealed(null);
    setEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-sm rounded-card bg-white dark:bg-ink border border-line dark:border-white/10 p-6 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-ink-soft hover:text-ink dark:hover:text-paper"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {!revealed ? (
              <form onSubmit={handleSubmit}>
                <div className="inline-flex size-10 items-center justify-center rounded-full bg-amber/15 text-amber mb-4">
                  <Mail className="size-5" />
                </div>
                <h3 className="font-display font-extrabold text-xl mb-1">Unlock your discount</h3>
                <p className="text-sm text-ink-soft dark:text-paper/60 mb-5">
                  {emailRequired
                    ? "Drop your email and we'll send your code straight to your inbox."
                    : 'Grab your exclusive discount code below.'}
                </p>

                {emailRequired && (
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="mb-4"
                  />
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Unlocking…' : 'Unlock Offer'}
                </Button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-flex size-10 items-center justify-center rounded-full bg-made/15 text-made mb-4">
                  <Check className="size-5" />
                </div>
                <h3 className="font-display font-extrabold text-xl mb-1">Your code is ready 🎉</h3>
                <p className="text-sm text-ink-soft dark:text-paper/60 mb-4">
                  {emailRequired ? "We've also sent this to your email." : 'Use this code at checkout.'}
                </p>

                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between rounded-xl border-2 border-dashed border-made bg-made/5 px-4 py-3 mb-4 transition-colors hover:bg-made/10"
                >
                  <span className="font-display font-extrabold tracking-wider text-made">
                    {revealed.discountCode}
                  </span>
                  {copied ? <Check className="size-4 text-made" /> : <Copy className="size-4 text-made" />}
                </button>

                <a
                  href={revealed.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={onShopNowClick}
                >
                  <Button className="w-full">
                    {revealed.buttonText} <ExternalLink className="size-4" />
                  </Button>
                </a>

                <p className="mt-3 text-[11px] text-ink-soft dark:text-paper/40 text-center leading-relaxed">
                  {revealed.disclosure}
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
