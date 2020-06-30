import { combineReducers } from 'redux';

import workoutsReducer, { State as WorkoutsState } from './workouts';

const reducer = combineReducers({
  workouts: workoutsReducer
});

export default reducer;

export type AppState = {
  workouts: WorkoutsState;
};
