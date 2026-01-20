const express = require('express');
const router = express.Router();

// AI 자소서 생성
router.post('/generate', async (req, res) => {
  try {
    const { profile, companyInfo, prompt, selectedProjects } = req.body;

    if (!profile || !companyInfo) {
      return res.status(400).json({
        error: true,
        message: 'profile과 companyInfo가 필요합니다.',
        code: 'MISSING_PARAMETERS'
      });
    }

    console.log(`✅ 자소서 생성 요청: ${companyInfo.name} - ${companyInfo.position}`);

    const GeminiService = require('../services/geminiService');

    // Application Form questions (from Job Object) or fallback questions
    const appQuestions = req.body.applicationForm ||
      companyInfo.applicationForm ||
      ['지원 동기', '성장 과정', '성격의 장단점'];

    // Call Gemini
    const content = await GeminiService.generateResume(profile, companyInfo, appQuestions, selectedProjects);

    console.log(`✅ 자소서 생성 완료 (${content.length}자)`);

    res.json({
      content,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('자소서 생성 오류:', error);
    res.status(500).json({
      error: true,
      message: '자소서 생성 중 오류가 발생했습니다.',
      code: 'RESUME_GENERATION_ERROR'
    });
  }
});

module.exports = router;
