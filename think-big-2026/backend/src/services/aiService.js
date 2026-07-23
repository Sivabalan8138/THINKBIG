"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateAbstractWithAI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const evaluateAbstractWithAI = (abstractData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Using Google Gemini as the AI Engine
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not configured. Falling back to Mock AI Evaluation.');
        // Return mock data for testing purposes
        return {
            scores: {
                innovationAndCreativity: Math.floor(Math.random() * 10) + 10,
                technicalFeasibility: Math.floor(Math.random() * 10) + 10,
                problemSolvingCapability: Math.floor(Math.random() * 5) + 5,
                socialIndustrialImpact: Math.floor(Math.random() * 5) + 5,
                scalabilityFutureScope: Math.floor(Math.random() * 5) + 5,
                pptQualityDocumentation: Math.floor(Math.random() * 5) + 5
            },
            report: {
                summary: "This is a simulated AI evaluation because GEMINI_API_KEY was missing. The project demonstrates a solid foundational understanding but requires more technical validation.",
                strengths: ["Strong problem statement", "Clear target audience"],
                weaknesses: ["Lacks technical depth in the architecture", "Financial feasibility not fully addressed"],
                risks: ["High competition in this sector"],
                opportunities: ["Integration with existing IoT frameworks"],
                improvementSuggestions: ["Define the system architecture more clearly", "Conduct a market survey"],
                industryApplications: ["Education", "Smart Homes"],
                futureEnhancements: ["Mobile App Integration"]
            }
        };
    }
    const prompt = `
    Act as an expert technical innovation judge for THINK BIG 2026.
    Analyze the following project abstract and provide a detailed evaluation based on these 7 parameters.
    Score each parameter from 0 to 100.
    
    Abstract Data:
    ${JSON.stringify(abstractData)}
    
    You MUST return the response strictly as a JSON object (without markdown wrappers like \`\`\`json) with the exact structure:
    {
      "scores": {
        "innovation": <number>,
        "technicalFeasibility": <number>,
        "marketPotential": <number>,
        "socialImpact": <number>,
        "scalability": <number>,
        "sustainability": <number>,
        "uniqueness": <number>
      },
      "report": {
        "summary": "<string>",
        "strengths": ["<string>"],
        "weaknesses": ["<string>"],
        "risks": ["<string>"],
        "opportunities": ["<string>"],
        "improvementSuggestions": ["<string>"],
        "industryApplications": ["<string>"],
        "futureEnhancements": ["<string>"]
      }
    }
  `;
    try {
        const response = yield fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            })
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to fetch AI evaluation');
        }
        const textOutput = data.candidates[0].content.parts[0].text;
        // Parse the JSON output
        const jsonOutput = JSON.parse(textOutput.replace(/```json/g, '').replace(/```/g, '').trim());
        return jsonOutput;
    }
    catch (error) {
        console.error('AI Evaluation Error:', error);
        throw new Error('AI Evaluation failed: ' + error.message);
    }
});
exports.evaluateAbstractWithAI = evaluateAbstractWithAI;
//# sourceMappingURL=aiService.js.map