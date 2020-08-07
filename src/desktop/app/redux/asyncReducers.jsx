import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { history } from 'app/utils'
import homeState from './Home'
import allState from './Home/All'
import sobConfigState from './Config/Sob'
import sobOptionState from './Config/Sob/SobOption'
import editRunningAllState from './Edit/EditRunning/runningAll'

import { toJS } from 'immutable'

export default combineReducers({
    homeState,
    allState,
    sobConfigState,
    sobOptionState,
    editRunningAllState,
    router: connectRouter(history),
})

export function createReducer(asyncReducers) {
    return combineReducers({
        homeState,
        allState,
        sobConfigState,
        sobOptionState,
        editRunningAllState,
        router: connectRouter(history),
        ...asyncReducers
    })
}

// import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';

// export default function createReducer(asyncReducers) {
//     const reducers = {
//         ...asyncReducers,
//         router: routerReducer
//     };
//     return combineReducers(reducers);
// }