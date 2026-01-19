# CareerFit AWS - API 명세서

## 개요

본 문서는 CareerFit 프론트엔드(S3 정적 웹 호스팅)와 백엔드(EC2) 간의 API 통신 규격을 정의합니다.

### 아키텍처 구조
```
[S3 정적 웹페이지] → [클라이언트 API 요청] → [EC2 서버] → [LLM 처리] → [응답]
```

### 기본 정보
- **Base URL**: `https://your-ec2-instance.amazonaws.com` (환경변수에서 설정)
- **Content-Type**: `application/json`
- **인증**: `X-API-Key` 헤더 (선택적)

---

## 1. 프로필 관리 API

사용자 프로필 생성, 조회를 담당합니다.

### 1.1 프로필 저장

**Endpoint**: `POST /api/profile`

**Request Body**:
```json
{
  "name": "홍길동",
  "education": "커리어대학교",
  "major": "소프트웨어학과",
  "gpa": "4.2/4.5",
  "experience": ["A사 인턴 (3개월)"],
  "projects": [
    {
      "title": "프로젝트명",
      "description": "프로젝트 설명",
      "contribution": "80%",
      "period": "2025.01 - 2025.03"
    }
  ],
  "skills": ["React", "TypeScript", "Node.js"],
  "activities": ["해커톤 수상"],
  "certifications": [
    {
      "date": "2024.05",
      "title": "자격증명"
    }
  ],
  "awards": [
    {
      "date": "2024.08",
      "title": "수상명"
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "프로필이 성공적으로 저장되었습니다.",
  "profileId": "profile_12345"
}
```

---

### 1.2 프로필 조회

**Endpoint**: `GET /api/profile` 또는 `GET /api/profile/{profileId}`

**Response** (200 OK):
```json
{
  "profileId": "profile_12345",
  "name": "홍길동",
  "education": "커리어대학교",
  "major": "소프트웨어학과",
  "gpa": "4.2/4.5",
  "experience": ["A사 인턴 (3개월)"],
  "projects": [...],
  "skills": ["React", "TypeScript"],
  "activities": [...],
  "certifications": [...],
  "awards": [...],
  "updatedAt": "2026-01-20T10:30:00Z"
}
```

---

## 2. 직무 및 컬쳐핏 분석 API

프로필과 회사 정보를 기반으로 AI가 적합도를 분석합니다.

### 2.1 적합도 분석

**Endpoint**: `POST /api/analysis/fit`

**Request Body**:
```json
{
  "profile": {
    "name": "홍길동",
    "education": "커리어대학교",
    "major": "소프트웨어학과",
    "skills": ["React", "TypeScript"],
    "projects": [...]
  },
  "companyInfo": {
    "name": "AWS코리아",
    "position": "백엔드 엔지니어",
    "jd": "채용 공고 내용...",
    "values": "고객 중심, 혁신, 협업"
  }
}
```

**Response** (200 OK):
```json
{
  "jobFit": 85,
  "cultureFit": 78,
  "overallScore": 82,
  "strengths": [
    "React 및 TypeScript 실무 경험 보유",
    "프로젝트 리더십 경험이 강점으로 작용"
  ],
  "weaknesses": [
    "백엔드 프레임워크 경험 부족",
    "클라우드 인프라 경험 필요"
  ],
  "summary": "전반적으로 우수한 프론트엔드 역량을 보유하고 있으나, 백엔드 역량 강화가 필요합니다."
}
```

---

## 3. 회사 리스트 및 적합도 탐색 API

사용자의 프로필을 기반으로 AI가 적합한 채용 공고를 추천합니다.

### 3.1 직무 공고 검색

**Endpoint**: `POST /api/jobs/search`

**Request Body**:
```json
{
  "profile": {
    "name": "홍길동",
    "skills": ["React", "TypeScript"],
    "projects": [...]
  },
  "query": "백엔드 개발자"
}
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "companyName": "AWS코리아",
      "position": "백엔드 엔지니어",
      "recruitType": "체험형인턴",
      "jdSummary": "Node.js, Express 기반 API 개발",
      "fitScore": 92
    },
    {
      "companyName": "카카오",
      "position": "풀스택 개발자",
      "recruitType": "일반채용",
      "jdSummary": "React, Spring Boot 활용한 웹 서비스 개발",
      "fitScore": 87
    }
  ],
  "totalCount": 2
}
```

---

## 4. AI 커리어 에이전트 API

사용자의 요청에 따라 AI가 자기소개서, 이력서 등을 생성합니다.

### 4.1 AI 자소서 생성

**Endpoint**: `POST /api/resume/generate`

**Request Body**:
```json
{
  "profile": {
    "name": "홍길동",
    "projects": [...]
  },
  "companyInfo": {
    "name": "AWS코리아",
    "position": "백엔드 엔지니어",
    "jd": "채용 공고 내용..."
  },
  "prompt": "AWS의 리더십 원칙을 반영한 자기소개서를 작성해줘",
  "selectedProjects": ["프로젝트A", "프로젝트B"]
}
```

