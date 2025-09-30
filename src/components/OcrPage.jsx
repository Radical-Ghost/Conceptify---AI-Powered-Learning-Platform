import React, { useState, useEffect } from "react";
import { Camera, Upload, History, FileText, Calendar } from "lucide-react";
import "../styles/OcrPage.css";

const OCRPage = ({ handleFileUpload, setCurrentPage, setOcrResult }) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [ocrHistory, setOcrHistory] = useState([]);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);

	// Fetch OCR history on component mount
	useEffect(() => {
		fetchOcrHistory();
	}, []);

	const fetchOcrHistory = async () => {
		try {
			const response = await fetch(
				"http://localhost:5001/api/ocr/results"
			);
			const data = await response.json();
			setOcrHistory(data.results || []);
		} catch (error) {
			console.error("Error fetching OCR history:", error);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	const handleHistoryItemClick = async (historyItem) => {
		try {
			// Fetch the full OCR result by filename
			const response = await fetch(
				`http://localhost:5001/api/ocr/result/${historyItem.filename}`
			);
			const result = await response.json();

			if (response.ok) {
				// Transform the result to match the expected structure
				const transformedResult = {
					originalFileName: result.originalFileName,
					extractedText:
						result.data?.extraction_results?.extracted_text,
					rawText: result.data?.extraction_results?.raw_text,
					correctedText:
						result.data?.extraction_results?.corrected_text,
					concepts: result.data?.ai_analysis?.concepts,
					difficulty: result.data?.ai_analysis?.difficulty,
					wordCount: result.data?.ai_analysis?.word_count,
					readingTime:
						result.data?.ai_analysis?.estimated_reading_time,
					keyTopics: result.data?.ai_analysis?.key_topics,
					confidenceScore: result.data?.ai_analysis?.confidence_score,
					processingMetadata: result.data?.processing_metadata,
					fileInfo: result.data?.file_info,
					savedFileName: result.savedFileName, // Important for editing
				};

				setOcrResult(transformedResult);
				setCurrentPage("ocr-result");
			} else {
				console.error("Failed to load OCR result:", result.error);
				// Could add error state here if needed
			}
		} catch (error) {
			console.error("Error loading OCR result:", error);
			// Could add error state here if needed
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			setIsProcessing(true);
			handleFileUpload(files[0]);
		}
	};

	const handleFileSelect = (e) => {
		const files = e.target.files;
		if (files.length > 0) {
			setIsProcessing(true);
			handleFileUpload(files[0]);
		}
	};

	return (
		<div className="ocrPageContent">
			<div className="ocrHeader">
				<div className="headerTitle">
					<Camera size={32} color="#8b5cf6" />
					<h1>Upload Document or Image</h1>
				</div>
				<p className="ocrSubtitle">
					Extract text and get AI-powered learning insights
				</p>
			</div>

			<div className="ocrMainContent">
				<div className="uploadSection">
					{isProcessing ? (
						<div className="ocrProcessing">
							<div className="spinner"></div>
							<h3 className="processingTitle">Processing...</h3>
							<p className="processingText">
								Extracting text and analyzing content
							</p>
						</div>
					) : (
						<div
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							className={`uploadArea ${
								isDragOver ? "uploadAreaHover" : ""
							}`}>
							<Upload size={64} className="uploadIcon" />
							<h3 className="uploadTitle">
								Drag & Drop or Click to Upload
							</h3>
							<p className="uploadDescription">
								Support for images (JPG, PNG) and documents
								(PDF)
							</p>
							<input
								type="file"
								onChange={handleFileSelect}
								accept="image/*,.pdf"
								className="hiddenInput"
								id="file-input"
							/>
							<label
								htmlFor="file-input"
								className="uploadButton">
								Choose File
							</label>
						</div>
					)}
				</div>

				{/* OCR History Section */}
				<div className="historySection">
					<div className="historyHeader">
						<div className="historyTitle">
							<History size={24} color="#6b7280" />
							<h3>Recent OCR Results</h3>
						</div>
					</div>

					<div className="historyList">
						{isLoadingHistory ? (
							<div className="historyLoading">
								Loading history...
							</div>
						) : ocrHistory.length === 0 ? (
							<div className="historyEmpty">
								<FileText size={48} color="#d1d5db" />
								<p>No OCR results yet</p>
								<p className="historyEmptySubtext">
									Upload a document to get started
								</p>
							</div>
						) : (
							ocrHistory.map((item, index) => (
								<div
									key={index}
									className="historyItem"
									onClick={() =>
										handleHistoryItemClick(item)
									}>
									<div className="historyItemIcon">
										<FileText size={20} color="#8b5cf6" />
									</div>
									<div className="historyItemContent">
										<div className="historyItemName">
											{item.originalName}
										</div>
										<div className="historyItemPreview">
											{item.extractedText}
										</div>
										<div className="historyItemMeta">
											<Calendar size={14} />
											<span>
												{new Date(
													item.created
												).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OCRPage;
