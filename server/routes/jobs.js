const express = require('express');
const router = express.Router();

// Mock 채용 공고 데이터
const mockJobs = [
  {
    companyName: 'AWS코리아',
    position: '백엔드 엔지니어',
    recruitType: '체험형인턴',
    jdSummary: 'Node.js, Express 기반 API 개발 및 AWS 클라우드 서비스 활용',
    link: 'https://aws.amazon.com/careers'
  },
  {
    companyName: '카카오',
    position: '풀스택 개발자',
    recruitType: '일반채용',
    jdSummary: 'React, Spring Boot 활용한 웹 서비스 개발',
    link: 'https://careers.kakao.com'
  },
  {
    companyName: '네이버',
    position: '프론트엔드 개발자',
    recruitType: '채용형인턴',
    jdSummary: 'React, TypeScript 기반 대규모 웹 애플리케이션 개발',
    link: 'https://careers.naver.com'
  },
  {
    companyName: '토스',
    position: '백엔드 개발자',
    recruitType: '일반채용',
    jdSummary: 'Kotlin, Spring 기반 금융 서비스 API 개발',
    link: 'https://toss.im/career'
  },
  {
    companyName: '쿠팡',
    position: '데이터 엔지니어',
    recruitType: '일반채용',
    jdSummary: 'Python, Spark 활용한 대용량 데이터 파이프라인 구축',
    link: 'https://www.coupang.jobs'
  }
];

// 직무 공고 검색
router.post('/search', (req, res) => {
  try {
    const { profile, query } = req.body;

    if (!profile) {
      return res.status(400).json({
        error: true,
        message: 'profile이 필요합니다.',
        code: 'MISSING_PROFILE'
      });
    }

    console.log(`✅ 직무 검색 요청: "${query || '전체'}"`);

    // Gemini를 이용한 동적 채용 공고 생성
    const GeminiService = require('../services/geminiService');
    const results = await GeminiService.generateJobs(profile, query || 'Software Engineer');

    console.log(`✅ 검색 완료: ${results.length}개 공고 생성됨`);

    res.json({
      results,
      totalCount: results.length
    });
  } catch (error) {
    console.error('직무 검색 오류:', error);
    res.status(500).json({
      error: true,
      message: '직무 검색 중 오류가 발생했습니다.',
      code: 'SEARCH_ERROR'
    });
  }
});

module.exports = router;
