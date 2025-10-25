import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const base =
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    ghost: "text-blue-600 hover:bg-blue-50",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
