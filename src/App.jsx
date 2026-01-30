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
import TestResultPage from "./components/TestResultPage";
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
	const [ocrResult, setOcrResult] = useState(() => {
		// Load OCR result from localStorage on mount
		try {
			const saved = localStorage.getItem("conceptify_ocr_result");
			return saved ? JSON.parse(saved) : null;
		} catch (error) {
			console.error("Error loading saved OCR result:", error);
			return null;
		}
	});
	const [activeTest, setActiveTest] = useState(null);
	const [chatMessages, setChatMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [chatDocuments, setChatDocuments] = useState([]);
	const [isSessionValidating, setIsSessionValidating] = useState(true);

	// Save OCR result to localStorage whenever it changes
	useEffect(() => {
		if (ocrResult) {
			localStorage.setItem(
				"conceptify_ocr_result",
				JSON.stringify(ocrResult),
			);
		} else {
			localStorage.removeItem("conceptify_ocr_result");
		}
	}, [ocrResult]);

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
	const handleSendMessage = async () => {
		if (!inputMessage.trim()) return;

		const newMessage = {
			id: Date.now(),
			text: inputMessage,
			sender: "user",
			timestamp: Date.now(),
		};
		setChatMessages((prev) => [...prev, newMessage]);
		setInputMessage("");

		// Add a loading message
		const loadingMessage = {
			id: Date.now() + 1,
			text: "Thinking...",
			sender: "ai",
			isLoading: true,
			timestamp: Date.now(),
		};
		setChatMessages((prev) => [...prev, loadingMessage]);

		try {
			// Build conversation context
			let conversationContext = "";

			// Add document context if available
			if (chatDocuments && chatDocuments.length > 0) {
				conversationContext += "DOCUMENT CONTEXT:\n";
				chatDocuments.forEach((doc) => {
					conversationContext += `\nDocument: ${doc.name}\n`;
					conversationContext += `Summary: ${doc.summary}\n`;
					conversationContext += `Key Topics: ${doc.keyTopics?.join(", ")}\n`;
					conversationContext += `Content:\n${doc.content}\n`;
					conversationContext += "\n---\n\n";
				});
			} else if (ocrResult && ocrResult.aiEnhancedText) {
				// Fallback to ocrResult if no documents are in chatDocuments
				conversationContext += "DOCUMENT CONTEXT:\n";
				conversationContext += `Document: ${ocrResult.originalFileName || "Uploaded Document"}\n`;
				conversationContext += `Summary: ${ocrResult.summary || ""}\n`;
				conversationContext += `Key Topics: ${ocrResult.keyTopics?.join(", ") || ""}\n`;
				conversationContext += `Content:\n${ocrResult.aiEnhancedText}\n`;
				conversationContext += "\n---\n\n";
			}

			// Add conversation history
			conversationContext += "CONVERSATION HISTORY:\n";
			chatMessages.forEach((msg) => {
				if (!msg.isLoading) {
					conversationContext += `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}\n`;
				}
			});

			// Add current question
			conversationContext += `User: ${inputMessage}\n`;
			conversationContext += "\nAI:";

			// Call Mistral API
			const response = await fetch(
				"http://localhost:11434/api/generate",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "mistral:7b",
						prompt: `You are an AI tutor designed to help students clearly understand technical and academic concepts.

Your goal is to resolve the user's doubt accurately, clearly, and in a well-structured format.

Formatting rules (MANDATORY - USE MARKDOWN):
- Do NOT write large paragraphs.
- Use markdown headings (### for section titles).
- Use bullet points (- for each point).
- Use **bold** for emphasis on key terms.
- Use \`code\` for technical terms, functions, or code snippets.
- Keep line length short and readable.
- Prefer structure over prose.

Response structure (FOLLOW THIS ORDER):

### Answer:
- Direct answer to the question in 1–2 lines.

### Explanation:
- 2–5 concise bullet points explaining the concept.
- Use **bold** for key terms.

### Example: (Optional)
- Include only if it improves clarity.
- Use code blocks (\`\`\`) for code examples.

### Comparison: (Optional)
- Use bullet points with clear labels ONLY if the question asks for differences.

Behavior rules:
- Use simple and precise language unless deeper detail is requested.
- Stay focused on the specific question.
- Do NOT summarize entire topics.
- Do NOT add unrelated concepts or speculation.
- Assume the most common academic interpretation if the question is vague.
- Ask at most one short clarifying question only if absolutely necessary.

End the response cleanly. Do not add extra sections.

Now answer the following question:

${conversationContext}`,
						stream: false,
						options: {
							temperature: 0.3,
							top_p: 0.9,
							num_predict: 500,
						},
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`Mistral API error: ${response.status}`);
			}

			const data = await response.json();
			const aiResponseText = data.response.trim();

			// Replace loading message with actual response
			setChatMessages((prev) =>
				prev.map((msg) =>
					msg.id === loadingMessage.id
						? {
								...msg,
								text: aiResponseText,
								isLoading: false,
							}
						: msg,
				),
			);
		} catch (error) {
			console.error("Error calling Mistral:", error);

			// Replace loading message with error message
			setChatMessages((prev) =>
				prev.map((msg) =>
					msg.id === loadingMessage.id
						? {
								...msg,
								text: "Sorry, I encountered an error. Please make sure Ollama is running with Mistral model installed.",
								isLoading: false,
								isError: true,
							}
						: msg,
				),
			);
		}
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
				},
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
					aiEnhancedText:
						result.aiEnhancedText ||
						result.data?.extraction_results?.ai_enhanced_text,
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
				// Clear processing state after successful upload
				localStorage.removeItem("ocr_processing");
				navigate("/ocr-result");
			} else {
				console.error("OCR processing failed:", result.error);
				// Clear processing state on error
				localStorage.removeItem("ocr_processing");
				// Set an error state that can be displayed in the UI instead of alert
				setOcrResult({
					error: "OCR processing failed: " + result.error,
				});
				navigate("/ocr-result");
			}
		} catch (error) {
			console.error("Error uploading file:", error);

			// Clear processing state on error
			localStorage.removeItem("ocr_processing");

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
									setChatMessages={setChatMessages}
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
					path="/test-result"
					element={
						<ProtectedRoute user={user}>
							<div className={mainContentClass}>
								<TestResultPage />
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
				/>{" "}
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
