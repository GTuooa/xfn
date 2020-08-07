import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { jsonifyDate, showMessage } from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'
import { message }	from 'antd'
import * as thirdParty from 'app/thirdParty'

export const getEnclosureExportRecordingList =(issuedate)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('exportEnclosureList', 'POST', JSON.stringify({
        year: issuedate.substr(0, 4),
        month: issuedate.substr(4,1) ==='-' ?issuedate.substr(5, 2):issuedate.substr(6, 2)
    }),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.GET_EXPORT_ENCLOSURE_LIST,
                data:resp.data,
                issuedate
            })

        }
    })
}
export const handleUuidList = (uuid)=>(dispatch,getState)=>{
        dispatch({
            type:ActionTypes.HANDLE_EXPORT_RECORDING_LIST,
            uuid
        })
}
export const selectAllUuidList=(selectedAll)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SELECT_ALL_EXPORT_RECORDING_LIST,
        selectedAll
    })
}
export const deleteExportList = ()=>(dispatch,getState)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuidList = getState().exportRecordingState.get('uuidList')
    const issuedate = getState().exportRecordingState.get('issuedate')
    fetchApi('deleteEnclosureExportList','POST',JSON.stringify({uuidList}),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch(getEnclosureExportRecordingList(issuedate))
        }
    })
}
