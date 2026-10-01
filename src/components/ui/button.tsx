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
    "tracking-[0.14em]",
    "transition-[background-color,border-color,color,opacity]",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[var(--color-accent)]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--color-bg)]",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-accent)]",
          "text-white",
          "border",
          "border-[var(--color-accent)]",
          "hover:bg-[var(--color-accent-dark)]",
          "hover:border-[var(--color-accent-dark)]",
          "hover:text-white",
          "active:bg-[var(--color-accent-active)]",
          "active:border-[var(--color-accent-active)]",
          "active:text-white",
        ],

        secondary: [
          "bg-transparent",
          "text-[var(--color-accent-dark)]",
          "border",
          "border-[var(--color-border-dark)]",
          "hover:bg-[var(--color-accent)]",
          "hover:border-[var(--color-accent)]",
          "hover:text-white",
          "active:bg-[var(--color-accent-active)]",
          "active:border-[var(--color-accent-active)]",
          "active:text-white",
        ],

        rose: [
          "bg-[var(--color-rose)]",
          "text-white",
          "border",
          "border-[var(--color-rose)]",
          "hover:bg-[var(--color-rose-dark)]",
          "hover:border-[var(--color-rose-dark)]",
          "hover:text-white",
        ],

        darkOutline: [
          "bg-transparent",
          "text-white",
          "border",
          "border-white/45",
          "hover:bg-white",
          "hover:text-[var(--color-accent-dark)]",
          "hover:border-white",
        ],
      },

      size: {
        sm: "min-h-10 px-4 text-[10px]",
        md: "min-h-11 px-5 text-[10px]",
        lg: "min-h-12 px-7 text-[11px]",
        xl: "min-h-[50px] px-8 text-[11px]",
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