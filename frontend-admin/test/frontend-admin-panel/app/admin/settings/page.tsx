"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Lock, Bell, Palette, Database, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    siteName: "Koupreng Invitations",
    siteUrl: "https://koupreng.com",
    supportEmail: "support@koupreng.com",
    invitationExpiryDays: "30",
    mainColor: "#3b82f6",
    accentColor: "#10b981",
    logoUrl: "/logo.png",
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    notificationEmail: "notifications@koupreng.com",
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    twoFactorAuth: false,
    passwordExpiry: "90",
    loginAttempts: "5",
    sessionTimeout: "30",
    apiKey: "pk_live_51234567890",
    webhookUrl: "",
  });

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6 max-w-5xl">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage system configuration and preferences</p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <p className="text-green-700 text-sm font-medium">Settings saved successfully!</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition ${
                  activeTab === "general"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Palette className="w-4 h-4" />
                General
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition ${
                  activeTab === "email"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition ${
                  activeTab === "security"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Lock className="w-4 h-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("api")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition ${
                  activeTab === "api"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Database className="w-4 h-4" />
                API
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => handleChange("siteName", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                        </label>
                        <input
                          type="url"
                          value={settings.siteUrl}
                          onChange={(e) => handleChange("siteUrl", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleChange("supportEmail", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleChange("timezone", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">EST</option>
                          <option value="PST">PST</option>
                          <option value="CST">CST</option>
                          <option value="IST">IST</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleChange("language", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invitation Expiry (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={settings.invitationExpiryDays}
                          onChange={(e) =>
                            handleChange("invitationExpiryDays", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Branding
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={settings.mainColor}
                            onChange={(e) => handleChange("mainColor", e.target.value)}
                            className="h-10 w-20 rounded-lg cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={settings.mainColor}
                            onChange={(e) => handleChange("mainColor", e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={settings.accentColor}
                            onChange={(e) => handleChange("accentColor", e.target.value)}
                            className="h-10 w-20 rounded-lg cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={settings.accentColor}
                            onChange={(e) => handleChange("accentColor", e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Tab */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Email Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Email
                        </label>
                        <input
                          type="email"
                          value={settings.notificationEmail}
                          onChange={(e) =>
                            handleChange("notificationEmail", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Server
                        </label>
                        <input
                          type="text"
                          value={settings.smtpServer}
                          onChange={(e) => handleChange("smtpServer", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="text"
                          value={settings.smtpPort}
                          onChange={(e) => handleChange("smtpPort", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Notification Preferences
                    </h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleChange("emailNotifications", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">
                        Enable email notifications
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      When enabled, administrators will receive email notifications for
                      important events such as new invitations, user registrations, and system alerts.
                    </p>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Authentication & Access
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="font-medium text-gray-700">
                            Two-Factor Authentication
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Require 2FA for all admin accounts
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) =>
                            handleChange("twoFactorAuth", e.target.checked)
                          }
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={settings.passwordExpiry}
                          onChange={(e) =>
                            handleChange("passwordExpiry", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Set to 0 for no expiration
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={settings.loginAttempts}
                            onChange={(e) =>
                              handleChange("loginAttempts", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            min="5"
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                              handleChange("sessionTimeout", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Tab */}
              {activeTab === "api" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      API Keys
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={settings.apiKey}
                            onChange={(e) => handleChange("apiKey", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition font-medium text-sm">
                          Regenerate
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Keep this key secure. Use it to authenticate API requests.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Webhooks
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.webhookUrl}
                        onChange={(e) => handleChange("webhookUrl", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="https://example.com/webhooks"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        We will send POST requests to this URL for important events.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
