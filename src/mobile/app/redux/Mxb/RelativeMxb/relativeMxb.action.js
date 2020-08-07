import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import { fromJS }	from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// Yeb 跳来的
export const getRelativeMxbListFromYeb = (issuedate, endissuedate, uuid, isTop,item, history,runningCategoryObj,hasChild) => (dispatch, getState) => {

    const relativeMxbState = getState().relativeMxbState
    const cardUuid = item.get('cardUuid')
    const cardCode = item.get('cardCode')
    const cardName = item.get('name')

    const categoryOrTypeUuid = runningCategoryObj.runningCategoryUuid
    const runningCategoryName = runningCategoryObj.runningCategoryName
    const chooseDirection = runningCategoryObj.dirction

    hasChild && dispatch({
                    type: ActionTypes.GET_RELATIVE_MXB_FROM_RELATIVE_RELATIVE_YEB,
                    selectItem: fromJS({
                        uuid:item.get('categoryUuid'),
                        name: cardName,
                        value:`${item.get('categoryUuid')}${Limit.TREE_JOIN_STR}${isTop === 'true' ? 0 : 1 }`,
                        top:isTop
                    }),
                })

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRelativeCard', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        categoryUuid: isTop === 'true' ? uuid : '',
        cardCategoryUuid: isTop === 'true' ?  '' : uuid,
        currentPage: 1,
        pageSize: '',
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            if (json.data.cardList.length) { // 有卡片
                let hasCard = false
                json.data.cardList.map(item => {
                    if(item.uuid === cardUuid){
                        hasCard = true
                    }
                })
                const cUuid = hasCard ? cardUuid : ''
                const cName = hasCard ? cardName : `全部`

                let newCategoryOrTypeUuid = categoryOrTypeUuid
                let newRunningCategoryName = runningCategoryName
                let newChooseDirection = chooseDirection
                let hasRunningItem = false
                fetchApi('getRelativejrType', 'POST', JSON.stringify({
                    begin: issuedate,
                    end: endissuedate,
                    cardUuid: cUuid,
                    categoryUuid: isTop === 'true' ? uuid : '',
                    cardCategoryUuid: isTop === 'true' ?  '' : uuid,
                }), jsonRunningCategory => {
                    if (showMessage(jsonRunningCategory)) {
                        const loop = (data) => data && data.map(item => {
                            if(item.jrCategoryUuid === categoryOrTypeUuid){
                                hasRunningItem = true
                            }
                            if(item.childList && item.childList.length){
                                loop(item.childList)
                            }
                        })
                        loop(jsonRunningCategory.data.categoryList)
                        if(!hasRunningItem){
                            newCategoryOrTypeUuid = ''
                            newRunningCategoryName = '全部',
                            newChooseDirection = 'double_credit'
                        }

                        dispatch({
                            type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE,
                            receivedData: jsonRunningCategory.data,
                            newRunningItem: {
                                categoryOrTypeUuid: newCategoryOrTypeUuid,
                                runningCategoryName: newRunningCategoryName,
                                chooseDirection: newChooseDirection
                            }
                        })
                        fetchApi('getRelativeDetail', 'POST', JSON.stringify({
                            begin: issuedate,
                            end: endissuedate,
                            currentPage: 1,
                            pageSize: Limit.REPORT_LIMIE_LENGTH,
                            direction: newChooseDirection,
                            jrAbstract: '',
                            cardUuid: cUuid,
                            selectType: 'category',
                            jrTypeUuid: '',
                            jrCategoryUuid: newCategoryOrTypeUuid,
                            categoryUuid: isTop === 'true' ? uuid : '',
                            cardCategoryUuid: isTop === 'true' ?  '' : uuid,
                        }), reportList => {
                            thirdParty.toast.hide()
                            if (showMessage(reportList)) {
                                dispatch({
                                    type: ActionTypes.GET_RELATIVE_BALANCE_LIST,
                                    receivedData: json.data,
                                    reportData: reportList.data,
                                    issues,
                                    issuedate,
                                    endissuedate,
                                    needPeriod: 'true',
                                    cardName:cName,
                                    cardUuid: cUuid,
                                    chooseDirection: newChooseDirection
                                })
                            }
                        })
                    }
                })

                // fetchApi('getRelativeDetail', 'POST', JSON.stringify({
                //     begin: issuedate,
                //     end: endissuedate,
                //     currentPage: 1,
                //     pageSize: Limit.REPORT_LIMIE_LENGTH,
                //     direction: 'double_credit',
                //     jrAbstract: '',
                //     cardUuid: cardUuid,
                //     selectType: 'category',
                //     jrTypeUuid: '',
                //     jrCategoryUuid: '',
                // }), reportList => {
                //     thirdParty.toast.hide()
                //     if (showMessage(reportList)) {
                //         dispatch({
                //             type: ActionTypes.GET_RELATIVE_BALANCE_LIST,
                //             receivedData: json.data,
                //             reportData: reportList.data,
                //             issues,
                //             needPeriod: 'true',
                //             issuedate,
                //             endissuedate,
                //             cardName:`${cardCode} ${cardName}`,
                //             cardUuid,
                //
                //         })
                //     }
                // })
                // // 获取默认卡片下的流水类别和类型
                // dispatch(getRelativeMxbCategoryAndType(issuedate, endissuedate, cardUuid))
            } else {
                thirdParty.toast.hide()

                dispatch({
                    type: ActionTypes.GET_RELATIVE_BALANCE_LIST,
                    receivedData: json.data,
                    reportData: '',
                    issues,
                    needPeriod: 'true',
                    issuedate,
                    endissuedate,
                    cardName: cardCode ? `${cardCode} ${cardName}` : cardName,
                    cardUuid,
                    chooseDirection
                })
            }
        } else {
            thirdParty.toast.hide()
        }
    })

    // 获取往来类别
    dispatch(getRelativeMxbCategory(issuedate, endissuedate))

    history.push('relativemxb')
}

