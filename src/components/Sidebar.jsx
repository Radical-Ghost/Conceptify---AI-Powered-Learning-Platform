import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	BookOpen,
	MessageSquare,
	Camera,
	Settings,
	Home,
	X,
	ClipboardCheck,
} from "lucide-react";
import logoImage from "../assets/logo.png";
import "../styles/Sidebar.css";

const Sidebar = ({ user, isSidebarOpen, toggleSidebar }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
		{
			id: "dashboard",
			path: "/dashboard",
			label: "Dashboard",
			icon: Home,
			color: "#2563eb",
		},
		{
			id: "chatbot",
			path: "/chatbot",
			label: "AI Chat",
			icon: MessageSquare,
			color: "#3b82f6",
		},
		{
			id: "ocr",
			path: "/ocr",
			label: "OCR",
			icon: Camera,
			color: "#8b5cf6",
		},
		{
			id: "test",
			path: "/test",
			label: "Tests",
			icon: ClipboardCheck,
			color: "#10b981",
		},
	];

	const handleNavClick = (path) => {
		navigate(path);
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
						<div className="brandLogoSection">
							<button
								className="logoButton"
								onClick={handleTitleClick}>
								<img
									src={logoImage}
									alt="Conceptify Logo"
									className="logoImage"
								/>
							</button>
							<span
								className="sidebarTitle"
								onClick={handleTitleClick}
								style={{ cursor: "pointer" }}>
								Conceptify
							</span>
						</div>
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
							const isActive = location.pathname === item.path;
							return (
								<li key={item.id}>
									<button
										onClick={() =>
											handleNavClick(item.path)
										}
										className={`navItem ${
											isActive ? "navItemActive" : ""
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
						onClick={() => handleNavClick("/settings")}
						className={`navItem ${
							location.pathname === "/settings"
								? "navItemActive"
								: ""
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
