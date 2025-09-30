import React from "react";
import { BookOpen, MessageSquare, Camera, Bot } from "lucide-react";
import "../styles/LandingPage.css";

const LandingPage = ({ setCurrentPage }) => (
	<div className="landingPage">
		<div className="landingContainer">
			<div className="landingHeader">
				<div className="brandContainer">
					<BookOpen size={48} color="#60a5fa" />
					<h1 className="brandTitle">Conceptify</h1>
				</div>
				<p className="subtitle">
					AI-Powered Learning Platform - Transform any content into
					interactive learning experiences
				</p>
			</div>

			<div className="featureGrid">
				<div className="featureCard">
					<MessageSquare
						size={48}
						color="#60a5fa"
						className="featureIcon"
					/>
					<h3 className="featureTitle">AI Chatbot</h3>
					<p className="featureDescription">
						Interactive learning conversations with AI
					</p>
				</div>
				<div className="featureCard">
					<Camera size={48} color="#a78bfa" className="featureIcon" />
					<h3 className="featureTitle">OCR Processing</h3>
					<p className="featureDescription">
						Extract and learn from any document or image
					</p>
				</div>
				<div className="featureCard">
					<Bot size={48} color="#818cf8" className="featureIcon" />
					<h3 className="featureTitle">Smart Analysis</h3>
					<p className="featureDescription">
						AI-powered concept breakdown and explanation
					</p>
				</div>
			</div>

			<div className="buttonContainer">
				<button
					onClick={() => setCurrentPage("login")}
					className="primaryButton">
					Get Started
				</button>
				<button
					onClick={() => setCurrentPage("signup")}
					className="secondaryButton">
					Sign Up
				</button>
			</div>
		</div>
	</div>
);

export default LandingPage;
