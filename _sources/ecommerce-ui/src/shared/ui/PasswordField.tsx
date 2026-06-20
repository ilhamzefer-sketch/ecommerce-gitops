import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TextField } from "./TextField";
import type { InputHTMLAttributes } from "react";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
  helperText?: string;
};

export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={isVisible ? "text" : "password"}
      trailing={
        <button
          className="icon-button icon-button--field"
          type="button"
          aria-label={isVisible ? "Şifrəni gizlət" : "Şifrəni göstər"}
          onClick={() => setIsVisible((value) => !value)}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
