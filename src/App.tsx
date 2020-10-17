import React, { memo, useCallback, useMemo } from 'react';
import { BrowserRouter, Route, RouteChildrenProps, Switch, Redirect } from 'react-router-dom';
import { fromEvent } from 'rxjs';
import { share } from 'rxjs/operators';

import { RouterConfig } from './configs/RouterConfig';

import { WindowClickContext } from './contexts/WindowClickContext';

import { WorkoutsPage } from './view/workouts/pages';
import { WorkoutPage } from './view/workout/pages';

const RootRoute = (p: RouteChildrenProps) => {
  const renderWorkoutPage = useCallback(() => <WorkoutPage />, []);

  const renderWorkoutsPage = useCallback(() => <WorkoutsPage />, []);

  const windowClickContextValue = useMemo(
    () => ({
      stream: fromEvent(window, 'click', { capture: true }).pipe(share())
    }),
    []
  );

  return (
    <WindowClickContext.Provider value={windowClickContextValue}>
      <>
        <Switch>
          <Route path={RouterConfig.workoutPath} render={renderWorkoutPage} />
          <Route path={RouterConfig.rootPath} render={renderWorkoutsPage} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </>
    </WindowClickContext.Provider>
  );
};

const App = () => {
  const renderRootRoute = useCallback(p => <RootRoute {...p} />, []);

  return (
    <BrowserRouter>
      <Route path={'/'} render={renderRootRoute} />
    </BrowserRouter>
  );
};

export default memo(App);
