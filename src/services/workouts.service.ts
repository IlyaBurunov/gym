import { Observable, of, throwError } from 'rxjs';
import { AppConfig } from '../configs/AppConfig';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ExerciseDatabaseType } from '../database/exercises';

export enum ExerciseUnitType {
  Time = 1,
  Weight,
  Repeat
}

export enum WeightType {
  Kilogram = 1,
  LB
}

export interface WorkoutDay {
  id: string;
  date: string;
  workouts: Workout[];
  title: string;
}

export interface Set {
  repsCount: number;
  weight?: number;
  weightType?: WeightType;
}

export interface Exercise extends ExerciseDatabaseType {
  sets: Set[];
  startTime: string;
  endTime: string;
}

export interface Workout {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  exercises: Exercise[];
  comment: string;
}

export class WorkoutService {
  getWorkouts(): Observable<Workout[]> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    return of(workouts);
  }

  getWorkout(workoutId: string): Observable<Workout> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts: Workout[] = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? of(workout) : throwError("Workout doesn't exist");
  }

  getNewWorkoutId(): Observable<string> {
    return of(uuidv4());
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
    return of(workout);
  }

  updateWorkout(workout: Workout): Observable<any> {
    localStorage.setItem(AppConfig.newWorkoutKey, JSON.stringify(workout));
    return of('');
  }

  saveWorkout(workout: Workout): Observable<any> {
    const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
    const workouts: Workout[] = storageWorkouts ? JSON.parse(storageWorkouts) : [];
    const newWorkout = { ...workout, endTime: dayjs().format() };
    const isNew = !workouts.find(w => w.id === newWorkout.id);
    if (isNew) {
      const newWorkouts = JSON.stringify(workouts.concat([newWorkout]));
      localStorage.setItem(AppConfig.workoutsKey, newWorkouts);
    } else {
      const newWorkouts = workouts.map(w => {
        if (w.id === workout.id) {
          return newWorkout;
        }
        return w;
      });
      localStorage.setItem(AppConfig.workoutsKey, JSON.stringify(newWorkouts));
    }
    return of('');
  }

  getNewWorkout(id: string): Observable<Workout | null> {
    const storageNewWorkout = localStorage.getItem(AppConfig.newWorkoutKey);
    const newWorkout: Workout | null = storageNewWorkout ? JSON.parse(storageNewWorkout) : null;
    if (newWorkout && newWorkout.id === id) {
      return of(newWorkout);
    }
    return of(null);
  }
}
