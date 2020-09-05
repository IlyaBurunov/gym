import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';

import { AppState } from '../../redux/reducers';
import { getUsersWorkouts, deleteWorkout } from '../../redux/actions/workouts';

import { Workout } from '../../models/workouts';

import { workoutService } from '../../services/static-instances';

import { DateHelper } from '../../helpers/date-helper';

import { Header } from '../../view/components/Header';
import { DeleteIcon } from '../icons';

import styles from './main-styles.module.scss';

const useWorkouts = (config: { userId: string }) => {
  const { userId } = config;
  const dispatch = useDispatch();
  const workoutsIds = useSelector<AppState, string[]>(state => state.workouts.workoutsIds);

  useEffect(() => {
    dispatch(getUsersWorkouts(userId));
  }, [userId, dispatch]);

  return { workoutsIds };
};

const WorkoutsListItem = memo((props: { workoutId: string }) => {
  const { workoutId } = props;
  const dispatch = useDispatch();

  const onDeleteClick = () => {
    workoutService.deleteWorkout(workoutId).subscribe(() => {
      dispatch(deleteWorkout(workoutId));
    });
  };

  const workout = useSelector<AppState, Workout>(state => state.workouts.workouts[`${workoutId}`]);
  return (
    <div className={styles.workoutItem}>
      <Link to={`/workout/${workout.id}`}>
        <span>
          {workout.title} {DateHelper.getDateFormat(workout.startTime)}
        </span>
      </Link>
      <IconButton onClick={onDeleteClick} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
});

const Main = () => {
  const { workoutsIds } = useWorkouts({ userId: '1' });

  const workoutsTmpl = useMemo(() => {
    return workoutsIds.map(workoutId => {
      return <WorkoutsListItem key={workoutId} workoutId={workoutId} />;
    });
  }, [workoutsIds]);

  return (
    <div>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.workouts}>{workoutsTmpl}</div>
      </div>
    </div>
  );
};

export default memo(Main);
