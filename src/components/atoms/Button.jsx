import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary/5 hover:shadow-md",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:shadow-lg hover:shadow-success/50 hover:-translate-y-0.5 active:translate-y-0",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/50 hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "rounded-lg font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;