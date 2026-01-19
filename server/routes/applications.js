const express = require('express');
const router = express.Router();

// 메모리 저장소 (실제로는 DB 사용)
let applications = [
  {
    id: 'app_001',
    companyName: 'AWS코리아',
    position: '백엔드 엔지니어',
    status: '지원예정',
    recruitType: '체험형인턴',
    date: '2026-01-30',
    link: 'https://aws.amazon.com/careers',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'app_002',
    companyName: 'OpenAI',
    position: 'Backend Engineer',
    status: '지원완료',
    recruitType: '채용형인턴',
    date: '2026-01-18',
    link: 'https://openai.com/careers',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z'
  }
];

let appCounter = 3;

// 지원 내역 목록 조회
router.get('/', (req, res) => {
  try {
    console.log(`✅ 지원 내역 조회: ${applications.length}건`);
    
    res.json({
      applications,
      totalCount: applications.length
    });
  } catch (error) {
    console.error('지원 내역 조회 오류:', error);
    res.status(500).json({
      error: true,
      message: '지원 내역 조회 중 오류가 발생했습니다.',
      code: 'APPLICATIONS_GET_ERROR'
    });
  }
});

// 지원 내역 생성
router.post('/', (req, res) => {
  try {
    const { companyName, position, status, recruitType, date, link } = req.body;

    if (!companyName || !position) {
      return res.status(400).json({
        error: true,
        message: 'companyName과 position은 필수입니다.',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    const newApp = {
      id: `app_${String(appCounter++).padStart(3, '0')}`,
      companyName,
      position,
      status: status || '지원예정',
      recruitType: recruitType || '일반채용',
      date: date || new Date().toISOString().split('T')[0],
      link: link || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    applications.push(newApp);

    console.log(`✅ 지원 내역 생성: ${newApp.id} - ${companyName}`);

    res.status(201).json(newApp);
  } catch (error) {
    console.error('지원 내역 생성 오류:', error);
    res.status(500).json({
      error: true,
      message: '지원 내역 생성 중 오류가 발생했습니다.',
      code: 'APPLICATION_CREATE_ERROR'
    });
  }
});

// 지원 내역 수정
router.put('/:applicationId', (req, res) => {
  try {
    const { applicationId } = req.params;
    const updates = req.body;

    const appIndex = applications.findIndex(app => app.id === applicationId);

    if (appIndex === -1) {
      return res.status(404).json({
        error: true,
        message: '지원 내역을 찾을 수 없습니다.',
        code: 'APPLICATION_NOT_FOUND'
      });
    }

    applications[appIndex] = {
      ...applications[appIndex],
      ...updates,
      id: applicationId, // ID는 변경 불가
      updatedAt: new Date().toISOString()
    };

    console.log(`✅ 지원 내역 수정: ${applicationId}`);

    res.json(applications[appIndex]);
  } catch (error) {
    console.error('지원 내역 수정 오류:', error);
    res.status(500).json({
      error: true,
      message: '지원 내역 수정 중 오류가 발생했습니다.',
      code: 'APPLICATION_UPDATE_ERROR'
    });
  }
});

// 지원 내역 삭제
router.delete('/:applicationId', (req, res) => {
  try {
    const { applicationId } = req.params;

    const appIndex = applications.findIndex(app => app.id === applicationId);

    if (appIndex === -1) {
      return res.status(404).json({
        error: true,
        message: '지원 내역을 찾을 수 없습니다.',
        code: 'APPLICATION_NOT_FOUND'
      });
    }

    applications.splice(appIndex, 1);

    console.log(`✅ 지원 내역 삭제: ${applicationId}`);

    res.json({
      success: true,
      message: '지원 내역이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('지원 내역 삭제 오류:', error);
    res.status(500).json({
      error: true,
      message: '지원 내역 삭제 중 오류가 발생했습니다.',
      code: 'APPLICATION_DELETE_ERROR'
    });
  }
});

module.exports = router;
