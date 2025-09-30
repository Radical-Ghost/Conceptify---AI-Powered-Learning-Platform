import React, { useState, useEffect, useCallback } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import ChatbotPage from "./components/ChatbotPage";
import OcrPage from "./components/OcrPage";
import OCRResultPage from "./components/OcrResultPage";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import { styles } from "./styles/styles";
import "./styles/MainLayout.css";

const App = () => {
	const [currentPage, setCurrentPage] = useState("landing");
	const [user, setUser] = useState(null);
	const [ocrResult, setOcrResult] = useState(null);
	const [chatMessages, setChatMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isSessionValidating, setIsSessionValidating] = useState(true);

	// Validate session with server
	const validateSession = useCallback(async () => {
		try {
			const response = await fetch("http://localhost:5001/api/health");
			if (!response.ok) {
				throw new Error("Server not available");
			}
			return true;
		} catch (error) {
			console.log("Server session validation failed:", error.message);
			// Clear session when server is not available or restarted
			localStorage.removeItem("conceptify_user");
			localStorage.removeItem("conceptify_currentPage");
			setUser(null);
			setCurrentPage("landing");
			return false;
		}
	}, []);

	// Load user session on app start
	useEffect(() => {
		const initializeSession = async () => {
			setIsSessionValidating(true);
			const savedUser = localStorage.getItem("conceptify_user");

			if (savedUser) {
				try {
					const userData = JSON.parse(savedUser);

					// Validate session with server
					const isServerAvailable = await validateSession();

					if (isServerAvailable) {
						setUser(userData);
						// Always redirect to dashboard on reload when logged in
						setCurrentPage("dashboard");
						// Update localStorage to reflect dashboard as current page
						localStorage.setItem(
							"conceptify_currentPage",
							"dashboard"
						);
					}
				} catch (error) {
					console.error("Error loading saved user:", error);
					localStorage.removeItem("conceptify_user");
					localStorage.removeItem("conceptify_currentPage");
					setCurrentPage("landing");
				}
			}

			setIsSessionValidating(false);
		};

		initializeSession();
	}, [validateSession]);

	// Toggle sidebar
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Set initial sidebar state based on screen size
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 1024) {
				setIsSidebarOpen(true);
			} else {
				setIsSidebarOpen(false);
			}
		};

		// Set initial state based on screen size
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Close sidebar when screen is mobile size
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 1024) {
				setIsSidebarOpen(false);
			}
		};

		handleResize(); // Check on mount
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Authentication handlers
	const handleLogin = (email, _password) => {
		const userData = { email, name: email.split("@")[0] };
		setUser(userData);
		setCurrentPage("dashboard");

		// Save to localStorage
		localStorage.setItem("conceptify_user", JSON.stringify(userData));
		localStorage.setItem("conceptify_currentPage", "dashboard");
	};

	const handleSignup = (name, email, _password) => {
		const userData = { email, name };
		setUser(userData);
		setCurrentPage("dashboard");

		// Save to localStorage
		localStorage.setItem("conceptify_user", JSON.stringify(userData));
		localStorage.setItem("conceptify_currentPage", "dashboard");
	};

	const handleLogout = () => {
		setUser(null);
		setCurrentPage("landing");
		setChatMessages([]);
		setOcrResult(null);
		setIsSidebarOpen(false);

		// Clear localStorage
		localStorage.removeItem("conceptify_user");
		localStorage.removeItem("conceptify_currentPage");
	};

	// Chat handlers
	const handleSendMessage = () => {
		if (!inputMessage.trim()) return;

		const newMessage = {
			id: Date.now(),
			text: inputMessage,
			sender: "user",
		};
		setChatMessages((prev) => [...prev, newMessage]);

		setTimeout(() => {
			let responseText;

			// Use OCR context if available
			if (
				ocrResult &&
				(ocrResult.finalExtractedText || ocrResult.extractedText)
			) {
				const mainText =
					ocrResult.finalExtractedText || ocrResult.extractedText;
				const shortContext = mainText.substring(0, 200);
				responseText = `Based on your uploaded document: "${shortContext}..."

I can help you understand "${inputMessage}" in the context of this material. The document covers topics like: ${
					ocrResult.keyTopics?.slice(0, 3).join(", ") ||
					"various important areas"
				}.

What specific aspect would you like me to explain?`;
			} else {
				// Default response when no OCR context
				responseText = `I understand you're asking about "${inputMessage}". Let me help you learn this concept step by step. This is a powerful learning topic that we can explore together!`;
			}

			const aiResponse = {
				id: Date.now() + 1,
				text: responseText,
				sender: "ai",
			};
			setChatMessages((prev) => [...prev, aiResponse]);
		}, 1000);

		setInputMessage("");
	};

	// OCR handlers
	const handleFileUpload = async (file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("user_id", user?.email || "anonymous");

			const response = await fetch(
				"http://localhost:5001/api/ocr/process",
				{
					method: "POST",
					body: formData,
				}
			);

			const result = await response.json();

			if (result.success) {
				// Transform the OCR result to match frontend expectations
				setOcrResult({
					originalFileName: file.name,
					// New field names (preferred)
					finalExtractedText:
						result.finalExtractedText ||
						result.data?.extraction_results?.extracted_text,
					originalOcrOutput:
						result.originalOcrOutput ||
						result.data?.extraction_results?.raw_text,
					enhancedTextNltk:
						result.enhancedTextNltk ||
						result.data?.extraction_results?.corrected_text,
					// Legacy field names (fallback)
					extractedText:
						result.finalExtractedText ||
						result.data?.extraction_results?.extracted_text,
					rawText:
						result.originalOcrOutput ||
						result.data?.extraction_results?.raw_text,
					correctedText:
						result.enhancedTextNltk ||
						result.data?.extraction_results?.corrected_text,
					// Analysis data
					concepts:
						result.concepts || result.data?.ai_analysis?.concepts,
					difficulty:
						result.difficulty ||
						result.data?.ai_analysis?.difficulty,
					wordCount:
						result.wordCount ||
						result.data?.ai_analysis?.word_count,
					readingTime:
						result.readingTime ||
						result.data?.ai_analysis?.estimated_reading_time,
					keyTopics:
						result.keyTopics ||
						result.data?.ai_analysis?.key_topics,
					confidenceScore:
						result.confidenceScore ||
						result.data?.ai_analysis?.confidence_score,
					processingMetadata:
						result.processingMetadata ||
						result.data?.processing_metadata,
					fileInfo: result.fileInfo || result.data?.file_info,
					savedFileName: result.savedFileName,
				});
				setCurrentPage("ocr-result");
			} else {
				console.error("OCR processing failed:", result.error);
				// Set an error state that can be displayed in the UI instead of alert
				setOcrResult({
					error: "OCR processing failed: " + result.error,
				});
				setCurrentPage("ocr-result");
			}
		} catch (error) {
			console.error("Error uploading file:", error);

			// Check if server is available - if not, clear session
			const isServerAvailable = await validateSession();

			if (!isServerAvailable) {
				// Session was cleared by validateSession, user redirected to landing
				return;
			}

			// If server is available but request failed for other reasons
			setOcrResult({
				error: "Error processing file. Please try again.",
			});
			setCurrentPage("ocr-result");
		}
	};

	// Pages that should show sidebar and navbar
	const pagesWithLayout = [
		"dashboard",
		"chatbot",
		"ocr",
		"ocr-result",
		"settings",
	];

	// Loading screen while validating session
	if (isSessionValidating) {
		return (
			<div className="loadingScreen">
				<div className="loadingSpinner"></div>
				<p>Validating session...</p>
			</div>
		);
	}

	// Page Router
	const renderCurrentPage = () => {
		const mainContentClass = isSidebarOpen
			? "mainContentWithSidebar"
			: "mainContentFull";

		switch (currentPage) {
			case "login":
				return (
					<LoginPage
						setCurrentPage={setCurrentPage}
						handleLogin={handleLogin}
					/>
				);
			case "signup":
				return (
					<SignupPage
						setCurrentPage={setCurrentPage}
						handleSignup={handleSignup}
					/>
				);
			case "dashboard":
				return (
					<div className={mainContentClass}>
						<Dashboard
							user={user}
							handleLogout={handleLogout}
							setCurrentPage={setCurrentPage}
							chatMessages={chatMessages}
						/>
					</div>
				);
			case "chatbot":
				return (
					<div className={mainContentClass}>
						<ChatbotPage
							chatMessages={chatMessages}
							inputMessage={inputMessage}
							setInputMessage={setInputMessage}
							handleSendMessage={handleSendMessage}
							handleLogout={handleLogout}
							setCurrentPage={setCurrentPage}
							ocrResult={ocrResult}
						/>
					</div>
				);
			case "ocr":
				return (
					<div className={mainContentClass}>
						<OcrPage
							handleFileUpload={handleFileUpload}
							handleLogout={handleLogout}
							setCurrentPage={setCurrentPage}
							setOcrResult={setOcrResult}
						/>
					</div>
				);
			case "ocr-result":
				return (
					<div className={mainContentClass}>
						<OCRResultPage
							ocrResult={ocrResult}
							setCurrentPage={setCurrentPage}
							setOcrResult={setOcrResult}
						/>
					</div>
				);
			case "settings":
				return (
					<div className={mainContentClass}>
						<div className="settingsPage">
							<h1>Settings</h1>
							<p>Settings page content will go here...</p>
						</div>
					</div>
				);
			default:
				return <LandingPage setCurrentPage={setCurrentPage} />;
		}
	};

	return (
		<div style={styles.container}>
			{user && pagesWithLayout.includes(currentPage) && (
				<>
					<Sidebar
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						user={user}
						isSidebarOpen={isSidebarOpen}
						toggleSidebar={toggleSidebar}
					/>
					<Navbar
						user={user}
						handleLogout={handleLogout}
						toggleSidebar={toggleSidebar}
						currentPage={currentPage}
						isSidebarOpen={isSidebarOpen}
					/>
				</>
			)}
			{renderCurrentPage()}
		</div>
	);
};

export default App;
