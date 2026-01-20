# CareerFit AWS - AI 기반 취업 준비 플랫폼dfdfd

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🚀 프로젝트 개요

CareerFit은 AI를 활용한 올인원 취업 준비 플랫폼입니다. S3 정적 웹 호스팅과 EC2 백엔드 서버를 통해 사용자 프로필 관리, 직무 적합도 분석, AI 자소서 작성, 지원 트래킹 등의 기능을 제공합니다.

### 주요 기능

1. **프로필 관리** - 학력, 프로젝트, 기술 스택, g자격증, 수상 경력 관리
2. **직무 및 컬쳐핏 분석** - AI 기반 회사-지원자 매칭 점수 분석
3. **회사 리스트 탐색** - AI 추천 채용 공고 및 적합도 점수
4. **AI 커리어 에이전트** - 컨텍스트 기반 자기소개서 자동 생성
5. **지원 트래커** - 채용 일정, 진행 상태, 결과 관리
6. **대시보드** - 지원 현황 통계 및 시각화

---

## 🏗️ 아키텍처

```
┌─────────────────┐      HTTP/HTTPS      ┌──────────────────┐
│   S3 Static     │ ───────────────────> │   EC2 Server     │
│   Web Hosting   │                      │   (Backend API)  │
└─────────────────┘                      └──────────────────┘
                                                   │
                                                   ▼
                                          ┌──────────────────┐
                                          │   LLM (Gemini)   │
                                          └──────────────────┘
```

---

## 📚 문서

- **[API 명세서](./API_SPEC.md)** - 전체 API 엔드포인트 및 요청/응답 스펙
- **[배포 가이드](./README_DEPLOYMENT.md)** - S3 배포 및 EC2 연동 가이드

---

## 🛠️ 기술 스택

### 프론트엔드
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Recharts** - 데이터 시각화
- **Lucide React** - 아이콘

### 백엔드 (별도 구현 필요)
- **EC2** - 서버 호스팅
- **LLM (Gemini)** - AI 분석 및 생성
- **RESTful API** - 프론트엔드-백엔드 통신

---

## 🚦 빠른 시작

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

`.env` 파일을 열어 EC2 백엔드 URL을 설정하세요:

```bash
VITE_API_BASE_URL=https://your-ec2-instance.amazonaws.com
VITE_API_KEY=your-api-key-here
```

### 2. 로컬 개발 서버 실행

```bash
npm run dev
```

- 기본 포트: `http://localhost:3000`
- 백엔드가 준비되지 않은 경우 로컬 AI 서비스(fallback)가 동작합니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

- `dist` 폴더에 정적 파일이 생성됩니다.
- S3에 업로드하여 배포할 수 있습니다.

---

## 📡 API 엔드포인트

전체 API 명세는 **[API_SPEC.md](./API_SPEC.md)**를 참조하세요.

### 주요 엔드포인트 요약

| 엔드포인트 | 메서드 | 기능 | 사용 페이지 |
|-----------|--------|------|------------|
| `/api/profile` | POST, GET | 프로필 저장/조회 | ProfileForm |
| `/api/analysis/fit` | POST | 직무 적합도 분석 | FitAnalysis |
| `/api/jobs/search` | POST | 채용 공고 검색 | CompanyList |
| `/api/resume/generate` | POST | AI 자소서 생성 | ResumeBuilder |
| `/api/applications` | GET, POST, PUT, DELETE | 지원 내역 관리 | Tracker, Dashboard |
| `/api/dashboard/stats` | GET | 대시보드 통계 | Dashboard |

---

## 📦 프로젝트 구조

```
CareerFit_AWS/
├── components/          # React 컴포넌트
│   ├── Dashboard.tsx    # 대시보드
│   ├── ProfileForm.tsx  # 프로필 관리
│   ├── FitAnalysis.tsx  # 적합도 분석
│   ├── CompanyList.tsx  # 회사 탐색
│   ├── ResumeBuilder.tsx # AI 자소서 작성
│   └── Tracker.tsx      # 지원 트래커
├── services/            # API 서비스 레이어
│   ├── apiService.ts    # 백엔드 API 호출
│   └── geminiService.ts # 로컬 AI (fallback)
├── types.ts             # TypeScript 타입 정의
├── App.tsx              # 메인 앱 컴포넌트
├── API_SPEC.md          # API 명세서
├── README_DEPLOYMENT.md # 배포 가이드
└── .env.example         # 환경 변수 템플릿
```

---

## 🔐 보안

### 환경 변수
- `.env` 파일은 Git에 커밋하지 마세요.
- API 키는 백엔드에서만 관리하세요.

### CORS
- EC2 서버에서 S3 도메인을 CORS 허용 목록에 추가하세요.

### HTTPS
- 프로덕션 환경에서는 CloudFront + ACM 인증서를 사용하세요.

---

## 🔄 페이지별 API 연동

각 페이지는 백엔드 API를 우선 호출하며, 실패 시 로컬 AI(Gemini)로 fallback합니다:

| 페이지 | API 엔드포인트 | Fallback |
|--------|---------------|----------|
| **ProfileForm** | `POST /api/profile` | localStorage |
| **FitAnalysis** | `POST /api/analysis/fit` | Local Gemini |
| **CompanyList** | `POST /api/jobs/search` | Local Gemini |
| **ResumeBuilder** | `POST /api/resume/generate` | Local Gemini |
| **Tracker** | CRUD `/api/applications` | localStorage |
| **Dashboard** | `GET /api/dashboard/stats` | Local calculation |

---

## 🐛 트러블슈팅

### CORS 오류
```bash
# EC2 서버에서 CORS 설정 확인
# S3 버킷 URL을 허용 목록에 추가
```

### API 연결 실패
```bash
# 1. EC2 보안 그룹에서 포트 확인
# 2. .env 파일의 URL 확인
# 3. 브라우저 개발자 도구 Network 탭 확인
```

### 빌드 오류
```bash
# Node.js 버전 확인 (16 이상 필요)
node --version

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 라이선스

MIT License

---

## 🙋‍♂️ 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.

---

## 📌 관련 링크

- **AI Studio**: https://ai.studio/apps/drive/102Ja7_s5TwSM2cobi7-DgVn7b_KHsozf
- **AWS S3 문서**: https://docs.aws.amazon.com/s3/
- **AWS EC2 문서**: https://docs.aws.amazon.com/ec2/
