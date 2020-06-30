import { createAction } from 'redux-actions';

import { Workout } from '../../models/workouts';

const ca = (n, p) => createAction(`workouts/${n}`, p);

export const getUsersWorkouts = ca('GET_USERS_WORKOUTS', (userId: string) => ({
  userId
}));

export const addWorkouts = ca('ADD_NEWS', (workouts: Workout[]) => ({
  workouts
}));
