import { AlertCircle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

type NoticeTone = "info" | "success" | "warning" | "danger";

type NoticeProps = {
  title?: string;
  message: string;
  tone?: NoticeTone;
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: ShieldAlert
};

export function Notice({ title, message, tone = "info" }: NoticeProps) {
  const Icon = icons[tone];

  return (
    <div className={`notice notice--${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <Icon className="notice__icon" size={20} aria-hidden="true" />
      <div>
        {title ? <p className="notice__title">{title}</p> : null}
        <p className="notice__message">{message}</p>
      </div>
    </div>
  );
}
