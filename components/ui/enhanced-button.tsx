"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./button"

interface EnhancedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  success?: boolean
  error?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText = "Loading...",
      success = false,
      error = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading
    
    const getButtonContent = () => {
      if (loading) {
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </>
        )
      }
      
      if (success) {
        return (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Success
          </>
        )
      }
      
      if (error) {
        return (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Error
          </>
        )
      }
      
      return children
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          success && "bg-green-600 hover:bg-green-700 text-white",
          error && "bg-red-600 hover:bg-red-700 text-white"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {getButtonContent()}
      </Comp>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }
