const express = require('express');
const router = express.Router();

// 대시보드 통계 조회
router.get('/stats', (req, res) => {
  try {
    // Mock 통계 데이터
    const stats = {
      totalApplications: 15,
      passedDocument: 8,
      inProgress: 5,
      acceptanceRate: 20,
      statusDistribution: {
        planning: 3,
        submitted: 5,
        passDocument: 4,
        interviewing: 1,
        accepted: 3,
        rejected: 2
      }
    };

    console.log(`✅ 대시보드 통계 조회 완료`);

    res.json(stats);
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({
      error: true,
      message: '대시보드 통계 조회 중 오류가 발생했습니다.',
      code: 'DASHBOARD_STATS_ERROR'
    });
  }
});

module.exports = router;
