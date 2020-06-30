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

// export interface WorkoutDay {
//     id: string;
//     date: string;
//     workouts: Workout[];
//     title: string;
// }

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
