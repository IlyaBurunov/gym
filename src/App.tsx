import React, { memo, useCallback, useMemo } from 'react';
import { BrowserRouter, Route, RouteChildrenProps, Switch, Redirect } from 'react-router-dom';
import { fromEvent } from 'rxjs';
import { share } from 'rxjs/operators';
import Main from './components/main/Main';
import { RouterConfig } from './configs/RouterConfig';
import { Workout } from './components/workout/Workout';
import { WindowClickContext } from './contexts/WindowClickContext';

const RootRoute = (p: RouteChildrenProps) => {
  const renderWorkout = useCallback(() => <Workout />, []);

  const renderMain = useCallback(() => <Main />, []);

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
          <Route path={RouterConfig.workoutPath} render={renderWorkout} />
          <Route path={RouterConfig.mainPath} render={renderMain} />
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
