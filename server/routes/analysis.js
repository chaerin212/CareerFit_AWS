const express = require('express');
const router = express.Router();

// 적합도 분석 (Mock 데이터)
router.post('/fit', (req, res) => {
  try {
    const { profile, companyInfo } = req.body;

    if (!profile || !companyInfo) {
      return res.status(400).json({
        error: true,
        message: 'profile과 companyInfo가 필요합니다.',
        code: 'MISSING_PARAMETERS'
      });
    }

    console.log(`✅ 적합도 분석 요청: ${companyInfo.name} - ${companyInfo.position}`);

    // Mock AI 분석 결과
    const jobFit = Math.floor(Math.random() * 20) + 75; // 75-95
    const cultureFit = Math.floor(Math.random() * 20) + 70; // 70-90
    const overallScore = Math.floor((jobFit + cultureFit) / 2);

    const result = {
      jobFit,
      cultureFit,
      overallScore,
      strengths: [
        `${profile.skills?.[0] || 'React'} 및 ${profile.skills?.[1] || 'TypeScript'} 실무 경험 보유`,
        '프로젝트 리더십 경험이 강점으로 작용',
        '학업 성적이 우수하여 학습 능력 입증'
      ],
      weaknesses: [
        `${companyInfo.position} 관련 실무 경험 보완 필요`,
        '해당 산업 도메인 지식 학습 권장',
        '팀 프로젝트 경험 추가 확보 필요'
      ],
      summary: `전반적으로 ${companyInfo.name}의 ${companyInfo.position} 포지션에 적합한 역량을 보유하고 있습니다. 특히 기술 스택이 잘 맞으며, 추가 학습을 통해 더욱 경쟁력을 높일 수 있습니다.`
    };

    console.log(`✅ 적합도 분석 완료: 종합 ${overallScore}점`);
    res.json(result);
  } catch (error) {
    console.error('적합도 분석 오류:', error);
    res.status(500).json({
      error: true,
      message: '적합도 분석 중 오류가 발생했습니다.',
      code: 'ANALYSIS_ERROR'
    });
  }
});

module.exports = router;
