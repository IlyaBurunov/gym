import React, { useCallback } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mergeMap } from 'rxjs/operators';

import { Box, IconButton, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { workoutService } from '../../services';
import { addWorkouts } from '../../redux/actions/workouts';

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
    <Box
      component="header"
      height="40px"
      py={1}
      px={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="grey.100"
    >
      <Typography variant="h4">
        <RouterLink to="/">Gym app</RouterLink>
      </Typography>
      <IconButton onClick={onAddWorkoutClick} aria-label="add workout">
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
}
