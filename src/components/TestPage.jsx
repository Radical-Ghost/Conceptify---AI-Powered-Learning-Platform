import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ClipboardCheck,
	FileText,
	Clock,
	CheckCircle2,
	TrendingUp,
	Calendar,
	Award,
	PlayCircle,
} from "lucide-react";
import "../styles/TestPage.css";

const TestPage = ({ setActiveTest }) => {
	const navigate = useNavigate();
	const [uploadedDocs, setUploadedDocs] = useState([]);
	const [testHistory, setTestHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({
		totalTests: 0,
		completedTests: 0,
		pendingTests: 0,
		averageScore: 0,
	});

	useEffect(() => {
		fetchUploadedDocuments();
		loadTestHistory();
	}, []);

	const fetchUploadedDocuments = async () => {
		try {
			const response = await fetch(
				"http://localhost:5001/api/ocr/results"
			);
			const data = await response.json();
			const docs = data.results || [];
			setUploadedDocs(docs);

			// Calculate stats
			const storedHistory =
				JSON.parse(localStorage.getItem("testHistory")) || [];
			const completedDocs = storedHistory.map((t) => t.documentId);
			const pending = docs.filter(
				(d) => !completedDocs.includes(d.filename)
			);

			setStats({
				totalTests: docs.length,
				completedTests: storedHistory.length,
				pendingTests: pending.length,
				averageScore:
					storedHistory.length > 0
						? Math.round(
								storedHistory.reduce(
									(acc, t) => acc + t.score,
									0
								) / storedHistory.length
						  )
						: 0,
			});
		} catch (error) {
			console.error("Error fetching documents:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const loadTestHistory = () => {
		const history = JSON.parse(localStorage.getItem("testHistory")) || [];
		setTestHistory(history.sort((a, b) => b.timestamp - a.timestamp));
	};

	const handleStartTest = (doc) => {
		setActiveTest({
			documentId: doc.filename,
			documentName: doc.originalName,
			timestamp: Date.now(),
		});
		navigate("/take-test");
	};

	const isTestCompleted = (docFilename) => {
		return testHistory.some((t) => t.documentId === docFilename);
	};

	const getTestScore = (docFilename) => {
		const test = testHistory.find((t) => t.documentId === docFilename);
		return test ? test.score : null;
	};

	return (
		<div className="testPageContent">
			{/* Header */}
			<div className="testHeader">
				<div className="headerTitle">
					<ClipboardCheck size={32} color="#3b82f6" />
					<h1>Test Center</h1>
				</div>
				<p className="testSubtitle">
					Take tests on your uploaded documents and track your
					progress
				</p>
			</div>

			{/* Stats Dashboard */}
			<div className="statsGrid">
				<div className="statCard statCardBlue">
					<div className="statIcon">
						<FileText size={24} />
					</div>
					<div className="statInfo">
						<div className="statNumber">{stats.totalTests}</div>
						<div className="statLabel">Total Documents</div>
					</div>
				</div>

				<div className="statCard statCardGreen">
					<div className="statIcon">
						<CheckCircle2 size={24} />
					</div>
					<div className="statInfo">
						<div className="statNumber">{stats.completedTests}</div>
						<div className="statLabel">Tests Completed</div>
					</div>
				</div>

				<div className="statCard statCardOrange">
					<div className="statIcon">
						<Clock size={24} />
					</div>
					<div className="statInfo">
						<div className="statNumber">{stats.pendingTests}</div>
						<div className="statLabel">Tests Pending</div>
					</div>
				</div>

				<div className="statCard statCardPurple">
					<div className="statIcon">
						<TrendingUp size={24} />
					</div>
					<div className="statInfo">
						<div className="statNumber">{stats.averageScore}%</div>
						<div className="statLabel">Average Score</div>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="testMainGrid">
				{/* Available Tests */}
				<div className="testSection">
					<h2 className="sectionTitle">
						<FileText size={20} />
						Available Tests
					</h2>

					{isLoading ? (
						<div className="loadingState">
							<div className="spinner"></div>
							<p>Loading documents...</p>
						</div>
					) : uploadedDocs.length === 0 ? (
						<div className="emptyState">
							<FileText size={48} color="#d1d5db" />
							<p>No documents uploaded yet</p>
							<p className="emptySubtext">
								Upload documents from the OCR page to start
								taking tests
							</p>
						</div>
					) : (
						<div className="documentsGrid">
							{uploadedDocs.map((doc, index) => {
								const completed = isTestCompleted(doc.filename);
								const score = getTestScore(doc.filename);

								return (
									<div
										key={index}
										className={`documentCard ${
											completed
												? "documentCardCompleted"
												: ""
										}`}
										onClick={() => handleStartTest(doc)}>
										<div className="documentCardHeader">
											<FileText
												size={20}
												color={
													completed
														? "#10b981"
														: "#3b82f6"
												}
											/>
											{completed && (
												<div className="completedBadge">
													<CheckCircle2 size={14} />
													<span>Completed</span>
												</div>
											)}
										</div>

										<div className="documentCardBody">
											<h3 className="documentTitle">
												{doc.originalName}
											</h3>
											<p className="documentMeta">
												Uploaded:{" "}
												{new Date(
													doc.created
												).toLocaleDateString()}
											</p>
											{completed && score !== null && (
												<div className="scoreDisplay">
													<Award size={16} />
													<span>Score: {score}%</span>
												</div>
											)}
										</div>

										<div className="documentCardFooter">
											<button className="startTestBtn">
												<PlayCircle size={16} />
												{completed
													? "Retake Test"
													: "Start Test"}
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Test History */}
				<div className="historySection">
					<h2 className="sectionTitle">
						<Calendar size={20} />
						Test History
					</h2>

					{testHistory.length === 0 ? (
						<div className="emptyHistory">
							<Clock size={40} color="#d1d5db" />
							<p>No tests taken yet</p>
						</div>
					) : (
						<div className="historyList">
							{testHistory.map((test, index) => (
								<div
									key={index}
									className="historyItem"
									onClick={() =>
										navigate("/test-result", {
											state: { testResult: test },
										})
									}
									style={{ cursor: "pointer" }}>
									<div className="historyIcon">
										<Award
											size={20}
											color={
												test.score >= 70
													? "#10b981"
													: test.score >= 50
													? "#f59e0b"
													: "#ef4444"
											}
										/>
									</div>
									<div className="historyContent">
										<div className="historyTitle">
											{test.documentName}
										</div>
										<div className="historyMeta">
											<span>
												{new Date(
													test.timestamp
												).toLocaleString()}
											</span>
											<span className="historySeparator">
												•
											</span>
											<span>
												{test.questionsAnswered}/
												{test.totalQuestions} questions
											</span>
										</div>
									</div>
									<div
										className={`historyScore ${
											test.score >= 70
												? "scoreHigh"
												: test.score >= 50
												? "scoreMedium"
												: "scoreLow"
										}`}>
										{test.score}%
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TestPage;
