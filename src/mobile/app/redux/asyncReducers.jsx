import { combineReducers } from 'redux';
import homeState from './Home/home'
import allState from './Home/All'
import sobConfigState from './Config/Sob'
import { toJS } from 'immutable'
import { connectRouter } from 'connected-react-router';
// import { history } from 'app/utils';

// console.log('history', history);
import history from 'app/utils/history'



export default combineReducers({
    homeState,
    allState,
    sobConfigState,
    router: connectRouter(history)
})

export function createReducer(asyncReducers) {
    return combineReducers({
        homeState,
        allState,
        sobConfigState,
        router: connectRouter(history),
        ...asyncReducers
    })
}
