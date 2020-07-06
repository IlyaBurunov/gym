import { createAction } from 'redux-actions';

import { Workout, Exercise } from '../../models/workouts';

const ca = (n, p) => createAction(`workouts/${n}`, p);

export const getUsersWorkouts = ca('GET_USERS_WORKOUTS', (userId: string) => ({
  userId
}));

export const addWorkouts = ca('ADD_NEWS', (workouts: Workout[]) => ({
  workouts
}));

export const updateWorkoutExercises = ca(
  'UPDATE_WORKOUT_EXERCISES',
  (workoutId: string, exercises: Exercise[]) => ({
    workoutId,
    exercises
  })
);

export const setWorkoutExercises = ca(
  'SET_WORKOUT_EXERCISES',
  (workoutId: string, exercises: Exercise[]) => ({
    workoutId,
    exercises
  })
);

export const deleteWorkout = ca('DELETE_WORKOUT', (workoutId: string) => ({ workoutId }));
