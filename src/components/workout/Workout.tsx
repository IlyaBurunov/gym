import React, { useState, useEffect, useMemo, useCallback, memo, useRef, useContext } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import styled from 'styled-components';
import {
  Workout,
  Exercise,
  WeightType,
  Set,
  ExerciseUnitType
} from '../../services/workouts.service';
import { workoutService, searchService } from '../../services/static-instances';
import { ExerciseDatabaseType } from '../../database/exercises';
import { DateHelper } from '../../helpers/date-helper';
import { Condition } from '../../util';
import { WindowClickContext } from '../../contexts/WindowClickContext';

const Modal = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(255, 255, 255);
  padding-left: 30px;
`;

interface Props {
  workout: Workout;
  updateWorkout(workout: Workout): void;
  isNewWorkout?: boolean;
}

const useWorkout = (): {
  workout: Workout | null;
  setWorkout(newWorkout: Workout | null): void;
  isNewWorkout?: boolean;
} => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const { workoutId } = useParams<{ workoutId: string }>();
  const { state } = useLocation<{ isNewWorkout?: boolean }>();

  useEffect(() => {
    const sub = workoutService
      .getNewWorkout(workoutId)
      .pipe(
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
        setWorkout(w);
      });

    return () => sub.unsubscribe();
  }, [workoutId, state]);

  return { workout, setWorkout, isNewWorkout: state?.isNewWorkout };
};

const withWorkout = WrappedComponent => () => {
  const { workout, setWorkout, isNewWorkout } = useWorkout();

  const updateWorkout = useCallback(
    (w: Workout) => {
      setWorkout(w);
      workoutService.updateWorkout(w).subscribe(() => {});
    },
    [setWorkout]
  );

  if (!workout) return null;

  return (
    <WrappedComponent workout={workout} isNewWorkout={isNewWorkout} updateWorkout={updateWorkout} />
  );
};

const ExerciseSearchInput = (props: { onExerciseSelect(e: ExerciseDatabaseType): void }) => {
  const { onExerciseSelect } = props;
  const [exerciseSearchVal, setExerciseSearchVal] = useState<string>('');
  const [exerciseSearchResult, setExerciseSearchResult] = useState<ExerciseDatabaseType[]>([]);
  const [lastClickInSearchZone, setLastClickInSearchZone] = useState(false);
  const inputBlockRef = useRef<HTMLDivElement>(null);
  const { stream } = useContext(WindowClickContext);

  const onExerciseClick = useCallback(
    ex => {
      setExerciseSearchResult([]);
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
        <button key={ex.name} onClick={() => onExerciseClick(ex)}>
          <span>{ex.name}</span>
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
        type={'text'}
        value={exerciseSearchVal}
        onChange={exerciseInputChange}
        placeholder={'Type a exercise that you want add'}
      />
      <Condition renderCondition={lastClickInSearchZone && !!exerciseSearchVal}>
        <div style={{ position: 'absolute', backgroundColor: '#e8e8e8' }}>{searchResults}</div>
      </Condition>
    </div>
  );
};

const ExerciseItem = memo((props: { exercise: Exercise; onExerciseUpdate(e: Exercise): void }) => {
  const { exercise, onExerciseUpdate } = props;
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
      <div key={`w${s.weight}i${i}`}>
        <span>Reps count: {s.repsCount}</span>
        <Condition renderCondition={!!s.weightType}>
          <span>
            Weight: {s.weight}
            {getWeightAbr(s.weightType)}
          </span>
        </Condition>
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
          <button onClick={onDoneNewSetClick}>Done</button>
          <button onClick={() => setNewSet(undefined)}>Cancel</button>
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
        <h3>{exercise.name}</h3>
        <button onClick={onAddNewSetClick}>Add new set</button>
      </div>
      {newSetTmpl}
      <Condition renderCondition={!!sets.length}>
        <div>
          <div>Sets</div>
          <div>{sets}</div>
        </div>
      </Condition>
    </div>
  );
});

const WorkoutItem = (props: Props) => {
  const { workout, updateWorkout, isNewWorkout } = props;
  const [isEditing, setIsEditing] = useState<boolean>(!!isNewWorkout);
  const history = useHistory();
  const dateHelper = useMemo(() => new DateHelper(), []);

  const workoutDate = useMemo(() => dateHelper.getDateFormat(workout.startTime), [
    workout.startTime,
    dateHelper
  ]);

  const onExerciseUpdate = useCallback(
    (ex: Exercise) => {
      const updatedExercises = workout.exercises.map(e => {
        if (e.id === ex.id) return ex;
        return e;
      });
      const updatedWorkout = { ...workout, exercises: updatedExercises };
      setIsEditing(true);
      updateWorkout(updatedWorkout);
    },
    [workout, updateWorkout]
  );

  const exercises = useMemo(() => {
    return workout.exercises.map(ex => (
      <ExerciseItem key={ex.id + ex.startTime} exercise={ex} onExerciseUpdate={onExerciseUpdate} />
    ));
  }, [workout.exercises, onExerciseUpdate]);

  const onExerciseSelect = useCallback(
    (ex: ExerciseDatabaseType) => {
      const newEx: Exercise = {
        ...ex,
        sets: [],
        startTime: dateHelper.getCurrentDate(),
        endTime: ''
      };
      const updatedWorkout = { ...workout, exercises: [...workout.exercises, newEx] };
      setIsEditing(true);
      updateWorkout(updatedWorkout);
    },
    [dateHelper, workout, updateWorkout]
  );

  const onSaveClick = useCallback(() => {
    workoutService.saveWorkout(workout).subscribe(() => {});
    history.push('/');
  }, [workout, history]);

  const onCancelClick = useCallback(() => {
    setIsEditing(false);
    history.push('/');
  }, [history]);

  return (
    <Modal>
      <div>
        <div>
          <p>Name of workout</p>
          <p>{workout.title}</p>
        </div>
        <div>{workoutDate}</div>
      </div>
      <ExerciseSearchInput onExerciseSelect={onExerciseSelect} />
      <div>{exercises}</div>
      <Condition renderCondition={isEditing}>
        <div>
          <button onClick={onSaveClick}>Save</button>
          <button onClick={onCancelClick}>Cancel</button>
        </div>
      </Condition>
    </Modal>
  );
};
const WorkoutComponent = withWorkout(WorkoutItem);
export { WorkoutComponent as Workout };