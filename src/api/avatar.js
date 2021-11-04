// import instance from '../lib/axios';
import instance from '../lib/testing';

export const avatarApis = {
  loadAvatar: () => instance.get('/avatars'),
  // 아바타 요청
  choiceAvatar: (avatarInfo) => instance.post('/avatars/select', avatarInfo),
  // 아바타선택
  // "avatarId" : Long,"avatarName" : "String"
};
