import React, { useMemo } from 'react';

import { Container } from '@material-ui/core';

import { useWorkouts } from '../../../../hooks';

import { WorkoutsListItem } from '../../molecules/WorkoutsListItem';

import css from './WorkoutsList.module.scss';

export function WorkoutsList() {
  const { workoutsIds } = useWorkouts({ userId: '1' });

  const workoutsTmpl = useMemo(() => {
    return workoutsIds.map(workoutId => {
      return <WorkoutsListItem key={workoutId} workoutId={workoutId} />;
    });
  }, [workoutsIds]);

  return (
    <Container maxWidth="lg">
      <div className={css.workouts}>{workoutsTmpl}</div>
    </Container>
  );
}
