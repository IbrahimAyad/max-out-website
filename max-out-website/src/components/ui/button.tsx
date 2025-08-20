import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gold text-black hover:bg-gold/90 hover:shadow-md hover:scale-105 shadow-sm",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 hover:shadow-md shadow-sm",
        outline:
          "border-2 border-burgundy-300 bg-transparent text-burgundy-700 hover:bg-burgundy-50 hover:border-burgundy-400 shadow-sm hover:shadow-md",
        secondary:
          "bg-burgundy text-white hover:bg-burgundy-700 hover:shadow-md shadow-sm",
        ghost: "hover:bg-burgundy-50 hover:text-burgundy-700 text-burgundy-600",
        link: "text-burgundy-700 underline-offset-4 hover:underline hover:text-burgundy-800",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };