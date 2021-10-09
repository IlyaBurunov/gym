enum ExerciseUnitType {
  Time = 1,
  Weight,
  Repeat
}

export interface ExerciseDatabaseType {
  id: string;
  name: string;
  slug: string;
  unitType: ExerciseUnitType;
}

// const namesMap = {
//   backSquat: 'Приседания со штангой на плечах',
//   frontSquat: 'Приседания со штангой на груди',
//   squatWithWeightBetweenLegs: 'Плие приседания с гантелью между ног',
//   bodyweightSquat: 'Приседания без веса',
//   lunge: 'Выпады',
//   romanianDeadlift: 'Румынская становая тяга',
//   pullUp: 'Подтягивания на турнике',
//   deadlift: 'Становая тяга',
//   bentOverBarbellRow: 'Тяга штанги в наклоне',
//   oneArmBentOverDumbbellRow: 'Тяга гантели в наклоне',
//   barbellOverheadShoulderPress: 'Армейский жим штанги стоя',
//   // армейский жим штанги сидя
//   // армейский жим гантель сидя
//   seatedDumbbellShoulderPress: 'Армейский жим гантель сидя',
//   // жим арнольда
//   dumbbellLateralRaise: 'Разведение рук с гантелями стоя',
//   flatBenchPress: 'Жим штанги от груди лежа',
//   inclineBenchPress: 'Жим штанги на скамье с наклоном вверх',
//   dipsForChest: 'Отжимания на брусьях',
//   barbellCurl: 'Подъем штанги на бицепс',
//   dumbbellCurl: 'Подъем гантелей на бицепс',
//   overheadTricepsExtension: 'Французский жим гантели',
//   closeGripBenchPress: 'Жим лежа узким хватом'
// };

// Legs

const backSquat = {
  id: '73B14SM2o',
  name: 'Back squat',
  slug: 'backSquat',
  unitType: ExerciseUnitType.Weight
};

const frontSquat = {
  id: '4KjdV57t4',
  name: 'Front squat',
  slug: 'frontSquat',
  unitType: ExerciseUnitType.Weight
};

const squatWithWeightBetweenLegs = {
  id: 'E4D9x86N9',
  name: 'Squat with weight between legs',
  slug: 'squatWithWeightBetweenLegs',
  unitType: ExerciseUnitType.Weight
};

const bodyweightSquat = {
  id: 'LphX1QU03',
  name: 'Bodyweight squat',
  slug: 'bodyweightSquat',
  unitType: ExerciseUnitType.Repeat
};

const lunge = {
  id: '92i2kXKA8',
  name: 'Lunge',
  slug: 'lunge',
  unitType: ExerciseUnitType.Weight
};

const romanianDeadlift = {
  id: 'gbVQSZ785',
  name: 'Romanian deadlift',
  slug: 'romanianDeadlift',
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
  name: 'Pull up',
  slug: 'pullUp',
  unitType: ExerciseUnitType.Repeat
};

const deadlift = {
  id: 'Z035FmeF6',
  name: 'Deadlift',
  slug: 'deadlift',
  unitType: ExerciseUnitType.Weight
};

const bentOverBarbellRow = {
  id: '5yQKUcT6x',
  name: 'Bent over barbell row',
  slug: 'bentOverBarbellRow',
  unitType: ExerciseUnitType.Weight
};

const oneArmBentOverDumbbellRow = {
  id: '4Gzbfl9ox',
  name: 'One arm bent over dumbbell row',
  slug: 'oneArmBentOverDumbbellRow',
  unitType: ExerciseUnitType.Weight
};

const backExercises = [pullUp, deadlift, bentOverBarbellRow, oneArmBentOverDumbbellRow];

// shoulder

const barbellOverheadShoulderPress = {
  id: 'R5vcwlu47',
  name: 'Barbell overhead shoulder press',
  slug: 'barbellOverheadShoulderPress',
  unitType: ExerciseUnitType.Weight
};

const seatedDumbbellShoulderPress = {
  id: 'AYV6xWN4Q',
  name: 'Seated dumbbell shoulder press',
  slug: 'seatedDumbbellShoulderPress',
  unitType: ExerciseUnitType.Weight
};

const dumbbellLateralRaise = {
  id: 'pQ75h0Ng2',
  name: 'Dumbbell lateral raise',
  slug: 'dumbbellLateralRaise',
  unitType: ExerciseUnitType.Weight
};

const shoulderExercises = [
  barbellOverheadShoulderPress,
  seatedDumbbellShoulderPress,
  dumbbellLateralRaise
];

// chest

const flatBenchPress = {
  id: 'Jcx75gWiC',
  name: 'Flat bench Press',
  slug: 'flatBenchPress',
  unitType: ExerciseUnitType.Weight
};

const inclineBenchPress = {
  id: '9jdGrFG7R',
  name: 'Incline bench press',
  slug: 'inclineBenchPress',
  unitType: ExerciseUnitType.Weight
};

const pushUp = {
  id: 'Ow19n873D',
  name: 'Push up',
  slug: 'pushUp',
  unitType: ExerciseUnitType.Repeat
};

const dipsForChest = {
  id: 'gVRWA4135',
  name: 'Dips for chest',
  slug: 'dipsForChest',
  unitType: ExerciseUnitType.Repeat
};

const chestExercises = [flatBenchPress, inclineBenchPress, pushUp, dipsForChest];

// Biceps

const barbellCurl = {
  id: 'om7rAk3P3',
  name: 'Barbell curl',
  slug: 'barbellCurl',
  unitType: ExerciseUnitType.Weight
};

const dumbbellCurl = {
  id: '4eJZhjZP3',
  name: 'Dumbbell curl',
  slug: 'dumbbellCurl',
  unitType: ExerciseUnitType.Weight
};

const bicepsExercises = [barbellCurl, dumbbellCurl];

// Triceps

const overheadTricepsExtension = {
  id: '4eJZhjZP3',
  name: 'Overhead triceps extension',
  slug: 'overheadTricepsExtension',
  unitType: ExerciseUnitType.Weight
};

const closeGripBenchPress = {
  id: 'K5Lq9L7lE',
  name: 'Close grip bench press',
  slug: 'closeGripBenchPress',
  unitType: ExerciseUnitType.Weight
};

const tricepsExercises = [overheadTricepsExtension, closeGripBenchPress];

export const exercises: ExerciseDatabaseType[] = legsExercises
  .concat(backExercises)
  .concat(shoulderExercises)
  .concat(chestExercises)
  .concat(bicepsExercises)
  .concat(tricepsExercises);
