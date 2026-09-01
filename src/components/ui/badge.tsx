import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white shadow hover:bg-primary-600",
        secondary:
          "border-transparent bg-secondary-500 text-white hover:bg-secondary-600",
        destructive:
          "border-transparent bg-red text-white shadow hover:bg-red/80",
        outline: "text-light-2 border-white/20",
        glow: "border-primary-500/40 bg-primary-500/10 text-primary-500 shadow-glow",
        pinkGlow: "border-secondary-500/40 bg-secondary-500/10 text-secondary-500 shadow-glow-pink",
        cyanGlow: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan shadow-glow-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
