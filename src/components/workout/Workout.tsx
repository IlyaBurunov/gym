import React, { useState, useEffect, useMemo, useCallback, memo, useRef, useContext } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { Workout, Exercise, WeightType, Set, ExerciseUnitType } from '../../models/workouts';
import { workoutService, searchService } from '../../services/static-instances';
import { ExerciseDatabaseType } from '../../database/exercises';
import { DateHelper } from '../../helpers/date-helper';
import { Condition } from '../../util';
import { WindowClickContext } from '../../contexts/WindowClickContext';
import styles from './workout.module.scss';
import { DeleteIcon } from '../icons';
import { AppState } from '../../redux/reducers';
import {
  addWorkouts,
  updateWorkoutExercises,
  updateWorkoutTitle
} from '../../redux/actions/workouts';

interface Props {
  workoutId: string;
  isNewWorkout?: boolean;
}

const useWorkout = (
  workoutId: string
): {
  workout: Workout | null;
  loading: boolean;
  isNewWorkout?: boolean;
} => {
  const { state } = useLocation<{ isNewWorkout?: boolean }>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const workout = useSelector<AppState, Workout | null>(
    state => state.workouts.workouts[`${workoutId}`] || null
  );

  useEffect(() => {
    setLoading(true);
    const sub = workoutService
      .getNewWorkout(workoutId)
      .pipe(
        finalize(() => setLoading(false)),
        switchMap(newW => {
          if (newW) {
            return of(newW);
          }
          if (state?.isNewWorkout) {
            return workoutService.createWorkout(workoutId);
          }
          return workoutService.getWorkout(workoutId);
        })
      )
      .subscribe(w => {
        dispatch(addWorkouts([w]));
      });

    return () => sub.unsubscribe();
  }, [workoutId, state, dispatch]);

  return { workout, isNewWorkout: state?.isNewWorkout, loading };
};

const withWorkout = WrappedComponent => () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { workout, loading, isNewWorkout } = useWorkout(workoutId);

  if (!workout || loading) {
    return <div>loading...</div>;
  }

  return <WrappedComponent workoutId={workoutId} isNewWorkout={isNewWorkout} />;
};

