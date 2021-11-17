import tokenInstance from '../lib/axios';

export const userApis = {
  searchUser: (monsterCode) => tokenInstance.get(`/monsterCode/${monsterCode}`),
  follow: (monsterCode, isFollowed = false) =>
    isFollowed
      ? tokenInstance.delete(`/unFollow/${monsterCode}`)
      : tokenInstance.patch(`/follow/${monsterCode}`),
};