import instance from '../lib/axios';
// import instance from '../lib/testing';

export const myPageApis = {
  loadUserData: () => instance.get('/user/info'),
  // 마이페이지 유저 정보 조회
  editUserName: (userName) => instance.patch('/user/name', userName),
};
