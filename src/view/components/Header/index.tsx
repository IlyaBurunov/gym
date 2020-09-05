import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';

import { workoutService } from '../../../services/static-instances';

import { PlusIcon } from '../../../components/icons';

import styles from './Header.module.scss';

export function Header() {
  const history = useHistory();

  const onAddWorkoutClick = useCallback(() => {
    workoutService.getNewWorkoutId().subscribe(id => {
      const url = `/workout/${id}`;
      history.push(url, { isNewWorkout: true });
    });
  }, [history]);

  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <h1>Gym app</h1>
        <IconButton onClick={onAddWorkoutClick} aria-label="add workout">
          <PlusIcon fontSize="small" />
        </IconButton>
      </div>
    </header>
  );
}
