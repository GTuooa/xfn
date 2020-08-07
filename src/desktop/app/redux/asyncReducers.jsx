import { combineReducers } from 'redux';
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
    editRunningAllState
})

export function createReducer(asyncReducers) {
    return combineReducers({
        homeState,
        allState,
        sobConfigState,
        sobOptionState,
        editRunningAllState,
        ...asyncReducers
    })
}
