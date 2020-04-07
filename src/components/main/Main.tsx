import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { workoutService } from '../../services/static-instances';
import { Workout } from '../../services/workouts.service';
import { DateHelper } from '../../helpers/date-helper';
import styled from 'styled-components';

export const Btn = styled.button`
  border-radius: 5px;
  border-style: solid;
  border-color: #ec5335;
  padding: 5px;
`;

const Main = () => {
  const history = useHistory();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const dateHelper = useMemo(() => new DateHelper(), []);

  const workoutsTmpl = useMemo(() => {
    return workouts.map(w => {
      return (
        <Link to={`/workout/${w.id}`} key={w.id}>
          <p>
            {w.title} {dateHelper.getDateFormat(w.startTime)}
          </p>
        </Link>
      );
    });
  }, [workouts, dateHelper]);

  useEffect(() => {
    const s = workoutService.getWorkouts().subscribe(r => {
      setWorkouts(r);
    });

    return () => s.unsubscribe();
  }, []);

  const onAddWorkoutClick = useCallback(() => {
    workoutService.getNewWorkoutId().subscribe(id => {
      const url = `/workout/${id}`;
      history.push(url, { isNewWorkout: true });
    });
  }, [history]);

  return (
    <>
      <h1>Gym app</h1>
      <Btn onClick={onAddWorkoutClick}>Add new Workout</Btn>
      {workoutsTmpl}
    </>
  );
};

export default memo(Main);
