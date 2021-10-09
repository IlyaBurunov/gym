import React, { useCallback, useState, memo } from 'react';
import { useDispatch } from 'react-redux';

import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

import { workoutService } from '../../../../services';
import { updateWorkoutTitle } from '../../../../redux/actions/workouts';

function WorkoutTitle(props: { workoutId: string; workoutTitle: string }) {
  const { workoutId, workoutTitle } = props;
  const [title, setTitle] = useState(workoutTitle);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setTitle(val);
  }, []);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onSaveClick = () => {
    workoutService.updateWorkoutTitle(workoutId, title).subscribe(() => {
      dispatch(updateWorkoutTitle(workoutId, title));
      setIsEditing(false);
    });
  };

  const onCancelClick = () => {
    setTitle(workoutTitle);
    setIsEditing(false);
  };

  return (
    <Box pt={3} display="flex" alignItems="center" justifyContent="space-between">
      {isEditing ? (
        <TextField
          size="medium"
          label="Workout title"
          type="text"
          value={title}
          onChange={onChange}
          placeholder="Type a title"
        />
      ) : (
        <Typography variant="h4">{title}</Typography>
      )}
      {isEditing ? (
        <div>
          <IconButton onClick={onSaveClick} aria-label="save title">
            <DoneIcon />
          </IconButton>
          <IconButton onClick={onCancelClick} aria-label="cancel editing">
            <ClearIcon />
          </IconButton>
        </div>
      ) : (
        <IconButton onClick={enableEditing} aria-label="enable editing">
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );
}

const WorkoutTitleMemo = memo(WorkoutTitle);

export { WorkoutTitleMemo as WorkoutTitle };
