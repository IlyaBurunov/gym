enum ExerciseUnitType {
  Time = 1,
  Weight,
  Repeat
}

export interface ExerciseDatabaseType {
  id: string;
  name: string;
  unitType: ExerciseUnitType;
}

// Legs

const backSquat = {
  id: '73B14SM2o',
  name: 'back squat',
  unitType: ExerciseUnitType.Weight
};

const frontSquat = {
  id: '4KjdV57t4',
  name: 'front squat',
  unitType: ExerciseUnitType.Weight
};

const squatWithWeightBetweenLegs = {
  id: 'E4D9x86N9',
  name: 'squat with weight between legs',
  unitType: ExerciseUnitType.Weight
};

const bodyweightSquat = {
  id: 'LphX1QU03',
  name: 'bodyweight squat',
  unitType: ExerciseUnitType.Repeat
};

const lunge = {
  id: '92i2kXKA8',
  name: 'lunge',
  unitType: ExerciseUnitType.Weight
};

const romanianDeadlift = {
  id: 'gbVQSZ785',
  name: 'romanian deadlift',
  unitType: ExerciseUnitType.Weight
};

const legsExercises = [
  backSquat,
  frontSquat,
  squatWithWeightBetweenLegs,
  bodyweightSquat,
  lunge,
  romanianDeadlift
];

// Back

const pullUp = {
  id: '8N2U6k3y8',
  name: 'pull-up',
  unitType: ExerciseUnitType.Repeat
};

const deadlift = {
  id: 'Z035FmeF6',
  name: 'deadlift',
  unitType: ExerciseUnitType.Weight
};

const bentOverBarbellRow = {
  id: '5yQKUcT6x',
  name: 'bent-over barbell row',
  unitType: ExerciseUnitType.Weight
};

const oneArmBentOverDumbbellRow = {
  id: '4Gzbfl9ox',
  name: 'one arm bent-over dumbbell row',
  unitType: ExerciseUnitType.Weight
};

const backExercises = [pullUp, deadlift, bentOverBarbellRow, oneArmBentOverDumbbellRow];

// shoulder

const barbellOverheadShoulderPress = {
  id: 'R5vcwlu47',
  name: 'barbell overhead shoulder press',
  unitType: ExerciseUnitType.Weight
};

const seatedDumbbellShoulderPress = {
  id: 'AYV6xWN4Q',
  name: 'seated dumbbell shoulder press',
  unitType: ExerciseUnitType.Weight
};

const dumbbellLateralRaise = {
  id: 'pQ75h0Ng2',
  name: 'dumbbell lateral raise',
  unitType: ExerciseUnitType.Weight
};

const facePull = {
  id: 'rBZT5It0E',
  name: 'face pull',
  unitType: ExerciseUnitType.Weight
};

const shoulderExercises = [
  barbellOverheadShoulderPress,
  seatedDumbbellShoulderPress,
  dumbbellLateralRaise,
  facePull
];

// chest

const flatBenchPress = {
  id: 'Jcx75gWiC',
  name: 'flat bench press',
  unitType: ExerciseUnitType.Weight
};

const inclineBenchPress = {
  id: '9jdGrFG7R',
  name: 'incline bench press',
  unitType: ExerciseUnitType.Weight
};

const PushUp = {
  id: 'Ow19n873D',
  name: 'push-up',
  unitType: ExerciseUnitType.Repeat
};

const dipsForChest = {
  id: 'gVRWA4135',
  name: 'dips for chest',
  unitType: ExerciseUnitType.Repeat
};

const chestExercises = [flatBenchPress, inclineBenchPress, PushUp, dipsForChest];

// Biceps

const barbellCurl = {
  id: 'om7rAk3P3',
  name: 'barbell curl',
  unitType: ExerciseUnitType.Weight
};

const dumbbellCurl = {
  id: '4eJZhjZP3',
  name: 'dumbbell curl',
  unitType: ExerciseUnitType.Weight
};

const bicepsExercises = [barbellCurl, dumbbellCurl];

// Triceps

const overheadTricepsExtension = {
  id: '4eJZhjZP3',
  name: 'overhead triceps extension',
  unitType: ExerciseUnitType.Weight
};

const closeGripBenchPress = {
  id: 'K5Lq9L7lE',
  name: 'close-grip bench press',
  unitType: ExerciseUnitType.Weight
};

const tricepsExercises = [overheadTricepsExtension, closeGripBenchPress];

export const exercises: ExerciseDatabaseType[] = legsExercises
  .concat(backExercises)
  .concat(shoulderExercises)
  .concat(chestExercises)
  .concat(bicepsExercises)
  .concat(tricepsExercises);
