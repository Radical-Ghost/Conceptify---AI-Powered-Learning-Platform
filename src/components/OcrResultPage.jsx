import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Eye,
	MessageSquare,
	Upload,
	Edit3,
	Save,
	X,
	BarChart3,
	Clock,
	Target,
	CheckCircle,
} from "lucide-react";
import "../styles/OcrResultPage.css";

const OCRResultPage = ({ ocrResult, setOcrResult, addDocumentToChat }) => {
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(
		ocrResult?.finalExtractedText || ocrResult?.extractedText || ""
	);
	const [selectedTab, setSelectedTab] = useState("final"); // 'original', 'enhanced', 'final'
	const [saveMessage, setSaveMessage] = useState("");
	const [addToChatMessage, setAddToChatMessage] = useState("");
	const summaryDetails =
		ocrResult?.summaryDetails ||
		ocrResult?.processingMetadata?.summary_details ||
		ocrResult?.summary_details;
	const summaryTime =
		ocrResult?.summaryTime ??
		summaryDetails?.duration ??
		ocrResult?.processingMetadata?.summary_time;
	const summaryMetaItems = [];

	if (summaryTime !== undefined && summaryTime !== null) {
		const numericTime = Number(summaryTime);
		if (!Number.isNaN(numericTime)) {
			summaryMetaItems.push(
				`Generated in ${numericTime.toFixed(numericTime >= 1 ? 1 : 2)}s`
			);
		}
	}

	if (summaryDetails?.strategy) {
		summaryMetaItems.push(`Mode: ${summaryDetails.strategy}`);
	}

	if (summaryDetails?.chunks) {
		summaryMetaItems.push(`Chunks: ${summaryDetails.chunks}`);
	}

	if (summaryDetails?.trimmed && summaryDetails?.trimmed_words) {
		summaryMetaItems.push(`Trimmed ${summaryDetails.trimmed_words} words`);
	}

	const handleSaveEdit = async () => {
		try {
			// Use the saved filename from the OCR result
			const filename = ocrResult.savedFileName;

			if (!filename) {
				setSaveMessage(
					"Error: No saved filename found. Cannot update this result."
				);
				setTimeout(() => setSaveMessage(""), 3000);
				return;
			}

			const response = await fetch(
				`http://localhost:5001/api/ocr/update/${filename}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						editedText: editedText,
					}),
				}
			);

			const result = await response.json();

			if (result.success) {
				setSaveMessage("Text updated successfully! ✅");
				setIsEditing(false);

				// Update the OCR result in real-time
				if (setOcrResult) {
					setOcrResult((prevResult) => ({
						...prevResult,
						finalExtractedText: editedText,
						extractedText: editedText, // Keep legacy field for compatibility
					}));
				}

				// Clear message after 3 seconds
				setTimeout(() => setSaveMessage(""), 3000);
			} else {
				setSaveMessage("Failed to update text: " + result.error);
				setTimeout(() => setSaveMessage(""), 3000);
			}
		} catch (error) {
			console.error("Error updating text:", error);
			setSaveMessage("Error updating text. Please try again.");
			setTimeout(() => setSaveMessage(""), 3000);
		}
	};

	const handleCancelEdit = () => {
		setEditedText(
			ocrResult?.finalExtractedText || ocrResult?.extractedText || ""
		);
		setIsEditing(false);
	};

	const handleAddToChat = () => {
		if (addDocumentToChat && ocrResult) {
			addDocumentToChat(ocrResult);
			setAddToChatMessage("Document added to chat! ✅");
			setTimeout(() => setAddToChatMessage(""), 3000);
		}
	};

	return (
		<div className="ocrResultContent">
			{/* Error Display */}
			{ocrResult?.error && (
				<div
					className="errorContainer"
					style={{
						padding: "1rem",
						margin: "1rem 0",
						borderRadius: "0.5rem",
						backgroundColor: "#fee2e2",
						border: "1px solid #f87171",
						color: "#dc2626",
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
					}}>
					<X size={16} />
					<span>{ocrResult.error}</span>
				</div>
			)}

			<div className="ocrResultHeader">
				<div className="headerTitle">
					<Eye size={32} color="#10b981" />
					<h1>OCR Results</h1>
				</div>
				<p className="headerSubtitle">
					Extracted from:{" "}
					<strong>{ocrResult?.originalFileName}</strong>
				</p>
				<div className="storageNotice">
					<div className="storageInfo">
						<CheckCircle size={16} color="#10b981" />
						<span>
							Results automatically saved! You can edit the text
							and changes will be updated.
						</span>
					</div>
				</div>
			</div>

			{/* Save Message */}
			{saveMessage && (
				<div
					className="saveMessageContainer"
					style={{
						padding: "0.75rem 1rem",
						margin: "1rem 0",
						borderRadius: "0.5rem",
						backgroundColor:
							saveMessage.includes("Error") ||
							saveMessage.includes("Failed")
								? "#fee2e2"
								: "#dcfce7",
						border: `1px solid ${
							saveMessage.includes("Error") ||
							saveMessage.includes("Failed")
								? "#f87171"
								: "#10b981"
						}`,
						color:
							saveMessage.includes("Error") ||
							saveMessage.includes("Failed")
								? "#dc2626"
								: "#059669",
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
					}}>
					{saveMessage.includes("Error") ||
					saveMessage.includes("Failed") ? (
						<X size={16} />
					) : (
						<CheckCircle size={16} />
					)}
					<span>{saveMessage}</span>
				</div>
			)}

			{/* Processing Summary */}
			{ocrResult?.processingMetadata && (
				<div className="resultCard" style={{ marginBottom: "1.5rem" }}>
					{ocrResult?.summary && (
						<div className="processingSummaryText">
							<h3 className="sectionTitle">AI Summary</h3>
							<p className="summaryText">{ocrResult.summary}</p>
							{summaryMetaItems.length > 0 && (
								<div className="summaryMeta">
									{summaryMetaItems.map((item, index) => (
										<span key={index}>{item}</span>
									))}
								</div>
							)}
							{ocrResult?.summaryModel && (
								<span className="summaryModelTag">
									Model: {ocrResult.summaryModel}
								</span>
							)}
						</div>
					)}
				</div>
			)}

			<div className="ocrResultGrid">
				{/* Text Extraction Results */}
				<div className="resultCard">
					<div className="resultHeader">
						<h2 className="resultTitle">Extracted Text</h2>
						<button
							onClick={() => setIsEditing(!isEditing)}
							className={`editButton ${
								isEditing ? "editing" : ""
							}`}>
							{isEditing ? <X size={16} /> : <Edit3 size={16} />}
							{isEditing ? "Cancel" : "Edit"}
						</button>
					</div>

					{/* Text View Tabs */}
					<div className="textTabs">
						<button
							className={`textTab ${
								selectedTab === "final" ? "active" : ""
							}`}
							onClick={() => setSelectedTab("final")}>
							📄 Final Extracted Text
						</button>
						{(ocrResult?.enhancedTextNltk ||
							ocrResult?.correctedText) && (
							<button
								className={`textTab ${
									selectedTab === "enhanced" ? "active" : ""
								}`}
								onClick={() => setSelectedTab("enhanced")}>
								🔧 Enhanced Text (NLTK)
							</button>
						)}
						{(ocrResult?.originalOcrOutput ||
							ocrResult?.rawText) && (
							<button
								className={`textTab ${
									selectedTab === "original" ? "active" : ""
								}`}
								onClick={() => setSelectedTab("original")}>
								📸 Original OCR Output
							</button>
						)}
					</div>

					{/* Text Content */}
					<div className="extractedText">
						{isEditing ? (
							<div className="textEditor">
								<textarea
									value={editedText}
									onChange={(e) =>
										setEditedText(e.target.value)
									}
									className="textEditArea"
									placeholder="Edit the extracted text..."
								/>
								<div className="editActions">
									<button
										onClick={handleSaveEdit}
										className="saveButton">
										<Save size={16} />
										Save Changes
									</button>
									<button
										onClick={handleCancelEdit}
										className="cancelButton">
										Cancel
									</button>
								</div>
							</div>
						) : (
							<div className="textDisplay">
								{selectedTab === "final" && (
									<p>
										{ocrResult?.finalExtractedText ||
											ocrResult?.extractedText}
									</p>
								)}
								{selectedTab === "enhanced" && (
									<p>
										{ocrResult?.enhancedTextNltk ||
											ocrResult?.correctedText}
									</p>
								)}
								{selectedTab === "original" && (
									<p>
										{ocrResult?.originalOcrOutput ||
											ocrResult?.rawText}
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				{/* AI Analysis and Actions */}
				<div>
					{/* AI Analysis */}
					<div
						className="resultCard"
						style={{ marginBottom: "1.5rem" }}>
						<h2 className="resultTitle">Content Analysis</h2>

						{/* Stats */}
						<div className="analysisStats">
							<div className="statCard">
								<span className="statNumber">
									{ocrResult?.wordCount || 0}
								</span>
								<span className="statLabel">Words</span>
							</div>
							<div className="statCard">
								<span className="statNumber">
									{ocrResult?.readingTime || 0}m
								</span>
								<span className="statLabel">Read Time</span>
							</div>
							<div className="statCard">
								<span className="statNumber">
									{Math.round(
										(ocrResult?.confidenceScore || 0) * 100
									)}
									%
								</span>
								<span className="statLabel">Confidence</span>
							</div>
						</div>

						{/* Key Concepts */}
						<div className="analysisSection">
							<h3 className="sectionTitle">Key Concepts:</h3>
							<div className="conceptTags">
								{ocrResult?.concepts?.map((concept, index) => (
									<span key={index} className="conceptTag">
										{concept}
									</span>
								)) || (
									<span className="noData">
										No concepts identified
									</span>
								)}
							</div>
						</div>

						{/* Topics */}
						{ocrResult?.keyTopics &&
							ocrResult.keyTopics.length > 0 && (
								<div className="analysisSection">
									<h3 className="sectionTitle">
										Key Topics:
									</h3>
									<div className="topicList">
										{ocrResult.keyTopics.map(
											(topic, index) => (
												<span
													key={index}
													className="topicTag">
													{topic}
												</span>
											)
										)}
									</div>
								</div>
							)}

						{/* Difficulty */}
						<div className="analysisSection">
							<h3 className="sectionTitle">Difficulty Level:</h3>
							<span
								className={`difficultyTag difficulty${
									ocrResult?.difficulty || "Unknown"
								}`}>
								{ocrResult?.difficulty || "Unknown"}
							</span>
						</div>
					</div>

					{/* Actions */}
					<div className="actionCard">
						<h2 className="resultTitle">Learning Actions</h2>

						{/* Add to Chat Message */}
						{addToChatMessage && (
							<div
								style={{
									padding: "0.75rem 1rem",
									marginBottom: "1rem",
									borderRadius: "0.5rem",
									backgroundColor: "#dcfce7",
									border: "1px solid #10b981",
									color: "#059669",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
								}}>
								<CheckCircle size={16} />
								<span>{addToChatMessage}</span>
							</div>
						)}

						<button
							onClick={handleAddToChat}
							className="actionButton actionButtonBlue">
							<div className="actionContent">
								<MessageSquare
									size={20}
									color="#2563eb"
									className="actionIcon"
								/>
								<div>
									<div className="actionTitle">
										Add to AI Chat
									</div>
									<div className="actionDescription">
										Load this document for AI discussions
									</div>
								</div>
							</div>
						</button>
						<button
							onClick={() => navigate("/ocr")}
							className="actionButton actionButtonGreen">
							<div className="actionContent">
								<Upload
									size={20}
									color="#059669"
									className="actionIcon"
								/>
								<div>
									<div className="actionTitle">
										Upload Another Document
									</div>
									<div className="actionDescription">
										Process more learning materials
									</div>
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OCRResultPage;
