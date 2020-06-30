import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { workoutService } from '../../services/static-instances';
import { Workout } from '../../models/workouts';
import { DateHelper } from '../../helpers/date-helper';
import styles from './main-styles.module.scss';
import { PlusIcon } from '../icons';
import { AppState } from '../../redux/reducers';
import { getUsersWorkouts } from '../../redux/actions/workouts';

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
  const workout = useSelector<AppState, Workout>(state => state.workouts.workouts[`${workoutId}`]);
  return (
    <Link to={`/workout/${workout.id}`} className={styles.workoutItem}>
      <span>
        {workout.title} {DateHelper.getDateFormat(workout.startTime)}
      </span>
    </Link>
  );
});

const Main = () => {
  const history = useHistory();

  const { workoutsIds } = useWorkouts({ userId: '1' });

  const workoutsTmpl = useMemo(() => {
    return workoutsIds.map(workoutId => {
      return <WorkoutsListItem key={workoutId} workoutId={workoutId} />;
    });
  }, [workoutsIds]);

  const onAddWorkoutClick = useCallback(() => {
    workoutService.getNewWorkoutId().subscribe(id => {
      const url = `/workout/${id}`;
      history.push(url, { isNewWorkout: true });
    });
  }, [history]);

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <h1>Gym app</h1>
          <button onClick={onAddWorkoutClick}>
            <PlusIcon />
          </button>
        </div>
      </header>
      <div className={styles.wrapper}>
        <div className={styles.workouts}>{workoutsTmpl}</div>
      </div>
    </div>
  );
};

export default memo(Main);
