import { MailCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../../shared/api/api-error";
import { hasErrors, isEmail, mapDetailsToErrors, required, type ValidationErrors } from "../../../shared/forms/validation";
import { BrandMark } from "../../../shared/ui/BrandMark";
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { TextField } from "../../../shared/ui/TextField";
import { forgotPassword } from "../auth-api";

type ForgotPasswordField = "email";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ValidationErrors<ForgotPasswordField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: ValidationErrors<ForgotPasswordField> = {
      email: required(email, "E-poçt ünvanını daxil edin.") ?? (isEmail(email) ? undefined : "E-poçt formatı düzgün deyil.")
    };
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword({ email: email.trim() });
      setSuccessMessage("Əgər bu e-poçt sistemdə varsa, şifrə bərpa keçidi göndərildi.");
    } catch (error) {
      setFormError(getFriendlyErrorMessage(error, "E-poçt ünvanını yoxlayın və yenidən cəhd edin."));
      if (error && typeof error === "object" && "details" in error) {
        setErrors(mapDetailsToErrors<ForgotPasswordField>((error as { details?: Record<string, string> }).details, ["email"]));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card auth-card--entrance" aria-labelledby="forgot-title">
      <BrandMark />
      <div className="auth-card__header">
        <h1 id="forgot-title">Şifrə bərpası</h1>
        <p>E-poçt ünvanınızı daxil edin. Əgər hesab mövcuddursa, bərpa təlimatı göndəriləcək.</p>
      </div>
      {formError ? <Notice tone="danger" message={formError} /> : null}
      {successMessage ? <Notice tone="success" message={successMessage} /> : null}
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <TextField
          label="E-poçt"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Button fullWidth type="submit" isLoading={isSubmitting} icon={<MailCheck size={19} />}>
          Təlimatı göndər
        </Button>
      </form>
      <p className="auth-switch">
        Şifrə yadınıza düşdü? <Link to="/login">Daxil olun</Link>
      </p>
    </section>
  );
}
