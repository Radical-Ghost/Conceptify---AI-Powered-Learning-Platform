import React from "react";
import {
	BookOpen,
	MessageSquare,
	Camera,
	Settings,
	Home,
	X,
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({
	currentPage,
	setCurrentPage,
	user,
	isSidebarOpen,
	toggleSidebar,
}) => {
	const menuItems = [
		{ id: "dashboard", label: "Dashboard", icon: Home, color: "#2563eb" },
		{
			id: "chatbot",
			label: "AI Chat",
			icon: MessageSquare,
			color: "#3b82f6",
		},
		{ id: "ocr", label: "OCR", icon: Camera, color: "#8b5cf6" },
	];

	const handleNavClick = (pageId) => {
		setCurrentPage(pageId);
		// Close sidebar on mobile after selection
		if (window.innerWidth <= 1024) {
			toggleSidebar();
		}
	};

	const handleTitleClick = () => {
		toggleSidebar();
	};

	return (
		<>
			{/* Overlay for mobile */}
			{isSidebarOpen && (
				<div className="sidebarOverlay" onClick={toggleSidebar}></div>
			)}

			<div
				className={`sidebar ${
					isSidebarOpen ? "sidebarOpen" : "sidebarClosed"
				}`}>
				<div className="sidebarHeader">
					<div className="sidebarBrand">
						<button
							className="logoButton"
							onClick={handleTitleClick}>
							<BookOpen size={32} color="#2563eb" />
						</button>
						<span
							className="sidebarTitle"
							onClick={handleTitleClick}
							style={{ cursor: "pointer" }}>
							Conceptify
						</span>
						<button className="closeButton" onClick={toggleSidebar}>
							<X size={20} />
						</button>
					</div>
					<div className="userInfo">
						<span className="userName">Welcome, {user?.name}</span>
						<span className="userEmail">{user?.email}</span>
					</div>
				</div>

				<nav className="sidebarNav">
					<ul className="navList">
						{menuItems.map((item) => {
							const IconComponent = item.icon;
							return (
								<li key={item.id}>
									<button
										onClick={() => handleNavClick(item.id)}
										className={`navItem ${
											currentPage === item.id
												? "navItemActive"
												: ""
										}`}>
										<IconComponent
											size={20}
											color={item.color}
										/>
										<span>{item.label}</span>
									</button>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="sidebarFooter">
					<button
						onClick={() => handleNavClick("settings")}
						className={`navItem ${
							currentPage === "settings" ? "navItemActive" : ""
						}`}>
						<Settings size={20} color="#64748b" />
						<span>Settings</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
