# CareerFit API 테스트 서버

API 명세서를 기반으로 구현된 간단한 테스트 서버입니다.

## 📁 디렉토리 구조

```
server/
├── server.js              # 메인 서버 파일
├── package.json           # 의존성 관리
├── test-api.js           # API 테스트 스크립트
├── .env                  # 환경 변수 (git ignore)
├── env.example           # 환경 변수 예시
└── routes/               # API 라우트
    ├── profile.js        # 프로필 API
    ├── analysis.js       # 적합도 분석 API
    ├── jobs.js          # 직무 검색 API
    ├── resume.js        # 자소서 생성 API
    ├── applications.js  # 지원 트래커 API
    └── dashboard.js     # 대시보드 API
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하거나 `env.example`을 복사하세요:

```bash
cp env.example .env
```

### 3. 서버 실행

```bash
# 일반 실행
npm start

# 개발 모드 (nodemon)
npm run dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 🧪 API 테스트

모든 API 엔드포인트를 자동으로 테스트하려면:

```bash
npm test
```

또는:

```bash
node test-api.js
```

## 📡 API 엔드포인트

### 기본

- `GET /health` - 헬스 체크
- `GET /` - 서버 정보

### 프로필 관리

- `POST /api/profile` - 프로필 저장
- `GET /api/profile` - 최근 프로필 조회
- `GET /api/profile/:profileId` - 특정 프로필 조회

### 적합도 분석

- `POST /api/analysis/fit` - 직무/컬쳐핏 분석

### 직무 검색

- `POST /api/jobs/search` - 직무 공고 검색

### 자소서 생성

- `POST /api/resume/generate` - AI 자소서 생성

### 지원 트래커

- `GET /api/applications` - 지원 내역 목록
- `POST /api/applications` - 지원 내역 생성
- `PUT /api/applications/:id` - 지원 내역 수정
- `DELETE /api/applications/:id` - 지원 내역 삭제

### 대시보드

- `GET /api/dashboard/stats` - 통계 조회

## 🔧 수동 테스트 (curl)

### 프로필 저장

```bash
curl -X POST http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "education": "커리어대학교",
    "major": "소프트웨어학과",
    "skills": ["React", "TypeScript"]
  }'
```

### 적합도 분석

```bash
curl -X POST http://localhost:3000/api/analysis/fit \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "name": "홍길동",
      "skills": ["React", "TypeScript"]
    },
    "companyInfo": {
      "name": "AWS코리아",
      "position": "백엔드 엔지니어"
    }
  }'
```

### 지원 내역 조회

```bash
curl http://localhost:3000/api/applications
```

## 📝 참고사항

- 현재는 **메모리 저장소**를 사용합니다 (서버 재시작 시 데이터 초기화)
- 실제 프로덕션에서는 데이터베이스(MongoDB, PostgreSQL 등)를 사용하세요
- AI 기능은 **Mock 데이터**를 반환합니다
- 실제 AI 통합을 위해서는 OpenAI, Google Gemini 등의 API를 연동하세요

## 🔐 보안

- CORS는 현재 모든 origin을 허용합니다 (`*`)
- 프로덕션에서는 실제 S3 URL만 허용하도록 변경하세요
- API Key 인증은 선택적으로 구현되어 있습니다

## 📊 로그

서버는 모든 요청을 콘솔에 로깅합니다:

```
[2026-01-20T10:30:00.000Z] POST /api/profile
✅ 프로필 저장 성공: profile_1
```

## 🐛 문제 해결

### 포트가 이미 사용 중인 경우

`.env` 파일에서 포트를 변경하세요:

```
PORT=3001
```

### 서버 연결 실패

1. 서버가 실행 중인지 확인
2. 방화벽 설정 확인
3. EC2의 경우 보안 그룹에서 포트 개방 확인

## 📚 추가 개발

실제 프로덕션 환경을 위해 추가할 사항:

1. **데이터베이스 연동** (MongoDB, PostgreSQL)
2. **AI API 통합** (OpenAI, Google Gemini)
3. **인증/인가** (JWT, OAuth)
4. **Rate Limiting** (express-rate-limit)
5. **로깅** (Winston, Morgan)
6. **테스트** (Jest, Supertest)
7. **배포** (PM2, Docker)
