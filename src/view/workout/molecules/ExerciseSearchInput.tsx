import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';

import { Box, List, ListItem, ListItemText, TextField } from '@material-ui/core';

import { ExerciseDatabaseType } from '../../../database/exercises';

import { searchService } from '../../../services';

import { If } from '../../../util';

interface Props {
  onExerciseSelect: (exerciseType: ExerciseDatabaseType) => void;
}

export const ExerciseSearchInput = memo(function ExerciseSearchInput({ onExerciseSelect }: Props) {
  const [exerciseSearchVal, setExerciseSearchVal] = useState<string>('');
  const [exerciseSearchResult, setExerciseSearchResult] = useState<ExerciseDatabaseType[]>([]);

  const onExerciseClick = useCallback(
    exercise => {
      setExerciseSearchResult([]);
      setExerciseSearchVal('');
      onExerciseSelect(exercise);
    },
    [onExerciseSelect]
  );

  const searchResults = useMemo<JSX.Element | null>(() => {
    if (!exerciseSearchResult.length) {
      return null;
    }

    return (
      <List>
        {exerciseSearchResult.map(exercise => {
          return (
            <ListItem key={exercise.name} button onClick={() => onExerciseClick(exercise)}>
              <ListItemText>{exercise.name}</ListItemText>
            </ListItem>
          );
        })}
      </List>
    );
  }, [exerciseSearchResult, onExerciseClick]);

  useEffect(() => {
    const s = searchService.searchExercises(exerciseSearchVal, 5).subscribe(r => {
      setExerciseSearchResult(r);
    });

    return () => s.unsubscribe();
  }, [exerciseSearchVal]);

  const exerciseInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setExerciseSearchVal(value);
  }, []);

  return (
    <Box pt={1}>
      <Box width="300px">
        <TextField
          label="Exercise"
          type="search"
          value={exerciseSearchVal}
          onChange={exerciseInputChange}
          placeholder="Type a exercise that you want add"
        />
      </Box>

      <If condition={Boolean(exerciseSearchVal) && searchResults !== null}>
        <Box
          position="absolute"
          p={1}
          border={1}
          borderColor="grey.300"
          borderRadius={12}
          bgcolor="background.paper"
          zIndex={1}
        >
          {searchResults}
        </Box>
      </If>
    </Box>
  );
});
