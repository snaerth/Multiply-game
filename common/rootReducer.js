import { combineReducers } from 'redux';
import commonReducer from './reducer';

const rootReducer = combineReducers({
  common: commonReducer,
});

export default rootReducer;
