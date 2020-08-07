import { combineReducers } from 'redux';
import homeState from './Home/home'
import allState from './Home/All'
import sobConfigState from './Config/Sob'
import { toJS } from 'immutable'

export default combineReducers({
    homeState,
    allState,
    sobConfigState
})

export function createReducer(asyncReducers) {
    return combineReducers({
        homeState,
        allState,
        sobConfigState,
        ...asyncReducers
    })
}
