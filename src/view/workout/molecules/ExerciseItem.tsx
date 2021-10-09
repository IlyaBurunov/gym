import React, { memo, useCallback, useMemo, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

import { workoutService } from '../../../services';

import { Workout, Exercise, WeightType, Set, ExerciseUnitType } from '../../../models/workouts';

import { If } from '../../../util';

function getWeightShortName(type: WeightType | undefined) {
  switch (type) {
    case WeightType.Kilogram:
      return 'kg';
    case WeightType.LB:
      return 'lbs';
    default:
      throw new Error('Unknown weight type');
  }
}

interface Props {
  workoutId: Workout['id'];
  exercise: Exercise;
  onExerciseUpdate(exercise: Exercise): void;
  onDeleteExercises(id: string): void;
}

export const ExerciseItem = memo<Props>(function ExerciseItem({
  workoutId,
  exercise,
  onExerciseUpdate,
  onDeleteExercises
}: Props) {
  const [newSet, setNewSet] = useState<Set>();
  const [dataError, setDataError] = useState<string>('');

  const onDoneNewSetClick = useCallback(() => {
    if (newSet?.repsCount) {
      const newSets: Set[] = [...exercise.sets, newSet];
      if (newSet.weightType && newSet.weight) {
        onExerciseUpdate({ ...exercise, sets: newSets });
        setNewSet(undefined);
        setDataError('');
      } else if (newSet.weightType && !newSet.weight) {
        setDataError('Weight must be greater than 0');
      } else {
        onExerciseUpdate({ ...exercise, sets: newSets });
        setNewSet(undefined);
        setDataError('');
      }
    } else {
      setDataError('Reps count must be greater than 0');
    }
  }, [newSet, exercise, onExerciseUpdate]);

  const onSetDelete = useCallback(
    id => {
      const newSets: Set[] = exercise.sets.filter(set => set.id === id);
      onExerciseUpdate({ ...exercise, sets: newSets });
      workoutService.deleteSet(workoutId, exercise.id, id);
    },
    [workoutId, exercise, onExerciseUpdate]
  );

  const onNewSetWeightTypeSelect = useCallback(
    (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
      const value = Number(e.target.value);
      setNewSet(nS => {
        if (nS) return { ...nS, weightType: value };
      });
    },
    []
  );

  const onNewSetRepsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    setNewSet(nS => {
      if (nS) return { ...nS, repsCount: val };
    });
  };

  const onNewSetWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    setNewSet(nS => {
      if (nS) return { ...nS, weight: val };
    });
  };

  const onCancelNewSetClick = () => {
    setNewSet(undefined);
  };

  const newSetTmpl = useMemo(() => {
    if (newSet) {
      return (
        <>
          <Box mt={5}>
            <TextField
              label="Reps count"
              type="number"
              value={newSet.repsCount || ''}
              onChange={onNewSetRepsCountChange}
            />
            <If condition={!!newSet.weightType}>
              <TextField
                label="Weight"
                type="number"
                value={newSet.weight || ''}
                onChange={onNewSetWeightChange}
              />
              <FormControl>
                <InputLabel id="weght-unut">Weight unit</InputLabel>
                <Select
                  labelId="weght-unut"
                  value={newSet.weightType}
                  onChange={onNewSetWeightTypeSelect}
                >
                  <MenuItem value={WeightType.Kilogram}>
                    {getWeightShortName(WeightType.Kilogram)}
                  </MenuItem>
                  <MenuItem value={WeightType.LB}>{getWeightShortName(WeightType.LB)}</MenuItem>
                </Select>
              </FormControl>
            </If>
            <If condition={!!dataError}>
              <div>
                <span style={{ color: '#ec5335' }}>{dataError}</span>
              </div>
            </If>
          </Box>
          <Box mt={2} display="flex">
            <Button variant="contained" color="primary" onClick={onDoneNewSetClick}>
              Done
            </Button>

            <Box ml={1} />

            <Button variant="contained" color="secondary" onClick={onCancelNewSetClick}>
              Cancel
            </Button>
          </Box>
        </>
      );
    }
  }, [onNewSetWeightTypeSelect, newSet, onDoneNewSetClick, dataError]);

  const onAddNewSetClick = useCallback(() => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    workoutService
      .createSet(
        exercise.unitType === ExerciseUnitType.Weight
          ? {
              repsCount: lastSet ? lastSet.repsCount : 1,
              weight: lastSet ? lastSet.weight : 1,
              weightType: lastSet ? lastSet.weightType : WeightType.Kilogram
            }
          : { repsCount: 0 }
      )
      .subscribe(newSet => {
        setNewSet(newSet);
      });
  }, [exercise.sets, exercise.unitType]);

  return (
    <Box p={2}>
      <Box width="600px" display="flex" alignItems="center">
        {/* @todo добавить цвет для каждой группы мышц и мб иконки */}
        <Avatar component="span">
          <FitnessCenterIcon />
        </Avatar>

        <Box ml={1}>
          <Typography display="inline" variant="h6">
            {exercise.name}
          </Typography>
        </Box>

        <Box display="inline" ml="auto">
          <IconButton onClick={() => onDeleteExercises(exercise.id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {newSetTmpl}

      <Box mt={2} pl={4}>
        Sets{' '}
        <IconButton onClick={onAddNewSetClick} aria-label="delete">
          <AddCircleIcon />
        </IconButton>
        {exercise.sets.map((set, index) => (
          <Box
            key={`i${index}w${set.weight}`}
            width="500px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              Reps count: {set.repsCount}
              <If condition={Boolean(set.weightType)}>
                {' '}
                Weight: {set.weight}
                {getWeightShortName(set.weightType)}
              </If>
            </div>
            <div>
              <IconButton onClick={() => onSetDelete(set.id)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </div>
          </Box>
        ))}
      </Box>
    </Box>
  );
});
