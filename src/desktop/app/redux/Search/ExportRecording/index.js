import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

const exportRecordingState = fromJS({
    dataList:[],
    uuidList:[],
    issuedate:"",
    selectedAll:false
})

export default function handleExportRecording(state = exportRecordingState, action) {
    return({
        [ActionTypes.GET_EXPORT_ENCLOSURE_LIST] :()=>{
            return state.set("dataList",action.data).set("issuedate",action.issuedate).set("selectedAll",false)
        },
        [ActionTypes.HANDLE_EXPORT_RECORDING_LIST] :()=>{
            let uuidList = state.get("uuidList").toJS()
            let uuid = action.uuid
            if(uuidList.includes(uuid)){
                let index = uuidList.findIndex((data,index)=>{
                    return data===uuid
                })
                uuidList.splice(index,1)
            }else{
                uuidList.push(uuid)
            }
            return state.set("uuidList",fromJS(uuidList))
        },
        [ActionTypes.SELECT_ALL_EXPORT_RECORDING_LIST]:()=>{
            let newUuidList=[]
            let selectedAll=action.selectedAll
            let dataList = state.get('dataList')
            if(selectedAll){
                for(let i in dataList){
                    newUuidList.push(dataList[i].zipUuid)
                }
            }
            return state.set("uuidList",fromJS(newUuidList)).set("selectedAll",selectedAll)
        }
    }[action.type] || (() => state))()
}
