import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const parseJobIntent = async (userInput: string, availableJobs: string[] = []): Promise<any> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please check your environment configuration.");
  }

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are an expert SAP Data Services administrator assistant.
    Your goal is to translate natural language requests into a structured JSON configuration for executing an SAP Data Services Batch Job.
    
    The user might say: "Run the daily sales load for region NA and fiscal year 2024".
    You should extract:
    1. The likely Job Name (snake_case or PascalCase). If the user mentions a specific job name, use it. If a list of available jobs is provided, try to match it closely.
    2. Global Variables. SAP global variables usually start with '$'. If the user doesn't provide the '$', prepend it. E.g., "region" becomes "$G_Region" or "$Region" depending on standard naming conventions (prefer $G_VarName).
    
    Available Jobs Hint: ${availableJobs.join(', ')}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: userInput,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobName: { type: Type.STRING, description: "The name of the SAP DS job to execute" },
          globalVariables: {
            type: Type.OBJECT,
            description: "Key-value pairs for global variables. Keys must start with $.",
          },
          explanation: { type: Type.STRING, description: "Brief explanation of what was extracted" }
        },
        required: ["jobName", "globalVariables"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};