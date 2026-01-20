const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not set! Gemini features will not work.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.5 Flash - fast and versatile model
    this.model = this.genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
  }

  /**
   * Generates mock job postings based on user profile and query.
   * @param {Object} profile User profile data
   * @param {String} query Search query (e.g., "Backend Developer")
   * @returns {Promise<Array>} List of job postings
   */
  async generateJobs(profile, query) {
    if (!process.env.GEMINI_API_KEY) {
      return this.getFallbackJobs();
    }

    try {
      const prompt = `
        You are a job recommendation engine. Generate 5 realistic job postings in South Korea based on the user's search query and profile.
        
        User Search: "${query}"
        User Profile Summary: ${JSON.stringify(profile).substring(0, 500)}...

        Requirements:
        1. Return ONLY a valid JSON array. No markdown formatting.
        2. Each job object must have:
           - companyName (string): Real Korean tech companies (e.g. Naver, Kakao, Toss, startup names)
           - position (string): Job title
           - recruitType (string): One of ["신입", "경력", "인턴", "병역특례"]
           - jdSummary (string): 1 sentence summary of the job
           - fitScore (number): 70-98 (calculate a rough match score based on profile)
           - applicationForm (array of strings): 2-3 specific self-introduction questions for this company (e.g., "Why do you want to work at Toss?", "Describe a challenge you overcame").

        Example JSON format:
        [
          {
            "companyName": "Tanghuru Tech",
            "position": "Backend Developer",
            "recruitType": "Credit Job",
            "jdSummary": "Developing high-traffic APIs using Node.js",
            "fitScore": 88,
            "applicationForm": ["What is your favorite fruit?", "Explain your experience with sugar coating."]
          }
        ]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim(); // Clean markdown if present

      const jobs = JSON.parse(text);
      return jobs;

    } catch (error) {
      console.error("Gemini Job Generation Failed:", error);
      return this.getFallbackJobs();
    }
  }

  /**
   * Generates resume answers for specific questions.
   * @param {Object} profile User profile
   * @param {Object} companyInfo Company context
   * @param {Array} questions List of questions to answer
   * @param {Array} selectedProjects List of project titles/descriptions
   * @returns {Promise<String>} Formatted markdown resume
   */
  async generateResume(profile, companyInfo, questions, selectedProjects) {
    if (!process.env.GEMINI_API_KEY) {
      return "⚠️ API Key missing. Cannot generate resume.";
    }

    try {
      const prompt = `
            You are an expert career consultant. Write a professional cover letter/resume answers for the following applicant.

            Applicant Profile:
            - Name: ${profile.name}
            - Skills: ${profile.skills?.join(', ')}
            - Education: ${profile.education}
            - Selected Projects: 
            ${selectedProjects?.join('\n\n') || "No specific projects selected"}

            Target Company:
            - Name: ${companyInfo.name}
            - Position: ${companyInfo.position}
            
            Task:
            Write answers for the following specific application questions. Use a professional, confident tone.
            Use Markdown formatting. Use headings '## Question 1: ...' for each question.

            Questions to Answer:
            ${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();

    } catch (error) {
      console.error("Gemini Resume Generation Failed:", error);
      return "❌ Error generating resume. Please try again.";
    }
  }

  getFallbackJobs() {
    return [
      {
        companyName: "Demo Corp",
        position: "Internal Server Error",
        recruitType: "System",
        jdSummary: "Please check if GEMINI_API_KEY is set in .env",
        fitScore: 0,
        applicationForm: ["Server check 1", "Server check 2"]
      }
    ];
  }
}

module.exports = new GeminiService();
