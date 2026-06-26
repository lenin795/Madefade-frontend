interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="block text-xs text-ink-soft dark:text-paper/50 mt-0.5">{description}</span>
        )}
      </span>
      <span
        className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-made' : 'bg-line dark:bg-white/15'
        }`}
      >
        <span
          className={`inline-block size-4.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}
