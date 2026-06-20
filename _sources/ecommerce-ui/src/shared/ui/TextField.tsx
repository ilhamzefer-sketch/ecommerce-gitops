import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
  trailing?: ReactNode;
};

export function TextField({ label, error, helperText, trailing, id, className = "", ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  const messageId = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={["field", className].filter(Boolean).join(" ")}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__control">
        <input
          id={inputId}
          className="field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          {...props}
        />
        {trailing ? <div className="field__trailing">{trailing}</div> : null}
      </div>
      {error ? (
        <p className="field__message field__message--error" id={messageId}>
          {error}
        </p>
      ) : helperText ? (
        <p className="field__message" id={messageId}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
