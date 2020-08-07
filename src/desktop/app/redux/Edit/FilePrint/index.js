import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const filePrintState = fromJS({
    vcIndex:[],
    year:'',
    month:'',
    fromPage:'static'
})
export default function handlePrintState(state = filePrintState, action){
    return ({
        [ActionTypes.SET_PRINT_VC_INDEX_AND_DATE]:()=>{
            return state.set('vcIndex',action.vcIndex).set('year',action.year).set('month',action.month)
        } ,
        [ActionTypes.SET_PRINT_STRING]:()=>{
            return state.set(action.name,action.value)
        },
    }[action.type] || (() => state))()
}
