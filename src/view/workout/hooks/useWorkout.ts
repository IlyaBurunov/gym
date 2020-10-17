import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';

import { addWorkouts } from '../../../redux/actions/workouts';

import { Workout } from '../../../models/workouts';
import { AppState } from '../../../redux/reducers';

import { workoutService } from '../../../services/static-instances';

export function useWorkout(
  workoutId: string,
  isNewWorkout?: boolean
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
    const sub = workoutService
      .getNewWorkout(workoutId)
      .pipe(
        finalize(() => setLoading(false)),
        switchMap(newW => {
          if (newW) {
            return of(newW);
          }
          if (isNewWorkout) {
            return workoutService.createWorkout(workoutId);
          }
          return workoutService.getWorkout(workoutId);
        })
      )
      .subscribe(w => {
        dispatch(addWorkouts([w]));
      });

    return () => sub.unsubscribe();
  }, [workoutId, isNewWorkout, dispatch]);

  return { workout, loading };
}
