import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Clock,
	CheckCircle,
	Circle,
	Award,
	FileText,
} from "lucide-react";
import "../styles/TakeTestPage.css";

const TakeTestPage = ({ activeTest }) => {
	const navigate = useNavigate();
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState({});
	const [showResults, setShowResults] = useState(false);
	const [timeElapsed, setTimeElapsed] = useState(0);

	// Dummy test data (will be replaced with AI-generated questions later)
	const dummyQuestions = [
		{
			id: 1,
			question: "What is the main topic discussed in this document?",
			options: [
				"Machine Learning Fundamentals",
				"Web Development",
				"Database Management",
				"Network Security",
			],
			correctAnswer: 0,
		},
		{
			id: 2,
			question:
				"Which of the following concepts is emphasized in the text?",
			options: [
				"Object-Oriented Programming",
				"Data Structures",
				"Algorithm Optimization",
				"Software Testing",
			],
			correctAnswer: 2,
		},
		{
			id: 3,
			question:
				"According to the document, what is the key benefit of the discussed approach?",
			options: [
				"Faster execution time",
				"Lower memory usage",
				"Better scalability",
				"Easier maintenance",
			],
			correctAnswer: 2,
		},
		{
			id: 4,
			question: "Which method is recommended in the document?",
			options: [
				"Waterfall methodology",
				"Agile methodology",
				"Spiral model",
				"V-model",
			],
			correctAnswer: 1,
		},
		{
			id: 5,
			question: "What conclusion does the document reach?",
			options: [
				"More research is needed",
				"The approach is highly effective",
				"Results are inconclusive",
				"Traditional methods are better",
			],
			correctAnswer: 1,
		},
	];

	const totalQuestions = dummyQuestions.length;

	const handleAnswerSelect = (questionIndex, optionIndex) => {
		setSelectedAnswers({
			...selectedAnswers,
			[questionIndex]: optionIndex,
		});
	};

	const handleNext = () => {
		if (currentQuestion < totalQuestions - 1) {
			setCurrentQuestion(currentQuestion + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1);
		}
	};

	const handleSubmit = () => {
		// Calculate score
		let correct = 0;
		dummyQuestions.forEach((q, idx) => {
			if (selectedAnswers[idx] === q.correctAnswer) {
				correct++;
			}
		});

		const score = Math.round((correct / totalQuestions) * 100);

		// Save to history
		const testResult = {
			documentId: activeTest.documentId,
			documentName: activeTest.documentName,
			timestamp: Date.now(),
			score: score,
			questionsAnswered: Object.keys(selectedAnswers).length,
			totalQuestions: totalQuestions,
			correctAnswers: correct,
		};

		const history = JSON.parse(localStorage.getItem("testHistory")) || [];
		history.push(testResult);
		localStorage.setItem("testHistory", JSON.stringify(history));

		setShowResults(true);
	};

	const handleReturnToTests = () => {
		navigate("/test");
	};

	const calculateScore = () => {
		let correct = 0;
		dummyQuestions.forEach((q, idx) => {
			if (selectedAnswers[idx] === q.correctAnswer) {
				correct++;
			}
		});
		return Math.round((correct / totalQuestions) * 100);
	};

	const getCorrectCount = () => {
		let correct = 0;
		dummyQuestions.forEach((q, idx) => {
			if (selectedAnswers[idx] === q.correctAnswer) {
				correct++;
			}
		});
		return correct;
	};

	if (showResults) {
		const score = calculateScore();
		const correctCount = getCorrectCount();

		return (
			<div className="takeTestContent">
				<div className="resultsContainer">
					<div className="resultsHeader">
						<Award
							size={64}
							color={
								score >= 70
									? "#10b981"
									: score >= 50
									? "#f59e0b"
									: "#ef4444"
							}
						/>
						<h1>Test Completed!</h1>
						<p className="resultsDocument">
							{activeTest.documentName}
						</p>
					</div>

					<div className="resultsScore">
						<div
							className={`scoreCircle ${
								score >= 70
									? "scoreHigh"
									: score >= 50
									? "scoreMedium"
									: "scoreLow"
							}`}>
							<span className="scoreNumber">{score}%</span>
						</div>
					</div>

					<div className="resultsStats">
						<div className="resultStat">
							<CheckCircle size={20} color="#10b981" />
							<div>
								<div className="statValue">
									{correctCount}/{totalQuestions}
								</div>
								<div className="statLabel">Correct Answers</div>
							</div>
						</div>

						<div className="resultStat">
							<FileText size={20} color="#3b82f6" />
							<div>
								<div className="statValue">
									{Object.keys(selectedAnswers).length}/
									{totalQuestions}
								</div>
								<div className="statLabel">
									Questions Answered
								</div>
							</div>
						</div>
					</div>

					<div className="resultsActions">
						<button
							onClick={handleReturnToTests}
							className="returnButton">
							<ArrowLeft size={16} />
							Back to Tests
						</button>
					</div>
				</div>
			</div>
		);
	}

	const question = dummyQuestions[currentQuestion];
	const answeredCount = Object.keys(selectedAnswers).length;

	return (
		<div className="takeTestContent">
			{/* Test Header */}
			<div className="testTopBar">
				<button onClick={handleReturnToTests} className="backButton">
					<ArrowLeft size={20} />
					Back
				</button>

				<div className="testInfo">
					<h2>{activeTest.documentName}</h2>
					<div className="testMeta">
						<Clock size={16} />
						<span>
							Question {currentQuestion + 1} of {totalQuestions}
						</span>
					</div>
				</div>

				<div className="testProgress">
					<span>
						{answeredCount}/{totalQuestions} answered
					</span>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="progressBar">
				<div
					className="progressFill"
					style={{
						width: `${
							((currentQuestion + 1) / totalQuestions) * 100
						}%`,
					}}></div>
			</div>

			{/* Question Card */}
			<div className="questionContainer">
				<div className="questionCard">
					<div className="questionHeader">
						<span className="questionNumber">
							Question {currentQuestion + 1}
						</span>
					</div>

					<h3 className="questionText">{question.question}</h3>

					<div className="optionsContainer">
						{question.options.map((option, idx) => (
							<div
								key={idx}
								className={`optionCard ${
									selectedAnswers[currentQuestion] === idx
										? "optionSelected"
										: ""
								}`}
								onClick={() =>
									handleAnswerSelect(currentQuestion, idx)
								}>
								<div className="optionRadio">
									{selectedAnswers[currentQuestion] ===
									idx ? (
										<CheckCircle size={20} />
									) : (
										<Circle size={20} />
									)}
								</div>
								<div className="optionText">{option}</div>
							</div>
						))}
					</div>
				</div>

				{/* Navigation */}
				<div className="questionNavigation">
					<button
						onClick={handlePrevious}
						disabled={currentQuestion === 0}
						className="navButton navButtonSecondary">
						Previous
					</button>

					{currentQuestion === totalQuestions - 1 ? (
						<button
							onClick={handleSubmit}
							className="navButton navButtonPrimary"
							disabled={
								Object.keys(selectedAnswers).length === 0
							}>
							Submit Test
						</button>
					) : (
						<button
							onClick={handleNext}
							className="navButton navButtonPrimary">
							Next Question
						</button>
					)}
				</div>

				{/* Question Indicator */}
				<div className="questionIndicators">
					{dummyQuestions.map((_, idx) => (
						<div
							key={idx}
							className={`indicator ${
								idx === currentQuestion
									? "indicatorActive"
									: selectedAnswers[idx] !== undefined
									? "indicatorAnswered"
									: ""
							}`}
							onClick={() => setCurrentQuestion(idx)}>
							{idx + 1}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TakeTestPage;
