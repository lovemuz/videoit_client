import { combineReducers } from 'redux';
import user from './user';
import post from './post';
import rank from './rank';
import room from './room';
import point from './point';

const rootReducer: any = combineReducers({
    user,
    post,
    rank,
    room,
    point,
});

export default rootReducer;
