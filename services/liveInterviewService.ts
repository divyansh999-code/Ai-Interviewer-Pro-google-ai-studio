
import { GoogleGenAI, Type } from "@google/genai";
import { LiveFeedbackReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Switch to Pro model for deep reasoning and analysis of the conversation
const MODEL_ID = "gemini-3-pro-preview";

export const generateLiveFeedback = async (
  resumeText: string,
  difficulty: string,
  transcript: { role: 'user' | 'model', text: string }[]
): Promise<LiveFeedbackReport> => {
  
  // 1. Pre-process transcript to be readable
  const conversationText = transcript.map(t => 
    `[${t.role.toUpperCase()}]: ${t.text}`
  ).join('\n');

  // 2. Handle empty/short transcripts gracefully
  if (transcript.length < 2) {
    return {
      overallScore: 0,
      summary: "Interview session was too short to generate a valid report. Please attempt a longer session.",
      hiringRecommendation: "NO",
      categoryScores: [],
      strengths: [],
      weaknesses: ["Insufficient data"],
      transcriptAnalysis: [],
      roadmap: []
    };
  }

  const systemInstruction = `
    You are a Bar Raiser / Technical Hiring Manager at a top-tier tech company (Google/Netflix level).
    Your task is to generate a BRUTALLY HONEST, DATA-DRIVEN post-interview report based *solely* on the provided transcript.

    ### ANALYSIS PROTOCOL:
    1. **Evidence-Based**: Do NOT hallucinate. Only evaluate what was actually said. If a topic wasn't covered, do not grade it.
    2. **Technical Accuracy**: Verify the candidate's answers against technical truths. 
       - Did they confuse O(n) with O(log n)? 
       - Did they suggest a SQL database when NoSQL was better?
       - Flag these errors specifically.
    3. **Resume Verification**: Compare their performance to their resume claims.
       - If they claim "Expert React" but failed basic hooks questions, flag it as a "Resume Discrepancy".
    4. **Communication**: Evaluate conciseness. Did they ramble? Did they ask clarifying questions?

    ### SCORING RUBRIC (Context: ${difficulty} Mode):
    - **0-49 (Strong No Hire)**: Fundamental lack of knowledge, incorrect logic, or inability to code basic solutions.
    - **50-69 (No Hire)**: Struggled with syntax, needed excessive hints, or communication was unclear.
    - **70-89 (Hire)**: Solid solution, good communication, minor nits (e.g., missed edge case but fixed it).
    - **90-100 (Strong Hire)**: Optimized solution, proactive communication, deep system understanding.

    ### OUTPUT FORMAT:
    Return strictly valid JSON matching the schema.
  `;

  const prompt = `
    CANDIDATE PROFILE (RESUME SNIPPET):
    "${resumeText.slice(0, 4000)}"

    INTERVIEW CONFIGURATION:
    - Difficulty: ${difficulty}
    
    RAW TRANSCRIPT:
    ${conversationText}

    TASK:
    Generate the feedback report. 
    For 'transcriptAnalysis', map specific questions asked by the interviewer to the candidate's response.
    If the candidate's answer was vague, mark evaluation as 'WEAK'.
    If the candidate provided a perfect optimal solution, mark as 'STRONG'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        // High budget for "thinking" allows the model to verify facts before outputting
        thinkingConfig: { thinkingBudget: 2048 }, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Weighted average 0-100" },
            summary: { type: Type.STRING, description: "Executive summary for the hiring committee. Be professional and direct." },
            hiringRecommendation: { type: Type.STRING, enum: ["YES", "NO", "MAYBE"] },
            categoryScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "e.g. Technical Depth, Communication, Problem Solving" },
                  score: { type: Type.INTEGER, description: "0-100" }
                },
                required: ["category", "score"]
              }
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            transcriptAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The specific technical question asked." },
                  candidateResponseSummary: { type: Type.STRING, description: "A concise summary of what the candidate actually said." },
                  evaluation: { type: Type.STRING, enum: ["STRONG", "ADEQUATE", "WEAK", "FAIL"] },
                  feedback: { type: Type.STRING, description: "Specific critique. Why was it good/bad?" },
                  improvementTip: { type: Type.STRING, description: "What is the correct/better approach?" },
                  score: { type: Type.INTEGER, description: "0-10" }
                },
                required: ["question", "candidateResponseSummary", "evaluation", "feedback", "improvementTip", "score"]
              }
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: "e.g. Immediate (Next 24h), Short Term (1 Week)" },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["phase", "tasks"]
              }
            }
          },
          required: ["overallScore", "summary", "hiringRecommendation", "categoryScores", "strengths", "weaknesses", "transcriptAnalysis", "roadmap"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as LiveFeedbackReport;

  } catch (error) {
    console.error("Error generating live feedback report:", error);
    // Provide a fallback error object structure if JSON parsing fails
    throw new Error("Failed to generate feedback report. The session might have been too short or unclear.");
  }
};
