import dotenv from 'dotenv';

dotenv.config();

export const evaluateAbstractWithAI = async (abstractData: any) => {
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch AI evaluation');
    }

    const textOutput = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON output
    const jsonOutput = JSON.parse(textOutput.replace(/```json/g, '').replace(/```/g, '').trim());
    return jsonOutput;
  } catch (error: any) {
    console.error('AI Evaluation Error:', error);
    throw new Error('AI Evaluation failed: ' + error.message);
  }
};
