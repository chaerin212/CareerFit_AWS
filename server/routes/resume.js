const express = require('express');
const router = express.Router();

// AI 자소서 생성
router.post('/generate', (req, res) => {
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

    // Mock AI 생성 자소서
    const content = `# 자기소개

안녕하십니까. ${companyInfo.name}의 ${companyInfo.position} 포지션에 지원하는 ${profile.name}입니다.

## 지원 동기

${companyInfo.name}는 ${companyInfo.values || '혁신과 도전'}을 중시하는 기업으로, 저의 가치관과 잘 부합한다고 생각합니다. 특히 ${companyInfo.position} 포지션에서 제가 보유한 ${profile.skills?.slice(0, 2).join(', ')} 기술을 활용하여 기여하고 싶습니다.

## 프로젝트 경험

${selectedProjects?.length > 0 ? selectedProjects.map((proj, idx) => 
  `### ${idx + 1}. ${proj}\n\n해당 프로젝트를 통해 실무 역량을 키웠으며, 팀워크와 문제 해결 능력을 향상시켰습니다.`
).join('\n\n') : '다양한 프로젝트 경험을 통해 실무 역량을 쌓아왔습니다.'}

## 보유 역량

- **기술 스택**: ${profile.skills?.join(', ') || 'React, TypeScript, Node.js'}
- **학력**: ${profile.education} ${profile.major} (${profile.gpa})
- **경험**: ${profile.experience?.join(', ') || '인턴 경험 보유'}

## 포부

${companyInfo.name}에서 ${companyInfo.position}로서 성장하며, 회사의 비전 달성에 기여하고 싶습니다. 지속적인 학습과 도전을 통해 더 나은 개발자로 성장하겠습니다.

감사합니다.`;

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
