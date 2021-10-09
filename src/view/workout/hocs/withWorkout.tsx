import React from 'react';
import { useParams } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

import { useWorkout } from '../hooks/useWorkout';

// логику можно перенести в роутер тк тут работа с роутом, а это не работа хока
export const withWorkout = WrappedComponent => () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { workout } = useWorkout(workoutId);

  if (!workout) {
    return <CircularProgress />;
  }

  return <WrappedComponent workoutId={workoutId} />;
};
