import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-[#4A8FA8] text-white hover:bg-[#3A7A91] focus:ring-[#4A8FA8]': variant === 'primary',
          'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300':
            variant === 'secondary',
          'text-gray-600 hover:bg-gray-100 focus:ring-gray-200': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400': variant === 'danger',
        },
        {
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
