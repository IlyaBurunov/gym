import { all } from 'redux-saga/effects';

import workoutsSagas from './workouts';

export type Action<T> = {
  payload: T;
};

export function* initSaga() {
  yield all([workoutsSagas()]);
}
