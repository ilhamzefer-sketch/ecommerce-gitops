import { Check, LockKeyhole, Store, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../../shared/api/api-error";
import { hasErrors, mapDetailsToErrors, required, type ValidationErrors } from "../../../shared/forms/validation";
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
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors<LoginField>>({});
  const initialMessage = state?.warning ?? (state?.sessionExpired ? "Sessiyanız başa çatdı. Yenidən daxil olun." : null);
  const [formError, setFormError] = useState<string | null>(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: ValidationErrors<LoginField> = {
      usernameOrEmail: required(usernameOrEmail, "İstifadəçi adı, e-poçt və ya telefonu daxil edin."),
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
      navigate(from ?? (roles.includes("ROLE_ADMIN") ? "/choose-workspace" : "/choose-workspace"), { replace: true });
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
    <div className="auth-stage auth-stage--login auth-card--entrance">
      <figure className="auth-stage__media">
        <img src="/assets/editorial/auth-still-life.jpg" alt="Yerli ustaların hazırladığı keramika və taxta ev əşyaları" width="1052" height="1536" />
      </figure>
      <section className="auth-workspace" aria-labelledby="login-title">
        <div className="auth-workspace__intro">
          <p className="eyebrow">Mizan hesabı</p>
          <h1 id="login-title">Daxil olun</h1>
          <p>Bir hesabla məhsulları kəşf edin və mağaza açmaq üçün müraciət edin.</p>
        </div>
        <div className="auth-workspace__seller-note">
          <Store aria-hidden="true" />
          <p><strong>Satıcı olmaq istəyirsiniz?</strong><span>Mağazanız admin təsdiqindən sonra aktivləşir.</span></p>
        </div>
        {formError ? <Notice tone={state?.sessionExpired ? "warning" : "danger"} message={formError} /> : null}
        <form className="form-stack auth-workspace__form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="İstifadəçi adı, e-poçt və ya telefon"
            name="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(event) => setUsernameOrEmail(event.target.value)}
            error={errors.usernameOrEmail}
            autoComplete="username"
            placeholder="camal123, camal@example.com və ya +994…"
            leading={<UserRound size={19} aria-hidden="true" />}
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
            leading={<LockKeyhole size={18} aria-hidden="true" />}
          />
          <label className="login-oasis__remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span aria-hidden="true">{rememberMe ? <Check size={15} strokeWidth={2.5} /> : null}</span>
            Məni xatırla
          </label>
          <Button fullWidth type="submit" isLoading={isSubmitting}>
            Daxil ol
          </Button>
        </form>
        <p className="auth-switch auth-switch--left">
          Hesabınız yoxdur? <Link to="/register">Yeni hesab yaradın</Link>
        </p>
      </section>
    </div>
  );
}
