import React, { memo, useState, useEffect, useRef, useMemo, useCallback, useContext } from 'react';

import TextField from '@material-ui/core/TextField';

import { ExerciseDatabaseType } from '../../../../database/exercises';

import { searchService } from '../../../../services/static-instances';
import { WindowClickContext } from '../../../../contexts/WindowClickContext';

import { If } from '../../../../util';

import css from './ExerciseSearchInput.module.scss';

function ExerciseSearchInput(props: { onExerciseSelect(e: ExerciseDatabaseType): void }) {
  const { onExerciseSelect } = props;
  const [exerciseSearchVal, setExerciseSearchVal] = useState<string>('');
  const [exerciseSearchResult, setExerciseSearchResult] = useState<ExerciseDatabaseType[]>([]);
  const [lastClickInSearchZone, setLastClickInSearchZone] = useState(false);
  const inputBlockRef = useRef<HTMLDivElement>(null);
  const { stream } = useContext(WindowClickContext);

  const onExerciseClick = useCallback(
    ex => {
      setExerciseSearchResult([]);
      setExerciseSearchVal('');
      onExerciseSelect(ex);
    },
    [onExerciseSelect]
  );

  const searchResults = useMemo<JSX.Element[]>(() => {
    if (!exerciseSearchResult.length) {
      return [];
    }

    return exerciseSearchResult.map(ex => {
      return (
        <button
          key={ex.name}
          className={css.exercisesResult__resultItem}
          onClick={() => onExerciseClick(ex)}
        >
          {ex.name}
        </button>
      );
    });
  }, [exerciseSearchResult, onExerciseClick]);

  useEffect(() => {
    const s = searchService.searchExercises(exerciseSearchVal, 5).subscribe(r => {
      setExerciseSearchResult(r);
    });

    return () => s.unsubscribe();
  }, [exerciseSearchVal]);

  useEffect(() => {
    const s = stream.subscribe(e => {
      const path = e.composedPath();
      const isClickedOnInput = path.some(p => p === inputBlockRef.current);

      if (isClickedOnInput) {
        if (!lastClickInSearchZone) {
          setLastClickInSearchZone(true);
        }
      } else {
        if (lastClickInSearchZone) {
          setLastClickInSearchZone(false);
        }
      }
    });

    return () => s.unsubscribe();
  }, [stream, lastClickInSearchZone]);

  const exerciseInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setExerciseSearchVal(value);
  }, []);

  return (
    <div className={css.exerciseSearch} ref={inputBlockRef}>
      <TextField
        label="Exercise"
        className={css.exerciseInput}
        type="search"
        value={exerciseSearchVal}
        onChange={exerciseInputChange}
        placeholder={'Type a exercise that you want add'}
      />
      <If condition={lastClickInSearchZone && !!exerciseSearchVal && searchResults?.length > 0}>
        <div className={css.exercisesResult}>{searchResults}</div>
      </If>
    </div>
  );
}

const ExerciseSearchInputMemo = memo(ExerciseSearchInput);

export { ExerciseSearchInputMemo as ExerciseSearchInput };
