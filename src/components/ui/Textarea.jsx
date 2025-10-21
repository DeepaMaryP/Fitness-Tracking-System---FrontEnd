import React from "react";
import { Label } from "./Label";

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  rows = 4,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <Label>{label}</Label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
