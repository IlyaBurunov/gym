import { put, call, takeEvery, all } from 'redux-saga/effects';

import { workoutService } from '../../services/static-instances';

import { Action } from './index';

import * as workoutsActions from '../actions/workouts';

import { Exercise } from '../../models/workouts';
import { ResultType } from '../../models/result';

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

function* watchUpdateWorkoutExercises() {
  yield takeEvery(workoutsActions.updateWorkoutExercises, function* handleWorkoutExercisesUpdate({
    payload
  }: Action<{ workoutId: string; exercises: Exercise[] }>) {
    const { workoutId, exercises } = payload;

    const result = yield call(
      () =>
        new Promise((resolve, reject) =>
          workoutService.updateWorkoutExercises(workoutId, exercises).subscribe(resolve, reject)
        )
    );
    if (result.status === ResultType.Success) {
      yield put(workoutsActions.setWorkoutExercises(workoutId, exercises));
    }
  });
}

export default function* workouts() {
  yield all([watchGetUsersWorkouts(), watchUpdateWorkoutExercises()]);
}