**Response** (200 OK):
```json
{
  "content": "# 자기소개\n\n저는 AWS의 '고객 집착' 원칙에 공감하며...\n\n## 프로젝트 경험\n...",
  "generatedAt": "2026-01-20T10:45:00Z"
}
```

---

## 5. 지원 트래커 API

지원 내역을 생성, 조회, 수정, 삭제합니다.

### 5.1 지원 내역 목록 조회

**Endpoint**: `GET /api/applications`

**Response** (200 OK):
```json
{
  "applications": [
    {
      "id": "app_001",
      "companyName": "AWS코리아",
      "position": "백엔드 엔지니어",
      "status": "지원예정",
      "recruitType": "체험형인턴",
      "date": "2026-01-30",
      "link": "https://aws.amazon.com/careers",
      "createdAt": "2026-01-15T09:00:00Z",
      "updatedAt": "2026-01-20T10:00:00Z"
    }
  ],
  "totalCount": 1
}
```

---

### 5.2 지원 내역 생성

**Endpoint**: `POST /api/applications`

**Request Body**:
```json
{
  "companyName": "카카오",
  "position": "프론트엔드 개발자",
  "status": "지원예정",
  "recruitType": "일반채용",
  "date": "2026-02-01",
  "link": "https://careers.kakao.com"
}
```

**Response** (201 Created):
```json
{
  "id": "app_002",
  "companyName": "카카오",
  "position": "프론트엔드 개발자",
  "status": "지원예정",
  "recruitType": "일반채용",
  "date": "2026-02-01",
  "link": "https://careers.kakao.com",
  "createdAt": "2026-01-20T11:00:00Z",
  "updatedAt": "2026-01-20T11:00:00Z"
}
```

---

### 5.3 지원 내역 수정

**Endpoint**: `PUT /api/applications/{applicationId}`

**Request Body**:
```json
{
  "status": "지원완료"
}
```

**Response** (200 OK):
```json
{
  "id": "app_002",
  "companyName": "카카오",
  "position": "프론트엔드 개발자",
  "status": "지원완료",
  "recruitType": "일반채용",
  "date": "2026-02-01",
  "link": "https://careers.kakao.com",
  "createdAt": "2026-01-20T11:00:00Z",
  "updatedAt": "2026-01-20T11:30:00Z"
}
```

---

### 5.4 지원 내역 삭제

**Endpoint**: `DELETE /api/applications/{applicationId}`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "지원 내역이 삭제되었습니다."
}
```

---

## 6. 대시보드 통계 API

지원 현황 통계를 제공합니다.

### 6.1 대시보드 통계 조회

**Endpoint**: `GET /api/dashboard/stats`

**Response** (200 OK):
```json
{
  "totalApplications": 15,
  "passedDocument": 8,
  "inProgress": 5,
  "acceptanceRate": 20,
  "statusDistribution": {
    "planning": 3,
    "submitted": 5,
    "passDocument": 4,
    "interviewing": 1,
    "accepted": 1,
    "rejected": 1
  }
}
```

---

## 에러 응답 형식

모든 API는 오류 발생 시 다음 형식으로 응답합니다:

```json
{
  "error": true,
  "message": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {}
}
```

### 주요 HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `404`: 리소스 없음
- `500`: 서버 오류

---

## 환경 변수 설정

프론트엔드에서 다음 환경 변수를 설정해야 합니다:

```bash
# .env 파일
VITE_API_BASE_URL=https://your-ec2-instance.amazonaws.com
VITE_API_KEY=your-api-key-here
```

---

## 페이지별 API 사용 매핑

| 페이지 | 사용 API 엔드포인트 |
|--------|---------------------|
| **ProfileForm** | `POST /api/profile`, `GET /api/profile` |
| **FitAnalysis** | `POST /api/analysis/fit` |
| **CompanyList** | `POST /api/jobs/search` |
| **ResumeBuilder** | `POST /api/resume/generate` |
| **Tracker** | `GET /api/applications`, `POST /api/applications`, `PUT /api/applications/{id}`, `DELETE /api/applications/{id}` |
| **Dashboard** | `GET /api/dashboard/stats`, `GET /api/applications` |

---

## 보안 고려사항

1. **CORS 설정**: EC2 서버에서 S3 도메인을 허용해야 합니다.
2. **HTTPS**: 프로덕션 환경에서는 반드시 HTTPS를 사용합니다.
3. **API Key**: 민감한 작업의 경우 인증 헤더를 포함합니다.
4. **Rate Limiting**: API 호출 제한을 설정하여 남용을 방지합니다.

---

## 개발 가이드

### 로컬 개발 환경
- 백엔드가 준비되지 않은 경우 `geminiService.ts`의 로컬 AI 서비스를 사용할 수 있습니다.
- 백엔드가 준비되면 `apiService.ts`로 전환합니다.

### 프로덕션 배포
1. `.env` 파일에 실제 EC2 URL을 설정합니다.
2. `npm run build`로 정적 파일을 생성합니다.
3. 생성된 `dist` 폴더를 S3에 업로드합니다.
4. S3 버킷을 정적 웹사이트 호스팅으로 설정합니다.

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-01-20 | 초기 API 명세서 작성 |
