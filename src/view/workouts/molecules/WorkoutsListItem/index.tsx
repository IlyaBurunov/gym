import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';

import { workoutService } from '../../../../services';
import { getDateFormat } from '../../../../helpers/date-helper';
import { deleteWorkout } from '../../../../redux/actions/workouts';

import { AppState } from '../../../../redux/reducers';
import { Workout } from '../../../../models/workouts';

import { DeleteIcon } from '../../../../components/icons';

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
    <div className={css.workoutItem}>
      <Link to={`/workout/${workout.id}`}>
        <span>
          {workout.title} {getDateFormat(workout.startTime)}
        </span>
      </Link>
      <IconButton onClick={onDeleteClick} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

const WorkoutsListItemMemo = memo(WorkoutsListItem);

export { WorkoutsListItemMemo as WorkoutsListItem };
