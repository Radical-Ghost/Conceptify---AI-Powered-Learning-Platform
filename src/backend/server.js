// Backend server setup for OCR processing
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Python with GPU support (in .venv)
const PYTHON_PATH = path.join(
	__dirname,
	"..",
	"..",
	".venv",
	"Scripts",
	"python.exe"
);

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadsDir = path.join(__dirname, "uploads");
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		// Generate unique filename with timestamp
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 50 * 1024 * 1024, // 50MB limit
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif|pdf/;
		const extname = allowedTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = allowedTypes.test(file.mimetype);

		if (mimetype && extname) {
			return cb(null, true);
		} else {
			cb(
				new Error(
					"Only image files (JPEG, JPG, PNG, GIF) and PDF files are allowed!"
				)
			);
		}
	},
});

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ status: "healthy", message: "Backend server is running" });
});

// Get saved OCR results with content
app.get("/api/ocr/results", (req, res) => {
	try {
		const dataDir = path.join(__dirname, "data");

		if (!fs.existsSync(dataDir)) {
			return res.json({ results: [], message: "No OCR results found" });
		}

		const files = fs
			.readdirSync(dataDir)
			.filter((file) => file.endsWith(".json"))
			.map((file) => {
				const filePath = path.join(dataDir, file);
				const stats = fs.statSync(filePath);

				// Skip empty or corrupted files
				if (stats.size === 0) {
					console.warn(`⚠️  Skipping empty file: ${file}`);
					return null;
				}

				// Read the file content to get metadata
				try {
					const fileContent = fs.readFileSync(filePath, "utf8").trim();
					
					// Skip if file is empty or just whitespace
					if (!fileContent) {
						console.warn(`⚠️  Skipping empty content: ${file}`);
						return null;
					}
					
					const content = JSON.parse(fileContent);
					return {
						filename: file,
						originalName:
							content.originalFileName ||
							file.replace("_", " ").replace(".json", ""),
						created: stats.birthtime,
						size: stats.size,
						extractedText:
							content.data?.extraction_results?.extracted_text?.substring(
								0,
								100
							) + "..." || "No text available",
					};
				} catch (err) {
					console.error(`❌ Error reading OCR result file (${file}):`, err.message);
					// Return null for corrupted files instead of error object
					return null;
				}
			})
			.filter(file => file !== null) // Remove null entries
			.sort((a, b) => b.created - a.created); // Sort by newest first

		res.json({ results: files, count: files.length });
	} catch (error) {
		console.error("Error listing OCR results:", error);
		res.status(500).json({ error: "Failed to list OCR results" });
	}
});

