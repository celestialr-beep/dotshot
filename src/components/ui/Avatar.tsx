import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  objectPosition?: 'top' | 'center' | 'bottom'
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

const positions = {
  top:    'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ src, name, size = 'md', className, objectPosition = 'top' }: AvatarProps) {
  const sizeClass = sizes[size]

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizeClass, className)}>
        <Image
          src={src}
          alt={name}
          fill
          className={cn('object-cover', positions[objectPosition])}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex-shrink-0 flex items-center justify-center font-bold bg-gradient-to-br from-gold to-gold-dark text-dark',
        sizeClass,
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
