import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import { showMessage, jsonifyDate } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import { Toast } from 'antd-mobile';
export const getExtraInformationList = ()=>(dispatch,getState)=>{
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
    fetchApi(isRunning?'getJrExtraMessage':'getSelfTypeListExtraMessage','GET','',resp=>{
		if(showMessage(resp)){
			dispatch({
				type:ActionTypes.SET_EXTRA_INFORMATION_LIST,
				data:resp.data
			})
		}
	})
}
export const changeExtraInfoListType=(value)=>dispatch=>{
    dispatch({
        type:ActionTypes.CHANGE_EXTRA_INFO_LIST_DELETE_TYOPE,
        value
    })
}
export const setDeleteList=(id)=>(dispatch,getState)=>{
    dispatch({
        type:ActionTypes.SET_EXTRA_INFO_DELETE_LIST,
        id
    })
}
export const emptyDeleteList=()=>(dispatch)=>{
    dispatch({type:ActionTypes.EMPTY_EXTRA_INFO_DELETE_LIST})
}
export const changeName = (name)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_EXTRA_INFO_NAME,
        name
    })
}
export const changeNumerator=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_EXTRA_INFO_NUMERATOR,
        value
    })
}
export const changeDenomiatorValue = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_DENOMINATOR_VALUE,
        value
    })
}
export const changeDenominatorName = (value) =>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_DENOMINATOR_NAME,
        value
    })
}
export const changeSettingEnable = (bool) =>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_EXTRA_INFO_ENABLE_TYPE,
        bool
    })
}
export const setExtraInfoInitData=(item)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_EXTAR_INFO_INIT_DATA,
        name:item?item.name:'',
        denominatorName:item?item.denominatorName:'',    //单位
        denominatorValue:item?item.denominatorValue:'',    //分母
        enable:item?item.enable:false,
        numerator:item?item.numerator:1,
        id:item?item.id:''
    })
}
export const setExtraInfoIsChange=(bool)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_EXTAR_INFO_INIT_ISCHANGE,
        bool
    })
}
export const setExtraInfoIsDefualt=(bool)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_EXTAR_INFO_INIT_ISDEFUALT,
        bool
    })
}
export const setNewExtraMessage =(history)=>(dispatch,getState)=>{
    const extraInformationState = getState().extraInformationState
    const name = extraInformationState.get("name")
    const denominatorName = extraInformationState.get("denominatorName")
    const denominatorValue = extraInformationState.get("denominatorValue")
    const enable = extraInformationState.get("enable")
    const numerator = extraInformationState.get("numerator")
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
    fetchApi(isRunning?'setJrNewExtraMessage':"setNewExtraMessage",'POST',JSON.stringify({
        name,
        denominatorName,
        denominatorValue,
        enable,
        numerator,
    }),resp=>{
        if(showMessage(resp)){
            Toast.info("操作成功",1)
            history.goBack()
        }
    })
}
export const updateExtraMessage =(history)=>(dispatch,getState)=>{
    const extraInformationState = getState().extraInformationState
    const name = extraInformationState.get("name")
    const denominatorName = extraInformationState.get("denominatorName")
    const denominatorValue = extraInformationState.get("denominatorValue")
    const enable = extraInformationState.get("enable")
    const numerator = extraInformationState.get("numerator")
    const id= extraInformationState.get("id")
      const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
    fetchApi(isRunning?'updateJrExtraMessage':"updateExtraMessage",'POST',JSON.stringify({
        name,
        denominatorName,
        denominatorValue,
        enable,
        numerator,
        id
    }),resp=>{
        if(showMessage(resp)){
            Toast.info("操作成功",1)
            history.goBack()
        }
    })
}
export const deleteExtraMessage = ()=>(dispatch,getState)=>{
    const extraInformationState = getState().extraInformationState
    const idList = extraInformationState.get('deleteList')
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
    fetchApi(isRunning?'deleteJrExtraMessage':'deleteExtraMessage','POST',JSON.stringify({
        idList
    }),resp=>{
        if(showMessage(resp)){
            Toast.info("操作成功",1)
            dispatch({
                type:ActionTypes.CHANGE_EXTRA_INFO_LIST_DELETE_TYOPE,
                value:false
            })
            dispatch({type:ActionTypes.EMPTY_EXTRA_INFO_DELETE_LIST})
            dispatch(getExtraInformationList())
        }
    })
}
