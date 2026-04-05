import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

const TYPE_STYLES = {
  success:
    "border-green-300/80 bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-200",
  error:
    "border-red-300/80 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-200",
  warning:
    "border-amber-300/80 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200",
  info: "border-sky-300/80 bg-sky-50 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200",
};

const TYPE_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TYPE_TITLES = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Notification",
};

const MessageBox = ({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}) => {
  const Icon = TYPE_ICONS[type] || Info;
  const styleClass = TYPE_STYLES[type] || TYPE_STYLES.info;

  if (!message) return null;

  return (
    <div
      className={`rounded-3xl border p-4 shadow-xl backdrop-blur-sm ${styleClass} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-2xl bg-white/80 p-2 text-current shadow-sm ring-1 ring-white/80 dark:bg-slate-950/80">
          <Icon size={20} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-sm tracking-wide uppercase text-current">
              {title || TYPE_TITLES[type]}
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1 text-current hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close notification"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-current">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
