import { useState } from "react";
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  Eye,
  Settings,
  Clock,
} from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const AdminSecurity = () => {
  const [activeTab, setActiveTab] = useState("password-policy");
  const [showConfirm, setShowConfirm] = useState(false);
  const [settings, setSettings] = useState({
    // Password Policy
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: false,
    passwordExpiryDays: 90,

    // Two-Factor Authentication
    twoFactorRequired: false,
    twoFactorMethods: ["app", "sms"],

    // Session Management
    sessionTimeout: 30,
    maxConcurrentSessions: 3,
    rememberMeDuration: 7,

    // Login Security
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    ipWhitelist: [],
    ipBlacklist: [],

    // Security Alerts
    alertOnFailedLogin: true,
    alertOnSuspiciousActivity: true,
    alertOnPasswordChange: false,
    alertEmail: "",

    // Audit Logging
    auditEnabled: true,
    auditRetentionDays: 365,
    logSensitiveActions: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
      // TODO: Implement API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setError(
        "Backend not implemented. This feature will be available in a future update.",
      );
      setTimeout(() => setError(""), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "password-policy", label: "Password Policy", icon: Key },
    { id: "two-factor", label: "Two-Factor Auth", icon: Shield },
    { id: "session-mgmt", label: "Session Management", icon: Clock },
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
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Password Policy Tab */}
        {activeTab === "password-policy" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Feature Not Available
                </span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This feature will be implemented in a future update. Backend
                logic is currently not available.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-semibold">
                Password Policy Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) =>
                    handleSettingChange(
                      "passwordMinLength",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="6"
                  max="32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password Expiry (Days)
                </label>
                <input
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) =>
                    handleSettingChange(
                      "passwordExpiryDays",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="0"
                  max="365"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 to disable expiry
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Password Requirements</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireUppercase}
                    onChange={(e) =>
                      handleSettingChange(
                        "passwordRequireUppercase",
                        e.target.checked,
                      )
                    }
                    className="mr-2"
                  />
                  Require uppercase letters
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireLowercase}
                    onChange={(e) =>
                      handleSettingChange(
                        "passwordRequireLowercase",
                        e.target.checked,
                      )
                    }
                    className="mr-2"
                  />
                  Require lowercase letters
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireNumbers}
                    onChange={(e) =>
                      handleSettingChange(
                        "passwordRequireNumbers",
                        e.target.checked,
                      )
                    }
                    className="mr-2"
                  />
                  Require numbers
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireSpecial}
                    onChange={(e) =>
                      handleSettingChange(
                        "passwordRequireSpecial",
                        e.target.checked,
                      )
                    }
                    className="mr-2"
                  />
                  Require special characters
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Tab */}
        {activeTab === "two-factor" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Feature Not Available
                </span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This feature will be implemented in a future update. Backend
                logic is currently not available.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-500" />
              <h3 className="text-xl font-semibold">
                Two-Factor Authentication
              </h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.twoFactorRequired}
                  onChange={(e) =>
                    handleSettingChange("twoFactorRequired", e.target.checked)
                  }
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <span className="font-medium">Require 2FA for all users</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Force all users to enable two-factor authentication
                  </p>
                </div>
              </label>

              <div>
                <h4 className="font-medium mb-2">Available 2FA Methods</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorMethods.includes("app")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.twoFactorMethods, "app"]
                          : settings.twoFactorMethods.filter(
                              (m) => m !== "app",
                            );
                        handleSettingChange("twoFactorMethods", methods);
                      }}
                      className="mr-2"
                    />
                    Authenticator App (TOTP)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorMethods.includes("sms")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.twoFactorMethods, "sms"]
                          : settings.twoFactorMethods.filter(
                              (m) => m !== "sms",
                            );
                        handleSettingChange("twoFactorMethods", methods);
                      }}
                      className="mr-2"
                    />
                    SMS Verification
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorMethods.includes("email")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.twoFactorMethods, "email"]
                          : settings.twoFactorMethods.filter(
                              (m) => m !== "email",
                            );
                        handleSettingChange("twoFactorMethods", methods);
                      }}
                      className="mr-2"
                    />
                    Email Verification
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Management Tab */}
        {activeTab === "session-mgmt" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Feature Not Available
                </span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This feature will be implemented in a future update. Backend
                logic is currently not available.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold">Session Management</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      "sessionTimeout",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="5"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Concurrent Sessions
                </label>
                <input
                  type="number"
                  value={settings.maxConcurrentSessions}
                  onChange={(e) =>
                    handleSettingChange(
                      "maxConcurrentSessions",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Remember Me Duration (days)
                </label>
                <input
                  type="number"
                  value={settings.rememberMeDuration}
                  onChange={(e) =>
                    handleSettingChange(
                      "rememberMeDuration",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Login Security Tab */}
        {activeTab === "login-security" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Feature Not Available
                </span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This feature will be implemented in a future update. Backend
                logic is currently not available.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-semibold">Login Security</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    handleSettingChange(
                      "maxLoginAttempts",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="3"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lockout Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) =>
                    handleSettingChange(
                      "lockoutDuration",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  min="5"
                  max="1440"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">IP Whitelist</h4>
                <textarea
                  placeholder="Enter IP addresses (one per line)"
                  value={settings.ipWhitelist.join("\n")}
                  onChange={(e) =>
                    handleSettingChange(
                      "ipWhitelist",
                      e.target.value.split("\n").filter((ip) => ip.trim()),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 h-24"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only these IPs can access the admin panel
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">IP Blacklist</h4>
                <textarea
                  placeholder="Enter IP addresses (one per line)"
                  value={settings.ipBlacklist.join("\n")}
                  onChange={(e) =>
                    handleSettingChange(
                      "ipBlacklist",
                      e.target.value.split("\n").filter((ip) => ip.trim()),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 h-24"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These IPs are blocked from accessing the system
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Alerts Tab */}
        {activeTab === "security-alerts" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Feature Not Available
                </span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This feature will be implemented in a future update. Backend
                logic is currently not available.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl font-semibold">Security Alerts</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.alertOnFailedLogin}
                  onChange={(e) =>
                    handleSettingChange("alertOnFailedLogin", e.target.checked)
                  }
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <span className="font-medium">
                    Alert on failed login attempts
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send alerts when login attempts fail
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.alertOnSuspiciousActivity}
                  onChange={(e) =>
                    handleSettingChange(
                      "alertOnSuspiciousActivity",
                      e.target.checked,
                    )
                  }
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <span className="font-medium">
                    Alert on suspicious activity
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monitor and alert on unusual user behavior
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.alertOnPasswordChange}
                  onChange={(e) =>
                    handleSettingChange(
                      "alertOnPasswordChange",
                      e.target.checked,
                    )
                  }
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <span className="font-medium">Alert on password changes</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notify when users change their passwords
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Alert Email Address
              </label>
              <input
                type="email"
                value={settings.alertEmail}
                onChange={(e) =>
                  handleSettingChange("alertEmail", e.target.value)
                }
                placeholder="security@yourdomain.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email address to receive security alerts
              </p>
            </div>
          </div>
        )}

        {/* Audit Logging Tab */}
        {activeTab === "audit-logging" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Feature Not Available
                </span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This feature will be implemented in a future update. Backend
                logic is currently not available.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-semibold">Audit Logging</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.auditEnabled}
                  onChange={(e) =>
                    handleSettingChange("auditEnabled", e.target.checked)
                  }
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <span className="font-medium">Enable audit logging</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Log all user actions and system events
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.logSensitiveActions}
                  onChange={(e) =>
                    handleSettingChange("logSensitiveActions", e.target.checked)
                  }
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <span className="font-medium">Log sensitive actions</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Include password changes and admin actions in logs
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Log Retention (Days)
              </label>
              <input
                type="number"
                value={settings.auditRetentionDays}
                onChange={(e) =>
                  handleSettingChange(
                    "auditRetentionDays",
                    parseInt(e.target.value),
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                min="30"
                max="3650"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long to keep audit logs before automatic deletion
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recent Audit Events</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Admin login</span>
                  <span className="text-gray-500">2 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Password policy updated</span>
                  <span className="text-gray-500">1 hour ago</span>
                </div>
                <div className="flex justify-between">
                  <span>User account locked</span>
                  <span className="text-gray-500">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
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
