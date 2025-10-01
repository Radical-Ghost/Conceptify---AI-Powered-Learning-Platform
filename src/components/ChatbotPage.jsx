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
} from "lucide-react";
import "../styles/ChatbotPage.css";

const ChatbotPage = ({
	chatMessages,
	inputMessage,
	setInputMessage,
	handleSendMessage,
	handleLogout,
	ocrResult,
}) => {
	const [chatSessions, setChatSessions] = useState([]);
	const [currentSessionId, setCurrentSessionId] = useState(null);
	const [testHistory, setTestHistory] = useState([]);
	const [localMessages, setLocalMessages] = useState([]);

	// Load chat sessions and test history on mount
	useEffect(() => {
		loadChatSessions();
		loadTestHistory();
	}, []);

	// Sync messages when current session changes
	useEffect(() => {
		if (currentSessionId) {
			const session = chatSessions.find((s) => s.id === currentSessionId);
			if (session) {
				setLocalMessages(session.messages);
			}
		} else {
			setLocalMessages([]);
		}
	}, [currentSessionId, chatSessions]);

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

	const saveChatSessions = (sessions) => {
		localStorage.setItem("chatSessions", JSON.stringify(sessions));
		setChatSessions(sessions);
	};

	const createNewChat = () => {
		const newSession = {
			id: Date.now().toString(),
			title: `Chat ${chatSessions.length + 1}`,
			messages: [],
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

	const getCurrentSession = () => {
		return chatSessions.find((s) => s.id === currentSessionId);
	};

	const currentSession = getCurrentSession();
	const displayMessages = currentSession ? currentSession.messages : [];

	return (
		<div className="chatPageContent">
			<div className="chatLayoutGrid">
				{/* Chat Sessions Sidebar */}
				<div className="chatSessionsSidebar">
					<div className="sidebarSection">
						<div className="sidebarHeader">
							<h3>
								<MessageSquare size={18} />
								Chat Sessions
							</h3>
							<button
								onClick={createNewChat}
								className="newChatBtn"
								title="New Chat">
								<Plus size={18} />
							</button>
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
										className="testHistoryCard">
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
		</div>
	);
};

export default ChatbotPage;
