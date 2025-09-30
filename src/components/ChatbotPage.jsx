import React from "react";
import { Bot, Send } from "lucide-react";
import "../styles/ChatbotPage.css";

const ChatbotPage = ({
	chatMessages,
	inputMessage,
	setInputMessage,
	handleSendMessage,
	handleLogout,
	setCurrentPage,
	ocrResult,
}) => (
	<div className="chatPageContent">
		<div className="chatHeader">
			<div className="chatTitleSection">
				<Bot size={32} color="#2563eb" />
				<h1>AI Learning Chat</h1>
			</div>
			{ocrResult ? (
				<div className="contextIndicator">
					<p>
						📄 Context:{" "}
						{ocrResult.keyTopics?.slice(0, 2).join(", ") ||
							"Study Material"}{" "}
						loaded
					</p>
					<p>Ask me anything about your uploaded document!</p>
				</div>
			) : (
				<p>Ask me anything and I'll help you learn!</p>
			)}
		</div>

		<div className="chatCard">
			<div className="chatMessages">
				{chatMessages.length === 0 ? (
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
							Ask me anything about any topic, and I'll help you
							understand it better!
						</p>
					</div>
				) : (
					<div>
						{chatMessages.map((message) => (
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
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyPress={(e) =>
							e.key === "Enter" && handleSendMessage()
						}
						placeholder="Ask me anything..."
						className="chatInputField"
					/>
					<button
						onClick={handleSendMessage}
						className="chatSendButton">
						<Send size={20} />
					</button>
				</div>
			</div>
		</div>
	</div>
);

export default ChatbotPage;
