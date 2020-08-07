import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

export const changeDetailXmmxCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'
    ? [`${tab}Temp`, place]
    : [
      `${tab}Temp`, ...place
    ]
  if (place[0] === 'flags') {
    placeArr = place
  }
  dispatch({type: ActionTypes.CHANGE_XM_DETAIL_ACCOUNT_COMMON_STRING, tab, placeArr, value})

}
export const clearXmState = () => ({
    type:ActionTypes.CLEAR_XM_STATE
})
const getProjectsTypeCategory = (json) => {
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

const getProjectsRunningCategory = (json) => {
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

export const getFirstProjectDetailList = (issuedate,endissuedate,pageNum=1,amountType='DETAIL_AMOUNT_TYPE_HAPPEN',typeUuid='',curCardUuid='',isTop='true',categoryUuid='',propertyCost='',cardName = '', history,isYeJump = false) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectDetailCategoryList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        getPeriod:'true'
    }),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const categoryList = getProjectsTypeCategory(json)
            dispatch(changeDetailXmmxCommonString('',['flags','projectTypeTree'],fromJS(categoryList)))

            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = issuedate ? issuedate : openedissuedate
            if (!json.data.categoryList.length) {
                dispatch(clearXmState())
                dispatch(changeDetailXmmxCommonString('',['flags','issuedate'],issuedateNew))
                return;
            }
            const cardCategoryUuid = typeUuid || json.data.categoryList[0].uuid
            // const propertyCost = json.data.resultList[0].propertyCost
            thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
            fetchApi('getProjectDetailCardList', 'POST', JSON.stringify({
                year: issuedateNew.substr(0, 4),
                month: issuedateNew.substr(5, 2),
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                cardCategoryUuid:isTop == 'true' ? cardCategoryUuid : '',
                cardSubUuid:isTop != 'true' ? cardCategoryUuid : '',
                cardPageNum:1,
                getPeriod:'false',
            }),json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch(changeDetailXmmxCommonString('',['flags','cardList'],fromJS(json.data.cardList)))
                    const cardUuid = curCardUuid || json.data.cardList[0].uuid
                    const curCardName = cardName || `${json.data.cardList[0].code} ${json.data.cardList[0].name}`
                    const cardPages = json.data.pages
                    dispatch(changeDetailXmmxCommonString('',['flags','curCardName'],curCardName))
                    dispatch(changeDetailXmmxCommonString('',['flags','cardPages'],cardPages))
                    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                    fetchApi('getProjectDetailList', 'POST', JSON.stringify({
                        year: issuedateNew.substr(0, 4),
                        month: issuedateNew.substr(5, 2),
                        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                        getPeriod:false,
                        cardUuid,
                        amountType,
                        categoryUuid,
                        propertyCost,
                        pageNum,
                    }),json => {
                        thirdParty.toast.hide()
                        if (showMessage(json)) {
                            const { debitSum, creditSum, total, detailList, pages } = json.data.result
                            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
                            dispatch({
                                type:ActionTypes.GET_XMMX_PROJECT_LIST,
                                detailList,
                                debitSum,
                                creditSum,
                                total,
                                issues,
                                period: json.data.periodDtoJson,
                                getPeriod:'true',
                                issuedate: issuedateNew,
                                endissuedate,
                                curCardUuid:cardUuid,
                                isTop,
                                categoryUuid,
                                propertyCost,
                                amountType,
                                pageNum,
                                cardPageNum:1,
                                pages,
                                typeUuid:cardCategoryUuid
                            })
                        }
                    })
                    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                    fetchApi('getProjectDetailRunningCategoryList', 'POST', JSON.stringify({
                        year: issuedate ? issuedate.substr(0, 4) : '',
                        month: issuedate ? issuedate.substr(5, 2) : '',
                        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                        cardUuid,
                        getPeriod:'false',
                    }), json => {
                        thirdParty.toast.hide()
                        if (showMessage(json)) {
                            const runningCategoryList = getProjectsRunningCategory(json)
                            dispatch(changeDetailXmmxCommonString('',['flags','runningCategory'],fromJS(runningCategoryList)))
                        }
                    })
                }
            })
        }
    })
    if(isYeJump){
        history.push('xmmxb')
    }
}
export const getProjectDetailCardList = (issuedate,endissuedate,amountType,typeUuid,isTop,cardPageNum=1,pageNum=1,isYeJump = false,cardUuid = '',cardName = '请选择卡片',typeJump = false) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectDetailCardList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardCategoryUuid: isTop == 'true' ? typeUuid : '',
        cardSubUuid: isTop != 'true' ? typeUuid : '',
        pageNum: cardPageNum,
        getPeriod:'false',
    }),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const resultList = fromJS(json.data.cardList)
			const cardList = resultList.map(v => {return {key: `${v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}`}})
            let cUuid = !isYeJump || typeJump ? (json.data.cardList[0] ? json.data.cardList[0].uuid : '') : cardUuid
            let cName = !isYeJump || typeJump ? (json.data.cardList[0] ? `${json.data.cardList[0].code} ${json.data.cardList[0].name}` : '暂无卡片') : cardName
            const cardPages = json.data.pages
            if(!isYeJump){
                if(cardList.size > 0){
                    thirdParty.chosen({
                        source : cardList.toJS(),
                        onSuccess(result) {
                            if(result){
                                const valueList = result.value.split(Limit.TREE_JOIN_STR)
                                const code = valueList[2]
                                const name = valueList[1]
                                cName = `${code} ${name}`
                                cUuid = valueList[0]
                                dispatch(changeDetailXmmxCommonString('',['flags','cardList'],fromJS(json.data.cardList)))

                                dispatch(changeDetailXmmxCommonString('',['flags', 'curCardName'],cName))
                                dispatch(changeDetailXmmxCommonString('',['flags','cardPages'],cardPages))
                                dispatch(changeDetailXmmxCommonString('',['flags','categoryName'],'全部'))
                                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

                                fetchApi('getProjectDetailList', 'POST', JSON.stringify({
                                    year: issuedate ? issuedate.substr(0, 4) : '',
                                    month: issuedate ? issuedate.substr(5, 2) : '',
                                    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                                    endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                                    getPeriod:false,
                                    cardUuid:cUuid,
                                    amountType,
                                    categoryUuid:'',
                                    propertyCost:'',
                                    pageNum
                                }),json => {
                                    thirdParty.toast.hide()
                                    if (showMessage(json)) {
                                        const { debitSum, creditSum, total, detailList, pages } = json.data.result
                                        const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
                                        dispatch({
                                            type:ActionTypes.GET_XMMX_PROJECT_LIST,
                                            detailList,
                                            debitSum,
                                            creditSum,
                                            total,
                                            issues,
                                            period: json.data.periodDtoJson,
                                            getPeriod:'true',
                                            issuedate: issuedate,
                                            endissuedate,
                                            amountType,
                                            categoryUuid:'',
                                            propertyCost:'',
                                            typeUuid,
                                            isTop,
                                            cardPageNum,
                                            pageNum,
                                            curCardUuid:cUuid,
                                            pages,

                                        })
                                    }
                                })
                                fetchApi('getProjectDetailRunningCategoryList', 'POST', JSON.stringify({
                                    year: issuedate ? issuedate.substr(0, 4) : '',
                                    month: issuedate ? issuedate.substr(5, 2) : '',
                                    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                                    endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
                                    cardUuid:cUuid,
                                    getPeriod:'false',
                                }), json => {
                                    if (showMessage(json)) {
                                        const runningCategoryList = getProjectsRunningCategory(json)
                                        dispatch(changeDetailXmmxCommonString('',['flags','runningCategory'],fromJS(runningCategoryList)))
                                    }
                                })
                            }
                        }
                    })
                }else{
                    thirdParty.toast.info('无可选对象')
                }
            }


        }
    })
}
export const getProjectDetailList = (issuedate,endissuedate,currentPage=1,cardUuid,amountType,categoryUuid='',propertyCost='',shouldConcat, isScroll,_self) => (dispatch,getState) => {
    const xmmxState = getState().xmmxbState
    const flags = xmmxState.get('flags')
    const typeUuid = flags.get('typeUuid')
    const isTop = flags.get('isTop')
    const cardPageNum = flags.get('cardPageNum')
    !isScroll && thirdParty.toast.loading('加载中...', 0)
    fetchApi('getProjectDetailList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        getPeriod:false,
        cardUuid,
        amountType,
        categoryUuid,
        propertyCost,
        pageNum:currentPage,
    }),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            const { debitSum, creditSum, total, detailList, pages } = json.data.result
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type:ActionTypes.GET_XMMX_PROJECT_LIST,
                detailList,
                debitSum,
                creditSum,
                total,
                issues,
                period: json.data.periodDtoJson,
                getPeriod:'true',
                issuedate,
                endissuedate,
                amountType,
                categoryUuid,
                propertyCost,
                typeUuid,
                isTop,
                cardPageNum,
                pageNum:currentPage,
                curCardUuid:cardUuid,
                pages,
                shouldConcat
            })
        }
    })
    if (!categoryUuid) {
        fetchApi('getProjectDetailRunningCategoryList', 'POST', JSON.stringify({
            year: issuedate ? issuedate.substr(0, 4) : '',
            month: issuedate ? issuedate.substr(5, 2) : '',
            endYear: endissuedate ? endissuedate.substr(0, 4) : '',
            endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
            cardUuid,
            getPeriod:'false',
        }), json => {
            if (showMessage(json)) {
                const runningCategoryList = getProjectsRunningCategory(json)
                dispatch(changeDetailXmmxCommonString('',['flags','runningCategory'],fromJS(runningCategoryList)))
            }
        })
    }

}
export const changeMenuData = (dataType, value) => (dispatch) => {
    dispatch({
        type: ActionTypes.XMMX_MENU_DATA,
        value,
        dataType
    })
}
