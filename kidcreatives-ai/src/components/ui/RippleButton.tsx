import { motion, HTMLMotionProps } from 'framer-motion'
import { createRipple } from '@/lib/microInteractions'
import { cn } from '@/lib/utils'

interface RippleButtonProps extends Omit<HTMLMotionProps<'button'>, 'onClick'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'gradient-blue' | 'gradient-green'
  rippleColor?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function RippleButton({
  children,
  variant = 'primary',
  rippleColor,
  className,
  onClick,
  ...props
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Don't create ripple if button is disabled
    if (!props.disabled) {
      createRipple(e, rippleColor)
    }
    onClick?.(e)
  }

  const variantClasses = {
    primary: 'bg-subject-blue hover:bg-subject-blue-600 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-subject-blue border-2 border-subject-blue',
    'gradient-blue': 'bg-gradient-to-r from-subject-blue to-subject-blue-600 text-white shadow-blue',
    'gradient-green': 'bg-gradient-to-r from-action-green to-action-green-600 text-white shadow-green'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        'ripple-enabled relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
