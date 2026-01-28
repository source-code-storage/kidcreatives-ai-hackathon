import * as React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const codeBlockVariants = cva(
  "inline-block px-4 py-2 rounded-lg font-mono text-sm font-medium shadow-md",
  {
    variants: {
      variant: {
        subject: "bg-subject-blue text-white",
        variable: "bg-variable-purple text-white",
        context: "bg-context-orange text-white",
      },
    },
    defaultVariants: {
      variant: "variable",
    },
  }
)

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeBlockVariants> {
  variable: string
  value: string
  delay?: number
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, variant, variable, value, delay = 0 }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
        className={cn(codeBlockVariants({ variant, className }))}
      >
        <span className="opacity-70">{variable}:</span>{' '}
        <span className="font-bold">{value}</span>
      </motion.div>
    )
  }
)
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock, codeBlockVariants }
