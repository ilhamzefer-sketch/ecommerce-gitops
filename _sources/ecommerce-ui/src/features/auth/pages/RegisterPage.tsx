import { CheckCircle2, ContactRound, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../../shared/api/api-error";
import { hasErrors, isEmail, mapDetailsToErrors, minLength, required, type ValidationErrors } from "../../../shared/forms/validation";
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { PasswordField } from "../../../shared/ui/PasswordField";
import { TextField } from "../../../shared/ui/TextField";
import { register } from "../auth-api";

type RegisterField = "username" | "email" | "phoneNumber" | "firstName" | "lastName" | "password" | "confirmPassword";

export function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<ValidationErrors<RegisterField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors: ValidationErrors<RegisterField> = {
      username:
        required(form.username, "İstifadəçi adını daxil edin.") ??
        minLength(form.username, 3, "İstifadəçi adı ən azı 3 simvol olmalıdır."),
      email: required(form.email, "E-poçt ünvanını daxil edin.") ?? (isEmail(form.email) ? undefined : "E-poçt formatı düzgün deyil."),
      phoneNumber: required(form.phoneNumber, "Telefon nömrəsini daxil edin."),
      firstName: required(form.firstName, "Adınızı daxil edin."),
      lastName: required(form.lastName, "Soyadınızı daxil edin."),
      password:
        required(form.password, "Şifrəni daxil edin.") ??
        minLength(form.password, 8, "Şifrə ən azı 8 simvol olmalıdır."),
      confirmPassword:
        required(form.confirmPassword, "Şifrə təsdiqini daxil edin.") ??
        (form.password === form.confirmPassword ? undefined : "Şifrələr uyğun gəlmir.")
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
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim()
      });
      setSuccessMessage("Qeydiyyat tamamlandı. E-poçtunuzu yoxlayın və sonra giriş edin.");
    } catch (error) {
      setFormError(getFriendlyErrorMessage(error, "Məlumatları yoxlayın və yenidən cəhd edin."));
      if (error && typeof error === "object" && "details" in error) {
        setErrors(
          mapDetailsToErrors<RegisterField>((error as { details?: Record<string, string> }).details, [
            "username",
            "email",
            "phoneNumber",
            "firstName",
            "lastName",
            "password",
            "confirmPassword"
          ])
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-stage auth-stage--register auth-card--entrance">
      <figure className="auth-stage__media auth-stage__media--register">
        <img src="/assets/editorial/auth-still-life.jpg" alt="Yerli ustaların hazırladığı keramika və taxta ev əşyaları" width="1052" height="1536" />
        <figcaption><ShieldCheck aria-hidden="true" /><span><strong>Bir hesab, iki imkan</strong>Alıcı kimi davam edin və istədiyiniz zaman mağaza üçün müraciət edin.</span></figcaption>
      </figure>
      <section className="auth-workspace auth-workspace--register" aria-labelledby="register-title">
        <div className="auth-workspace__intro">
          <p className="eyebrow">Yeni Mizan hesabı</p>
          <h1 id="register-title">Yeni hesab yaradın</h1>
          <p>Alış-veriş və gələcək mağazanız üçün vahid hesab yaradın.</p>
        </div>
        {formError ? <Notice tone="danger" message={formError} /> : null}
        {successMessage ? <Notice tone="success" title="Qeydiyyat tamamlandı" message={successMessage} /> : null}
        {successMessage ? (
          <p className="auth-switch">
            Növbəti addım: <Link to="/login">daxil olun</Link>
          </p>
        ) : null}
        <form className="form-stack auth-register-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="auth-form-group">
            <legend>Hesab məlumatları</legend>
            <TextField
              label="İstifadəçi adı"
              name="username"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              error={errors.username}
              autoComplete="username"
              leading={<UserRound size={18} aria-hidden="true" />}
            />
            <TextField
              label="E-poçt"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              error={errors.email}
              autoComplete="email"
              leading={<Mail size={18} aria-hidden="true" />}
            />
            <TextField
              label="Telefon nömrəsi"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
              error={errors.phoneNumber}
              autoComplete="tel"
              placeholder="+994 50 123 45 67"
              leading={<Phone size={18} aria-hidden="true" />}
            />
          </fieldset>
          <fieldset className="auth-form-group">
            <legend>Şəxsi məlumatlar</legend>
            <TextField
              label="Ad"
              name="firstName"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              error={errors.firstName}
              autoComplete="given-name"
              leading={<ContactRound size={18} aria-hidden="true" />}
            />
            <TextField
              label="Soyad"
              name="lastName"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              error={errors.lastName}
              autoComplete="family-name"
              leading={<ContactRound size={18} aria-hidden="true" />}
            />
          </fieldset>
          <fieldset className="auth-form-group">
            <legend>Şifrə yaradın</legend>
          <PasswordField
            label="Şifrə"
            name="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            error={errors.password}
            autoComplete="new-password"
            leading={<LockKeyhole size={18} aria-hidden="true" />}
            helperText="Ən azı 8 simvol istifadə edin."
          />
          <PasswordField
            label="Şifrə təkrarı"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
            leading={<LockKeyhole size={18} aria-hidden="true" />}
          />
          </fieldset>
          <Button fullWidth type="submit" isLoading={isSubmitting} icon={<CheckCircle2 size={19} />}>
            Hesab yarat
          </Button>
        </form>
        <p className="auth-switch auth-switch--left">
          Artıq hesabınız var? <Link to="/login">Daxil olun</Link>
        </p>
      </section>
    </div>
  );
}
