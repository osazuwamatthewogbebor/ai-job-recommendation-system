import { GoogleGenAI } from "@google/genai";

async function main(userProfile) {
  try {
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User profile:\n${JSON.stringify(userProfile, null, 2)}`,
      config: {
        temperature: 0.3,
        topP: 0.9,
        topK: 32,
       maxOutputTokens: 512,
       responseMimeType: "application/json",
        systemInstruction: `
You are an intelligent job query generator.

You will receive a JSON object containing a user's profile with fields like:
{
  "name": "Sultan",
  "email": "example@gmail.com",
  "skills": ["javascript", "react", "node.js"],
  "isRemotePreferred": true,
  "job_titles": ["frontend developer", "full stack engineer"],
  "preferred_location": "Lagos",
  "country": "Nigeria",
}

Your task:
1. Analyze the user profile.
2. Identify the most relevant job titles, keywords or skills for job search.
3. Generate a concise, optimized search query that would return the most suitable jobs on JSearch.
4. Return the result strictly in JSON format with the following structure:

{
  "query": "developer roles in preferred location",
  "preferred_location": "Lagos", 
  "work_from_home": true,
  "country": "string",
  "explanation": "brief reasoning for chosen query"
}

STRICT RULES:
- The entire response must be valid JSON. No explanations, comments, markdown, or additional text outside the JSON object.
- Do not use triple backticks or code fences.
- Do not include any text before or after the JSON.
- If a field value is unknown, use an empty string ("").
- Prioritize 'job_titles' if available; otherwise infer from skills and keywords.
- Include skills as secondary keywords in the query.
- Use 'preferred_location' or 'country' as the location.
- Keep 'query' short and clean (max 5 keywords).
        `
      }
    });
const text = response.candidates[0].content.parts[0].text;

    const llmOutput = JSON.parse(text);
    return llmOutput;
  } catch (error) {
    console.error("Error in LLM connection:", error);
    throw error;
  }}

export { main };
