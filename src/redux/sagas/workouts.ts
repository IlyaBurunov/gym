import { put, call, takeEvery, all } from 'redux-saga/effects';

import { workoutService } from '../../services/static-instances';

import { Action } from './index';

import * as workoutsActions from '../actions/workouts';

function* watchGetUsersWorkouts() {
  yield takeEvery(workoutsActions.getUsersWorkouts, function* handleWorkoutsRequest({
    payload
  }: Action<{ userId: string }>) {
    const { userId } = payload;
    yield put(workoutsActions.addWorkouts([]));

    const workouts = yield call(
      () =>
        new Promise((resolve, reject) =>
          workoutService.getWorkouts(userId).subscribe(resolve, reject)
        )
    );

    yield put(workoutsActions.addWorkouts(workouts));
  });
}

export default function* workouts() {
  yield all([watchGetUsersWorkouts()]);
}
