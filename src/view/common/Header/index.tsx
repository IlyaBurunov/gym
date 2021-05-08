import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { mergeMap } from 'rxjs/operators';

import IconButton from '@material-ui/core/IconButton';

import { workoutService } from '../../../services';
import { addWorkouts } from '../../../redux/actions/workouts';

import { PlusIcon } from '../../../components/icons';

import styles from './Header.module.scss';

export function Header() {
  const history = useHistory();
  const dispatch = useDispatch();

  const onAddWorkoutClick = useCallback(() => {
    workoutService
      .getNewWorkoutId()
      .pipe(mergeMap((id: string) => workoutService.createWorkout(id)))
      .subscribe(newWorkout => {
        const url = `/workout/${newWorkout.id}`;
        dispatch(addWorkouts([newWorkout]));
        history.push(url);
      });
  }, [history, dispatch]);

  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <h1>
          <Link to="/">Gym app</Link>{' '}
        </h1>
        <IconButton onClick={onAddWorkoutClick} aria-label="add workout">
          <PlusIcon fontSize="small" />
        </IconButton>
      </div>
    </header>
  );
}
