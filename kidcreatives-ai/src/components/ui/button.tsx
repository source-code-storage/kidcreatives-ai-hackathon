import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-action-green text-white hover:bg-action-green/90 hover:shadow-green hover:-translate-y-0.5",
        subject: "bg-subject-blue text-white hover:bg-subject-blue/90 hover:shadow-blue hover:-translate-y-0.5",
        variable: "bg-variable-purple text-white hover:bg-variable-purple/90 hover:shadow-purple hover:-translate-y-0.5",
        context: "bg-context-orange text-white hover:bg-context-orange/90 hover:shadow-orange hover:-translate-y-0.5",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-md",
        ghost: "hover:bg-gray-100",
        'gradient-blue': "bg-gradient-blue text-white hover:shadow-blue hover:-translate-y-0.5",
        'gradient-purple': "bg-gradient-purple text-white hover:shadow-purple hover:-translate-y-0.5",
        'gradient-orange': "bg-gradient-orange text-white hover:shadow-orange hover:-translate-y-0.5",
        'gradient-green': "bg-gradient-green text-white hover:shadow-green hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