// OCR processing endpoint
app.post("/api/ocr/process", upload.single("file"), (req, res) => {
	console.log("📄 OCR processing request received");
	console.log("🐍 Using Python:", PYTHON_PATH);

	if (!req.file) {
		console.error("❌ No file uploaded");
		return res.status(400).json({ error: "No file uploaded" });
	}

	const filePath = req.file.path;
	const originalFileName = req.file.originalname;
	console.log(`📁 Processing file: ${originalFileName}`);
	console.log(`💾 Saved to: ${filePath}`);

	// Spawn Python process to handle OCR (use .venv Python with GPU support)
	const pythonProcess = spawn(
		PYTHON_PATH,
		[path.join(__dirname, "ocr_wrapper.py"), filePath],
		{
			cwd: __dirname,
			stdio: ["pipe", "pipe", "pipe"],
		}
	);

	let pythonOutput = "";
	let pythonError = "";

	pythonProcess.stdout.on("data", (data) => {
		pythonOutput += data.toString();
	});

	pythonProcess.stderr.on("data", (data) => {
		pythonError += data.toString();
	});

	pythonProcess.on("close", (code) => {
		console.log(`🐍 Python process exited with code: ${code}`);

		// Always log stderr (contains diagnostic messages)
		if (pythonError.trim()) {
			console.log("🔍 Python diagnostics:", pythonError);
		}

		if (code !== 0) {
			console.error("❌ Python process error:", pythonError);
			return res.status(500).json({
				error: "OCR processing failed",
				details: pythonError,
			});
		}

		try {
			console.log(
				"📤 Python output:",
				pythonOutput.substring(0, 200) + "..."
			);
			const pythonResult = JSON.parse(pythonOutput);
			const summaryText =
				pythonResult.summary ||
				pythonResult.aiSummary ||
				pythonResult.data?.ai_analysis?.summary ||
				"";
			const summaryModel =
				pythonResult.summary_model ||
				pythonResult.data?.ai_analysis?.summary_model ||
				"facebook/bart-large-cnn";
			const summaryDetails =
				pythonResult.summaryDetails ||
				pythonResult.data?.ai_analysis?.summary_details ||
				{};
			const summaryTime =
				pythonResult.summaryTime ??
				pythonResult.data?.processing_metadata?.summary_time ??
				0;

			// Transform the response to match frontend expectations
			const transformedResult = {
				success: pythonResult.success,
				originalFileName: originalFileName,
				data: {
					extraction_results: {
						extracted_text:
							pythonResult.finalExtractedText ||
							pythonResult.extractedText ||
							pythonResult.final_text ||
							"",
						raw_text:
							pythonResult.originalOcrOutput ||
							pythonResult.rawText ||
							pythonResult.raw_ocr_text ||
							"",
						corrected_text:
							pythonResult.enhancedTextNltk ||
							pythonResult.correctedText ||
							pythonResult.corrected_text ||
							"",
					},
					ai_analysis: {
						concepts: pythonResult.concepts || [],
						difficulty: pythonResult.difficulty || "Medium",
						word_count: pythonResult.wordCount || 0,
						estimated_reading_time:
							pythonResult.readingTime || "1 min",
						key_topics: pythonResult.keyTopics || [],
						confidence_score: pythonResult.confidenceScore || 0.85,
						summary: summaryText,
						summary_model: summaryText ? summaryModel : "",
						summary_details: summaryDetails,
						summary_time: summaryTime,
					},
					processing_metadata: pythonResult.processingMetadata || {
						processing_time: "1.2s",
						method: "hybrid",
					},
					file_info: {
						filename: originalFileName,
						size: "Unknown",
						type: path.extname(originalFileName),
					},
				},
			};

			// Save immediately after processing
			const dataDir = path.join(__dirname, "data");
			if (!fs.existsSync(dataDir)) {
				fs.mkdirSync(dataDir, { recursive: true });
			}

			const timestamp = Date.now();
			const baseFileName = path.parse(originalFileName).name;
			const resultFileName = `${baseFileName}_${timestamp}.json`;
			const resultFilePath = path.join(dataDir, resultFileName);

			// Add filename to the result before saving
			transformedResult.savedFileName = resultFileName;
			transformedResult.summary = summaryText;
			transformedResult.summaryModel = summaryText ? summaryModel : "";
			transformedResult.summaryDetails = summaryDetails;
			transformedResult.summaryTime = summaryTime;

			// Validate result before saving
			const resultContent = JSON.stringify(transformedResult, null, 2);
			if (!resultContent || resultContent.length < 10) {
				throw new Error("Result is empty or invalid");
			}

			fs.writeFileSync(resultFilePath, resultContent);
			console.log(
				`💾 OCR result automatically saved to: ${resultFileName} (${(resultContent.length / 1024).toFixed(2)} KB)`
			);

			res.json(transformedResult);
		} catch (parseError) {
			console.error("❌ Error parsing Python output:", parseError);
			console.error("📄 Raw Python output:", pythonOutput);
			res.status(500).json({
				error: "Failed to parse OCR results",
				details: parseError.message,
			});
		}

		// Clean up uploaded file
		try {
			fs.unlinkSync(filePath);
			console.log("🗑️ Temporary file cleaned up");
		} catch (cleanupError) {
			console.warn(
				"⚠️ Failed to clean up temporary file:",
				cleanupError.message
			);
		}
	});

	pythonProcess.on("error", (error) => {
		console.error("❌ Failed to start Python process:", error);
		res.status(500).json({
			error: "Failed to start OCR processing",
			details: error.message,
		});
	});
});

// Get specific OCR result by filename
app.get("/api/ocr/result/:filename", (req, res) => {
	console.log("📄 Get specific OCR result request received");

	try {
		const { filename } = req.params;
		const dataDir = path.join(__dirname, "data");
		const filePath = path.join(dataDir, filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: "OCR result file not found" });
		}

		const result = JSON.parse(fs.readFileSync(filePath, "utf8"));
		res.json(result);
	} catch (error) {
		console.error("❌ Error retrieving OCR result:", error);
		res.status(500).json({
			error: "Failed to retrieve OCR result",
			details: error.message,
		});
	}
});

// Update OCR result endpoint (for in-place editing)
app.put("/api/ocr/update/:filename", (req, res) => {
	console.log("📝 Update OCR result request received");

	try {
		const { filename } = req.params;
		const { editedText } = req.body;

		if (!filename || !editedText) {
			return res
				.status(400)
				.json({ error: "Missing filename or edited text" });
		}

		const dataDir = path.join(__dirname, "data");
		const filePath = path.join(dataDir, filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: "OCR result file not found" });
		}

		// Read existing result
		const existingResult = JSON.parse(fs.readFileSync(filePath, "utf8"));

		// Update with edited text
		const updatedResult = {
			...existingResult,
			data: {
				...existingResult.data,
				extraction_results: {
					...existingResult.data.extraction_results,
					extracted_text: editedText,
					edited_by_user: true,
					edit_timestamp: new Date().toISOString(),
				},
			},
		};

		// Save updated result
		fs.writeFileSync(filePath, JSON.stringify(updatedResult, null, 2));
		console.log(`💾 OCR result updated: ${filename}`);

		res.json({
			success: true,
			message: "OCR result updated successfully",
		});
	} catch (error) {
		console.error("❌ Error updating OCR result:", error);
		res.status(500).json({
			error: "Failed to update OCR result",
			details: error.message,
		});
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Backend server running on http://localhost:${PORT}`);
	console.log(`� Python executable: ${PYTHON_PATH}`);
	console.log(`✅ Python exists: ${fs.existsSync(PYTHON_PATH)}`);
	console.log(`�📄 OCR processing endpoint: POST /api/ocr/process`);
	console.log(`📄 Get specific OCR result: GET /api/ocr/result/:filename`);
	console.log(`📝 Update OCR results: PUT /api/ocr/update/:filename`);
	console.log(`📋 List OCR results: GET /api/ocr/results`);
	console.log(`💚 Health check: GET /api/health`);
});
