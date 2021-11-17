import { authState } from './auth';
import { atom, selector, selectorFamily } from 'recoil';
import { mainApis } from '../../api';

export const asyncDefaultHabitsSelector = selector({
  key: 'asyncDefaultHabitsSelector',
  get: async ({ get }) => {
    const { isLogin } = get(authState);

    if (!isLogin) {
      return null;
    }

    try {
      const { data } = await mainApis.getHabitsInfo();
      return data.habits;
    } catch (error) {
      throw error;
    }
  },
});

export const habitsState = atom({
  key: 'habitList',
  default: asyncDefaultHabitsSelector,
});

export const habitIdListState = selector({
  key: 'habitIdList',
  get: ({ get }) => {
    return get(habitsState).map(({ habitId }) => habitId);
  },
});

export const habitIdHashState = selector({
  key: 'habitIdHash',
  get: ({ get }) => {
    return get(habitsState).reduce((hash, cur) => {
      hash[cur.habitId] = cur;
      return hash;
    }, {});
  },
});

export const habitState = selectorFamily({
  key: 'habit',
  get:
    (habitId) =>
    ({ get }) =>
      get(habitIdHashState)[habitId],
});
