import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DotshotLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  textColor?: 'dark' | 'light'
  className?: string
  href?: string
}

function PinIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pin body */}
      <path
        d="M50 2C27.9 2 10 19.9 10 42C10 65.5 50 118 50 118C50 118 90 65.5 90 42C90 19.9 72.1 2 50 2Z"
        fill="#D4A017"
      />
      {/* Outer ring */}
      <circle cx="50" cy="42" r="26" fill="white" fillOpacity="0.2" />
      {/* Middle ring */}
      <circle cx="50" cy="42" r="17" fill="white" fillOpacity="0.25" />
      {/* Inner ring */}
      <circle cx="50" cy="42" r="10" fill="white" fillOpacity="0.3" />
      {/* Center dot */}
      <circle cx="50" cy="42" r="5" fill="white" />
    </svg>
  )
}

const sizes = {
  sm: { pin: 24, text: 'text-base', gap: 'gap-1.5' },
  md: { pin: 32, text: 'text-xl', gap: 'gap-2' },
  lg: { pin: 44, text: 'text-3xl', gap: 'gap-2.5' },
}

export function DotshotLogo({
  size = 'md',
  showText = true,
  textColor = 'light',
  className,
  href = '/',
}: DotshotLogoProps) {
  const { pin, text, gap } = sizes[size]

  const content = (
    <div className={cn('flex items-center', gap, className)}>
      <div className="flex-shrink-0 drop-shadow-sm">
        <PinIcon size={pin} />
      </div>
      {showText && (
        <span
          className={cn(
            'font-black tracking-widest uppercase leading-none',
            text,
            textColor === 'light' ? 'text-white' : 'text-[#1a1a1a]'
          )}
        >
          DOTSHOT
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        <div className="group-hover:scale-105 transition-transform duration-200">
          {content}
        </div>
      </Link>
    )
  }

  return content
}
