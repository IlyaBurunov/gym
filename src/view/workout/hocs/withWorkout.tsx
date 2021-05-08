import React from 'react';
import { useParams } from 'react-router-dom';

import { useWorkout } from '../hooks/useWorkout';

// deprecated
export const withWorkout = WrappedComponent => () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { workout } = useWorkout(workoutId);

  if (!workout) {
    return <div>loading...</div>;
  }

  return <WrappedComponent workoutId={workoutId} />;
};
