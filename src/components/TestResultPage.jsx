import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	ArrowLeft,
	Award,
	CheckCircle,
	XCircle,
	Calendar,
	Clock,
	Target,
	BookOpen,
	Lightbulb,
} from "lucide-react";
import "../styles/TestResultPage.css";

const TestResultPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [testResult, setTestResult] = useState(null);

	useEffect(() => {
		// Get test result from location state or localStorage
		if (location.state?.testResult) {
			setTestResult(location.state.testResult);
		} else {
			// If no state, try to get from localStorage (in case of page refresh)
			const savedResult = localStorage.getItem("currentTestResult");
			if (savedResult) {
				setTestResult(JSON.parse(savedResult));
			} else {
				// If no data, redirect back to tests page
				navigate("/test");
			}
		}
	}, [location, navigate]);

	useEffect(() => {
		// Save current test result to localStorage for page refresh
		if (testResult) {
			localStorage.setItem(
				"currentTestResult",
				JSON.stringify(testResult)
			);
		}
	}, [testResult]);

	const handleBackToTests = () => {
		localStorage.removeItem("currentTestResult");
		navigate("/test");
	};

	const handleRetakeTest = () => {
		localStorage.removeItem("currentTestResult");
		navigate("/take-test", {
			state: {
				documentId: testResult.documentId,
				documentName: testResult.documentName,
			},
		});
	};

	if (!testResult) {
		return (
			<div className="testResultLoading">
				<p>Loading test results...</p>
			</div>
		);
	}

	// Calculate statistics
	const totalQuestions = testResult.totalQuestions || 0;
	const correctAnswers = testResult.correctAnswers || 0;
	const incorrectAnswers = totalQuestions - correctAnswers;
	const score = testResult.score || 0;

	// Determine score color
	const getScoreColor = () => {
		if (score >= 70) return "scoreHigh";
		if (score >= 50) return "scoreMedium";
		return "scoreLow";
	};

	return (
		<div className="testResultPage">
			{/* Header Section */}
			<div className="testResultHeader">
				<button onClick={handleBackToTests} className="backButton">
					<ArrowLeft size={20} />
					<span>Back to Tests</span>
				</button>

				<div className="testResultTitle">
					<Award size={32} color="#3b82f6" />
					<div>
						<h1>{testResult.documentName}</h1>
						<p className="testResultSubtitle">
							Test Results & Review
						</p>
					</div>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="resultSummaryGrid">
				<div className="summaryCard">
					<div className="summaryIcon scoreIcon">
						<Target size={24} />
					</div>
					<div className="summaryContent">
						<div className="summaryLabel">Score</div>
						<div className={`summaryValue ${getScoreColor()}`}>
							{score}%
						</div>
					</div>
				</div>

				<div className="summaryCard">
					<div className="summaryIcon correctIcon">
						<CheckCircle size={24} />
					</div>
					<div className="summaryContent">
						<div className="summaryLabel">Correct</div>
						<div className="summaryValue correctValue">
							{correctAnswers}
						</div>
					</div>
				</div>

				<div className="summaryCard">
					<div className="summaryIcon incorrectIcon">
						<XCircle size={24} />
					</div>
					<div className="summaryContent">
						<div className="summaryLabel">Incorrect</div>
						<div className="summaryValue incorrectValue">
							{incorrectAnswers}
						</div>
					</div>
				</div>

				<div className="summaryCard">
					<div className="summaryIcon totalIcon">
						<BookOpen size={24} />
					</div>
					<div className="summaryContent">
						<div className="summaryLabel">Total Questions</div>
						<div className="summaryValue">{totalQuestions}</div>
					</div>
				</div>
			</div>

			{/* Test Metadata */}
			<div className="testMetadata">
				<div className="metadataItem">
					<Calendar size={16} />
					<span>
						{new Date(testResult.timestamp).toLocaleDateString(
							"en-US",
							{
								year: "numeric",
								month: "long",
								day: "numeric",
							}
						)}
					</span>
				</div>
				<div className="metadataItem">
					<Clock size={16} />
					<span>
						{new Date(testResult.timestamp).toLocaleTimeString(
							"en-US",
							{
								hour: "2-digit",
								minute: "2-digit",
							}
						)}
					</span>
				</div>
			</div>

			{/* Question Review Section */}
			<div className="questionsReviewSection">
				<div className="sectionHeader">
					<h2>Detailed Question Review</h2>
					<button onClick={handleRetakeTest} className="retakeButton">
						Retake Test
					</button>
				</div>

				{testResult.detailedAnswers &&
				testResult.detailedAnswers.length > 0 ? (
					<div className="questionsList">
						{testResult.detailedAnswers.map((qa, index) => (
							<div
								key={index}
								className={`questionReviewCard ${
									qa.isCorrect
										? "correctQuestionCard"
										: "incorrectQuestionCard"
								}`}>
								{/* Question Header */}
								<div className="questionReviewHeader">
									<div className="questionNumber">
										<span>Question {index + 1}</span>
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
									<div
										className={`statusBadge ${
											qa.isCorrect
												? "correctBadge"
												: "incorrectBadge"
										}`}>
										{qa.isCorrect ? "Correct" : "Incorrect"}
									</div>
								</div>

								{/* Question Text */}
								<div className="questionText">
									<p>{qa.question}</p>
								</div>

								{/* Answer Options */}
								<div className="answerOptions">
									{qa.options.map((option, optIdx) => {
										const isUserAnswer =
											optIdx === qa.userAnswer;
										const isCorrectAnswer =
											optIdx === qa.correctAnswer;

										return (
											<div
												key={optIdx}
												className={`answerOption ${
													isCorrectAnswer
														? "correctAnswerOption"
														: ""
												} ${
													isUserAnswer &&
													!isCorrectAnswer
														? "incorrectAnswerOption"
														: ""
												} ${
													isUserAnswer
														? "userSelectedOption"
														: ""
												}`}>
												<div className="optionContent">
													<span className="optionLetter">
														{String.fromCharCode(
															65 + optIdx
														)}
														.
													</span>
													<span className="optionText">
														{option}
													</span>
												</div>
												<div className="optionBadges">
													{isCorrectAnswer && (
														<span className="optionBadge correctOptionBadge">
															<CheckCircle
																size={14}
															/>
															Correct Answer
														</span>
													)}
													{isUserAnswer &&
														!isCorrectAnswer && (
															<span className="optionBadge incorrectOptionBadge">
																<XCircle
																	size={14}
																/>
																Your Answer
															</span>
														)}
													{isUserAnswer &&
														isCorrectAnswer && (
															<span className="optionBadge correctOptionBadge">
																<CheckCircle
																	size={14}
																/>
																Your Answer
															</span>
														)}
												</div>
											</div>
										);
									})}
								</div>

								{/* Explanation Section */}
								<div className="explanationSection">
									<div className="explanationHeader">
										<Lightbulb size={18} />
										<span>Explanation</span>
									</div>
									<div className="explanationContent">
										<p>
											{qa.explanation ||
												`The correct answer is Option ${String.fromCharCode(
													65 + qa.correctAnswer
												)} - "${
													qa.options[qa.correctAnswer]
												}". ${
													qa.isCorrect
														? "You answered correctly!"
														: qa.userAnswer !==
														  undefined
														? `You selected Option ${String.fromCharCode(
																65 +
																	qa.userAnswer
														  )} - "${
																qa.options[
																	qa
																		.userAnswer
																]
														  }" which is incorrect.`
														: "You did not answer this question."
												} This question tests your understanding of the key concepts from the document.`}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="noDetailsAvailable">
						<BookOpen size={48} color="#94a3b8" />
						<h3>No Detailed Results Available</h3>
						<p>
							Detailed question-by-question results are not
							available for this test.
						</p>
						<p className="noDetailsHint">
							This feature is available for tests taken after the
							latest update.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TestResultPage;