// 切换账期
export const getRelativeMxbListFromChangePeriod = (issuedate, endissuedate) => (dispatch,getState) => {
    const relativeMxbState = getState().relativeMxbState
    const curCardUuid = relativeMxbState.getIn(['views','cardUuid'])
    const curCardName = relativeMxbState.getIn(['views','cardName'])
    const direction = relativeMxbState.getIn(['views','chooseDirection'])
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])

    const categoryOrTypeUuid = relativeMxbState.getIn(['views', 'categoryOrTypeUuid'])
    const runningCategoryName = relativeMxbState.getIn(['views', 'runningCategoryName'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getRelativeCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            let newRelativeItem = currentRelativeItem
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid === currentRelativeItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data.cardCategory)
            if(!hasItem){
                newRelativeItem = fromJS({
                    uuid: '',
                    name: '损益项目',
                    value: '损益项目',
                    top: false,
                })
            }
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY,
                receivedData: jsonCategory.data.cardCategory
            })
            fetchApi('getRelativeCard', 'POST', JSON.stringify({
                begin: issuedate,
                end: endissuedate,
                categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                currentPage: 1,
                pageSize: '',
                needPeriod: issuedate ? '' : 'true',
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let hasCard = false
                        json.data.cardList.map(item => {
                            if(item.uuid === curCardUuid){
                                hasCard = true
                            }
                        })
                        const cUuid = hasCard ? curCardUuid : json.data.cardList[0].uuid
                        const cName = hasCard ? curCardName : `${json.data.cardList[0].code} ${json.data.cardList[0].name}`


                        let newCategoryOrTypeUuid = categoryOrTypeUuid
                        let newRunningCategoryName = runningCategoryName
                        let newChooseDirection = chooseDirection
                        let hasRunningItem = false
                        fetchApi('getRelativejrType', 'POST', JSON.stringify({
                            begin: issuedate,
                            end: endissuedate,
                            cardUuid: cUuid,
                            categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                            cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                        }), jsonRunningCategory => {
                            if (showMessage(jsonRunningCategory)) {
                                const loop = (data) => data && data.map(item => {
                                    if(item.jrCategoryUuid === categoryOrTypeUuid){
                                        hasRunningItem = true
                                    }
                                    if(item.childList && item.childList.length){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonRunningCategory.data.categoryList)
                                if(!hasRunningItem){
                                    newCategoryOrTypeUuid = ''
                                    newRunningCategoryName = '全部',
                                    newChooseDirection = 'double_credit'
                                }

                                dispatch({
                                    type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE,
                                    receivedData: jsonRunningCategory.data,
                                    newRunningItem: {
                                        categoryOrTypeUuid: newCategoryOrTypeUuid,
                                        runningCategoryName: newRunningCategoryName,
                                        chooseDirection: newChooseDirection
                                    }
                                })
                                fetchApi('getRelativeDetail', 'POST', JSON.stringify({
                                    begin: issuedate,
                                    end: endissuedate,
                                    currentPage: 1,
                                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                                    direction: newChooseDirection,
                                    jrAbstract: '',
                                    cardUuid: cUuid,
                                    selectType: 'category',
                                    jrTypeUuid: '',
                                    jrCategoryUuid: newCategoryOrTypeUuid,
                                    categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                                    cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                                }), reportList => {
                                    thirdParty.toast.hide()
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_RELATIVE_BALANCE_LIST,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            needPeriod: '',
                                            cardName:cName,
                                            cardUuid: cUuid,
                                            chooseDirection: newChooseDirection
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        thirdParty.toast.hide()

                        dispatch({
                            type: ActionTypes.GET_RELATIVE_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            needPeriod: '',
                            cardName: '暂无卡片',
                            cardUuid: '',
                            chooseDirection
                        })
                    }
                } else {
                    thirdParty.toast.hide()
                }
            })

        }
    })
}
// 切换往来卡片类别
export const changeContactsCategory = (item,selectTypeValue) => (dispatch,getState) =>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const itemList = item.key.split(Limit.TREE_JOIN_STR)
    const isTop = itemList[1] === '0' ? true : false
    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.getIn(['views','issuedate'])
    const endissuedate = relativeMxbState.getIn(['views','endissuedate'])
    const selectRelativeItem = {
        uuid: itemList[0],
        name: item.label,
        value: item.key,
        top: isTop,
    }
    dispatch({type:ActionTypes.GET_RELATIVE_MXB_FROM_RELATIVE_RELATIVE_YEB,selectItem:fromJS(selectRelativeItem)})

    fetchApi('getRelativeCard', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        categoryUuid: isTop ? itemList[0] : '',
        cardCategoryUuid: isTop ? '' : itemList[0],
        currentPage: 1,
        pageSize: '',
        needPeriod: issuedate ? '' : 'true',
    }), json => {
        if (showMessage(json)) {

            if (json.data.cardList.length) { // 有卡片
                thirdParty.toast.hide()
                let cardListArr = [{name: '全部',uuid: ''}]
				json.data.cardList && json.data.cardList.map(item => {
					cardListArr.push({
                        name: `${item.code} ${item.name}`,
						uuid: item.uuid
					})
				})
                dispatch(changeRelativeDetailCommonString('views','cardList',fromJS(cardListArr)))


            } else {
                thirdParty.toast.hide()

                // dispatch({
                //     type: ActionTypes.GET_RELATIVE_BALANCE_LIST,
                //     receivedData: json.data,
                //     reportData: '',
                //     issuedate,
                //     endissuedate,
                //     needPeriod: '',
                //     cardName: '暂无卡片',
                //     cardUuid: '',
                // })
            }
        } else {
            thirdParty.toast.hide()
        }
    })
}
// 切换卡片
export const getRelativeMxbBalanceListFromCardItem = (result) => (dispatch,getState) => {
    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.getIn(['views','issuedate'])
    const endissuedate = relativeMxbState.getIn(['views','endissuedate'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])
    const selectDirction = chooseDirection === 'double_debit' || chooseDirection === 'double_credit' ? chooseDirection : 'double_credit'

    const categoryOrTypeUuid = relativeMxbState.getIn(['views', 'categoryOrTypeUuid'])
    const runningCategoryName = relativeMxbState.getIn(['views', 'runningCategoryName'])
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])
    let newCategoryOrTypeUuid = categoryOrTypeUuid
    let newRunningCategoryName = runningCategoryName
    let newChooseDirection = chooseDirection
    let hasRunningItem = false

    fetchApi('getRelativejrType', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        cardUuid: result.uuid,
        categoryUuid: currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : '',
        cardCategoryUuid: currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid'),
    }), jsonRunningCategory => {
        if (showMessage(jsonRunningCategory)) {
            const loop = (data) => data && data.map(item => {
                if(item.jrCategoryUuid === categoryOrTypeUuid){
                    hasRunningItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonRunningCategory.data.categoryList)
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE,
                receivedData: jsonRunningCategory.data,
                newRunningItem: {
                    categoryOrTypeUuid: newCategoryOrTypeUuid,
                    runningCategoryName: newRunningCategoryName,
                    chooseDirection: newChooseDirection
                }
            })
            fetchApi('getRelativeDetail', 'POST', JSON.stringify({
                begin: issuedate,
                end: endissuedate,
                currentPage: 1,
                pageSize: Limit.REPORT_LIMIE_LENGTH,
                direction: newChooseDirection,
                jrAbstract: '',
                cardUuid: result.uuid,
                selectType: 'category',
                jrTypeUuid: '',
                jrCategoryUuid: newCategoryOrTypeUuid,
                categoryUuid: currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : '',
                cardCategoryUuid: currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid'),
            }), reportList => {
                thirdParty.toast.hide()
                if (showMessage(reportList)) {
                    dispatch({
                        type: ActionTypes.GET_RELATIVE_BALANCE_LIST_FROM_CARD,
                        reportData: reportList.data,
                        issuedate,
                        endissuedate,
                        needPeriod: '',
                        cardName: result.name,
                        cardUuid: result.uuid,
                        chooseDirection: newChooseDirection,
                    })
                    // 初始化类别、类型值
                    dispatch({type: ActionTypes.CHANGE_CHOOSE_CONTACTS_CATEGORY,})
                }
            })

        }
    })
}
// 切换 类别 或 类型
export const getRelativeMxbBalanceListFromCategoryOrType = (selectType,uuid,direction='double_credit') => (dispatch, getState) => {

    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.getIn(['views','issuedate'])
    const endissuedate = relativeMxbState.getIn(['views','endissuedate'])
    const cardUuid = relativeMxbState.getIn(['views','cardUuid'])
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])

    const jrTypeUuid = selectType === 'type' ? uuid : ''
    const jrCategoryUuid = selectType === 'category' ? uuid : ''

    const begin = issuedate
    const end = endissuedate

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRelativeDetail', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.REPORT_LIMIE_LENGTH,
        direction,
        jrAbstract: '',
        cardUuid: cardUuid,
        selectType,
        jrTypeUuid,
        jrCategoryUuid,
        categoryUuid: currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : '',
        cardCategoryUuid: currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid'),
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_LIST_FROM_CATEGORY_OR_TYPE,
                receivedData: json.data,
                selectType,
                direction,
            })
            // dispatch({type: ActionTypes.INIT_CATEGORY_AND_TYPE})
        }
    })
}
// 滑动分页
export const getRelativeMxbListFromPage = (currentPage=1,shouldConcat, isScroll,_self) => (dispatch, getState) => {
     !isScroll && thirdParty.toast.loading('加载中...', 0)
    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.getIn(['views','issuedate'])
    const endissuedate = relativeMxbState.getIn(['views','endissuedate'])

    const selectTypeValue = relativeMxbState.getIn(['views', 'selectTypeValue'])
    const cardUuid = relativeMxbState.getIn(['views', 'cardUuid'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])

    const categoryOrTypeUuid = relativeMxbState.getIn(['views','categoryOrTypeUuid'])
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])

    fetchApi('getRelativeDetail', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        currentPage,
        pageSize: Limit.REPORT_LIMIE_LENGTH,
        direction: chooseDirection,
        jrAbstract: '',
        cardUuid: cardUuid,
        selectType:selectTypeValue,
        jrTypeUuid: selectTypeValue === 'type' ? categoryOrTypeUuid : '',
        jrCategoryUuid: selectTypeValue === 'type' ? '' : categoryOrTypeUuid,
        categoryUuid: currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : '',
        cardCategoryUuid: currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid'),
    }), json => {
        !isScroll && thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_LIST_FROM_PAGE,
                receivedData: json.data,
                currentPage,
                shouldConcat
            })
        }
    })
}
export const initCategoryAndType = () => dispatch => {dispatch({type: ActionTypes.INIT_CATEGORY_AND_TYPE})}


// 获取某卡片下的流水类别和类型
export const getRelativeMxbCategoryAndType = (issuedate, endissuedate, cardUuid) => (dispatch,getState) => {
    const relativeMxbState = getState().relativeMxbState
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])
    fetchApi('getRelativejrType', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        cardUuid,
        categoryUuid: currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : '',
        cardCategoryUuid: currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid'),
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE,
                receivedData: json.data
            })
        }
    })
}

// 获取往来类别
export const getRelativeMxbCategory = (issuedate, endissuedate) => dispatch => {
    fetchApi('getRelativeCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY,
                receivedData: json.data.cardCategory
            })
        }
    })
}


export const changeRelativeDetailCommonString = (parent, position, value) => (dispatch) => {
    dispatch({type: ActionTypes.CHANGE_RELATIVE_DETAIL_COMMON_STRING, parent, position, value})
}

export const changeRelativeMxbReportDirection = (direction,changeData = true) => ({
    type: ActionTypes.CHANGE_RELATIVE_MXB_REPORT_DIRECTION,
    direction,
    changeData
})

export const changeRelativeMxbChooseValue = (value) => ({
      type: ActionTypes.CHANGE_RELATIVE_MXB_CHOOSE_VALUE,
      value,
})
