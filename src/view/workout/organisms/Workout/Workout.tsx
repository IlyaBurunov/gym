import React, { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Divider, Typography } from '@material-ui/core';

import { Workout as WorkoutType, Exercise } from '../../../../models/workouts';
import { ExerciseDatabaseType } from '../../../../database/exercises';
import { AppState } from '../../../../redux/reducers';

import { getDateFormat, getCurrentDate } from '../../../../helpers/date-helper';
import { workoutService } from '../../../../services';
import { updateWorkoutExercises } from '../../../../redux/actions/workouts';

import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { withWorkout } from '../../hocs/withWorkout';

import { If } from '../../../../util';
import { WorkoutTitle } from '../../molecules/WorkoutTitle';
import { ExerciseSearchInput } from '../../molecules/ExerciseSearchInput';
import { ExerciseItem } from '../../molecules/ExerciseItem';

function Workout(props: { workoutId: string }) {
  const { workoutId } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const workout = useSelector<AppState, WorkoutType>(
    state => state.workouts.workouts[`${workoutId}`]
  );

  const exercises = useSelector<AppState, Exercise[]>(
    state => state.workouts.workoutsExercises[`${workoutId}`] || []
  );

  const workoutDate = useMemo(() => getDateFormat(workout.startTime), [workout.startTime]);

  const onUpdateExercises = useCallback(
    (exercises: Exercise[]) => {
      dispatch(updateWorkoutExercises(workoutId, exercises));
    },
    [workoutId, dispatch]
  );

  const onExerciseSelect = useCallback(
    (ex: ExerciseDatabaseType) => {
      // @todo можно добавить возможность выбора кол-ва сетов при создании
      // @todo перенести создание сета в диалог
      const newEx: Exercise = {
        ...ex,
        sets: [],
        startTime: getCurrentDate(),
        endTime: ''
      };
      const updatedExercises = [...exercises, newEx];
      setIsEditing(true);
      onUpdateExercises(updatedExercises);
    },
    [exercises, onUpdateExercises]
  );

  const onExerciseUpdate = useCallback(
    (ex: Exercise) => {
      const updatedExercises = exercises.map(e => {
        if (e.id === ex.id) return ex;
        return e;
      });
      setIsEditing(true);
      onUpdateExercises(updatedExercises);
    },
    [exercises, onUpdateExercises]
  );

  const onDeleteExercises = useCallback(
    (id: string) => {
      const updatedExercises = exercises.filter(e => e.id !== id);
      setIsEditing(true);
      onUpdateExercises(updatedExercises);
    },
    [exercises, onUpdateExercises]
  );

  const onSaveClick = useCallback(() => {
    workoutService.saveWorkout({ ...workout, exercises }).subscribe(() => {
      history.push('/');
    });
  }, [workout, exercises, history]);

  const onCancelClick = useCallback(() => {
    setIsEditing(false);
    history.push('/');
  }, [history]);

  return (
    <Container maxWidth="lg">
      <WorkoutTitle workoutId={workout.id} workoutTitle={workout.title} />

      <Typography variant="subtitle1" color="textSecondary">
        {workoutDate}
      </Typography>

      <Divider />

      <ExerciseSearchInput onExerciseSelect={onExerciseSelect} />

      <Box mt={5}>
        <Typography variant="h5">Exercises</Typography>
        {exercises.map((exercise, index, array) => (
          <Fragment key={exercise.id + exercise.startTime}>
            <ExerciseItem
              workoutId={workoutId}
              exercise={exercise}
              onExerciseUpdate={onExerciseUpdate}
              //@todo в случае удаления можно показать попап конфирмации
              onDeleteExercises={onDeleteExercises}
            />
            <If condition={index !== array.length - 1}>
              <Divider />
            </If>
          </Fragment>
        ))}
      </Box>
      <If condition={isEditing}>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" onClick={onSaveClick}>
            Save
          </Button>
          <Box ml={2}>
            <Button variant="contained" color="secondary" onClick={onCancelClick}>
              Cancel
            </Button>
          </Box>
        </Box>
      </If>
    </Container>
  );
}

const WorkoutMemo = withWorkout(memo(Workout));

export { WorkoutMemo as Workout };
