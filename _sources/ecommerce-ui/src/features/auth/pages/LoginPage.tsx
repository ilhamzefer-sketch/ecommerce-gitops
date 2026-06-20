import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../../shared/api/api-error";
import { hasErrors, mapDetailsToErrors, required, type ValidationErrors } from "../../../shared/forms/validation";
import { BrandMark } from "../../../shared/ui/BrandMark";
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { TextField } from "../../../shared/ui/TextField";
import { normalizeRoles } from "../../account/account-types";
import { useAuth } from "../use-auth";

type LoginField = "usernameOrEmail" | "password";

type LocationState = {
  warning?: string;
  from?: string;
  sessionExpired?: boolean;
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors<LoginField>>({});
  const initialMessage = state?.warning ?? (state?.sessionExpired ? "Sessiyanız başa çatdı. Yenidən daxil olun." : null);
  const [formError, setFormError] = useState<string | null>(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: ValidationErrors<LoginField> = {
      usernameOrEmail: required(usernameOrEmail, "Email və ya istifadəçi adını daxil edin."),
      password: required(password, "Şifrəni daxil edin.")
    };

    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = await login({ usernameOrEmail: usernameOrEmail.trim(), password });
      const from = state?.from;
      const roles = normalizeRoles(profile.roles);
      navigate(from ?? (roles.includes("ROLE_ADMIN") ? "/admin" : "/account"), { replace: true });
    } catch (error) {
      setFormError(getFriendlyErrorMessage(error, "Daxil olma məlumatları düzgün deyil."));

      if (error && typeof error === "object" && "details" in error) {
        setErrors(mapDetailsToErrors<LoginField>((error as { details?: Record<string, string> }).details, ["usernameOrEmail", "password"]));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card auth-card--entrance" aria-labelledby="login-title">
      <BrandMark />
      <div className="auth-card__header">
        <h1 id="login-title">Hesabınıza daxil olun</h1>
        <p>Mizan.az-da hesabınıza təhlükəsiz daxil olun və mövcud xidmətlərdən istifadə edin.</p>
      </div>
      {formError ? <Notice tone={state?.sessionExpired ? "warning" : "danger"} message={formError} /> : null}
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email və ya istifadəçi adı"
          name="usernameOrEmail"
          value={usernameOrEmail}
          onChange={(event) => setUsernameOrEmail(event.target.value)}
          error={errors.usernameOrEmail}
          autoComplete="username"
          placeholder="Email və ya istifadəçi adınızı daxil edin"
        />
        <div className="field-row-label">
          <span>Şifrə</span>
          <Link to="/forgot-password">Şifrəni unutmusunuz?</Link>
        </div>
        <PasswordField
          label="Şifrə"
          className="field--compact-label"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          autoComplete="current-password"
          placeholder="Şifrənizi daxil edin"
        />
        <Button fullWidth type="submit" isLoading={isSubmitting} icon={<ArrowRight size={19} />}>
          Daxil ol
        </Button>
      </form>
      <p className="auth-switch">
        Hesabınız yoxdur? <Link to="/register">Qeydiyyatdan keçin</Link>
      </p>
    </section>
  );
}
