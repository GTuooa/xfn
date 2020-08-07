import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// 从余额表跳明细表
export const getRunningTypeMxbListFromRunningTypeYeb = (issuedate, endissuedate, item, history,acNameStr) => dispatch => {
    const currentTypeUuid = item.get('acId')
    const acName = item.get('mergeName')

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    dispatch(getRunningTypeDetailCategory(issuedate, endissuedate))

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        acId: currentTypeUuid,
        jrAbstract:'',
        pageNum: 1,
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        needPeriod: 'true',
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPE_YEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentTypeUuid,
                currentPage: 1,
                needPeriod: 'true',
                issues,
                acName:acNameStr
            })
        }
    })

    history.push('runningTypeMxb')
}

export const getRunningTypeDetailCategory = (issuedate, endissuedate) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRunningTypeMxbCategory', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY,
                receivedData: json.data.tree.childList,
            })
        }
        thirdParty.toast.hide()
    })
}

export const getRunningTypeMxbBalanceListPages = (issuedate, endissuedate,currentTypeUuid = '',currentPage = 1, shouldConcat, isScroll,_self) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    !isScroll && thirdParty.toast.loading('加载中...', 0)

    fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        acId: currentTypeUuid,
        jrAbstract: '',
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        needPeriod: 'true',
        pageNum: currentPage,
    }), json => {
        !isScroll && thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_PAGE,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentTypeUuid,
                currentPage,
                shouldConcat
            })
        }
    })
}

export const getJrRunningTypeList = (issuedate, endissuedate,currentTypeUuid = '',direction='debit',currentPage = 1,needPeriod, shouldConcat, isScroll,_self) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    !isScroll && thirdParty.toast.loading('加载中...', 0)

    fetchApi('getJrRunningTypeList', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        acId: currentTypeUuid,
        jrAbstract: '',
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        needPeriod: 'true',
        pageNum: currentPage,
        direction
    }), json => {
        !isScroll && thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const openedissuedate = issuedate ? issuedate : dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_PAGE,
                receivedData: json.data,
                issuedate: openedissuedate,
                endissuedate: endissuedate,
                currentTypeUuid,
                currentPage,
                shouldConcat,
                direction,
                issues,
                needPeriod
            })
        }
    })
}
export const getJrAcList = (begin, end,acId) => (dispatch, getState) => {
    fetchApi('getJrAcList', 'POST', JSON.stringify({
        needPeriod:true,
        begin,
        end,
        acId
    }), json => {
        if (showMessage(json)) {
            const { acId, typeName, direction } = json.data.tree
            let list = json.data.tree.childList
            if (json.data.tree.acId) {
                dispatch(changeRunningTypeMxbCommonState('views','acName',json.data.tree.typeName))
                if (json.data.tree.typeName === '全部') {
                    list.unshift({ acId, mergeName:typeName, acName:typeName, direction })
                } else {
                    list = [json.data.tree]
                }
            } else {
                thirdParty.toast.info('当前账期无数据')
            }
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY,
                receivedData:list
                })
        }
    })

}

export const getPeriodAndRunningTypeMxbListFromReflash = (issuedate, endissuedate,typeUuid) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRunningTypeMxbCategory', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        needPeriod: 'true',
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const openedissuedate = issuedate ? issuedate : dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY,
                receivedData: json.data.tree.childList,
            })
            let currentTypeUuid = typeUuid
            let currentacName = ''
            let hasTypeItem = false
            if(json.data.tree.childList.length > 0){
                const loop = (data) => data.map(item => {
                    if(item.acId == typeUuid){
                        hasTypeItem = true
                        currentacName = item.acName
                    }
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(json.data.tree.childList)
                if(!hasTypeItem){
                    currentTypeUuid = json.data.tree.childList[0].acId
                    currentacName = json.data.tree.childList[0].acName
                }
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
                    begin: issuedate,
                    end: endissuedate,
                    acId: currentTypeUuid,
                    jrAbstract: '',
                    pageNum: 1,
                    pageSize: Limit.LSMX_LIMIE_LENGTH,
                    needPeriod: 'true',
                }), result => {
                    thirdParty.toast.hide()
                    if (showMessage(result)) {
                        dispatch({
                            type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPE_YEB,
                            receivedData: result.data,
                            issuedate: openedissuedate,
                            endissuedate: endissuedate,
                            currentTypeUuid,
                            acName: currentacName,
                            currentPage: 1,
                        })
                    }
                })
            }else{
                dispatch({
                    type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_NO_TYPE_TREE,
                    issuedate: openedissuedate,
                    endissuedate: endissuedate,
                })
            }
        }
    })

}

export const changeRunningTypeMxbCommonState = (parent, position, value) => ({type: ActionTypes.CHANGE_RUNNING_TYPE_MXB_COMMON_STATE, parent, position, value})

export const changeRunningTypeMxbChooseValue = (value) => ({
      type: ActionTypes.CHANGE_RUNNING_TYPE_MXB_CHOOSE_VALUE,
      value,
})

export const changeRunningTypString = (name,value) => ({
      type: ActionTypes.CHANGE_RUNNING_TYPE_STRING,
      name,
      value,
})
