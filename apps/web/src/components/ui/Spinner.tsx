import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'current' | 'primary' | 'gold' | 'white' | 'muted';
  label?: string;
}

const sizeClasses = {
  xs: 'w-3.5 h-3.5 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
};

const variantClasses = {
  current: 'border-current border-t-transparent',
  primary: 'border-obsidian-900 border-t-transparent',
  gold: 'border-gold border-t-transparent',
  white: 'border-white border-t-transparent',
  muted: 'border-obsidian-300 border-t-transparent',
};

export const Spinner = ({
  size = 'md',
  variant = 'current',
  label = 'Loading...',
  className,
  ...props
}: SpinnerProps) => {
  return (
    <span
      className={cn(
        'inline-block rounded-full animate-spin shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
};

Spinner.displayName = 'Spinner';
export default Spinner;
