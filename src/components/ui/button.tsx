import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-3",
    "whitespace-nowrap",
    "font-sans",
    "font-semibold",
    "uppercase",
    "tracking-[0.16em]",
    "transition-all",
    "duration-300",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[var(--color-rose)]",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-charcoal)]",
          "text-white",
          "border",
          "border-[var(--color-charcoal)]",
          "hover:bg-[var(--color-charcoal-soft)]",
          "hover:border-[var(--color-charcoal-soft)]",
        ],

        secondary: [
          "bg-transparent",
          "text-[var(--color-charcoal)]",
          "border",
          "border-[var(--color-charcoal)]",
          "hover:bg-[var(--color-charcoal)]",
          "hover:text-white",
        ],

        rose: [
          "bg-[var(--color-rose)]",
          "text-[var(--color-charcoal)]",
          "border",
          "border-[var(--color-rose)]",
          "hover:bg-[var(--color-rose-dark)]",
          "hover:border-[var(--color-rose-dark)]",
        ],

        darkOutline: [
          "bg-transparent",
          "text-white",
          "border",
          "border-white/45",
          "hover:bg-white",
          "hover:text-[var(--color-charcoal)]",
          "hover:border-white",
        ],
      },

      size: {
        sm: "min-h-10 px-4 text-[8px]",
        md: "min-h-12 px-5 text-[9px]",
        lg: "min-h-14 px-7 text-[9px]",
        xl: "min-h-16 px-8 text-[10px]",
      },

      rounded: {
        none: "rounded-none",
        soft: "rounded-sm",
        pill: "rounded-full",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "none",
    },
  }
);

type BaseProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

export function Button({
  children,
  className,
  variant,
  size,
  rounded,
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
          rounded,
        }),
        className
      )}
      {...props}
    >
      <span>{children}</span>

      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  className,
  variant,
  size,
  rounded,
  icon,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group",
        buttonVariants({
          variant,
          size,
          rounded,
        }),
        className
      )}
      {...props}
    >
      <span>{children}</span>

      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </Link>
  );
}

export { buttonVariants };