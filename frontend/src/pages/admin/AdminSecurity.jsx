import { useEffect, useState } from "react";
import { Shield, Lock, Key, AlertTriangle, Eye, Settings } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";
import {
  getSecuritySettings,
  updateSecuritySettings,
} from "../../api/adminSecurityApi";

const AdminSecurity = () => {
  const [activeTab, setActiveTab] = useState("password-policy");
  const [showConfirm, setShowConfirm] = useState(false);
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    ipWhitelist: [],
    ipBlacklist: [],
    alertOnFailedLogin: true,
    alertOnSuspiciousActivity: true,
    alertOnPasswordChange: false,
    alertEmail: "",
    auditEnabled: true,
    auditRetentionDays: 365,
    logSensitiveActions: true,
  });
  const [recentAuditEvents, setRecentAuditEvents] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await getSecuritySettings();
        setSettings({
          passwordMinLength: data.password_min_length,
          passwordRequireUppercase: data.password_require_uppercase,
          passwordRequireLowercase: data.password_require_lowercase,
          passwordRequireNumbers: data.password_require_numbers,
          passwordRequireSpecial: data.password_require_special,
          passwordExpiryDays: data.password_expiry_days,
          maxLoginAttempts: data.max_login_attempts,
          lockoutDuration: data.lockout_duration,
          ipWhitelist: data.ip_whitelist || [],
          ipBlacklist: data.ip_blacklist || [],
          alertOnFailedLogin: data.alert_on_failed_login,
          alertOnSuspiciousActivity: data.alert_on_suspicious_activity,
          alertOnPasswordChange: data.alert_on_password_change,
          alertEmail: data.alert_email || "",
          auditEnabled: data.audit_enabled,
          auditRetentionDays: data.audit_retention_days,
          logSensitiveActions: data.log_sensitive_actions,
        });
        setRecentAuditEvents(data.recent_audit_events || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load security settings.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettingsClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setLoading(true);
    setShowConfirm(false);
    setError("");
    setSuccess("");
    try {
      const payload = {
        password_min_length: settings.passwordMinLength,
        password_require_uppercase: settings.passwordRequireUppercase,
        password_require_lowercase: settings.passwordRequireLowercase,
        password_require_numbers: settings.passwordRequireNumbers,
        password_require_special: settings.passwordRequireSpecial,
        password_expiry_days: settings.passwordExpiryDays,
        max_login_attempts: settings.maxLoginAttempts,
        lockout_duration: settings.lockoutDuration,
        ip_whitelist: settings.ipWhitelist,
        ip_blacklist: settings.ipBlacklist,
        alert_on_failed_login: settings.alertOnFailedLogin,
        alert_on_suspicious_activity: settings.alertOnSuspiciousActivity,
        alert_on_password_change: settings.alertOnPasswordChange,
        alert_email: settings.alertEmail,
        audit_enabled: settings.auditEnabled,
        audit_retention_days: settings.auditRetentionDays,
        log_sensitive_actions: settings.logSensitiveActions,
      };

      const { data } = await updateSecuritySettings(payload);
      setRecentAuditEvents(data.recent_audit_events || []);
      setSuccess("Security settings saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Please review the values and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateListSetting = (key, value) => {
    handleSettingChange(
      key,
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    );
  };

  if (initialLoading) {
    return (
      <div className="p-6 text-gray-800 dark:text-white">
        Loading security settings...
      </div>
    );
  }

  const tabs = [
    { id: "password-policy", label: "Password Policy", icon: Key },
    { id: "login-security", label: "Login Security", icon: Lock },
    { id: "security-alerts", label: "Security Alerts", icon: AlertTriangle },
    { id: "audit-logging", label: "Audit Logging", icon: Eye },
  ];

  return (
    <div className="text-gray-800 dark:text-white p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">System Security Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure security policies and monitor system access
        </p>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-100 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        {activeTab === "password-policy" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Password Policy</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Minimum Password Length
              </label>
              <input
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) =>
                  handleSettingChange("passwordMinLength", parseInt(e.target.value, 10) || 0)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                min="6"
                max="32"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password Expiry (Days)
              </label>
              <input
                type="number"
                value={settings.passwordExpiryDays}
                onChange={(e) =>
                  handleSettingChange("passwordExpiryDays", parseInt(e.target.value, 10) || 0)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                min="0"
                max="365"
              />
              <p className="mt-1 text-xs text-gray-500">Set to 0 to disable expiry.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Password Requirements</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.passwordRequireUppercase}
                  onChange={(e) =>
                    handleSettingChange("passwordRequireUppercase", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                Require uppercase letters
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.passwordRequireLowercase}
                  onChange={(e) =>
                    handleSettingChange("passwordRequireLowercase", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                Require lowercase letters
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.passwordRequireNumbers}
                  onChange={(e) =>
                    handleSettingChange("passwordRequireNumbers", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                Require numbers
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.passwordRequireSpecial}
                  onChange={(e) =>
                    handleSettingChange("passwordRequireSpecial", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                Require special characters
              </label>
            </div>
          </div>
        </section>
        )}

        {activeTab === "login-security" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-500" />
            <h3 className="text-xl font-semibold">Login Security</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) =>
                  handleSettingChange("maxLoginAttempts", parseInt(e.target.value, 10) || 0)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                min="1"
                max="20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.lockoutDuration}
                onChange={(e) =>
                  handleSettingChange("lockoutDuration", parseInt(e.target.value, 10) || 0)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                min="1"
                max="1440"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                IP Whitelist
              </label>
              <textarea
                value={settings.ipWhitelist.join("\n")}
                onChange={(e) => updateListSetting("ipWhitelist", e.target.value)}
                placeholder="Enter one IP per line"
                className="h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                IP Blacklist
              </label>
              <textarea
                value={settings.ipBlacklist.join("\n")}
                onChange={(e) => updateListSetting("ipBlacklist", e.target.value)}
                placeholder="Enter one IP per line"
                className="h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
        </section>
        )}

        {activeTab === "security-alerts" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-xl font-semibold">Security Alerts</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.alertOnFailedLogin}
                onChange={(e) =>
                  handleSettingChange("alertOnFailedLogin", e.target.checked)
                }
                className="h-4 w-4"
              />
              Alert on failed login attempts
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.alertOnSuspiciousActivity}
                onChange={(e) =>
                  handleSettingChange("alertOnSuspiciousActivity", e.target.checked)
                }
                className="h-4 w-4"
              />
              Alert on suspicious activity
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.alertOnPasswordChange}
                onChange={(e) =>
                  handleSettingChange("alertOnPasswordChange", e.target.checked)
                }
                className="h-4 w-4"
              />
              Alert on password changes
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Alert Email</label>
            <input
              type="email"
              value={settings.alertEmail}
              onChange={(e) => handleSettingChange("alertEmail", e.target.value)}
              placeholder="security@bachelorsnest.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </section>
        )}

        {activeTab === "audit-logging" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold">Audit Logging</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.auditEnabled}
                onChange={(e) => handleSettingChange("auditEnabled", e.target.checked)}
                className="h-4 w-4"
              />
              Enable audit logging
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.logSensitiveActions}
                onChange={(e) =>
                  handleSettingChange("logSensitiveActions", e.target.checked)
                }
                className="h-4 w-4"
              />
              Log sensitive actions
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Log Retention (Days)
            </label>
            <input
              type="number"
              value={settings.auditRetentionDays}
              onChange={(e) =>
                handleSettingChange("auditRetentionDays", parseInt(e.target.value, 10) || 0)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              min="1"
              max="3650"
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">Recent Audit Events</h4>
            </div>
            {recentAuditEvents.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                No audit events found yet.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                {recentAuditEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between gap-4 border-b border-gray-200 pb-2 dark:border-gray-600"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.message}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSaveSettingsClick}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition"
          >
            <Settings className="w-4 h-4" />
            {loading ? "Saving..." : "Save Security Settings"}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Save Security Settings"
        message="Are you sure you want to save these security settings? This will update security policies for all users and may affect existing sessions."
        confirmLabel="Save Settings"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default AdminSecurity;
