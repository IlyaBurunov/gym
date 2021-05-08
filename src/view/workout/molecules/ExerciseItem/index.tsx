import React, { memo, useCallback, useMemo, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { workoutService } from '../../../../services';

import { Workout, Exercise, WeightType, Set, ExerciseUnitType } from '../../../../models/workouts';

import { If } from '../../../../util';
import { DeleteIcon } from '../../../../components/icons';

import css from './ExerciseItem.module.scss';

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

function ExerciseItem(props: {
  workoutId: Workout['id'];
  exercise: Exercise;
  onExerciseUpdate(e: Exercise): void;
  onDeleteExercises(id: string): void;
}) {
  const { workoutId, exercise, onExerciseUpdate, onDeleteExercises } = props;
  const [newSet, setNewSet] = useState<Set>();
  const [dataError, setDataError] = useState('');

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
      workoutService.deleteSet(workoutId, exercise.id, id);
    },
    [workoutId, exercise.id]
  );

  const sets = useMemo(() => {
    return exercise.sets.map((set, i) => (
      <div key={`i${i}w${set.weight}`} className={css.exerciseSet}>
        <div className={css.exerciseSet__stats}>
          <div>Reps count: {set.repsCount}</div>
          <If condition={!!set.weightType}>
            <div>
              Weight: {set.weight}
              {getWeightShortName(set.weightType)}
            </div>
          </If>
        </div>
        <div>
          <IconButton onClick={() => onSetDelete(set.id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    ));
  }, [exercise.sets, onSetDelete]);

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
          <div className={css.exerciseNewSet}>
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
          </div>
          <div className={css.buttons}>
            <Button variant="contained" color="primary" onClick={onDoneNewSetClick}>
              Done
            </Button>
            <Button variant="contained" color="secondary" onClick={onCancelNewSetClick}>
              Cancel
            </Button>
          </div>
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
    <div className={css.exercise}>
      <div>
        <div className={css.exerciseTitle}>
          <span>{exercise.name}</span>
          <IconButton onClick={() => onDeleteExercises(exercise.id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </div>
        <Button variant="contained" color="primary" onClick={onAddNewSetClick}>
          Add new set
        </Button>
      </div>
      {newSetTmpl}
      <If condition={!!sets.length}>
        <div className={css.sets}>
          <div>Sets</div>
          <div className={css.exerciseSets}>{sets}</div>
        </div>
      </If>
    </div>
  );
}

const ExerciseItemMemo = memo(ExerciseItem);

export { ExerciseItemMemo as ExerciseItem };
