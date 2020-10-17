import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { useWorkout } from '../hooks/useWorkout';

export const withWorkout = WrappedComponent => () => {
  const { workoutId } = useParams<{ workoutId: string }>();

  console.log(useLocation());
  const { state } = useLocation<{ isNewWorkout?: boolean }>();
  const { workout, loading } = useWorkout(workoutId, state?.isNewWorkout);

  if (!workout || loading) {
    return <div>loading...</div>;
  }

  return <WrappedComponent workoutId={workoutId} />;
};
