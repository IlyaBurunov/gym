import React, { memo, useCallback, useMemo, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Workout as WorkoutType, Exercise } from '../../../../models/workouts';
import { ExerciseDatabaseType } from '../../../../database/exercises';
import { AppState } from '../../../../redux/reducers';

import { getDateFormat, getCurrentDate } from '../../../../helpers/date-helper';
import { workoutService } from '../../../../services/static-instances';
import { updateWorkoutExercises } from '../../../../redux/actions/workouts';

import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { withWorkout } from '../../hocs/withWorkout';

import { If } from '../../../../util';
import { WorkoutTitle } from '../../molecules/WorkoutTitle';
import { ExerciseSearchInput } from '../../molecules/ExerciseSearchInput';
import { ExerciseItem } from '../../molecules/ExerciseItem';

import css from './Workout.module.scss';

function Workout(props: { workoutId: string }) {
  const { workoutId } = props;
  // const { workoutId } = useParams<{ workoutId: string }>();
  const { state } = useLocation<{ isNewWorkout?: boolean }>();
  const history = useHistory();
  const dispatch = useDispatch();
  // const { workout, loading } = useWorkout(workoutId, isNewWorkout);
  const [isEditing, setIsEditing] = useState<boolean>(Boolean(state?.isNewWorkout));
  const workout = useSelector<AppState, WorkoutType>(
    state => state.workouts.workouts[`${workoutId}`] || null
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

  const exercisesTmpl = useMemo(() => {
    return exercises.map(ex => (
      <ExerciseItem
        key={ex.id + ex.startTime}
        exercise={ex}
        onExerciseUpdate={onExerciseUpdate}
        onDeleteExercises={onDeleteExercises}
      />
    ));
  }, [exercises, onExerciseUpdate, onDeleteExercises]);

  return (
    <Container maxWidth="lg">
      <div>
        <WorkoutTitle workoutId={workout.id} workoutTitle={workout.title} />
        <div className={css.date}>{workoutDate}</div>
      </div>
      <div>
        <ExerciseSearchInput onExerciseSelect={onExerciseSelect} />
        <div className={css.exercises}>
          <h2 className={css.exercisesListTitle}>Exercises</h2>
          {exercisesTmpl}
        </div>
        <If condition={isEditing}>
          <div className={css.buttons}>
            <Button variant="contained" color="primary" onClick={onSaveClick}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={onCancelClick}>
              Cancel
            </Button>
          </div>
        </If>
      </div>
    </Container>
  );
}

const WorkoutMemo = withWorkout(memo(Workout));

export { WorkoutMemo as Workout };
