import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { AppConfig } from '../configs/AppConfig';
import { Workout, Exercise, Set } from '../models/workouts';
import { ResultType } from '../models/result';

function getStoredWorkouts(): Workout[] {
  const storageWorkouts = localStorage.getItem(AppConfig.workoutsKey);
  const workouts = storageWorkouts ? JSON.parse(storageWorkouts) : [];

  return workouts;
}

function getStoredWorkout(id: Workout['id']): Workout | null {
  const workouts = getStoredWorkouts();
  const workout = workouts.find(workout => workout.id === id);

  return workout || null;
}

function addWorkoutToStorage(workout: Partial<Workout>) {
  if (!workout.id) {
    throw new Error('Can not add workout to storage without id');
  }

  const workouts = getStoredWorkouts();

  localStorage.setItem(AppConfig.workoutsKey, JSON.stringify([...workouts, workout]));
}

function deleteWorkoutFromStorage(id: Workout['id']) {
  const storedWorkout = getStoredWorkout(id);

  if (storedWorkout === null) {
    throw new Error(
      `Can not delete stored workout, because there is no workout with ${id} id in storage`
    );
  }

  const workouts = getStoredWorkouts().filter(work => work.id !== id);

  localStorage.setItem(AppConfig.workoutsKey, JSON.stringify(workouts));
}

function updateStoredWorkoutsByWorkout(workout: Partial<Workout>) {
  if (!workout.id) {
    throw new Error('Can not update stored workout without id');
  }

  const storedWorkout = getStoredWorkout(workout.id);

  if (storedWorkout === null) {
    throw new Error(
      `Can not update stored workout, because there is no workout with ${workout.id} id in storage`
    );
  }

  const workouts = getStoredWorkouts();
  const newWorkout = { ...storedWorkout, ...workout };
  const newWorkouts = workouts.map(storedWork =>
    storedWork.id === workout.id ? newWorkout : storedWork
  );

  localStorage.setItem(AppConfig.workoutsKey, JSON.stringify(newWorkouts));
}

export class WorkoutService {
  getWorkouts(userId: string): Observable<Workout[]> {
    const workouts = getStoredWorkouts();
    return of(workouts).pipe(delay(300));
  }

  getWorkout(workoutId: string): Observable<Workout | null> {
    const workout = getStoredWorkout(workoutId);

    return of(workout).pipe(delay(300));
  }

  getNewWorkoutId(): Observable<string> {
    return of(uuidv4()).pipe(delay(100));
  }

  createSet(set: Partial<Set>): Observable<Set> {
    return of({ id: uuidv4(), ...set }).pipe(delay(300));
  }

  deleteSet(
    workoutId: Workout['id'],
    exerciseId: Exercise['id'],
    setId: Set['id']
  ): Observable<any> {
    const newWorkout = getStoredWorkout(workoutId);

    if (newWorkout === null) {
      throw new Error(
        `Can not delete set from workout with ${workoutId} id, because there is no workout in storage`
      );
    }

    updateStoredWorkoutsByWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) };
        }

        return exercise;
      })
    });
    return of('').pipe(delay(300));
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

    addWorkoutToStorage(workout);

    return of(workout).pipe(delay(300));
  }

  updateWorkout(workout: Workout): Observable<any> {
    updateStoredWorkoutsByWorkout(workout);

    return of('').pipe(delay(300));
  }

  updateWorkoutExercises(
    workoutId: string,
    exercises: Exercise[]
  ): Observable<{ status: ResultType }> {
    updateStoredWorkoutsByWorkout({ id: workoutId, exercises });

    return of({ status: ResultType.Success }).pipe(delay(300));
  }

  saveWorkout(workout: Workout): Observable<any> {
    const newWorkout = { ...workout, endTime: dayjs().format() };
    const isNew = !getStoredWorkout(workout.id);
    if (isNew) {
      addWorkoutToStorage(newWorkout);
    } else {
      updateStoredWorkoutsByWorkout(newWorkout);
    }

    return of('').pipe(delay(300));
  }

  deleteWorkout(id: Workout['id']): Observable<any> {
    deleteWorkoutFromStorage(id);

    return of('').pipe(delay(300));
  }

  updateWorkoutTitle(id: Workout['id'], title: string): Observable<any> {
    updateStoredWorkoutsByWorkout({ id, title });

    return of(title).pipe(delay(300));
  }
}
