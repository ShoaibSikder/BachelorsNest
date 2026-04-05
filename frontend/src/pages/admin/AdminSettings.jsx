import { useState } from "react";
import {
  Globe,
  Image,
  Home,
  Tag,
  Mail,
  Settings,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("site-settings");
  const [showConfirm, setShowConfirm] = useState(false);
  const [settings, setSettings] = useState({
    // Site Settings
    siteName: "BachelorsNest",
    siteDescription: "Find your perfect rental property",
    siteUrl: "https://bachelorsnest.com",
    contactEmail: "contact@bachelorsnest.com",
    contactPhone: "+1 (555) 123-4567",

    // Logo Settings
    logoUrl: "",
    faviconUrl: "",
    logoFile: null,
    faviconFile: null,

    // Homepage Content
    heroTitle: "Find Your Perfect Home",
    heroSubtitle: "Discover amazing rental properties in your area",
    heroImageUrl: "",
    featuredPropertiesCount: 6,
    showTestimonials: true,
    showStats: true,

    // Property Categories
    categories: [
      { id: 1, name: "Apartment", enabled: true, icon: "building" },
      { id: 2, name: "House", enabled: true, icon: "home" },
      { id: 3, name: "Condo", enabled: true, icon: "building-2" },
      { id: 4, name: "Townhouse", enabled: true, icon: "home" },
      { id: 5, name: "Studio", enabled: true, icon: "building" },
      { id: 6, name: "Room", enabled: true, icon: "bed" },
    ],

    // Email Templates
    emailTemplates: {
      welcome: {
        subject: "Welcome to BachelorsNest!",
        content: "Welcome to our platform...",
      },
      passwordReset: {
        subject: "Reset Your Password",
        content: "Click here to reset your password...",
      },
      propertyApproved: {
        subject: "Your Property Has Been Approved",
        content: "Congratulations! Your property listing has been approved...",
      },
    },

    // Maintenance Mode
    maintenanceMode: false,
    maintenanceMessage:
      "We are currently performing maintenance. Please check back soon.",
    maintenanceEndTime: "",
    allowAdminAccess: true,
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

  const handleCategoryChange = (categoryId, field, value) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat,
      ),
    }));
  };

  const handleEmailTemplateChange = (templateKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [templateKey]: {
          ...prev.emailTemplates[templateKey],
          [field]: value,
        },
      },
    }));
  };

  const handleFileUpload = (fileType, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings((prev) => ({
          ...prev,
          [fileType]: e.target.result,
          [fileType.replace("Url", "File")]: file,
        }));
      };
      reader.readAsDataURL(file);
    }
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
    { id: "site-settings", label: "Site Settings", icon: Globe },
    { id: "logo-favicon", label: "Logo & Favicon", icon: Image },
    { id: "homepage", label: "Homepage Content", icon: Home },
    { id: "categories", label: "Property Categories", icon: Tag },
    { id: "email-templates", label: "Email Templates", icon: Mail },
    { id: "maintenance", label: "Maintenance Mode", icon: Settings },
  ];

  return (
    <div className="text-gray-800 dark:text-white p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">System Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure system-wide settings and preferences
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
        {/* Site Settings Tab */}
        {activeTab === "site-settings" && (
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
              <Globe className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-semibold">Site Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleSettingChange("siteName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) =>
                    handleSettingChange("siteUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    handleSettingChange("contactEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) =>
                    handleSettingChange("contactPhone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  handleSettingChange("siteDescription", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
          </div>
        )}

        {/* Logo & Favicon Tab */}
        {activeTab === "logo-favicon" && (
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
              <Image className="w-5 h-5 text-green-500" />
              <h3 className="text-xl font-semibold">Logo & Favicon</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Logo</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("logoUrl", e.target.files[0])
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                  {settings.logoUrl && (
                    <div className="mt-2">
                      <img
                        src={settings.logoUrl}
                        alt="Logo preview"
                        className="h-16 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Favicon
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("faviconUrl", e.target.files[0])
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                  {settings.faviconUrl && (
                    <div className="mt-2">
                      <img
                        src={settings.faviconUrl}
                        alt="Favicon preview"
                        className="h-8 w-8 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Homepage Content Tab */}
        {activeTab === "homepage" && (
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
              <Home className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold">Homepage Content</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) =>
                    handleSettingChange("heroTitle", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={settings.heroSubtitle}
                  onChange={(e) =>
                    handleSettingChange("heroSubtitle", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={settings.heroImageUrl}
                  onChange={(e) =>
                    handleSettingChange("heroImageUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Featured Properties Count
                  </label>
                  <input
                    type="number"
                    value={settings.featuredPropertiesCount}
                    onChange={(e) =>
                      handleSettingChange(
                        "featuredPropertiesCount",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showTestimonials}
                    onChange={(e) =>
                      handleSettingChange("showTestimonials", e.target.checked)
                    }
                    className="mr-2"
                  />
                  Show testimonials section
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showStats}
                    onChange={(e) =>
                      handleSettingChange("showStats", e.target.checked)
                    }
                    className="mr-2"
                  />
                  Show statistics section
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Property Categories Tab */}
        {activeTab === "categories" && (
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
              <Tag className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl font-semibold">Property Categories</h3>
            </div>

            <div className="space-y-4">
              {settings.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={category.enabled}
                      onChange={(e) =>
                        handleCategoryChange(
                          category.id,
                          "enabled",
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(category.id, "name", e.target.value)
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const newCategory = {
                  id: Math.max(...settings.categories.map((c) => c.id)) + 1,
                  name: "New Category",
                  enabled: true,
                  icon: "building",
                };
                setSettings((prev) => ({
                  ...prev,
                  categories: [...prev.categories, newCategory],
                }));
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add New Category
            </button>
          </div>
        )}

        {/* Email Templates Tab */}
        {activeTab === "email-templates" && (
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
              <Mail className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-semibold">Email Templates</h3>
            </div>

            <div className="space-y-6">
              {Object.entries(settings.emailTemplates).map(
                ([key, template]) => (
                  <div
                    key={key}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-3 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={template.subject}
                          onChange={(e) =>
                            handleEmailTemplateChange(
                              key,
                              "subject",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Content
                        </label>
                        <textarea
                          value={template.content}
                          onChange={(e) =>
                            handleEmailTemplateChange(
                              key,
                              "content",
                              e.target.value,
                            )
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Maintenance Mode Tab */}
        {activeTab === "maintenance" && (
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
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="text-xl font-semibold">Maintenance Mode</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleSettingChange("maintenanceMode", e.target.checked)
                  }
                  className="mr-3 w-5 h-5"
                />
                <div>
                  <span className="font-medium">Enable Maintenance Mode</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Put the site in maintenance mode for updates
                  </p>
                </div>
              </label>

              {settings.maintenanceMode && (
                <div className="space-y-4 ml-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={settings.maintenanceMessage}
                      onChange={(e) =>
                        handleSettingChange(
                          "maintenanceMessage",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected End Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={settings.maintenanceEndTime}
                      onChange={(e) =>
                        handleSettingChange(
                          "maintenanceEndTime",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowAdminAccess}
                      onChange={(e) =>
                        handleSettingChange(
                          "allowAdminAccess",
                          e.target.checked,
                        )
                      }
                      className="mr-2"
                    />
                    Allow admin access during maintenance
                  </label>
                </div>
              )}
            </div>

            {settings.maintenanceMode && (
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    Maintenance Mode Active
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  The site is currently in maintenance mode. Only admins can
                  access it.
                </p>
              </div>
            )}
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
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Save System Settings"
        message="Are you sure you want to save these system settings? This will apply the changes across the entire platform."
        confirmLabel="Save Settings"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default AdminSettings;
