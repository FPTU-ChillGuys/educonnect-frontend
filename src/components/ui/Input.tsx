import React, { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  leftIcon,
  rightIcon,
  showPasswordToggle,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPasswordToggle
    ? showPassword ? "text" : "password"
    : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-base font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 text-base
            py-3 px-4
            ${leftIcon ? "pl-12" : ""}
            ${(rightIcon || showPasswordToggle) ? "pr-12" : ""}
            ${error ? "border-red-300" : "border-gray-300"}
            ${className}
          `}
          type={inputType}
          {...props}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
        {rightIcon && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
