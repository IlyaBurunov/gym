import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Box, IconButton, Typography } from '@material-ui/core';

import { workoutService } from '../../../../services';
import { getDateFormat } from '../../../../helpers/date-helper';
import { deleteWorkout } from '../../../../redux/actions/workouts';

import { AppState } from '../../../../redux/reducers';
import { Workout } from '../../../../models/workouts';

import DeleteIcon from '@material-ui/icons/Delete';

import css from './WorkoutsListItem.module.scss';

function WorkoutsListItem(props: { workoutId: string }) {
  const { workoutId } = props;
  const dispatch = useDispatch();

  const onDeleteClick = () => {
    workoutService.deleteWorkout(workoutId).subscribe(() => {
      dispatch(deleteWorkout(workoutId));
    });
  };

  const workout = useSelector<AppState, Workout>(state => state.workouts.workouts[`${workoutId}`]);
  return (
    <div className={css.root}>
      <Link to={`/workout/${workout.id}`} className={css.link}>
        <Typography display="block" variant="body1" color="textPrimary">
          {workout.title}
        </Typography>
        <Box mb={1} />
        <Typography display="block" variant="body2" color="textSecondary">
          {getDateFormat(workout.startTime)}
        </Typography>
      </Link>
      <IconButton onClick={onDeleteClick} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

const WorkoutsListItemMemo = memo(WorkoutsListItem);

export { WorkoutsListItemMemo as WorkoutsListItem };