const ExerciseSearchInput = memo((props: { onExerciseSelect(e: ExerciseDatabaseType): void }) => {
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

  const searchResults = useMemo(() => {
    if (!exerciseSearchResult.length) {
      return null;
    }

    return exerciseSearchResult.map(ex => {
      return (
        <button
          key={ex.name}
          className={styles.exercisesResult__resultItem}
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

  const exerciseInputChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setExerciseSearchVal(value);
  }, []);

  return (
    <div ref={inputBlockRef}>
      <input
        className={styles.exerciseInput}
        type={'search'}
        value={exerciseSearchVal}
        onChange={exerciseInputChange}
        placeholder={'Type a exercise that you want add'}
      />
      <Condition renderCondition={lastClickInSearchZone && !!exerciseSearchVal}>
        <div className={styles.exercisesResult}>{searchResults}</div>
      </Condition>
    </div>
  );
});

const ExerciseItem = memo(
  (props: {
    exercise: Exercise;
    onExerciseUpdate(e: Exercise): void;
    onDeleteExercises(id: string): void;
  }) => {
    const { exercise, onExerciseUpdate, onDeleteExercises } = props;
    const [newSet, setNewSet] = useState<Set>();
    const [dataError, setDataError] = useState('');

    const onDoneNewSetClick = useCallback(() => {
      if (newSet?.repsCount) {
        const newSets: Set[] = [...exercise.sets, newSet];
        if (newSet.weightType && newSet.weight) {
          onExerciseUpdate({ ...exercise, sets: newSets });
          setNewSet(undefined);
          setDataError('');
        } else if (newSet.weightType && !newSet.weight) {
          setDataError('Weight must be greater than 0');
        } else {
          onExerciseUpdate({ ...exercise, sets: newSets });
          setNewSet(undefined);
          setDataError('');
        }
      } else {
        setDataError('Reps count must be greater than 0');
      }
    }, [newSet, exercise, onExerciseUpdate]);

    const getWeightAbr = useCallback((weightType: WeightType | undefined) => {
      switch (weightType) {
        case WeightType.Kilogram:
          return 'kg';
        case WeightType.LB:
          return 'lbs';
        default:
          console.error('Unknown weight type');
      }
    }, []);

    const sets = useMemo(() => {
      return exercise.sets.map((s, i) => (
        <div key={`w${s.weight}i${i}`} className={styles.exerciseSet}>
          <div className={styles.exerciseSet__stats}>
            <div>Reps count: {s.repsCount}</div>
            <Condition renderCondition={!!s.weightType}>
              <div>
                Weight: {s.weight}
                {getWeightAbr(s.weightType)}
              </div>
            </Condition>
          </div>
          <div>
            <button>
              <DeleteIcon />
            </button>
          </div>
        </div>
      ));
    }, [exercise.sets, getWeightAbr]);

    const onNewSetWeightTypeSelect = useCallback(
      (
        e: React.FormEvent<HTMLSelectElement | HTMLInputElement>,
        propName: 'repsCount' | 'weight' | 'weightType'
      ) => {
        const val =
          propName === 'repsCount' || propName === 'weight'
            ? +e.currentTarget.value
            : e.currentTarget.value;
        setNewSet(nS => {
          if (nS) return { ...nS, [propName]: +val };
        });
      },
      []
    );

    const newSetTmpl = useMemo(() => {
      if (newSet) {
        return (
          <div>
            <label>
              Reps count
              <input
                type="number"
                min="1"
                value={newSet.repsCount || ''}
                onChange={e => onNewSetWeightTypeSelect(e, 'repsCount')}
              />
            </label>
            <Condition renderCondition={!!newSet.weightType}>
              <label>
                Weight
                <input
                  type="number"
                  min="1"
                  value={newSet.weight || ''}
                  onChange={e => onNewSetWeightTypeSelect(e, 'weight')}
                />
              </label>
              <select
                value={newSet.weightType}
                onChange={e => onNewSetWeightTypeSelect(e, 'weightType')}
              >
                <option value={WeightType.Kilogram}>{getWeightAbr(WeightType.Kilogram)}</option>
                <option value={WeightType.LB}>{getWeightAbr(WeightType.LB)}</option>
              </select>
            </Condition>
            <Condition renderCondition={!!dataError}>
              <div>
                <span style={{ color: '#ec5335' }}>{dataError}</span>
              </div>
            </Condition>
            <div className={styles.buttons}>
              <button className={styles.buttons__confirm} onClick={onDoneNewSetClick}>
                Done
              </button>
              <button className={styles.buttons__cancel} onClick={() => setNewSet(undefined)}>
                Cancel
              </button>
            </div>
          </div>
        );
      }
    }, [getWeightAbr, onNewSetWeightTypeSelect, newSet, onDoneNewSetClick, dataError]);

    const onAddNewSetClick = useCallback(() => {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newS: Set = (() => {
        if (exercise.unitType === ExerciseUnitType.Weight) {
          return {
            repsCount: lastSet ? lastSet.repsCount : 1,
            weight: lastSet ? lastSet.weight : 1,
            weightType: lastSet ? lastSet.weightType : WeightType.Kilogram
          };
        }

        return { repsCount: 0 };
      })();

      setNewSet(newS);
    }, [exercise.sets, exercise.unitType]);

    return (
      <div>
        <div>
          <div className={styles.exerciseTitle}>
            <span>{exercise.name}</span>
            <button onClick={() => onDeleteExercises(exercise.id)}>
              <DeleteIcon />
            </button>
          </div>
          <button onClick={onAddNewSetClick}>Add new set</button>
        </div>
        {newSetTmpl}
        <Condition renderCondition={!!sets.length}>
          <div>
            <div>Sets</div>
            <div className={styles.exerciseSets}>{sets}</div>
          </div>
        </Condition>
      </div>
    );
  }
);

const WorkoutTitle = memo((props: { workoutId: string; workoutTitle: string }) => {
  const { workoutId, workoutTitle } = props;
  const [title, setTitle] = useState(workoutTitle);
  const dispatch = useDispatch();
  const isTitleChanged = title !== workoutTitle;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setTitle(val);
  };

  const onSaveClick = () => {
    console.log(workoutTitle);
    workoutService.updateTitle(workoutId, title).subscribe(() => {
      console.log('updateTitle');
      dispatch(updateWorkoutTitle(workoutId, title));
    });
  };

  const onCancelClick = () => {
    setTitle(workoutTitle);
  };

  return (
    <div className={styles.header}>
      <input value={title} onChange={onChange} placeholder={'Type title'} />
      <Condition renderCondition={isTitleChanged}>
        <div className={styles.buttons}>
          <button className={styles.buttons__confirm} onClick={onSaveClick}>
            Save
          </button>
          <button className={styles.buttons__cancel} onClick={onCancelClick}>
            Cancel
          </button>
        </div>
      </Condition>
    </div>
  );
});

const WorkoutItem = memo((props: Props) => {
  const { workoutId, isNewWorkout } = props;
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState<boolean>(!!isNewWorkout);
  const history = useHistory();
  const workout = useSelector<AppState, Workout>(
    state => state.workouts.workouts[`${workoutId}`] || null
  );
  const exercises = useSelector<AppState, Exercise[]>(
    state => state.workouts.workoutsExercises[`${workoutId}`] || []
  );

  const workoutDate = useMemo(() => DateHelper.getDateFormat(workout.startTime), [
    workout.startTime
  ]);

  const onUpdateExercises = useCallback(
    (exercises: Exercise[]) => {
      dispatch(updateWorkoutExercises(workoutId, exercises));
    },
    [workoutId, dispatch]
  );

  const onExerciseUpdate = useCallback(
    (ex: Exercise) => {
      const updatedExercises = exercises.map(e => {
        if (e.id === ex.id) return ex;
        return e;
      });
      setIsEditing(true);
      onUpdateExercises(updatedExercises);
    },
    [exercises, onUpdateExercises]
  );

  const onDeleteExercises = useCallback(
    (id: string) => {
      const updatedExercises = exercises.filter(e => e.id !== id);
      setIsEditing(true);
      onUpdateExercises(updatedExercises);
    },
    [exercises, onUpdateExercises]
  );

  const exercisesTmpl = useMemo(() => {
    return exercises.map(ex => (
      <ExerciseItem
        key={ex.id + ex.startTime}
        exercise={ex}
        onExerciseUpdate={onExerciseUpdate}
        onDeleteExercises={onDeleteExercises}
      />
    ));
  }, [exercises, onExerciseUpdate, onDeleteExercises]);

  const onExerciseSelect = useCallback(
    (ex: ExerciseDatabaseType) => {
      const newEx: Exercise = {
        ...ex,
        sets: [],
        startTime: DateHelper.getCurrentDate(),
        endTime: ''
      };
      const updatedExercises = [...exercises, newEx];
      setIsEditing(true);
      onUpdateExercises(updatedExercises);
    },
    [exercises, onUpdateExercises]
  );

  const onSaveClick = useCallback(() => {
    workoutService.saveWorkout({ ...workout, exercises }).subscribe(() => {
      history.push('/');
    });
  }, [workout, exercises, history]);

  const onCancelClick = useCallback(() => {
    setIsEditing(false);
    history.push('/');
  }, [history]);

  return (
    <div className={styles.wrapper}>
      <div>
        <WorkoutTitle workoutId={workout.id} workoutTitle={workout.title} />
        <div className={styles.date}>{workoutDate}</div>
      </div>
      <div>
        <ExerciseSearchInput onExerciseSelect={onExerciseSelect} />
        <div>{exercisesTmpl}</div>
        <Condition renderCondition={isEditing}>
          <div className={styles.buttons}>
            <button className={styles.buttons__confirm} onClick={onSaveClick}>
              Save
            </button>
            <button className={styles.buttons__cancel} onClick={onCancelClick}>
              Cancel
            </button>
          </div>
        </Condition>
      </div>
    </div>
  );
});
const WorkoutComponent = withWorkout(WorkoutItem);
export { WorkoutComponent as Workout };
