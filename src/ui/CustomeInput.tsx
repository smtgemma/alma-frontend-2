import React, { forwardRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      showPasswordToggle = false,
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",
      errorClassName = "",
      type = "text",
      id,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    const togglePasswordVisibility = () => {
      if (
        showPasswordToggle &&
        (type === "password" || inputType === "password")
      ) {
        setShowPassword(!showPassword);
        setInputType(showPassword ? "password" : "text");
      }
    };

    const baseInputClassName = `w-full px-3 py-2  border rounded-lg bg-[#F7F7F7] focus:outline-none focus:ring-1 focus:ring-primary ${
      error ? "border-red-500" : "border-gray-200"
    }`;

    const finalInputClassName = inputClassName
      ? `${baseInputClassName} ${inputClassName}`
      : baseInputClassName;

    return (
      <div className={`space-y-2 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className={`text-sm font-medium block ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={showPasswordToggle ? inputType : type}
            className={finalInputClassName}
            {...props}
          />

          {showPasswordToggle &&
            (type === "password" ||
              inputType === "password" ||
              inputType === "text") && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            )}
        </div>

        {error && (
          <p className={`text-red-500 text-xs ${errorClassName}`}>{error}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
