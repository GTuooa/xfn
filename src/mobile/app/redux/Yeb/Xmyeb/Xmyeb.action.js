import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

const getFormatRunningCategory = (json) => {
    let runningCategoryList = []
    const loop = (data, children) => data.forEach((item) => {
        if (item.get('childList') && item.get('childList').size) {//有子集
            children.push({
                value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}${Limit.TREE_JOIN_STR}${item.get('propertyCost')}`,
                label: item.get('name'),
                children: getChild(item.get('childList'))
            })
        } else {//无子集
            children.push({
                value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}${Limit.TREE_JOIN_STR}${item.get('propertyCost')}`,
                label: item.get('name'),
                children: []
            })
        }
    })

    const getChild = (dataList) => {
        let child = []
        loop(dataList, child)
        return child
    }
    const topParent = json.data.result[0]
    if(json.data.result.length > 0 && topParent.name === '全部'){
        runningCategoryList.push({
            value: `${topParent.uuid}${Limit.TREE_JOIN_STR}${topParent.name}${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
            label: topParent.name,
            children: [{
                value: `${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
                label:'全部'
            }]
        })
        const topChild = json.data.result[0].childList
        fromJS(topChild).forEach(v => {
            if (v.get('childList').size) {
                let childList = getChild(v.get('childList'))
                const firstchild = [{
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                    label: v.get('name'),
                    children: childList
                }]
                runningCategoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                    label: v.get('name'),
                    children: firstchild
                })
            } else {
                runningCategoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                    label: v.get('name'),
                    children: [{
                        value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                        label: v.get('name')
                    }]
                })
            }
        })
    }else{
        fromJS(json.data.result).forEach(v => {
            if (v.get('childList').size) {
                let childList = getChild(v.get('childList'))
                const firstchild = [{
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                    label: v.get('name'),
                    children: childList
                }]
                runningCategoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                    label: v.get('name'),
                    children: firstchild
                })
            } else {
                runningCategoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                    label: v.get('name'),
                    children: [{
                        value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                        label: v.get('name')
                    }]
                })
            }
        })
    }
    return runningCategoryList
}
const getFormatTypeCategory = (json) => {
    let categoryList = []
    const loop = (data, children) => data.forEach((item) => {
        if (item.get('childList') && item.get('childList').size) {//有子集
            children.push({
                value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}${Limit.TREE_JOIN_STR}${item.get('top')}`,
                label: item.get('name'),
                children: getChild(item.get('childList'))
            })
        } else {//无子集
            children.push({
                value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}${Limit.TREE_JOIN_STR}${item.get('top')}`,
                label: item.get('name'),
                children: []
            })
        }
    })

    const getChild = (dataList) => {
        let child = []
        loop(dataList, child)
        return child
    }
    const topParent = json.data.categoryList[0]
    if(json.data.categoryList.length > 0 && topParent.name === '损益项目'){
        categoryList.push({
            value: `${topParent.uuid}${Limit.TREE_JOIN_STR}${topParent.name}${Limit.TREE_JOIN_STR}${topParent.top}`,
            label: topParent.name,
            children: [{
                value: `${topParent.uuid}${Limit.TREE_JOIN_STR}${topParent.name}${Limit.TREE_JOIN_STR}${topParent.top}`,
                label:'损益项目'
            }]
        })
        const topChild = json.data.categoryList[0].childList
        fromJS(topChild).forEach(v => {
            if (v.get('childList').size) {
                let childList = getChild(v.get('childList'))
                const firstChild = [{
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                    label: v.get('name'),
                    children: childList
                }]

                categoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                    label: v.get('name'),
                    children: firstChild
                })
            } else {
                categoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                    label: v.get('name'),
                    children: [{
                        value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                        label: v.get('name')
                    }]
                })
            }
        })
    }else{
        fromJS(json.data.categoryList).forEach(v => {
            if (v.get('childList').size) {
                let childList = getChild(v.get('childList'))
                const firstChild = [{
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                    label: v.get('name'),
                    children: childList
                }]
                categoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                    label: v.get('name'),
                    children: firstChild
                })
            } else {
                categoryList.push({
                    value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                    label: v.get('name'),
                    children: [{
                        value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
                        label: v.get('name')
                    }]
                })
            }
        })
    }
    return categoryList
}
export const getFirstProjectList = (issuedate,endissuedate) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getProjectBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        getPeriod: "true",
        "subordinateUuid":"",
        "runningCategoryUuid":"",
        categoryUuid:'',
        currentPage:1,
        propertyCost:''
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = issuedate ? issuedate : openedissuedate
            const {
                balanceAmount,
                expenseAmount,
                incomeAmount,
                pages,
                realBalanceAmount,
                realExpenseAmount,
                realIncomeAmount,
            } = json.data.result
            fetchApi('getProjectDetailCategoryList', 'POST',JSON.stringify({
                year: issuedateNew.substr(0, 4),
                month: issuedateNew.substr(5, 2),
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                getPeriod: "true",
            }),json => {
                if (showMessage(json)) {
                    const categoryList = getFormatTypeCategory(json)
                    dispatch(changeXmYeInnerCommonString(['flags','projectCategoryList'],fromJS(categoryList)))
                }
            })
            fetchApi('getProjectCategoryList', 'POST',JSON.stringify({
                year: issuedateNew.substr(0, 4),
                month: issuedateNew.substr(5, 2),
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                categoryUuid:"",
                subordinateUuid:''
            }),json => {
                if (showMessage(json)) {
                    const runningCategoryList = getFormatRunningCategory(json)
                    dispatch(changeXmYeInnerCommonString(['flags','categoryList'],fromJS(runningCategoryList)))
                }
            })
            const issues = dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson))

            dispatch({
                type: ActionTypes.GET_XM_BALANCE_LIST,
                receivedData: json.data.result.childList,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                getPeriod: "true",
                balanceAmount,
                expenseAmount,
                incomeAmount,
                pages,
                issues,
                realBalanceAmount,
                realExpenseAmount,
                realIncomeAmount,
                currentPage:1,
                changeDate:true,
                endissuedate
            })
       }
    })
}
export const getProjectDetailRunningCategoryList = (issuedate,endissuedate,uuid) => dispatch => {
    fetchApi('getProjectDetailRunningCategoryList', 'POST',JSON.stringify({
        year: issuedate.substr(0, 4),
        month: issuedate.substr(5, 2),
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',

    }),json => {
        if (showMessage(json)) {
            const runningCategoryList = getFormatRunningCategory(json)
            dispatch(changeXmYeInnerCommonString(['flags','categoryList'],fromJS(runningCategoryList)))
        }
    })
}
export const getProjectBalanceList = (issuedate,endissuedate,currentPage=1,isTop,categoryUuid='',runningCategoryUuid='',propertyCost='',shouldConcat, isScroll,_self) => (dispatch,getState) => {
    !isScroll && thirdParty.toast.loading('加载中...', 0)
	fetchApi('getProjectBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
		endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        getPeriod: "true",
        subordinateUuid:isTop == 'true' ?'':categoryUuid,
        runningCategoryUuid,
        categoryUuid:isTop == 'true' ?categoryUuid:'',
        pageNum:currentPage,
        propertyCost
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            const {
                balanceAmount,
                expenseAmount,
                incomeAmount,
                pages,
                realBalanceAmount,
                realExpenseAmount,
                realIncomeAmount,
            } = json.data.result
            const issues = dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson))
          dispatch({
            type: ActionTypes.GET_XM_BALANCE_LIST,
            receivedData: json.data.result.childList,
            period: json.data.periodDtoJson,
            issues,
            issuedate,
            endissuedate,
            getPeriod: "",
            balanceAmount,
            expenseAmount,
            incomeAmount,
            pages,
            realBalanceAmount,
            realExpenseAmount,
            realIncomeAmount,
            currentPage,
            isTop,
            categoryUuid,
            runningCategoryUuid,
            propertyCost,
            shouldConcat
          })
        }
	})
}
export const getProjectCategoryList = (issuedate,endissuedate,uuid,isTop) => dispatch => {
    fetchApi('getProjectCategoryList', 'POST',JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        subordinateUuid:isTop == 'true' ?'':uuid,
        categoryUuid:isTop == 'true' ?uuid:'',
    }),json => {
        if (showMessage(json)) {
            const runningCategoryList = getFormatRunningCategory(json)
            dispatch(changeXmYeInnerCommonString(['flags','categoryList'],fromJS(runningCategoryList)))
        }
    })
}
// export const changeEndPeriod = (lastChooseperiods) => dispatch => {
//     if (!lastChooseperiods) {
//         dispatch(changeXmYeInnerCommonString(['flags','endissuedate'],''))
//     } else {
//
//     }
// }
export const changeXmYeInnerCommonString = (placeArr,value) => dispatch => {
    dispatch({
      type: ActionTypes.CHANGE_XMYE_COMMON_STRING,
      placeArr,
      value
    })
}
export const accountBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.ACCOUNTCONF_XM_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
  })

export const changeZhyeMorePeriods = (chooseperiods) => ({
    type: ActionTypes.CHANGE_ZHYE_MORE_PERIODS,
    chooseperiods
})
export const changeMenuData = (dataType, value) => (dispatch) => {
    dispatch({
        type: ActionTypes.XMYE_MENU_DATA,
        value,
        dataType
    })
}
