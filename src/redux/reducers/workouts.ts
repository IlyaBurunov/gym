import { handleActions } from 'redux-actions';
import produce from 'immer';

import { Workout } from '../../models/workouts';

import {
  addWorkouts,
  setWorkoutExercises,
  deleteWorkout,
  updateWorkoutTitle
} from '../actions/workouts';

export type State = {
  workouts: Record<string, Workout>;
  workoutsExercises: Record<string, Workout['exercises']>;
  workoutsIds: string[];
};

const initialState: State = {
  workouts: {},
  workoutsExercises: {},
  workoutsIds: []
};

function mergeWorkouts(
  obj: State['workouts'],
  exercisesObj: State['workoutsExercises'],
  workouts: Workout[]
) {
  const workoutsArr: Workout[] = workouts;
  for (const workout of workoutsArr) {
    const id = workout.id;

    if (workout.exercises.length) {
      exercisesObj[id] = workout.exercises;
      delete workout.exercises;
    }

    obj[id] = workout;
  }
}

export default handleActions(
  {
    [addWorkouts]: (state, { payload: { workouts } }) =>
      produce(state, draft => {
        mergeWorkouts(draft.workouts, draft.workoutsExercises, workouts);
        draft.workoutsIds = workouts.map(item => item.id);
      }),
    [setWorkoutExercises]: (state, { payload: { workoutId, exercises } }) =>
      produce(state, draft => {
        draft.workoutsExercises[workoutId] = exercises;
      }),
    [deleteWorkout]: (state, { payload: { workoutId } }) =>
      produce(state, draft => {
        delete draft.workouts[workoutId];
        const idsIndex = draft.workoutsIds.indexOf(workoutId);
        draft.workoutsIds.splice(idsIndex, 1);
      }),
    [updateWorkoutTitle]: (state, { payload: { workoutId, title } }) =>
      produce(state, draft => {
        const workout = draft.workouts[workoutId];
        draft.workouts[workoutId] = { ...workout, title };
      })
  },
  initialState
);
