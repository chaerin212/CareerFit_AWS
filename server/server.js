require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 라우트 임포트
const profileRoutes = require('./routes/profile');
const analysisRoutes = require('./routes/analysis');
const jobsRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resume');
const applicationsRoutes = require('./routes/applications');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
  origin: '*', // 프로덕션에서는 실제 S3 URL로 변경
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API 라우트 등록
app.use('/api/profile', profileRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 루트 엔드포인트
app.get('/', (req, res) => {
  res.json({
    message: 'CareerFit API Server',
    version: '1.0.0',
    endpoints: {
      profile: '/api/profile',
      analysis: '/api/analysis/fit',
      jobs: '/api/jobs/search',
      resume: '/api/resume/generate',
      applications: '/api/applications',
      dashboard: '/api/dashboard/stats'
    }
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: '요청하신 엔드포인트를 찾을 수 없습니다.',
    code: 'NOT_FOUND'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: true,
    message: '서버 내부 오류가 발생했습니다.',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`🚀 CareerFit API Server 시작됨`);
  console.log(`📡 포트: ${PORT}`);
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ 시작 시간: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  console.log('\n사용 가능한 엔드포인트:');
  console.log('  GET  /health');
  console.log('  GET  /');
  console.log('  POST /api/profile');
  console.log('  GET  /api/profile');
  console.log('  POST /api/analysis/fit');
  console.log('  POST /api/jobs/search');
  console.log('  POST /api/resume/generate');
  console.log('  GET  /api/applications');
  console.log('  POST /api/applications');
  console.log('  PUT  /api/applications/:id');
  console.log('  DELETE /api/applications/:id');
  console.log('  GET  /api/dashboard/stats');
  console.log('\n');
});

module.exports = app;
