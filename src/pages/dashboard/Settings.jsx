import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { LuMoon, LuSun, LuTrash2, LuRefreshCw, LuAlertCircle } from "lucide-react";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/Modal";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { demoData, resetDemoData } = useData();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDark, setIsDark] = useState(theme === "dark");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-h2 text-primary-text dark:text-white">Settings</h2>
        <p className="text-secondary-text dark:text-gray-300">
          Configure your dashboard preferences. All settings are stored locally.
        </p>
      </div>

      {/* General Settings */}
      <div className="card-premium p-8">
        <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-6">General Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
            <div>
              <p className="font-medium text-primary-text dark:text-white">Company Name</p>
              <p className="text-sm text-secondary-text dark:text-gray-400">{demoData.company.name}</p>
            </div>
            <span className="text-sm font-medium text-primary-text dark:text-white">{demoData.company.name}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
            <div>
              <p className="font-medium text-primary-text dark:text-white">Default Currency</p>
              <p className="text-sm text-secondary-text dark:text-gray-400">USD</p>
            </div>
            <select className="px-4 py-2 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>INR</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
            <div>
              <p className="font-medium text-primary-text dark:text-white">Date Format</p>
              <p className="text-sm text-secondary-text dark:text-gray-400">MM/DD/YYYY</p>
            </div>
            <select className="px-4 py-2 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card-premium p-8">
        <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-6">Appearance</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${isDark ? "bg-yellow-500" : "bg-blue-500"} flex items-center justify-center text-white shadow-lg`}>
                {isDark ? <LuMoon className="h-5 w-5" /> : <LuSun className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-primary-text dark:text-white">{isDark ? "Dark Theme" : "Light Theme"}</p>
                <p className="text-sm text-secondary-text dark:text-gray-400">Switch between light and dark mode</p>
              </div>
            </div>
            <button
              onClick={() => { toggleTheme(); setIsDark(!isDark); }}
              className="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors duration-300"
            >
              <div className={`w-5 h-5 rounded-full bg-white ${isDark ? "translate-x-7" : "translate-x-1"} absolute top-1 ${isDark ? "right-1" : "left-1"} transition-transform duration-300 shadow-md`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Preferences */}
      <div className="card-premium p-8">
        <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-6">Data Preferences</h3>
        <p className="text-secondary-text dark:text-gray-300 mb-6">
          Reset demonstration data to the initial state. This will clear all
          custom data you've added and restore the default demo dataset.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsResetConfirmOpen(true)}>
            <LuRefreshCw className="h-4 w-4 mr-2" /> Reset Demo Data
          </Button>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-xl p-4 flex items-start gap-3">
            <LuAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary-text dark:text-gray-300 leading-relaxed">
              This action cannot be undone. All custom dashboard data will be
              lost and replaced with the default demonstration dataset.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onConfirm={() => { resetDemoData(); setIsResetConfirmOpen(false); }}
        onCancel={() => setIsResetConfirmOpen(false)}
        title="Reset Demo Data"
        message="Are you sure you want to reset all demonstration data? This action cannot be undone."
        confirmLabel="Reset Data"
        cancelLabel="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
