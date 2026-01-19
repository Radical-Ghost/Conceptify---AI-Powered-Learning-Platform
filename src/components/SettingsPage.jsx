import React, { useState, useEffect } from "react";
import {
	Settings,
	Moon,
	Sun,
	Bell,
	Globe,
	User,
	Database,
	Trash2,
	Download,
	CheckCircle,
} from "lucide-react";
import "../styles/SettingsPage.css";

const SettingsPage = () => {
	// Load settings from localStorage
	const [theme, setTheme] = useState(
		localStorage.getItem("conceptify_theme") || "light"
	);
	const [notifications, setNotifications] = useState({
		testReminders: localStorage.getItem("notif_testReminders") !== "false",
		aiResponses: localStorage.getItem("notif_aiResponses") !== "false",
		updates: localStorage.getItem("notif_updates") !== "false",
	});
	const [language, setLanguage] = useState(
		localStorage.getItem("conceptify_language") || "en"
	);
	const [autoSave, setAutoSave] = useState(
		localStorage.getItem("conceptify_autoSave") !== "false"
	);
	const [saveMessage, setSaveMessage] = useState("");

	// Apply theme on mount and when changed
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("conceptify_theme", theme);
	}, [theme]);

	// Save notification preferences
	useEffect(() => {
		localStorage.setItem(
			"notif_testReminders",
			notifications.testReminders
		);
		localStorage.setItem("notif_aiResponses", notifications.aiResponses);
		localStorage.setItem("notif_updates", notifications.updates);
	}, [notifications]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
		showSaveMessage("Theme updated!");
	};

	const toggleNotification = (type) => {
		setNotifications((prev) => ({
			...prev,
			[type]: !prev[type],
		}));
		showSaveMessage("Notification preferences updated!");
	};

	const handleLanguageChange = (e) => {
		const newLang = e.target.value;
		setLanguage(newLang);
		localStorage.setItem("conceptify_language", newLang);
		showSaveMessage("Language updated!");
	};

	const toggleAutoSave = () => {
		const newValue = !autoSave;
		setAutoSave(newValue);
		localStorage.setItem("conceptify_autoSave", newValue);
		showSaveMessage("Auto-save preference updated!");
	};

	const showSaveMessage = (message) => {
		setSaveMessage(message);
		setTimeout(() => setSaveMessage(""), 3000);
	};

	const handleExportData = () => {
		const data = {
			testHistory: JSON.parse(
				localStorage.getItem("testHistory") || "[]"
			),
			chatSessions: JSON.parse(
				localStorage.getItem("chatSessions") || "[]"
			),
			ocrHistory: JSON.parse(localStorage.getItem("ocrHistory") || "[]"),
			exportDate: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `conceptify-data-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
		showSaveMessage("Data exported successfully!");
	};

	const handleClearTestHistory = () => {
		if (
			window.confirm(
				"Are you sure you want to clear all test history? This cannot be undone."
			)
		) {
			localStorage.removeItem("testHistory");
			showSaveMessage("Test history cleared!");
		}
	};

	const handleClearChatHistory = () => {
		if (
			window.confirm(
				"Are you sure you want to clear all chat sessions? This cannot be undone."
			)
		) {
			localStorage.removeItem("chatSessions");
			showSaveMessage("Chat history cleared!");
		}
	};

	const handleClearAllData = () => {
		if (
			window.confirm(
				"⚠️ WARNING: This will delete ALL your data including tests, chats, and OCR history. This cannot be undone. Are you sure?"
			)
		) {
			const confirmAgain = window.confirm(
				"Last chance! Click OK to permanently delete all data."
			);
			if (confirmAgain) {
				const keysToKeep = ["conceptify_user", "conceptify_theme"];
				Object.keys(localStorage).forEach((key) => {
					if (!keysToKeep.includes(key)) {
						localStorage.removeItem(key);
					}
				});
				showSaveMessage("All data cleared!");
			}
		}
	};

	return (
		<div className="settingsContainer">
			{/* Save Message Toast */}
			{saveMessage && (
				<div className="saveMessageToast">
					<CheckCircle size={18} />
					<span>{saveMessage}</span>
				</div>
			)}

			<div className="settingsHeader">
				<Settings className="settingsIcon" />
				<h1 className="settingsTitle">Settings</h1>
			</div>

			<div className="settingsContent">
				{/* Appearance Section */}
				<div className="settingsSection">
					<div className="sectionHeader">
						<div className="sectionTitle">
							{theme === "light" ? (
								<Sun size={20} />
							) : (
								<Moon size={20} />
							)}
							<h2>Appearance</h2>
						</div>
						<p className="sectionDescription">
							Customize the look and feel of the application
						</p>
					</div>

					<div className="settingsCard">
						<div className="settingItem">
							<div className="settingInfo">
								<div className="settingLabel">Dark Mode</div>
								<div className="settingDesc">
									Switch between light and dark themes
								</div>
							</div>
							<button
								className={`toggleSwitch ${
									theme === "dark" ? "active" : ""
								}`}
								onClick={toggleTheme}>
								<span className="toggleSlider"></span>
							</button>
						</div>
					</div>
				</div>

				{/* Notifications Section */}
				<div className="settingsSection">
					<div className="sectionHeader">
						<div className="sectionTitle">
							<Bell size={20} />
							<h2>Notifications</h2>
						</div>
						<p className="sectionDescription">
							Manage your notification preferences
						</p>
					</div>

					<div className="settingsCard">
						<div className="settingItem">
							<div className="settingInfo">
								<div className="settingLabel">
									Test Reminders
								</div>
								<div className="settingDesc">
									Get notified about pending tests
								</div>
							</div>
							<button
								className={`toggleSwitch ${
									notifications.testReminders ? "active" : ""
								}`}
								onClick={() =>
									toggleNotification("testReminders")
								}>
								<span className="toggleSlider"></span>
							</button>
						</div>

						<div className="settingDivider"></div>

						<div className="settingItem">
							<div className="settingInfo">
								<div className="settingLabel">
									AI Response Updates
								</div>
								<div className="settingDesc">
									Receive notifications for AI chat responses
								</div>
							</div>
							<button
								className={`toggleSwitch ${
									notifications.aiResponses ? "active" : ""
								}`}
								onClick={() =>
									toggleNotification("aiResponses")
								}>
								<span className="toggleSlider"></span>
							</button>
						</div>

						<div className="settingDivider"></div>

						<div className="settingItem">
							<div className="settingInfo">
								<div className="settingLabel">
									System Updates
								</div>
								<div className="settingDesc">
									Stay informed about new features and updates
								</div>
							</div>
							<button
								className={`toggleSwitch ${
									notifications.updates ? "active" : ""
								}`}
								onClick={() => toggleNotification("updates")}>
								<span className="toggleSlider"></span>
							</button>
						</div>
					</div>
				</div>

				{/* Language & Region Section */}
				<div className="settingsSection">
					<div className="sectionHeader">
						<div className="sectionTitle">
							<Globe size={20} />
							<h2>Language & Region</h2>
						</div>
						<p className="sectionDescription">
							Set your preferred language
						</p>
					</div>

					<div className="settingsCard">
						<div className="settingItem">
							<div className="settingInfo">
								<div className="settingLabel">Language</div>
								<div className="settingDesc">
									Choose your preferred language
								</div>
							</div>
							<select
								className="settingSelect"
								value={language}
								onChange={handleLanguageChange}>
								<option value="en">English</option>
								<option value="es">Español</option>
								<option value="fr">Français</option>
								<option value="de">Deutsch</option>
								<option value="hi">हिन्दी</option>
								<option value="zh">中文</option>
							</select>
						</div>
					</div>
				</div>

				{/* Account Settings Section */}
				<div className="settingsSection">
					<div className="sectionHeader">
						<div className="sectionTitle">
							<User size={20} />
							<h2>Account Settings</h2>
						</div>
						<p className="sectionDescription">
							Manage your account preferences
						</p>
					</div>

					<div className="settingsCard">
						<div className="settingItem">
							<div className="settingInfo">
								<div className="settingLabel">Auto-Save</div>
								<div className="settingDesc">
									Automatically save your progress
								</div>
							</div>
							<button
								className={`toggleSwitch ${
									autoSave ? "active" : ""
								}`}
								onClick={toggleAutoSave}>
								<span className="toggleSlider"></span>
							</button>
						</div>
					</div>
				</div>

				{/* Data Management Section */}
				<div className="settingsSection">
					<div className="sectionHeader">
						<div className="sectionTitle">
							<Database size={20} />
							<h2>Data Management</h2>
						</div>
						<p className="sectionDescription">
							Export or clear your data
						</p>
					</div>

					<div className="settingsCard">
						<div className="settingItem settingItemColumn">
							<div className="settingInfo">
								<div className="settingLabel">Export Data</div>
								<div className="settingDesc">
									Download all your data as JSON
								</div>
							</div>
							<button
								className="actionButton primaryButton"
								onClick={handleExportData}>
								<Download size={18} />
								<span>Export All Data</span>
							</button>
						</div>

						<div className="settingDivider"></div>

						<div className="settingItem settingItemColumn">
							<div className="settingInfo">
								<div className="settingLabel">
									Clear Test History
								</div>
								<div className="settingDesc">
									Remove all test records
								</div>
							</div>
							<button
								className="actionButton dangerButton"
								onClick={handleClearTestHistory}>
								<Trash2 size={18} />
								<span>Clear Tests</span>
							</button>
						</div>

						<div className="settingDivider"></div>

						<div className="settingItem settingItemColumn">
							<div className="settingInfo">
								<div className="settingLabel">
									Clear Chat History
								</div>
								<div className="settingDesc">
									Remove all chat sessions
								</div>
							</div>
							<button
								className="actionButton dangerButton"
								onClick={handleClearChatHistory}>
								<Trash2 size={18} />
								<span>Clear Chats</span>
							</button>
						</div>

						<div className="settingDivider"></div>

						<div className="settingItem settingItemColumn">
							<div className="settingInfo">
								<div className="settingLabel">
									Clear All Data
								</div>
								<div className="settingDesc dangerText">
									⚠️ Permanently delete all your data
								</div>
							</div>
							<button
								className="actionButton dangerButton dangerButtonStrong"
								onClick={handleClearAllData}>
								<Trash2 size={18} />
								<span>Delete Everything</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
