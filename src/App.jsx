import React, { useState, useEffect, useCallback } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import ChatbotPage from "./components/ChatbotPage";
import OcrPage from "./components/OcrPage";
import OCRResultPage from "./components/OcrResultPage";
import TestPage from "./components/TestPage";
import TakeTestPage from "./components/TakeTestPage";
import SettingsPage from "./components/SettingsPage";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import { styles } from "./styles/styles";
import "./styles/MainLayout.css";

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
	if (!user) {
		return <Navigate to="/" replace />;
	}
	return children;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ user, children }) => {
	if (user) {
		return <Navigate to="/dashboard" replace />;
	}
	return children;
};

// Main App Content Component
const AppContent = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState(null);
	const [ocrResult, setOcrResult] = useState(null);
	const [activeTest, setActiveTest] = useState(null);
	const [chatMessages, setChatMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [chatDocuments, setChatDocuments] = useState([]);
	const [isSessionValidating, setIsSessionValidating] = useState(true);

	// Theme management - Load and apply theme on mount
	useEffect(() => {
		const savedTheme = localStorage.getItem("conceptify_theme") || "light";
		document.documentElement.setAttribute("data-theme", savedTheme);

		// Listen for theme changes from SettingsPage
		const handleThemeChange = () => {
			const currentTheme =
				localStorage.getItem("conceptify_theme") || "light";
			document.documentElement.setAttribute("data-theme", currentTheme);
		};

		// Check for theme changes every second (simple polling)
		const themeCheckInterval = setInterval(handleThemeChange, 100);

		return () => clearInterval(themeCheckInterval);
	}, []);

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
			setUser(null);
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
						// Don't force navigation - let the user stay on their current route
						// If they're on a public route, ProtectedRoute will handle the redirect
					}
				} catch (error) {
					console.error("Error loading saved user:", error);
					localStorage.removeItem("conceptify_user");
				}
			}

			setIsSessionValidating(false);
		};

		initializeSession();
	}, [validateSession, navigate]);

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
		navigate("/dashboard");

		// Save to localStorage
		localStorage.setItem("conceptify_user", JSON.stringify(userData));
	};

	const handleSignup = (name, email, _password) => {
		const userData = { email, name };
		setUser(userData);
		navigate("/dashboard");

		// Save to localStorage
		localStorage.setItem("conceptify_user", JSON.stringify(userData));
	};

	const handleLogout = () => {
		setUser(null);
		navigate("/");
		setChatMessages([]);
		setOcrResult(null);
		setIsSidebarOpen(false);
		setChatDocuments([]);

		// Clear localStorage
		localStorage.removeItem("conceptify_user");
	};

	// Add document to chat context
	const addDocumentToChat = (document) => {
		const newDocument = {
			id: Date.now().toString(),
			name: document.originalFileName || document.fileName || "Document",
			summary: document.summary || "",
			content:
				document.finalExtractedText || document.extractedText || "",
			keyTopics: document.keyTopics || [],
			addedAt: Date.now(),
			wordCount: document.wordCount || 0,
			readingTime: document.readingTime || 0,
		};

		setChatDocuments((prev) => {
			// Check if document already exists
			const exists = prev.some((doc) => doc.name === newDocument.name);
			if (exists) {
				return prev; // Don't add duplicates
			}
			return [...prev, newDocument];
		});

		// Navigate to chatbot page
		navigate("/chatbot");

		return newDocument;
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
					summary:
						result.summary || result.data?.ai_analysis?.summary,
					summaryModel:
						result.summaryModel ||
						result.data?.ai_analysis?.summary_model,
					summaryDetails:
						result.summaryDetails ||
						result.data?.ai_analysis?.summary_details,
					summaryTime:
						result.summaryTime ??
						result.data?.ai_analysis?.summary_time ??
						result.processingMetadata?.summary_time ??
						result.data?.processing_metadata?.summary_time ??
						0,
					processingMetadata:
						result.processingMetadata ||
						result.data?.processing_metadata,
					fileInfo: result.fileInfo || result.data?.file_info,
					savedFileName: result.savedFileName,
				});
				navigate("/ocr-result");
			} else {
				console.error("OCR processing failed:", result.error);
				// Set an error state that can be displayed in the UI instead of alert
				setOcrResult({
					error: "OCR processing failed: " + result.error,
				});
				navigate("/ocr-result");
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
				error: `Error processing file. Please try again.${
					error && error.message ? " Details: " + error.message : ""
				}`,
			});
			navigate("/ocr-result");
		}
	};

	// Check if current route should show sidebar and navbar
	const pagesWithLayout = [
		"/dashboard",
		"/chatbot",
		"/ocr",
		"/ocr-result",
		"/test",
		"/take-test",
		"/settings",
	];
	const showLayout = user && pagesWithLayout.includes(location.pathname);

	// Loading screen while validating session
	if (isSessionValidating) {
		return (
			<div className="loadingScreen">
				<div className="loadingSpinner"></div>
				<p>Validating session...</p>
			</div>
		);
	}

	const mainContentClass = isSidebarOpen
		? "mainContentWithSidebar"
		: "mainContentFull";

	return (
		<div style={styles.container}>
			{showLayout && (
				<>
					<Sidebar
						user={user}
						isSidebarOpen={isSidebarOpen}
						toggleSidebar={toggleSidebar}
					/>
					<Navbar
						user={user}
						handleLogout={handleLogout}
						toggleSidebar={toggleSidebar}
						isSidebarOpen={isSidebarOpen}
					/>
				</>
			)}
			<Routes>
				{/* Public Routes */}
				<Route
					path="/"
					element={
						<PublicRoute user={user}>
							<LandingPage />
						</PublicRoute>
					}
				/>
				<Route
					path="/login"
					element={
						<PublicRoute user={user}>
							<LoginPage handleLogin={handleLogin} />
						</PublicRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<PublicRoute user={user}>
							<SignupPage handleSignup={handleSignup} />
						</PublicRoute>
					}
				/>

				{/* Protected Routes */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<Dashboard
									user={user}
									handleLogout={handleLogout}
									chatMessages={chatMessages}
								/>
							</div>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/chatbot"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<ChatbotPage
									chatMessages={chatMessages}
									inputMessage={inputMessage}
									setInputMessage={setInputMessage}
									handleSendMessage={handleSendMessage}
									handleLogout={handleLogout}
									ocrResult={ocrResult}
									chatDocuments={chatDocuments}
									setChatDocuments={setChatDocuments}
								/>
							</div>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/ocr"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<OcrPage
									handleFileUpload={handleFileUpload}
									handleLogout={handleLogout}
									setOcrResult={setOcrResult}
								/>
							</div>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/ocr-result"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<OCRResultPage
									ocrResult={ocrResult}
									setOcrResult={setOcrResult}
									addDocumentToChat={addDocumentToChat}
								/>
							</div>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/test"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<TestPage setActiveTest={setActiveTest} />
							</div>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/take-test"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<TakeTestPage activeTest={activeTest} />
							</div>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<SettingsPage />
							</div>
						</ProtectedRoute>
					}
				/>

				{/* Catch all route */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</div>
	);
};

// Main App Component with Router
const App = () => {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
};

export default App;
