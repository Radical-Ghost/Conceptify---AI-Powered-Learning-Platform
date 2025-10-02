import React, { useState, useEffect } from "react";
import {
	Bot,
	Send,
	Plus,
	MessageSquare,
	Trash2,
	Award,
	Clock,
	Calendar,
	X,
	CheckCircle,
	XCircle,
} from "lucide-react";
import "../styles/ChatbotPage.css";

const ChatbotPage = ({
	chatMessages,
	inputMessage,
	setInputMessage,
	handleSendMessage,
	handleLogout,
	ocrResult,
	chatDocuments,
	setChatDocuments,
}) => {
	const [chatSessions, setChatSessions] = useState([]);
	const [currentSessionId, setCurrentSessionId] = useState(null);
	const [testHistory, setTestHistory] = useState([]);
	const [localMessages, setLocalMessages] = useState([]);
	const [selectedTest, setSelectedTest] = useState(null);
	const [showTestModal, setShowTestModal] = useState(false);
	const [showDocumentSelector, setShowDocumentSelector] = useState(false);
	const [ocrHistory, setOcrHistory] = useState([]);

	// Load chat sessions, test history, and OCR history on mount
	useEffect(() => {
		loadChatSessions();
		loadTestHistory();
		loadOcrHistory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync messages and documents when current session changes
	useEffect(() => {
		if (currentSessionId) {
			const session = chatSessions.find((s) => s.id === currentSessionId);
			if (session) {
				setLocalMessages(session.messages);
				// Load documents for this session
				setChatDocuments(session.documents || []);
			}
		} else {
			setLocalMessages([]);
			setChatDocuments([]);
		}
	}, [currentSessionId, chatSessions, setChatDocuments]);

	const loadChatSessions = () => {
		const saved = localStorage.getItem("chatSessions");
		if (saved) {
			const sessions = JSON.parse(saved);
			setChatSessions(sessions);
			// Set most recent session as active if none selected
			if (!currentSessionId && sessions.length > 0) {
				setCurrentSessionId(sessions[0].id);
			}
		}
	};

	const loadTestHistory = () => {
		const history = JSON.parse(localStorage.getItem("testHistory")) || [];
		setTestHistory(
			history.slice(0, 5).sort((a, b) => b.timestamp - a.timestamp)
		);
	};

	const loadOcrHistory = async () => {
		try {
			const response = await fetch(
				"http://localhost:5001/api/ocr/results"
			);
			const data = await response.json();
			setOcrHistory(data.results || []);
		} catch (error) {
			console.error("Error fetching OCR history:", error);
			setOcrHistory([]);
		}
	};

	const saveChatSessions = (sessions) => {
		localStorage.setItem("chatSessions", JSON.stringify(sessions));
		setChatSessions(sessions);
	};

	const createNewChat = () => {
		const newSession = {
			id: Date.now().toString(),
			title: `Chat ${chatSessions.length + 1}`,
			messages: [],
			documents: [], // Store loaded documents for this chat session
			createdAt: Date.now(),
			updatedAt: Date.now(),
			metadata: {
				messageCount: 0,
				context: ocrResult
					? {
							hasContext: true,
							topics: ocrResult.keyTopics || [],
							documentName:
								ocrResult.originalFileName || "Document",
					  }
					: { hasContext: false },
			},
		};

		const updatedSessions = [newSession, ...chatSessions];
		saveChatSessions(updatedSessions);
		setCurrentSessionId(newSession.id);
	};

	const deleteChat = (sessionId, e) => {
		e.stopPropagation();
		const updatedSessions = chatSessions.filter((s) => s.id !== sessionId);
		saveChatSessions(updatedSessions);

		// If deleting current session, switch to first available or null
		if (currentSessionId === sessionId) {
			setCurrentSessionId(
				updatedSessions.length > 0 ? updatedSessions[0].id : null
			);
		}
	};

	const switchChat = (sessionId) => {
		setCurrentSessionId(sessionId);
	};

	const deleteAllChats = () => {
		if (
			window.confirm(
				"Are you sure you want to delete all chats? This cannot be undone."
			)
		) {
			saveChatSessions([]);
			setCurrentSessionId(null);
			setChatDocuments([]);
		}
	};

	const handleLocalSendMessage = () => {
		if (!inputMessage.trim() || !currentSessionId) return;

		const userMessage = {
			id: Date.now(),
			sender: "user",
			text: inputMessage,
			timestamp: Date.now(),
		};

		const aiMessage = {
			id: Date.now() + 1,
			sender: "ai",
			text: "I'm a placeholder AI response. In the future, I'll be powered by a real AI model to help you learn!",
			timestamp: Date.now() + 100,
		};

		const updatedSessions = chatSessions.map((session) => {
			if (session.id === currentSessionId) {
				const newMessages = [
					...session.messages,
					userMessage,
					aiMessage,
				];
				return {
					...session,
					messages: newMessages,
					updatedAt: Date.now(),
					metadata: {
						...session.metadata,
						messageCount: newMessages.length,
					},
				};
			}
			return session;
		});

		saveChatSessions(updatedSessions);
		setInputMessage("");
	};

	const handleTestClick = (test) => {
		console.log("=== Test Clicked Debug ===");
		console.log("Full test object:", test);
		console.log("Has detailedAnswers:", !!test.detailedAnswers);
		console.log(
			"Number of detailed answers:",
			test.detailedAnswers?.length
		);
		console.log("showTestModal will be set to:", true);
		console.log("=========================");
		setSelectedTest(test);
		setShowTestModal(true);
	};

	const closeTestModal = () => {
		setShowTestModal(false);
		setSelectedTest(null);
	};

	const openDocumentSelector = () => {
		setShowDocumentSelector(true);
	};

	const closeDocumentSelector = () => {
		setShowDocumentSelector(false);
	};

	const handleDocumentSelect = async (document) => {
		// Check if document is already added
		const alreadyAdded = chatDocuments.some(
			(doc) => doc.id === document.filename
		);
		if (alreadyAdded) {
			alert(`"${document.originalName}" is already in your chat context`);
			return;
		}

		try {
			// Fetch the full document data
			const response = await fetch(
				`http://localhost:5001/api/ocr/result/${document.filename}`
			);
			const fullResult = await response.json();

			// Extract the data from the response
			const extractedText =
				fullResult.data?.extraction_results?.extracted_text ||
				fullResult.data?.extraction_results?.final_extracted_text ||
				"";
			const summary = fullResult.data?.analysis_results?.summary || "";
			const keyTopics =
				fullResult.data?.analysis_results?.key_topics || [];
			const wordCount =
				fullResult.data?.analysis_results?.word_count || 0;
			const readingTime =
				fullResult.data?.analysis_results?.reading_time || 0;

			// Add document to chat context
			const newDocument = {
				id: document.filename,
				name: document.originalName,
				summary: summary,
				content: extractedText,
				keyTopics: keyTopics,
				addedAt: Date.now(),
				wordCount: wordCount,
				readingTime: readingTime,
			};

			const updatedDocuments = [...chatDocuments, newDocument];
			setChatDocuments(updatedDocuments);

			// Save documents to the current session
			const updatedSessions = chatSessions.map((session) => {
				if (session.id === currentSessionId) {
					return {
						...session,
						documents: updatedDocuments,
					};
				}
				return session;
			});
			saveChatSessions(updatedSessions);

			setShowDocumentSelector(false);
			alert(`✅ "${document.originalName}" added to chat context!`);
		} catch (error) {
			console.error("Error loading document:", error);
			alert("Failed to load document. Please try again.");
		}
	};

	const getCurrentSession = () => {
		return chatSessions.find((s) => s.id === currentSessionId);
	};

	const currentSession = getCurrentSession();
	const displayMessages = currentSession ? currentSession.messages : [];

	// Debug: Log modal state
	console.log(
		"Modal State - showTestModal:",
		showTestModal,
		"selectedTest:",
		selectedTest
	);

	return (
		<div className="chatPageContent">
			<div className="chatLayoutGrid">
				{/* Chat Sessions Sidebar */}
				<div className="chatSessionsSidebar">
					<div className="sidebarSection">
						<div className="chatSidebarHeader">
							<h3>
								<MessageSquare size={18} />
								Chat Sessions
							</h3>
							<div className="chatHeaderButtons">
								<button
									onClick={createNewChat}
									className="newChatBtn"
									title="New Chat">
									<Plus size={18} />
								</button>
								{chatSessions.length > 0 && (
									<button
										onClick={deleteAllChats}
										className="deleteAllChatsBtn"
										title="Delete All Chats">
										<Trash2 size={18} />
									</button>
								)}
							</div>
						</div>

						<div className="sessionsList">
							{chatSessions.length === 0 ? (
								<div className="emptySessions">
									<MessageSquare size={32} color="#d1d5db" />
									<p>No chats yet</p>
									<button
										onClick={createNewChat}
										className="createFirstChat">
										Create First Chat
									</button>
								</div>
							) : (
								chatSessions.map((session) => (
									<div
										key={session.id}
										className={`sessionCard ${
											currentSessionId === session.id
												? "sessionActive"
												: ""
										}`}
										onClick={() => switchChat(session.id)}>
										<div className="sessionInfo">
											<div className="sessionTitle">
												{session.title}
											</div>
											<div className="sessionMeta">
												{session.metadata.messageCount}{" "}
												messages •{" "}
												{new Date(
													session.updatedAt
												).toLocaleDateString()}
											</div>
											{session.metadata.context
												.hasContext && (
												<div className="sessionContext">
													📄{" "}
													{
														session.metadata.context
															.documentName
													}
												</div>
											)}
										</div>
										<button
											onClick={(e) =>
												deleteChat(session.id, e)
											}
											className="deleteSessionBtn"
											title="Delete Chat">
											<Trash2 size={16} />
										</button>
									</div>
								))
							)}
						</div>
					</div>

					{/* Test History Section */}
					<div className="sidebarSection">
						<div className="sidebarHeader">
							<h3>
								<Award size={18} />
								Recent Tests
							</h3>
						</div>

						<div className="testHistoryList">
							{testHistory.length === 0 ? (
								<div className="emptyTests">
									<Clock size={28} color="#d1d5db" />
									<p>No tests taken</p>
								</div>
							) : (
								testHistory.map((test, index) => (
									<div
										key={index}
										className="testHistoryCard"
										onClick={() => handleTestClick(test)}
										style={{ cursor: "pointer" }}>
										<div className="testIcon">
											<Award
												size={16}
												color={
													test.score >= 70
														? "#10b981"
														: test.score >= 50
														? "#f59e0b"
														: "#ef4444"
												}
											/>
										</div>
										<div className="testInfo">
											<div className="testTitle">
												{test.documentName}
											</div>
											<div className="testDate">
												<Calendar size={12} />
												{new Date(
													test.timestamp
												).toLocaleDateString()}
											</div>
										</div>
										<div
											className={`testScore ${
												test.score >= 70
													? "scoreHigh"
													: test.score >= 50
													? "scoreMedium"
													: "scoreLow"
											}`}>
											{test.score}%
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				{/* Main Chat Area */}
				<div className="chatMainArea">
					<div className="chatHeader">
						<div className="chatTitleSection">
							<Bot size={32} color="#2563eb" />
							<div>
								<h1>
									{currentSession
										? currentSession.title
										: "AI Learning Chat"}
								</h1>
								{currentSession?.metadata.context.hasContext ? (
									<div className="contextIndicator">
										📄 Context:{" "}
										{currentSession.metadata.context.topics
											.slice(0, 2)
											.join(", ") ||
											"Study Material"}{" "}
										loaded
									</div>
								) : (
									<p className="chatSubtitle">
										Ask me anything and I'll help you learn!
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Loaded Documents Section */}
					{chatDocuments && chatDocuments.length > 0 && (
						<div className="loadedDocumentsSection">
							<div className="documentsHeader">
								<MessageSquare size={16} />
								<span>
									Loaded Documents ({chatDocuments.length})
								</span>
							</div>
							<div className="documentsList">
								{chatDocuments.map((doc) => (
									<div key={doc.id} className="documentChip">
										<div className="documentInfo">
											<span className="documentName">
												📄 {doc.name}
											</span>
											<span className="documentMeta">
												{doc.wordCount} words •{" "}
												{doc.readingTime} min read
											</span>
										</div>
										<button
											onClick={() => {
												const updatedDocuments =
													chatDocuments.filter(
														(d) => d.id !== doc.id
													);
												setChatDocuments(
													updatedDocuments
												);

												// Save to current session
												const updatedSessions =
													chatSessions.map(
														(session) => {
															if (
																session.id ===
																currentSessionId
															) {
																return {
																	...session,
																	documents:
																		updatedDocuments,
																};
															}
															return session;
														}
													);
												saveChatSessions(
													updatedSessions
												);
											}}
											className="removeDocBtn"
											title="Remove document">
											<Trash2 size={14} />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="chatCard">
						<div className="chatMessages">
							{!currentSession ? (
								<div className="chatEmpty">
									<Bot
										size={64}
										color="#9ca3af"
										style={{ margin: "0 auto 1rem auto" }}
									/>
									<h3 className="chatEmptyTitle">
										Create a Chat to Get Started
									</h3>
									<p>
										Click the + button to create a new chat
										session
									</p>
									<button
										onClick={createNewChat}
										className="createChatBtn">
										<Plus size={20} />
										Create New Chat
									</button>
								</div>
							) : displayMessages.length === 0 ? (
								<div className="chatEmpty">
									<Bot
										size={64}
										color="#9ca3af"
										style={{ margin: "0 auto 1rem auto" }}
									/>
									<h3 className="chatEmptyTitle">
										Start Learning with AI
									</h3>
									<p>
										Ask me anything about any topic, and
										I'll help you understand it better!
									</p>
								</div>
							) : (
								<div>
									{displayMessages.map((message) => (
										<div
											key={message.id}
											className={`messageContainer ${
												message.sender === "user"
													? "messageUser"
													: "messageAi"
											}`}>
											<div
												className={`message ${
													message.sender === "user"
														? "messageUserBubble"
														: "messageAiBubble"
												}`}>
												{message.text}
											</div>
											<div className="messageTime">
												{new Date(
													message.timestamp
												).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="chatInput">
							<div className="chatInputContainer">
								<button
									onClick={openDocumentSelector}
									className="chatUploadButton"
									title="Add document from OCR history"
									disabled={!currentSession}>
									<Plus size={20} />
								</button>
								<input
									type="text"
									value={inputMessage}
									onChange={(e) =>
										setInputMessage(e.target.value)
									}
									onKeyPress={(e) =>
										e.key === "Enter" &&
										handleLocalSendMessage()
									}
									placeholder={
										currentSession
											? "Ask me anything..."
											: "Create a chat to start messaging..."
									}
									className="chatInputField"
									disabled={!currentSession}
								/>
								<button
									onClick={handleLocalSendMessage}
									className="chatSendButton"
									disabled={!currentSession}>
									<Send size={20} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Old modals removed - now placed after chatLayoutGrid closes */}
			{false && (
				<div className="modalOverlay" onClick={closeTestModal}>
					<div
						className="testModalContent"
						onClick={(e) => e.stopPropagation()}>
						<div className="modalHeader">
							<div className="modalTitle">
								<Award size={24} color="#3b82f6" />
								<h2>{selectedTest.documentName}</h2>
							</div>
							<button
								onClick={closeTestModal}
								className="modalCloseBtn">
								<X size={24} />
							</button>
						</div>

						<div className="modalBody">
							{/* Test Summary */}
							<div className="testSummary">
								<div className="summaryCard">
									<div className="summaryLabel">Score</div>
									<div
										className={`summaryValue ${
											selectedTest.score >= 70
												? "scoreHigh"
												: selectedTest.score >= 50
												? "scoreMedium"
												: "scoreLow"
										}`}>
										{selectedTest.score}%
									</div>
								</div>
								<div className="summaryCard">
									<div className="summaryLabel">
										Correct Answers
									</div>
									<div className="summaryValue">
										{selectedTest.correctAnswers} /{" "}
										{selectedTest.totalQuestions}
									</div>
								</div>
								<div className="summaryCard">
									<div className="summaryLabel">Date</div>
									<div className="summaryValue summaryDate">
										{new Date(
											selectedTest.timestamp
										).toLocaleDateString()}
									</div>
								</div>
							</div>

							{/* Detailed Answers */}
							{selectedTest.detailedAnswers && (
								<div className="detailedAnswers">
									<h3 className="detailedTitle">
										Question Review
									</h3>
									{selectedTest.detailedAnswers.map(
										(qa, index) => (
											<div
												key={index}
												className={`questionCard ${
													qa.isCorrect
														? "correctCard"
														: "incorrectCard"
												}`}>
												<div className="questionHeader">
													<span className="questionNumber">
														Q{index + 1}
													</span>
													{qa.isCorrect ? (
														<CheckCircle
															size={20}
															color="#10b981"
														/>
													) : (
														<XCircle
															size={20}
															color="#ef4444"
														/>
													)}
												</div>
												<p className="questionText">
													{qa.question}
												</p>

												<div className="answerOptions">
													{qa.options.map(
														(option, optIdx) => {
															const isUserAnswer =
																option ===
																qa.userAnswer;
															const isCorrectAnswer =
																option ===
																qa.correctAnswer;

															return (
																<div
																	key={optIdx}
																	className={`answerOption ${
																		isCorrectAnswer
																			? "correctOption"
																			: ""
																	} ${
																		isUserAnswer &&
																		!isCorrectAnswer
																			? "incorrectOption"
																			: ""
																	}`}>
																	{option}
																	{isCorrectAnswer && (
																		<span className="optionBadge correctBadge">
																			✓
																			Correct
																		</span>
																	)}
																	{isUserAnswer &&
																		!isCorrectAnswer && (
																			<span className="optionBadge incorrectBadge">
																				✗
																				Your
																				Answer
																			</span>
																		)}
																</div>
															);
														}
													)}
												</div>
											</div>
										)
									)}
								</div>
							)}

							{!selectedTest.detailedAnswers && (
								<div className="noDetailsMessage">
									<p>
										Detailed answers not available for this
										test.
									</p>
									<p className="noDetailsHint">
										This feature is available for tests
										taken after this update.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Document Selector Modal */}
			{showDocumentSelector && (
				<div className="modalOverlay" onClick={closeDocumentSelector}>
					<div
						className="documentSelectorModal"
						onClick={(e) => e.stopPropagation()}>
						<div className="modalHeader">
							<h2>Select Document from OCR History</h2>
							<button
								onClick={closeDocumentSelector}
								className="modalCloseBtn">
								<X size={24} />
							</button>
						</div>

						<div className="modalBody">
							{ocrHistory.length === 0 ? (
								<div className="noDocumentsMessage">
									<p>No documents found in OCR history.</p>
									<p className="noDocumentsHint">
										Upload and process a document in the OCR
										page first.
									</p>
								</div>
							) : (
								<div className="documentGrid">
									{ocrHistory.map((document, index) => {
										const isAdded = chatDocuments.some(
											(doc) =>
												doc.id === document.filename
										);

										return (
											<div
												key={document.filename || index}
												className={`documentCard ${
													isAdded
														? "documentAdded"
														: ""
												}`}
												onClick={() =>
													!isAdded &&
													handleDocumentSelect(
														document
													)
												}>
												<div className="documentIcon">
													📄
												</div>
												<div className="documentInfo">
													<h3 className="documentTitle">
														{document.originalName ||
															"Untitled Document"}
													</h3>
													<p className="documentDate">
														{new Date(
															document.created
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															}
														)}
													</p>
													<p className="documentPreview">
														{document.extractedText}
													</p>
												</div>
												{isAdded && (
													<div className="addedBadge">
														<CheckCircle
															size={20}
														/>
														<span>Added</span>
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Test Detail Modal */}
			{showTestModal && selectedTest && (
				<div className="modalOverlay" onClick={closeTestModal}>
					<div
						className="testModalContent"
						onClick={(e) => e.stopPropagation()}>
						<div className="modalHeader">
							<div className="modalTitle">
								<Award size={24} color="#3b82f6" />
								<h2>{selectedTest.documentName}</h2>
							</div>
							<button
								onClick={closeTestModal}
								className="modalCloseBtn">
								<X size={24} />
							</button>
						</div>

						<div className="modalBody">
							{/* Test Summary */}
							<div className="testSummary">
								<div className="summaryCard">
									<div className="summaryLabel">Score</div>
									<div
										className={`summaryValue ${
											selectedTest.score >= 70
												? "scoreHigh"
												: selectedTest.score >= 50
												? "scoreMedium"
												: "scoreLow"
										}`}>
										{selectedTest.score}%
									</div>
								</div>
								<div className="summaryCard">
									<div className="summaryLabel">
										Correct Answers
									</div>
									<div className="summaryValue">
										{selectedTest.correctAnswers} /{" "}
										{selectedTest.totalQuestions}
									</div>
								</div>
								<div className="summaryCard">
									<div className="summaryLabel">Date</div>
									<div className="summaryValue summaryDate">
										{new Date(
											selectedTest.timestamp
										).toLocaleDateString()}
									</div>
								</div>
							</div>

							{/* Detailed Answers */}
							{selectedTest.detailedAnswers && (
								<div className="detailedAnswers">
									<h3 className="detailedTitle">
										Question Review
									</h3>
									{selectedTest.detailedAnswers.map(
										(qa, index) => (
											<div
												key={index}
												className={`questionCard ${
													qa.isCorrect
														? "correctCard"
														: "incorrectCard"
												}`}>
												<div className="questionHeader">
													<span className="questionNumber">
														Q{index + 1}
													</span>
													{qa.isCorrect ? (
														<CheckCircle
															size={20}
															color="#10b981"
														/>
													) : (
														<XCircle
															size={20}
															color="#ef4444"
														/>
													)}
												</div>
												<p className="questionText">
													{qa.question}
												</p>

												<div className="answerOptions">
													{qa.options.map(
														(option, optIdx) => {
															const isUserAnswer =
																option ===
																qa.userAnswer;
															const isCorrectAnswer =
																option ===
																qa.correctAnswer;

															return (
																<div
																	key={optIdx}
																	className={`answerOption ${
																		isCorrectAnswer
																			? "correctOption"
																			: ""
																	} ${
																		isUserAnswer &&
																		!isCorrectAnswer
																			? "incorrectOption"
																			: ""
																	}`}>
																	{option}
																	{isCorrectAnswer && (
																		<span className="optionBadge correctBadge">
																			✓
																			Correct
																		</span>
																	)}
																	{isUserAnswer &&
																		!isCorrectAnswer && (
																			<span className="optionBadge incorrectBadge">
																				✗
																				Your
																				Answer
																			</span>
																		)}
																</div>
															);
														}
													)}
												</div>
											</div>
										)
									)}
								</div>
							)}

							{!selectedTest.detailedAnswers && (
								<div className="noDetailsMessage">
									<p>
										Detailed answers not available for this
										test.
									</p>
									<p className="noDetailsHint">
										This feature is available for tests
										taken after this update.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Document Selector Modal */}
			{showDocumentSelector && (
				<div className="modalOverlay" onClick={closeDocumentSelector}>
					<div
						className="documentSelectorModal"
						onClick={(e) => e.stopPropagation()}>
						<div className="modalHeader">
							<h2>Select Document from OCR History</h2>
							<button
								onClick={closeDocumentSelector}
								className="modalCloseBtn">
								<X size={24} />
							</button>
						</div>

						<div className="modalBody">
							{ocrHistory.length === 0 ? (
								<div className="noDocumentsMessage">
									<p>No documents found in OCR history.</p>
									<p className="noDocumentsHint">
										Upload and process a document in the OCR
										page first.
									</p>
								</div>
							) : (
								<div className="documentGrid">
									{ocrHistory.map((document, index) => {
										const isAdded = chatDocuments.some(
											(doc) =>
												doc.id === document.filename
										);

										return (
											<div
												key={document.filename || index}
												className={`documentCard ${
													isAdded
														? "documentAdded"
														: ""
												}`}
												onClick={() =>
													!isAdded &&
													handleDocumentSelect(
														document
													)
												}>
												<div className="documentIcon">
													📄
												</div>
												<div className="documentInfo">
													<h3 className="documentTitle">
														{document.originalName ||
															"Untitled Document"}
													</h3>
													<p className="documentDate">
														{new Date(
															document.created
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															}
														)}
													</p>
													<p className="documentPreview">
														{document.extractedText}
													</p>
												</div>
												{isAdded && (
													<div className="addedBadge">
														<CheckCircle
															size={20}
														/>
														<span>Added</span>
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatbotPage;
