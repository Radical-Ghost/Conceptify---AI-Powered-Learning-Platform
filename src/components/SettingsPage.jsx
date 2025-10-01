import React from "react";
import { Settings } from "lucide-react";
import "../styles/SettingsPage.css";

const SettingsPage = () => {
	return (
		<div className="settingsContainer">
			<div className="settingsHeader">
				<Settings className="settingsIcon" />
				<h1 className="settingsTitle">Settings</h1>
			</div>

			<div className="settingsContent">
				<p className="comingSoonText">Settings options coming soon...</p>
			</div>
		</div>
	);
};

export default SettingsPage;
