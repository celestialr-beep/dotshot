import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'outline' | 'success' | 'error' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'outline', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
        {
          'bg-gold/20 text-gold border-gold/40': variant === 'gold',
          'bg-transparent text-text-muted border-border-light': variant === 'outline',
          'bg-success/20 text-green-300 border-success/30': variant === 'success',
          'bg-error/20 text-red-300 border-error/30': variant === 'error',
          'bg-surface-2 text-text-faint border-border': variant === 'muted',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
