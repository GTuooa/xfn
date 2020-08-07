import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const extraInformationState = fromJS({
    informationList:[],
    onDeleted:false,
    deleteList:[],

    //setting
    id:'',
    name:'',
    denominatorName:'',     //单位
    denominatorValue:'',    //分母
    enable:false,
    numerator:1 ,           //分子
    isChange:false,         // 新增或修改
    isDefault:false         // 是否为默认信息
})

export default function handle(state = extraInformationState, action) {
	return ({
		[ActionTypes.INIT_EXTRA_INFORMATION]: () => extraInformationState,
        [ActionTypes.SET_EXTRA_INFORMATION_LIST]:()=>{
            return state.set('informationList',action.data)
        },
        [ActionTypes.CHANGE_EXTRA_INFO_LIST_DELETE_TYOPE]:()=>{
            return state.set("onDeleted",action.value)
        },
        [ActionTypes.SET_EXTRA_INFO_DELETE_LIST]:()=>{
            let deleteList = state.get("deleteList").toJS()
            const index = deleteList.findIndex(v => v === action.id)
            if (index > -1) {
                deleteList.splice(index, 1)
            } else {
                deleteList.push(action.id)
            }
            return state.set("deleteList",fromJS(deleteList))
        },
        [ActionTypes.EMPTY_EXTRA_INFO_DELETE_LIST]:()=>state.set("deleteList",fromJS([])),
        [ActionTypes.CHANGE_EXTRA_INFO_NAME]:()=>{
            return state.set('name',action.name)
        },
        [ActionTypes.CHANGE_EXTRA_INFO_NUMERATOR]:()=>{
            return state.set("numerator",action.value)
        },
        [ActionTypes.CHANGE_DENOMINATOR_VALUE]:()=>{
            return state.set('denominatorValue',action.value)
        },
        [ActionTypes.CHANGE_DENOMINATOR_NAME]:()=>{
            return state.set('denominatorName',action.value)
        },
        [ActionTypes.CHANGE_EXTRA_INFO_ENABLE_TYPE]:()=>{
            return state.set('enable',action.bool)
        },
        [ActionTypes.SET_EXTAR_INFO_INIT_DATA]:()=>{
            return state.set('name',action.name)
                        .set('denominatorName',action.denominatorName)
                        .set('denominatorValue',action.denominatorValue)
                        .set('enable',action.enable)
                        .set('numerator',action.numerator)
                        .set('id',action.id)
        },
        [ActionTypes.SET_EXTAR_INFO_INIT_ISCHANGE]:()=>state.set('isChange',action.bool),
        [ActionTypes.SET_EXTAR_INFO_INIT_ISDEFUALT]:()=>state.set('isDefault',action.bool)


	}[action.type] || (() => state))()
}
