export enum ExerciseUnitType {
  Time = 1,
  Weight,
  Repeat
}

export enum WeightType {
  Kilogram = 1,
  LB
}

export interface Set {
  id: string;
  repsCount?: number;
  weight?: number;
  weightType?: WeightType;
}

export interface Exercise {
  id: string;
  name: string;
  unitType: ExerciseUnitType;
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
