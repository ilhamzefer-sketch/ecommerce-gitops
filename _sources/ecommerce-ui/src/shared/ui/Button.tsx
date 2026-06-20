import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
};

export function Button({
  children,
  variant = "primary",
  icon,
  fullWidth = false,
  isLoading = false,
  disabled,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const classes = ["button", `button--${variant}`, fullWidth ? "button--full" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || isLoading} type={type} {...props}>
      {isLoading ? <span className="button__spinner" aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
}
