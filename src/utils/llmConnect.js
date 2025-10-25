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
            "country":  country code top-level domain (e.g., 'ng' for Nigeria),
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
    const text = response.candidates[0].content.parts[0];
    const llmOutput = JSON.parse(text.text);
    
    return llmOutput;

  } catch (error) {
    console.error("1 Error in LLM connection:", error);
    throw error;
  }} 


  async function analyzeJobs(userProfile, jobResults) {
  try {
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        User profile: ${JSON.stringify(userProfile, null, 2)}
        Job results (top 15 for analysis):
        ${JSON.stringify(jobResults, null, 2)}
        `,
      config: {
        temperature: 0.3,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 7100,
        responseMimeType: "application/json",
        systemInstruction: `
          You are an expert job ranking assistant.

          You will receive:
          1. A user's job profile.
          2. A list of job postings fetched from a job API.

          Your task:
          - Analyze how well each job matches the user's profile based on:
            * job title relevance
            * required skills overlap
            * preferred location or remote preference
            * industry/keywords match
          - Give each job a "match_score" between 0 and 100.
          - Return the top 5 most relevant jobs, sorted by score (highest first).

          Return strictly in JSON format:
          {
            "top_jobs": [
              {
                "job_id": "",
                "title": "",
                "match_score": 0,
                "reason": "Short explanation for why this job fits the user."
              }
            ],
          }

          STRICT RULES:
          - The response must be valid JSON only.
          - Do NOT use markdown, comments, or text outside the JSON.
          - If no jobs are relevant, return an empty 'top_jobs' array with a short summary.
          `
      }
    });
    const text = response.candidates[0].content.parts[0];
    const llmOutput = JSON.parse(text.text);

    return llmOutput;

  } catch (error) {
    console.error("Error in LLM connection:", error);
    throw error;
  }};

export { main, analyzeJobs };
