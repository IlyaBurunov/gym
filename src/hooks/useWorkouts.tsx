import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../redux/reducers';

import { getUsersWorkouts } from '../redux/actions/workouts';

export const useWorkouts = (config: { userId: string }) => {
  const { userId } = config;
  const dispatch = useDispatch();
  const workoutsIds = useSelector<AppState, string[]>(state => state.workouts.workoutsIds);

  useEffect(() => {
    dispatch(getUsersWorkouts(userId));
  }, [userId, dispatch]);

  return { workoutsIds };
};
