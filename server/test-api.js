/**
 * CareerFit API 테스트 스크립트
 * 모든 API 엔드포인트를 테스트합니다.
 */

const BASE_URL = 'http://localhost:8080';

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testsPassed = 0;
let testsFailed = 0;

// 테스트 헬퍼 함수
async function testAPI(name, method, endpoint, body = null, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n${colors.cyan}[테스트]${colors.reset} ${name}`);
    console.log(`  ${method} ${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.status === expectedStatus) {
      console.log(`  ${colors.green}✓ 성공${colors.reset} (${response.status})`);
      console.log(`  응답:`, JSON.stringify(data, null, 2).split('\n').slice(0, 5).join('\n  '));
      testsPassed++;
      return { success: true, data };
    } else {
      console.log(`  ${colors.red}✗ 실패${colors.reset} (예상: ${expectedStatus}, 실제: ${response.status})`);
      console.log(`  응답:`, JSON.stringify(data, null, 2));
      testsFailed++;
      return { success: false, data };
    }
  } catch (error) {
    console.log(`  ${colors.red}✗ 오류${colors.reset}`, error.message);
    testsFailed++;
    return { success: false, error };
  }
}

// 메인 테스트 실행
async function runTests() {
  console.log('='.repeat(60));
  console.log(`${colors.blue}CareerFit API 테스트 시작${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log('='.repeat(60));

  // 1. 헬스 체크
  console.log(`\n${colors.yellow}[1] 헬스 체크 API${colors.reset}`);
  await testAPI('헬스 체크', 'GET', '/health');

  // 2. 루트 엔드포인트
  console.log(`\n${colors.yellow}[2] 루트 엔드포인트${colors.reset}`);
  await testAPI('루트 정보 조회', 'GET', '/');

  // 3. 프로필 API
  console.log(`\n${colors.yellow}[3] 프로필 API${colors.reset}`);
  const profileData = {
    name: '홍길동',
    education: '커리어대학교',
    major: '소프트웨어학과',
    gpa: '4.2/4.5',
    experience: ['A사 인턴 (3개월)'],
    projects: [
      {
        title: '프로젝트A',
        description: '테스트 프로젝트',
        contribution: '80%',
        period: '2025.01 - 2025.03'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js'],
    activities: ['해커톤 수상'],
    certifications: [{ date: '2024.05', title: '자격증명' }],
    awards: [{ date: '2024.08', title: '수상명' }]
  };

  const profileResult = await testAPI('프로필 저장', 'POST', '/api/profile', profileData);
  
  if (profileResult.success) {
    const profileId = profileResult.data.profileId;
    await testAPI('프로필 조회 (ID)', 'GET', `/api/profile/${profileId}`);
  }
  
  await testAPI('프로필 조회 (최근)', 'GET', '/api/profile');

  // 4. 적합도 분석 API
  console.log(`\n${colors.yellow}[4] 적합도 분석 API${colors.reset}`);
  await testAPI('적합도 분석', 'POST', '/api/analysis/fit', {
    profile: profileData,
    companyInfo: {
      name: 'AWS코리아',
      position: '백엔드 엔지니어',
      jd: '채용 공고 내용...',
      values: '고객 중심, 혁신, 협업'
    }
  });

  // 5. 직무 검색 API
  console.log(`\n${colors.yellow}[5] 직무 검색 API${colors.reset}`);
  await testAPI('직무 공고 검색', 'POST', '/api/jobs/search', {
    profile: profileData,
    query: '백엔드 개발자'
  });

  // 6. 자소서 생성 API
  console.log(`\n${colors.yellow}[6] 자소서 생성 API${colors.reset}`);
  await testAPI('AI 자소서 생성', 'POST', '/api/resume/generate', {
    profile: profileData,
    companyInfo: {
      name: 'AWS코리아',
      position: '백엔드 엔지니어',
      jd: '채용 공고 내용...'
    },
    prompt: 'AWS의 리더십 원칙을 반영한 자기소개서를 작성해줘',
    selectedProjects: ['프로젝트A']
  });

  // 7. 지원 트래커 API
  console.log(`\n${colors.yellow}[7] 지원 트래커 API${colors.reset}`);
  
  // 목록 조회
  await testAPI('지원 내역 목록 조회', 'GET', '/api/applications');

  // 생성
  const newAppResult = await testAPI('지원 내역 생성', 'POST', '/api/applications', {
    companyName: '카카오',
    position: '프론트엔드 개발자',
    status: '지원예정',
    recruitType: '일반채용',
    date: '2026-02-01',
    link: 'https://careers.kakao.com'
  }, 201);

  if (newAppResult.success) {
    const appId = newAppResult.data.id;
    
    // 수정
    await testAPI('지원 내역 수정', 'PUT', `/api/applications/${appId}`, {
      status: '지원완료'
    });

    // 삭제
    await testAPI('지원 내역 삭제', 'DELETE', `/api/applications/${appId}`);
  }

  // 8. 대시보드 API
  console.log(`\n${colors.yellow}[8] 대시보드 API${colors.reset}`);
  await testAPI('대시보드 통계 조회', 'GET', '/api/dashboard/stats');

  // 9. 에러 처리 테스트
  console.log(`\n${colors.yellow}[9] 에러 처리 테스트${colors.reset}`);
  await testAPI('존재하지 않는 엔드포인트', 'GET', '/api/nonexistent', null, 404);
  await testAPI('잘못된 요청 (필수 파라미터 누락)', 'POST', '/api/analysis/fit', {}, 400);

  // 결과 요약
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.blue}테스트 결과 요약${colors.reset}`);
  console.log('='.repeat(60));
  console.log(`${colors.green}성공: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}실패: ${testsFailed}${colors.reset}`);
  console.log(`총 테스트: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log(`\n${colors.green}✓ 모든 테스트 통과!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ 일부 테스트 실패${colors.reset}`);
  }
  console.log('='.repeat(60));
}

// 서버 연결 확인 후 테스트 실행
async function main() {
  try {
    console.log(`서버 연결 확인 중... (${BASE_URL})`);
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log(`${colors.green}✓ 서버 연결 성공${colors.reset}\n`);
      await runTests();
    } else {
      console.log(`${colors.red}✗ 서버 응답 오류${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.log(`${colors.red}✗ 서버에 연결할 수 없습니다.${colors.reset}`);
    console.log(`에러: ${error.message}`);
    console.log(`\n서버가 실행 중인지 확인하세요: npm start`);
    process.exit(1);
  }
}

// 즉시 실행
(async () => {
  await main();
})();
