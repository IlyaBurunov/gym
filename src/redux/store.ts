import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';
import { initSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();

const isDev = process.env.NODE_ENV === `development`;

const appliedMiddleware = applyMiddleware(sagaMiddleware);
const store = createStore(
  rootReducer,
  isDev ? composeWithDevTools(appliedMiddleware) : appliedMiddleware
);

sagaMiddleware.run(initSaga);

export default store;
