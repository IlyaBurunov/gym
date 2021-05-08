import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';

import { workoutService } from '../../../../services';

import { updateWorkoutTitle } from '../../../../redux/actions/workouts';

import { If } from '../../../../util';

import css from './WorkoutTitle.module.scss';

function WorkoutTitle(props: { workoutId: string; workoutTitle: string }) {
  const { workoutId, workoutTitle } = props;
  const [title, setTitle] = useState(workoutTitle);
  const dispatch = useDispatch();
  const isTitleChanged = title !== workoutTitle;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setTitle(val);
  };

  const onSaveClick = () => {
    workoutService.updateWorkoutTitle(workoutId, title).subscribe(() => {
      dispatch(updateWorkoutTitle(workoutId, title));
    });
  };

  const onCancelClick = () => {
    setTitle(workoutTitle);
  };

  return (
    <div className={css.header}>
      <input value={title} onChange={onChange} placeholder={'Type title'} />
      <If condition={isTitleChanged}>
        <div className={css.buttons}>
          <Button variant="contained" color="primary" onClick={onSaveClick}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onCancelClick}>
            Cancel
          </Button>
        </div>
      </If>
    </div>
  );
}

const WorkoutTitleMemo = memo(WorkoutTitle);

export { WorkoutTitleMemo as WorkoutTitle };
