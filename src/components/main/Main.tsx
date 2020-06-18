import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { workoutService } from '../../services/static-instances';
import { Workout } from '../../services/workouts.service';
import { DateHelper } from '../../helpers/date-helper';
import styles from './main-styles.module.scss';
import { PlusIcon } from '../icons';

const Main = () => {
  const history = useHistory();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const dateHelper = useMemo(() => new DateHelper(), []);

  const workoutsTmpl = useMemo(() => {
    return workouts.map(w => {
      return (
        <Link to={`/workout/${w.id}`} key={w.id} className={styles.workoutItem}>
          <span>
            {w.title} {dateHelper.getDateFormat(w.startTime)}
          </span>
        </Link>
      );
    });
  }, [workouts, dateHelper]);

  useEffect(() => {
    const s = workoutService.getWorkouts().subscribe(r => {
      setWorkouts(r);
    });

    return () => s.unsubscribe();
  }, []);

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
