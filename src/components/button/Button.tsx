import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { BUTTON_VARIANT_ENUM, BUTTON_SIZE_ENUM, BUTTON_BORDER_RADIUS_ENUM } from "@/shared/enums";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BUTTON_VARIANT_ENUM;
  size?: BUTTON_SIZE_ENUM;
  borderRadius?: BUTTON_BORDER_RADIUS_ENUM;
  isLoading?: boolean;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = BUTTON_VARIANT_ENUM.PRIMARY,
  size = BUTTON_SIZE_ENUM.DEFAULT,
  borderRadius = BUTTON_BORDER_RADIUS_ENUM.DEFAULT,
  isLoading = false,
  icon,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  
  const variantStyles = {
    [BUTTON_VARIANT_ENUM.PRIMARY]:
      "bg-primary text-white border-transparent hover:bg-primary/90 hover:shadow-lg focus:ring-primary/50",
    [BUTTON_VARIANT_ENUM.PRIMARY_GRADIENT]:
      "bg-gradient-to-br from-primary to-[#e54400] text-white border-transparent hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 focus:ring-primary/50",
    [BUTTON_VARIANT_ENUM.WHITE]:
      "bg-white text-secondary border border-gray-200 hover:bg-gray-50 active:bg-gray-100 hover:shadow-md focus:ring-gray-200",
    [BUTTON_VARIANT_ENUM.SECONDARY]:
      "bg-secondary text-white border-transparent hover:bg-secondary/95 hover:shadow-lg focus:ring-secondary/50",
    [BUTTON_VARIANT_ENUM.TERTIARY]:
      "bg-transparent text-secondary border-transparent hover:bg-gray-100 focus:ring-gray-200",
    [BUTTON_VARIANT_ENUM.TERTIARY_PRIMARY]:
      "bg-transparent text-primary border-transparent hover:bg-primary/5 ring-2 ring-primary/20",
    [BUTTON_VARIANT_ENUM.TERTIARY_WHITE]:
      "bg-transparent text-white border-transparent hover:bg-white/10 focus:ring-white/20",
  };

  const sizeStyles = {
    [BUTTON_SIZE_ENUM.DEFAULT]: "px-5 py-2.5 text-sm font-semibold",
    [BUTTON_SIZE_ENUM.SMALL]: "px-4 py-1.5 text-xs font-medium",
    [BUTTON_SIZE_ENUM.LARGE]: "px-7 py-3.5 text-base font-bold",
  };

  const radiusStyles = {
    [BUTTON_BORDER_RADIUS_ENUM.DEFAULT]: "rounded-lg",
    [BUTTON_BORDER_RADIUS_ENUM.SMALL]: "rounded",
    [BUTTON_BORDER_RADIUS_ENUM.FULL]: "rounded-full",
  };

  const isBtnDisabled = disabled || isLoading;
  const renderedLeftIcon = icon || leftIcon;

  return (
    <button
      disabled={isBtnDisabled}
      className={`
        inline-flex items-center justify-center gap-2 border cursor-pointer outline-none select-none transition-all duration-200
        focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant] || variantStyles[BUTTON_VARIANT_ENUM.PRIMARY]}
        ${sizeStyles[size] || sizeStyles[BUTTON_SIZE_ENUM.DEFAULT]}
        ${radiusStyles[borderRadius] || radiusStyles[BUTTON_BORDER_RADIUS_ENUM.DEFAULT]}
        ${className}
      `.trim()}
      {...props}
    >
      {isLoading ? (
        <ImSpinner2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
      ) : (
        renderedLeftIcon && <span className="flex items-center">{renderedLeftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;