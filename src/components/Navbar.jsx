import React from "react";
import { BookOpen, LogOut } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = ({
	user,
	handleLogout,
	toggleSidebar,
	currentPage,
	isSidebarOpen,
}) => {
	const getPageTitle = () => {
		const titles = {
			dashboard: "Dashboard",
			chatbot: "AI Learning Chat",
			ocr: "OCR Learning",
			"ocr-result": "OCR Results",
			settings: "Settings",
		};
		return titles[currentPage] || "Conceptify";
	};

	return (
		<nav
			className={`navbar ${
				isSidebarOpen ? "navbarWithSidebar" : "navbarFull"
			}`}>
			<div className="navbarContent">
				<div className="navbarLeft">
					{/* Show only logo when sidebar is closed - no three lines */}
					{!isSidebarOpen && (
						<button className="logoButton" onClick={toggleSidebar}>
							<BookOpen size={28} color="#2563eb" />
						</button>
					)}

					{/* Always show page title */}
					<h1 className="pageTitle">{getPageTitle()}</h1>
				</div>

				<div className="navbarRight">
					<div className="userInfoMobile">
						<span className="userName">Welcome, {user?.name}</span>
					</div>
					<button onClick={handleLogout} className="logoutButton">
						<LogOut size={20} />
						<span>Logout</span>
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
