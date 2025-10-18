import { GoogleGenAI } from "@google/genai";

//const ai = new GoogleGenAI({});

async function main(userProfile) {
  const ai = new GoogleGenAI({});
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `User profile:\n${JSON.stringify(userProfile, null, 2)}`,
    config: {
        temperature: 0.3,
    topP: 0.9,
    topK: 32,
    maxOutputTokens: 512,
      systemInstruction:
       `You are an intelligent job query generator.

You will receive a JSON object containing a user's profile with fields like:
{
  "skills": ["javascript", "react", "node.js"],
  "job_titles": ["frontend developer", "full stack engineer"],
  "experience_level": "junior",
  "preferred_location": "Lagos, Nigeria",
  "remote_preference": "hybrid",
  "industry": "tech",
  "keywords": ["web development", "UI", "startup"]
}

Your task:
1. Analyze the user profile.
2. Identify the most relevant job titles or keywords for job search.
3. Generate a concise, **optimized search query** that would return the most suitable jobs on JSearch.
4. Return the result in **JSON format** with the following structure:
{
  "query": "string",
  "location": "string",
  "filters": {
    "remote": true/false,
    "employment_type": "full-time" | "part-time" | null
  },
  "explanation": "brief reasoning for chosen query"
}

Rules:
- Prioritize 'job_titles' if available; otherwise, infer a good job title from skills and keywords.
- Include skills as secondary keywords in the query.
- Use the 'preferred_location' directly.
- If remote_preference is "remote" or "hybrid", set filters.remote = true.
- Keep the query short and clean (max 5 keywords).
- Do not return extra text outside the JSON.
`
    }
  });
  
 const text = response.candidates[0].content.parts[0].text;
  // don't use response.response.text
  const cleanText = text.replace(/```(json)?/g, '').trim();
  const parsed = JSON.parse(cleanText);

  return parsed;
}



function getTopJobs(jobs, topN = 5) {
  return jobs.sort((a, b) => b.score - a.score).slice(0, topN);
}
export { main, getTopJobs };