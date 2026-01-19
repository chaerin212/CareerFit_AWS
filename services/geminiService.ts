
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitAnalysisResult } from "../types";

// Fix: Initialize GoogleGenAI with process.env.API_KEY directly according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResumeContent = async (
  profile: UserProfile,
  companyInfo: { name: string; position: string; jd: string },
  prompt: string
) => {
  const systemInstruction = `
    당신은 전문 커리어 컨설턴트이자 테크 리크루터입니다. 
    사용자의 프로필과 지원하려는 회사의 JD를 바탕으로 최적화된 자기소개서 또는 이력서 내용을 작성합니다.
    출력은 마크다운 형식을 사용하며, 가독성 있게 구조화하세요.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      사용자 프로필: ${JSON.stringify(profile)}
      지원 회사: ${companyInfo.name}
      지원 직무: ${companyInfo.position}
      JD 내용: ${companyInfo.jd}
      추가 요청사항: ${prompt}
      
      위 정보를 바탕으로 회사 맞춤형 자기소개서 또는 이력서 보완 내용을 작성해줘.
    `,
    config: {
      systemInstruction,
    },
  });

  // Fix: Access response.text as a property according to guidelines
  return response.text;
};

export const searchJobOpenings = async (
  profile: UserProfile,
  query: string
): Promise<any[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      사용자 데이터: ${JSON.stringify(profile)}
      검색 쿼리: ${query}
      
      사용자의 기술 스택과 프로젝트 경험을 바탕으로, 현재 채용 중일 법한 실제 기업(혹은 매우 현실적인 가상 기업)의 오픈 공고 5개를 추천해줘.
      각 공고별로 회사명, 구체적인 직무명, 그리고 사용자 프로필과의 적합도 점수(0-100)를 산출해줘.
      또한 해당 공고의 가상 JD(주요 업무/자격 요건)를 아주 간단히 포함해줘.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            position: { type: Type.STRING },
            fitScore: { type: Type.NUMBER },
            jdSummary: { type: Type.STRING },
            recruitType: { type: Type.STRING, description: "체험형인턴, 채용형인턴, 일반채용 중 하나" }
          },
          required: ["companyName", "position", "fitScore", "jdSummary", "recruitType"]
        }
      }
    }
  });

  // Fix: Access response.text as a property according to guidelines
  return JSON.parse(response.text || '[]');
};

export const analyzeFit = async (
  profile: UserProfile,
  companyInfo: { name: string; position: string; jd: string; values: string }
): Promise<FitAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      사용자 데이터: ${JSON.stringify(profile)}
      회사 JD: ${companyInfo.jd}
      회사 핵심 가치: ${companyInfo.values}
      지원 직무: ${companyInfo.position}
      
      위 데이터를 분석하여 직무 적합도와 컬쳐핏을 산출해줘.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobFit: { type: Type.NUMBER, description: "0-100 사이의 직무 적합도 점수" },
          cultureFit: { type: Type.NUMBER, description: "0-100 사이의 조직 문화 적합도 점수" },
          overallScore: { type: Type.NUMBER, description: "종합 점수" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "강점 요인 목록" },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "부족 요소 목록" },
          summary: { type: Type.STRING, description: "간단한 해석 요약" }
        },
        required: ["jobFit", "cultureFit", "overallScore", "strengths", "weaknesses", "summary"]
      }
    }
  });

  // Fix: Access response.text as a property according to guidelines
  return JSON.parse(response.text || '{}');
};
