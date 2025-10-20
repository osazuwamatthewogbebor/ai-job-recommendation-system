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
        systemInstruction: `
You are an intelligent job query generator.

You will receive a JSON object containing a user's profile with fields like:
{
  "skills": ["javascript", "react", "node.js"],
  "job_titles": ["frontend developer", "full stack engineer"],
  "experience_level": "junior",
  "preferred_location": "Lagos, Nigeria",
  "country": "Nigeria",
  "remote_preference": "hybrid",
  "industry": "tech",
  "keywords": ["web development", "UI", "startup"]
}

Your task:
1. Analyze the user profile.
2. Identify the most relevant job titles or keywords for job search.
3. Generate a concise, optimized search query that would return the most suitable jobs on JSearch.
4. Return the result strictly in JSON format with the following structure:

{
  "query": "string",
  "country": "string",
  "filters": {
    "remote": true | false,
    "employment_type": "full-time" | "part-time" | null
  },
  "explanation": "brief reasoning for chosen query"
}

STRICT RULES:
- The entire response must be valid JSON. No explanations, comments, markdown, or additional text outside the JSON object.
- Do not use triple backticks or code fences.
- Do not include any text before or after the JSON.
- If a field value is unknown, use an empty string ("") or null (for employment_type).
- Prioritize 'job_titles' if available; otherwise infer from skills and keywords.
- Include skills as secondary keywords in the query.
- Use 'preferred_location' or 'country' as the location.
- If 'remote_preference' is "remote" or "hybrid", set 'filters.remote' = true, otherwise false.
- Keep 'query' short and clean (max 5 keywords).
        `
      }
    });
    
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.candidates?.[0]?.content?.text ||
      response?.outputText ||
      "";

    if (!text) {
      console.warn("Warning: No text returned from LLM. Using fallback.");
      return fallbackResponse(userProfile);
    }

    const cleanText = text.replace(/```(?:json)?/gi, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse LLM output as JSON:", cleanText);
      parsed = fallbackResponse(userProfile);
    }
    return {
      query: parsed.query || "",
      country: parsed.country || userProfile.country || "",
      filters: {
        remote: parsed?.filters?.remote ?? false,
        employment_type: parsed?.filters?.employment_type ?? null
      },
      explanation: parsed.explanation || ""
    };
  } catch (error) {
    console.error("Error in LLM connection:", error.message);
    return fallbackResponse(userProfile);
  }
}

function fallbackResponse(userProfile) {
  const inferredQuery =
    userProfile.job_titles?.[0] ||
    userProfile.skills?.slice(0, 3).join(" ") ||
    "";

  return {
    query: inferredQuery,
    country: userProfile.country || "",
    explanation: "Fallback generated due to parsing or connection error."
  };
}

export { main };
