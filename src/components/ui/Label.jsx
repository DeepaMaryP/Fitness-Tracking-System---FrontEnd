import React from "react";

export const Label = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`}>
    {children}
  </label>
);
