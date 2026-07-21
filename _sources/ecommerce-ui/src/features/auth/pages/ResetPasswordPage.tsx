import { KeyRound, LockKeyhole } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApiError, getFriendlyErrorMessage } from "../../../shared/api/api-error";
import { hasErrors, mapDetailsToErrors, minLength, required, type ValidationErrors } from "../../../shared/forms/validation";
import { BrandMark } from "../../../shared/ui/BrandMark";
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { AuthVisualPanel } from "../components/AuthVisualPanel";
import { resetPassword } from "../auth-api";

type ResetPasswordField = "newPassword" | "confirmPassword";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors<ResetPasswordField>>({});
  const [formError, setFormError] = useState<string | null>(token ? null : "Şifrə yeniləmə tokeni tapılmadı.");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: ValidationErrors<ResetPasswordField> = {
      newPassword:
        required(newPassword, "Yeni şifrəni daxil edin.") ??
        minLength(newPassword, 8, "Şifrə ən azı 8 simvol olmalıdır."),
      confirmPassword:
        required(confirmPassword, "Şifrə təsdiqini daxil edin.") ??
        (newPassword === confirmPassword ? undefined : "Şifrələr uyğun gəlmir.")
    };
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(token ? null : "Şifrə yeniləmə tokeni tapılmadı.");
    setSuccessMessage(null);

    if (!token || !validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ token, newPassword });
      setSuccessMessage("Şifrəniz yeniləndi. İndi giriş edə bilərsiniz.");
    } catch (error) {
      const fallback =
        error instanceof ApiError && error.status === 401
          ? "Keçid linki etibarsızdır və ya vaxtı keçib."
          : "Məlumatları yoxlayın və yenidən cəhd edin.";
      setFormError(getFriendlyErrorMessage(error, fallback));
      if (error && typeof error === "object" && "details" in error) {
        setErrors(mapDetailsToErrors<ResetPasswordField>((error as { details?: Record<string, string> }).details, [
          "newPassword",
          "confirmPassword"
        ]));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell auth-shell--compact auth-card--entrance">
      <AuthVisualPanel
        eyebrow="Təhlükəsiz yeniləmə"
        title="Hesabınıza yeni açar təyin edin."
        description="Yeni şifrə təsdiqləndikdən sonra Mizan hesabınıza yenidən giriş edə bilərsiniz."
      />
      <section className="auth-form-panel auth-form-panel--compact" aria-labelledby="reset-title">
        <div className="auth-form-panel__brand">
          <BrandMark compact />
          <span>
            <strong>Mizan.az</strong>
            Yeni şifrə
          </span>
        </div>
        <div className="auth-card__header auth-card__header--split">
          <h1 id="reset-title">Şifrəni yeniləyin</h1>
          <p>Yeni şifrəniz ən azı 8 simvoldan ibarət olmalıdır.</p>
        </div>
        {formError ? <Notice tone="danger" message={formError} /> : null}
        {successMessage ? <Notice tone="success" message={successMessage} /> : null}
        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <PasswordField
            label="Yeni şifrə"
            name="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            error={errors.newPassword}
            autoComplete="new-password"
            leading={<LockKeyhole size={18} aria-hidden="true" />}
          />
          <PasswordField
            label="Yeni şifrə təkrarı"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
            leading={<LockKeyhole size={18} aria-hidden="true" />}
          />
          <Button fullWidth type="submit" isLoading={isSubmitting} icon={<KeyRound size={19} />}>
            Şifrəni yenilə
          </Button>
        </form>
        <p className="auth-switch">
          Hazırsınız? <Link to="/login">Daxil olun</Link>
        </p>
      </section>
    </div>
  );
}
