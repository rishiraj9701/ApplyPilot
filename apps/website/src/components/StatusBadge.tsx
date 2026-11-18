export interface StatusBadgeProps {
  status: 'In Development' | 'Planned' | 'Researching' | 'Local-First' | 'Open Source' | 'Human in Loop';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const styles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    'In Development': {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400 animate-pulse',
    },
    'Planned': {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/20',
      dot: 'bg-cyan-400',
    },
    'Researching': {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
    },
    'Local-First': {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-300',
    },
    'Open Source': {
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      border: 'border-purple-500/20',
      dot: 'bg-purple-400',
    },
    'Human in Loop': {
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      border: 'border-blue-500/20',
      dot: 'bg-blue-400',
    },
  };

  const current = styles[status] || styles['Planned'];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}
