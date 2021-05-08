import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { finalize } from 'rxjs/operators';

import { addWorkouts } from '../../../redux/actions/workouts';

import { Workout } from '../../../models/workouts';
import { AppState } from '../../../redux/reducers';

import { workoutService } from '../../../services';

export function useWorkout(
  workoutId: string
): {
  workout: Workout | null;
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const workout = useSelector<AppState, Workout | null>(
    state => state.workouts.workouts[`${workoutId}`] || null
  );

  useEffect(() => {
    setLoading(true);
    if (!workout || workoutId !== workout.id) {
      const sub = workoutService
        .getWorkout(workoutId)
        .pipe(finalize(() => setLoading(false)))
        .subscribe(w => {
          dispatch(addWorkouts([w]));
        });

      return () => sub.unsubscribe();
    }
  }, [workoutId, workout, dispatch]);

  return { workout, loading };
}
