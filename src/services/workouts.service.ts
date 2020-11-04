import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { AppConfig } from '../configs/AppConfig';
import { Workout, Exercise } from '../models/workouts';
import { ResultType } from '../models/result';

export class WorkoutService {
  getWorkouts(userId: string): Observable<Workout[]> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    return of(workouts).pipe(delay(300));
  }

  getWorkout(workoutId: string): Observable<Workout> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts: Workout[] = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? of(workout).pipe(delay(300)) : throwError("Workout doesn't exist");
  }

  getNewWorkoutId(): Observable<string> {
    return of(uuidv4()).pipe(delay(100));
  }

  createWorkout(workoutId: string): Observable<Workout> {
    const workout: Workout = {
      id: workoutId,
      title: `Workout ${dayjs().format('DD MMM')}`,
      startTime: dayjs().format(),
      endTime: '',
      exercises: [],
      comment: ''
    };
    localStorage.setItem(AppConfig.newWorkoutKey, JSON.stringify(workout));
    return of(workout).pipe(delay(300));
  }

  updateWorkout(workout: Workout): Observable<any> {
    localStorage.setItem(AppConfig.newWorkoutKey, JSON.stringify(workout));
    return of('').pipe(delay(300));
  }

  updateWorkoutExercises(
    workoutId: string,
    exercises: Exercise[]
  ): Observable<{ status: ResultType }> {
    const storageNewWorkout = localStorage.getItem(AppConfig.newWorkoutKey);
    const newWorkout = storageNewWorkout && JSON.parse(storageNewWorkout);
    localStorage.setItem(AppConfig.newWorkoutKey, JSON.stringify({ ...newWorkout, exercises }));
    return of({ status: ResultType.Success }).pipe(delay(300));
  }

  saveWorkout(workout: Workout): Observable<any> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts: Workout[] = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    const newWorkout = { ...workout, endTime: dayjs().format() };
    const isNew = !workouts.find(w => w.id === newWorkout.id);
    if (isNew) {
      const newWorkouts = JSON.stringify(workouts.concat([newWorkout]));
      localStorage.setItem(AppConfig.workoutsKey, newWorkouts);
      localStorage.removeItem(AppConfig.newWorkoutKey);
    } else {
      const newWorkouts = workouts.map(w => {
        if (w.id === workout.id) {
          return newWorkout;
        }
        return w;
      });
      localStorage.setItem(AppConfig.workoutsKey, JSON.stringify(newWorkouts));
    }
    return of('').pipe(delay(300));
  }

  getNewWorkout(id: string): Observable<Workout | null> {
    const storageNewWorkout = localStorage.getItem(AppConfig.newWorkoutKey);
    const newWorkout: Workout | null = storageNewWorkout ? JSON.parse(storageNewWorkout) : null;
    if (newWorkout && newWorkout.id === id) {
      return of(newWorkout).pipe(delay(300));
    }
    return of(null).pipe(delay(300));
  }

  deleteWorkout(id: string): Observable<any> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts: Workout[] = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    const newWorkouts = workouts.filter(w => w.id !== id);
    localStorage.setItem(AppConfig.workoutsKey, JSON.stringify(newWorkouts));
    return of('').pipe(delay(300));
  }

  updateTitle(id: string, title: string): Observable<any> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts: Workout[] = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    const newWorkouts = workouts.map(w => {
      if (w.id === id) {
        return { ...w, title };
      }
      return w;
    });
    localStorage.setItem(AppConfig.workoutsKey, JSON.stringify(newWorkouts));
    return of(title).pipe(delay(300));
  }
}
