const express = require('express');
const router = express.Router();

// 메모리 저장소 (실제로는 DB 사용)
let profiles = {};
let profileCounter = 1;

// 프로필 저장
router.post('/', (req, res) => {
  try {
    const profileData = req.body;
    const profileId = `profile_${profileCounter++}`;
    
    profiles[profileId] = {
      profileId,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log(`✅ 프로필 저장 성공: ${profileId}`);
    
    res.status(200).json({
      success: true,
      message: '프로필이 성공적으로 저장되었습니다.',
      profileId
    });
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    res.status(500).json({
      error: true,
      message: '프로필 저장 중 오류가 발생했습니다.',
      code: 'PROFILE_SAVE_ERROR'
    });
  }
});

// 프로필 조회 (전체 또는 특정 ID)
router.get('/:profileId?', (req, res) => {
  try {
    const { profileId } = req.params;

    if (profileId) {
      // 특정 프로필 조회
      const profile = profiles[profileId];
      if (!profile) {
        return res.status(404).json({
          error: true,
          message: '프로필을 찾을 수 없습니다.',
          code: 'PROFILE_NOT_FOUND'
        });
      }
      console.log(`✅ 프로필 조회 성공: ${profileId}`);
      return res.json(profile);
    } else {
      // 최근 프로필 조회 (실제로는 사용자별로 관리)
      const allProfiles = Object.values(profiles);
      const latestProfile = allProfiles[allProfiles.length - 1] || null;
      
      if (!latestProfile) {
        return res.status(404).json({
          error: true,
          message: '저장된 프로필이 없습니다.',
          code: 'NO_PROFILE'
        });
      }

      console.log(`✅ 최근 프로필 조회 성공`);
      return res.json(latestProfile);
    }
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({
      error: true,
      message: '프로필 조회 중 오류가 발생했습니다.',
      code: 'PROFILE_GET_ERROR'
    });
  }
});

module.exports = router;
