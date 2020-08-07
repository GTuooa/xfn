import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { jsonifyDate, showMessage } from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'
import { message }	from 'antd'
import * as thirdParty from 'app/thirdParty'

import { allDownloadEnclosure } from 'app/redux/Home/All/all.action.js'
//获取附件管理的数据

export const getRunningEnclosureData = (issuedate,endissuedate)=>(dispatch)=>{

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('runningEnclosure', 'POST', JSON.stringify({
		start: issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : '',
        searchType:"SEARCH_TYPE_ENCLOSURE_NAME",
        searchContent:""
	}),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch({type: ActionTypes.SET_ISSUEDATE,issuedate,endissuedate})
            dispatch({type: ActionTypes.SET_INITIAL_DATA,payload:resp.data})
            //dispatch({type:ActionTypes.HANDLE_RUNNING_ENCLOSURE_CHOOSE_VALUE,value:chooseValue})
        }
    })

}
//预览
export const previewImage = (idx,fjIdx) => ({
	type: ActionTypes.PREVIEW_RUNNING_ENCLOSURE_IMAGE,
	idx,
	fjIdx
})
export const closeRunningEncloseurePreviewModal =()=>({
    type:ActionTypes.CLOSE_PREVIEW_RUNNING_ENCLOSURE_IMAGE
})
export const changeRunningEnclosureSelectList =(enclosureKey) =>({
    type:ActionTypes.CHANGE_RUNNING_ENCLOSURE_SELECT_LIST,
    enclosureKey
})
export const selectAllRunningEncloseureList = (selectedAll)=>({
    type:ActionTypes.SELECT_ALL_RUNNING_ENCLOSURE_LIST,
    selectedAll
})
export const exportEnclosureList =(selectList,dataList,issuedate,showModal)=>(dispatch)=>{
    let selectedList=selectList.toJS()
    let result =[]
    // let period =issuedate.substr(4,1) ==='-' ? `${issuedate.substr(0, 4)}第${issuedate.substr(5, 2)}` : `${issuedate.substr(0, 4)}第${issuedate.substr(6, 2)}`
    for(let i in selectedList){
        let jrIndex = Number(selectedList[i].split("-")[0])
        dataList.forEach((data,index)=>{
            if(data.jrIndex===jrIndex){
                let object={
                    jrIndex:data.jrIndex,
                    // period:period,
                    period:data.period,
                    enclosureList:[]
                }
                let includes=false
                for(let i in result){
                    if(result[i].jrIndex===object.jrIndex){
                        includes=true
                        break
                    }
                }
                if(!includes){
                    result.push(object)
                }
            }
        })
    }
    for(let i in selectedList){
        let jrIndex = Number(selectedList[i].split("-")[0])
        let enclosureKey = Number(selectedList[i].split("-")[1])
        dataList.forEach((data,index)=>{
            if(data.jrIndex===jrIndex){
                data.enclosureList.forEach((e,i)=>{
                    if(e.enclosureKey===enclosureKey){
                        let obj={
                            uuid:e.uuid,
                            enclosurePath:e.enclosurePath,
                            fileName:e.fileName,
                            size:e.size
                        }

                        for(let j in result){
                            if(result[j].jrIndex===jrIndex){
                                result[j].enclosureList.push(obj)
                            }
                        }
                    }
                })
            }
        })
    }
    fetchApi("exportEncloseure",'POST',JSON.stringify({jrList:result}),resp=>{
        if(showMessage(resp)){
            // dispatch(showModal())
            showModal && showModal()
        }
    })
}
export const changeRunningEnclosureSearchCodition=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_RUNNING_ENCLOSEURE_SEARCH_CONDITION,
        value
    })
}
export const changeRunningEnclosureContent=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_RUNNING_ENCLOSEURE_SEARCH_CONTENT,
        value
    })
}
export const getRunningEnclosureSearchData=(issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('runningEnclosure', 'POST',JSON.stringify({
        start: issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : '',
        searchType:searchCondition,
        searchContent:searchContent
    }),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            //dispatch({type: ActionTypes.SET_ISSUEDATE,payload:issuedate})
            dispatch({type: ActionTypes.SET_RUNNING_ENCLOSURE_SEARCHED_DATA,payload:resp.data,issuedate})
        }
    })
}
export const verifyRunningEnclosure =(uuidList,issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("insertVcList",'POST',JSON.stringify({
        uuidList: [uuidList],
        action: 'QUERY_JR-AUDIT'
    }),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            if(resp.data.result.length) {
                const error = resp.data.result.join(',')
                message.error(error)
            }else{
                message.success('成功')
                dispatch(getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,searchContent))
            }
        }
    })

}
export const antiVerifyRunningEnclosure =(uuidList,issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("deleteVcList",'POST',JSON.stringify({
        year:issuedate.substr(0, 4),
		month:issuedate.substr(4,1) ==='-' ?issuedate.substr(5, 2):issuedate.substr(6, 2),
        vcindexlist: [uuidList],
        action: 'QUERY_JR-CANCEL_AUDIT',
    }),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            if(resp.data.failJsonList.length) {
                const error = resp.data.text
                message.error(error)
            }else{
                message.success('成功')
                dispatch(getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,searchContent))
            }

        }
    })
}
export const getEnclosureTagList =(enclosureKey,showTagListModal)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("getEnclosureTagList","GET",``,resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.GET_RUNNING_ENCLOSURE_TAG_LIST,
                data:resp.data,
                enclosureKey:enclosureKey
            })
            showTagListModal()
        }
    })
}
export const refreshTagList =(issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("getEnclosureTagList","GET",``,resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.REFRESH_RUNNING_ENCLOSURE_TAG_LIST,
                data:resp.data,
            })
            dispatch(getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,searchContent))
        }
    })
}
export const upLoadRunningEnclosureLabel = (object,issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("updateLabel",'POST',JSON.stringify(object),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch(refreshTagList(issuedate,endissuedate,searchCondition,searchContent))
        }
    })
}
export const setEnclosureLabelValue=(value,id)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_RUNNING_ENCLOSEURE_LABEL,
        value,
        id
    })
}
export const modifyEnclosureLabel = (id,label,enKey,issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("modifyEnclosureLabel","POST",JSON.stringify({id,label}),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch(upLoadRunningEnclosureLabel({label,enKey},issuedate,endissuedate,searchCondition,searchContent))
        }
    })
}
export const insertEnclosureLabel=(label,enKey,issuedate,endissuedate,searchCondition,searchContent)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertNewEnclosureLabel','POST',JSON.stringify({label}),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch(upLoadRunningEnclosureLabel({label,enKey},issuedate,endissuedate,searchCondition,searchContent))
        }
    })
}
export const deleteEnclosureLabel=(id)=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteEnclosureLabel','POST',JSON.stringify({id}),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.REFRESH_RUNNING_ENCLOSURE_TAG_LIST,
                data:resp.data,
            })
        }
    })
}
export const setEnclosureUuidList =(uuid)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_ENCLOSURE_UUIDLIST,
        uuid
    })
}
export const deleteEnclosureList = ()=>(dispatch,getState)=>{
    const issuedate = getState().runningEnclosureState.get("issuedate")
    const endissuedate = getState().runningEnclosureState.get("endissuedate")
    const uuidList = getState().runningEnclosureState.get("uuidList")
    const searchCondition = getState().runningEnclosureState.get("searchCondition")
    const searchContent = getState().runningEnclosureState.get("searchContent")
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteEnclosureList','POST',JSON.stringify({
        uuidList,
        start: issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : '',
        end: endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : '',
    }),resp=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            dispatch(getRunningEnclosureSearchData(issuedate,endissuedate,searchCondition,searchContent))
        }
    })
}
export const handleRunningEnclosureChooseStatus =(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_RUNNING_ENCLOSURE_CHOOSE_VALUE,
        value
    })
}
