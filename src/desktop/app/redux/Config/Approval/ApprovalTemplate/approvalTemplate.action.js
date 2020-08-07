import * as ActionTypes from '../ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS } from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common.js'
import { receiptList } from 'app/containers/Config/Approval/components/common.js'

import { approvalActions } from 'app/redux/Config/Approval/index.js'

// 通用的简单的修改设置的方法
export const changeApprovalBaseSettingCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_BASE_SETTING_COMMON_STRING,
    place,
    value
})

export const changeApprovalFormOptionString = (arr, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_FORM_OPTION_STRING,
    arr,
    value
})

// 切换类别
export const changeApprovalBaseSettingJrCategory = (modelCode, categoryUuid, categoryType, categoryName, childList) => (dispatch, getState) => {

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('getApprovalCategoryList', 'GET', `uuid=${categoryUuid}`, json => {
        if (showMessage(json)) {

            let baseSetting = getState().approvalTemplateState.getIn(['approvalTemp', 'baseSetting']).toJS()
            let suiteMap = getState().approvalTemplateState.getIn(['approvalTemp', 'suiteMap']).toJS()
            let modelComponentList = getState().approvalTemplateState.getIn(['approvalTemp', 'modelComponentList'])
            const componentList = getState().approvalTemplateState.getIn(['approvalTemp', 'formSetting', 'componentList'])
            const categoryData = json.data
            const { categoryTypeObj } = getCategorynameByType(categoryType)
            
            baseSetting.jrCategoryType = categoryType
            baseSetting.jrCategoryId = categoryUuid
            baseSetting.jrCategoryName = categoryName

            dispatch(approvalChangeMxExtraInfo(true))
            // 删除可能有的内部核算的组件
            dispatch(deleteApprovalFormComponentFromType(Limit.CK_IN_COMPONENT_TYPE))
            dispatch(deleteApprovalFormComponentFromType(Limit.CK_OUT_COMPONENT_TYPE))
            // dispatch(deleteApprovalFormComponentFromType(Limit.DATE_COMPONENT_TYPE))

            // 预置 项目
            if (categoryData.beProject) { // 项目
                const projectRange = categoryData.projectRange
                dispatch(getApprovalProjectCardList(projectRange))
                baseSetting.projectScope = []
                baseSetting.outProjectScope = []
                // 重制上一次可能有的组件状态
                // dispatch(changeApprovalFormOptionStringFromType(Limit.XM_COMPONENT_TYPE, 'selectValueList', fromJS(['', '', ''])))

                if (categoryData.propertyCarryover === 'SX_HW') {
                    if (baseSetting.project == 'IN_DETAIL') { // 存货的往来单位只能在不启用或在模版中选择
                        baseSetting.project = 'NO'
                    }
                }
            } else {
                baseSetting.project = 'NO'
                baseSetting.projectScope = []
                baseSetting.outProjectScope = []
                // 重制上一次可能有的组件状态
                dispatch(deleteApprovalFormComponentFromType(Limit.XM_COMPONENT_TYPE))
            }

            // 预置 往来单位
            if (categoryData[categoryTypeObj].contactsManagement) { // 往来单位
                const contactsRange = categoryData[categoryTypeObj].contactsRange
                dispatch(getApprovalRelativeCardList(contactsRange))
                baseSetting.contactScope = []
                baseSetting.outContactScope = []
                // 重制上一次可能有的组件状态
                // dispatch(changeApprovalFormOptionStringFromType(Limit.WLDW_COMPONENT_TYPE, 'selectValueList', fromJS(['', '', ''])))

                if (categoryData.propertyCarryover === 'SX_HW') {
                    if (baseSetting.contact == 'IN_DETAIL') {  // 存货的往来单位只能在不启用或在模版中选择
                        baseSetting.contact = 'NO'
                    }
                }
                
            } else {
                baseSetting.contact = 'NO'
                baseSetting.contactScope = []
                baseSetting.outContactScope = []
                // 重制上一次可能有的组件状态
                dispatch(deleteApprovalFormComponentFromType(Limit.WLDW_COMPONENT_TYPE))
            }

            const propertyCostList = categoryData.propertyCostList
            // 费用性质处理
            if (propertyCostList.length > 0) {
                if (propertyCostList.length === 1) {
                    if (propertyCostList[0] === 'XZ_MANAGE') {
                        baseSetting.nature = "GLFY"
                        baseSetting.natureScope = []
                    } else if (propertyCostList[0] === 'XZ_SALE') {
                        baseSetting.nature = "XSFY"
                        baseSetting.natureScope = []
                    } else if (propertyCostList[0] === 'XZ_FINANCE') {
                        baseSetting.nature = "CWFY"
                        baseSetting.natureScope = []
                    }
                    // 清空上一次可能有的组件
                    dispatch(deleteApprovalFormComponentFromType(Limit.FYXZ_COMPONENT_TYPE))
                } else if (propertyCostList.length === 2) {
                    if (baseSetting.nature === "CWFY" || baseSetting.nature === '') {
                        baseSetting.nature = "XSFY"
                    }
                }
            } else {
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.FYXZ_COMPONENT_TYPE))
                baseSetting.nature = ''
                baseSetting.natureScope = []
            }
            
            // 收支类别处理
            if (receiptList.indexOf(categoryType) > -1) { // 收入类
            } else { // 支出类
                dispatch(deleteApprovalFormComponentFromType(Limit.ZH_COMPONENT_TYPE))
                baseSetting.jrAccount = 'NO'
                baseSetting.jrAccountRequired = false
                baseSetting.jrAccountScope = []
            }

            // 流水类别末端与非末端
            if (childList.length > 0) {
                if (categoryData.propertyCarryover === 'SX_HW') { // 带存货的只能在模版中选择
                    if (baseSetting.jrCategory !== 'IN_MODEL') {
                        baseSetting.jrCategory = 'IN_MODEL'
                        baseSetting.jrCategoryScope = childList

                        let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.LSLB_COMPONENT_TYPE)
                        if (component) {  
                            component = component.toJS()
                            // component.selectValueList = jrCategoryScope.toJS()
                            dispatch(addApprovalFormComponent(component))
                        }
                    }
                    // dispatch(changeApprovalFormOptionStringFromType(Limit.LSLB_COMPONENT_TYPE, 'selectValueList', fromJS(childList)))
                } else {
                    if (baseSetting.jrCategory === 'NO') {
                        baseSetting.jrCategory = 'IN_DETAIL'
                        baseSetting.jrCategoryScope = childList
                    } else if (baseSetting.jrCategory === 'IN_DETAIL') {
                        baseSetting.jrCategoryScope = childList
                    } else if (baseSetting.jrCategory === 'IN_MODEL') {
                        baseSetting.jrCategoryScope = childList
                        // dispatch(changeApprovalFormOptionStringFromType(Limit.LSLB_COMPONENT_TYPE, 'selectValueList', fromJS(childList)))
                    }
                }
            } else if (childList.length === 0) {
                baseSetting.jrCategory = 'NO'
                baseSetting.jrCategoryScope = []
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.LSLB_COMPONENT_TYPE))
            }

            // 存货
            if (categoryData.propertyCarryover === 'SX_HW') {

                const stockRange = categoryData[categoryTypeObj].stockRange
                dispatch(getApprovalStockCardList(stockRange))

                baseSetting.detailScope = categoryType === 'LB_YYSR' ? suiteMap.XS_HW : suiteMap.CG_HW
                // 原来的流水类别不是货物， 且没选 incomeExpensesProperty 为 货物      
                if ((baseSetting.jrCategoryProperty !== 'SX_HW' && baseSetting.incomeExpensesProperty !== 'SX_HW') || (baseSetting.jrCategoryProperty == 'SX_HW' && baseSetting.incomeExpensesProperty !== 'SX_HW')) { // 前一个状态不是带存货的类别

                    if (!judgeApprovalComponentFromTypeExist(Limit.DATE_COMPONENT_TYPE, componentList)) {
                        let componentDate = modelComponentList.find(v => v.get('jrComponentType') === Limit.DATE_COMPONENT_TYPE)
                        if (componentDate) {
                            componentDate = componentDate.toJS()
                            dispatch(addApprovalFormComponent(componentDate))
                        }
                    }

                    baseSetting.jrCategoryProperty = 'SX_HW'
                    baseSetting.incomeExpensesProperty = 'SX_HW'
                    // baseSetting.detailScope = categoryType === 'LB_YYSR' ? suiteMap.XS_HW : suiteMap.CG_HW
                    dispatch(approvalChangeMxExtraInfo(false))
                    if (baseSetting.digest === 'IN_DETAIL') { // 存货摘要只能在不启用或在模版中选择
                        baseSetting.digest = 'NO'
                        baseSetting.digestRequired = false
                    }

                    baseSetting.stock = 'IN_DETAIL' // 加存货范围组件

                    const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
                    if (enableWarehouse) {
                        baseSetting.depot = 'IN_DETAIL'
                    }
                } else {
                    baseSetting.depotScope = []
                    baseSetting.stockScope = []
                }

            } else {

                if (categoryData.propertyCarryover === 'SX_HW_FW') {
                    baseSetting.incomeExpensesProperty = 'SX_FW'
                } else {
                    if (categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC') {
                        baseSetting.incomeExpensesProperty = 'SX_FW'
                    } else {
                        if (categoryType === 'LB_FYZC') {
                            baseSetting.incomeExpensesProperty = 'SX_FS'
                        } else {
                            baseSetting.incomeExpensesProperty = ''
                        }
                    }
                }
                
                baseSetting.jrCategoryProperty = categoryData.propertyCarryover ? categoryData.propertyCarryover : ''
                baseSetting.detailScope = []
                baseSetting.stockScope = []
                baseSetting.outStockScope = []
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.DATE_COMPONENT_TYPE))
                
                baseSetting.depot = 'NO'
                baseSetting.stock = 'NO'
                dispatch(deleteApprovalFormComponentFromType(Limit.CK_COMPONENT_TYPE))
            }

            if (categoryType === 'LB_ZSKX') {
                baseSetting.detailScope = suiteMap.ZS_KX
            }

            if (categoryType === 'LB_ZFKX') {
                baseSetting.detailScope = suiteMap.ZF_KX
            }

            dispatch({
                type: ActionTypes.CHANGE_APPROVAL_BASE_SETTING_JR_CATEGORY,
                receivedData: categoryData,
                baseSetting: baseSetting,
            })

            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

        } else {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        }
    })
}

export const changeApprovalBaseSettingHideCategory = (modelCode, categoryUuid, categoryType, categoryName, childList) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('getApprovalCategoryList', 'GET', `uuid=${categoryUuid}`, json => {
        if (showMessage(json)) {


            let baseSetting = getState().approvalTemplateState.getIn(['approvalTemp', 'baseSetting']).toJS()
            let suiteMap = getState().approvalTemplateState.getIn(['approvalTemp', 'suiteMap']).toJS()
            let modelComponentList = getState().approvalTemplateState.getIn(['approvalTemp', 'modelComponentList'])
            const componentList = getState().approvalTemplateState.getIn(['approvalTemp', 'formSetting', 'componentList'])
            const categoryData = json.data
            // const { categoryTypeObj } = getCategorynameByType(categoryType)
            
            baseSetting.jrCategoryType = categoryType
            baseSetting.jrCategoryId = categoryUuid
            baseSetting.jrCategoryName = categoryName
            baseSetting.jrCategoryProperty = ''
            baseSetting.incomeExpensesProperty = ''

            dispatch(approvalChangeMxExtraInfo(true))

            if (categoryType === 'LB_ZZ' || categoryType === 'LB_CHDB') {

                 // 预置 项目
                baseSetting.project = 'NO'
                baseSetting.projectScope = []
                baseSetting.outProjectScope = []
                // 重制上一次可能有的组件状态
                dispatch(deleteApprovalFormComponentFromType(Limit.XM_COMPONENT_TYPE))

                // 预置 往来单位
                baseSetting.contact = 'NO'
                baseSetting.contactScope = []
                baseSetting.outContactScope = []
                // 重制上一次可能有的组件状态
                dispatch(deleteApprovalFormComponentFromType(Limit.WLDW_COMPONENT_TYPE))

                // 费用性质处理
                baseSetting.nature = ''
                baseSetting.natureScope = []
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.FYXZ_COMPONENT_TYPE))

                // 删掉有的帐户
                dispatch(deleteApprovalFormComponentFromType(Limit.ZH_COMPONENT_TYPE))
                baseSetting.jrAccount = 'NO'
                baseSetting.jrAccountRequired = false
                baseSetting.jrAccountScope = []

                // 清空可能有的类别
                baseSetting.jrCategory = 'NO'
                baseSetting.jrCategoryScope = []
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.LSLB_COMPONENT_TYPE))

            }

            if (categoryType === 'LB_ZZ') {

                // 设置明细类型
                baseSetting.detailScope = suiteMap.NB_ZZ
                
                // 清空
                baseSetting.stock = 'NO'
                baseSetting.stockScope = []
                baseSetting.outStockScope = []
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.DATE_COMPONENT_TYPE))
                
                baseSetting.depot = 'NO'
                // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.CK_COMPONENT_TYPE))
            } 
            
            if (categoryType === 'LB_CHDB') {

                // 设置明细类型
                baseSetting.detailScope = suiteMap.CH_DB
                // 获取仓库存货列表
                dispatch(getApprovalHideCategoryStockCardList({temp:'StockTemp'}))

                dispatch(approvalChangeMxExtraInfo(false))
                // 存货摘要只能在不启用或在模版中选择
                if (baseSetting.digest === 'IN_DETAIL') {
                    baseSetting.digest = 'NO'
                    baseSetting.digestRequired = false
                }

                 // 清空
                 baseSetting.stock = ''
                 baseSetting.stockScope = []
                 baseSetting.outStockScope = []
                 // 清空上一次可能有的组件
                //  dispatch(deleteApprovalFormComponentFromType(Limit.DATE_COMPONENT_TYPE))
                 
                baseSetting.depot = ''
                 // 清空上一次可能有的组件
                dispatch(deleteApprovalFormComponentFromType(Limit.CK_COMPONENT_TYPE))
                 
                if (!judgeApprovalComponentFromTypeExist(Limit.DATE_COMPONENT_TYPE, componentList)) {
                    let componentDate = modelComponentList.find(v => v.get('jrComponentType') === Limit.DATE_COMPONENT_TYPE)
                    if (componentDate) {
                        componentDate = componentDate.toJS()
                        dispatch(addApprovalFormComponent(componentDate))
                    }
                }
                if (!judgeApprovalComponentFromTypeExist(Limit.CK_OUT_COMPONENT_TYPE, componentList)) {
                    let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.CK_OUT_COMPONENT_TYPE)
                    if (component) {  
                        component = component.toJS()
                        dispatch(addApprovalFormComponent(component))
                    }
                }
                if (!judgeApprovalComponentFromTypeExist(Limit.CK_IN_COMPONENT_TYPE, componentList)) {
                    let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.CK_IN_COMPONENT_TYPE)
                    if (component) {  
                        component = component.toJS()
                        dispatch(addApprovalFormComponent(component))
                    }
                }
            } else {
                dispatch(deleteApprovalFormComponentFromType(Limit.CK_IN_COMPONENT_TYPE))
                dispatch(deleteApprovalFormComponentFromType(Limit.CK_OUT_COMPONENT_TYPE))
                dispatch(deleteApprovalFormComponentFromType(Limit.DATE_COMPONENT_TYPE))
            }
 
           


            // 存货
            // if (categoryData.propertyCarryover === 'SX_HW') {

            //     const stockRange = categoryData[categoryTypeObj].stockRange
            //     dispatch(getApprovalStockCardList(stockRange))
                
            //     if (baseSetting.jrCategoryProperty !== 'SX_HW' && baseSetting.incomeExpensesProperty !== 'SX_HW') { // 前一个状态不是带存货的类别
            //         let componentDate = modelComponentList.find(v => v.get('jrComponentType') === Limit.DATE_COMPONENT_TYPE)
            //         if (componentDate) {
            //             componentDate = componentDate.toJS()
            //             dispatch(addApprovalFormComponent(componentDate))
            //         }

            //         baseSetting.jrCategoryProperty = 'SX_HW'
            //         baseSetting.incomeExpensesProperty = 'SX_HW'
            //         baseSetting.detailScope = categoryType === 'LB_YYSR' ? suiteMap.XS_HW : suiteMap.CG_HW
                    // if (baseSetting.digest === 'IN_DETAIL') { // 存货摘要只能在不启用或在模版中选择
                    //     baseSetting.digest = 'NO'
                    //     baseSetting.digestRequired = false
                    // }

            //         baseSetting.stock = 'IN_DETAIL' // 加存货范围组件

            //         const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
            //         if (enableWarehouse) {
            //             baseSetting.depot = 'IN_DETAIL'
            //         }
            //     } else {
            //         baseSetting.depotScope = []
            //         baseSetting.stockScope = []
            //     }

            // } else {
            //     if (categoryData.propertyCarryover === 'SX_HW_FW' || (categoryData.propertyCarryover === '' && (categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC'))) {
            //         baseSetting.incomeExpensesProperty = 'SX_FW'
            //     } else {
            //         if (categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC') {
            //             baseSetting.incomeExpensesProperty = 'SX_FW'
            //         } else {
            //             baseSetting.incomeExpensesProperty = ''
            //         }
            //     }
            
            dispatch({
                type: ActionTypes.CHANGE_APPROVAL_BASE_SETTING_JR_CATEGORY,
                receivedData: categoryData,
                baseSetting: baseSetting,
            })

            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        } else {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        }
    })
}

export const switchApprovalBaseSettingCategoryProperty = (propertyVal) => (dispatch, getState) =>  {

    let baseSetting = getState().approvalTemplateState.getIn(['approvalTemp', 'baseSetting']).toJS()
    let suiteMap = getState().approvalTemplateState.getIn(['approvalTemp', 'suiteMap']).toJS()
    let modelComponentList = getState().approvalTemplateState.getIn(['approvalTemp', 'modelComponentList'])
    const categoryData = getState().approvalTemplateState.get('categoryData').toJS()

    const categoryType = baseSetting.jrCategoryType

    const { categoryTypeObj } = getCategorynameByType(categoryType)
    
    // 预置 项目
    if (categoryData.beProject && propertyVal === 'SX_HW') { // 项目
        baseSetting.project = 'NO'
        baseSetting.projectScope = []
        baseSetting.outProjectScope = []
        // 重制上一次可能有的组件状态
        dispatch(deleteApprovalFormComponentFromType(Limit.XM_COMPONENT_TYPE))
    }

    // 预置 往来单位
    if (categoryData[categoryTypeObj].contactsManagement && propertyVal === 'SX_HW') { // 往来单位
        if (baseSetting.contact == 'IN_DETAIL') {  // 存货的往来单位只能在不启用或在模版中选择
            baseSetting.contact = 'IN_MODEL'
            let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.WLDW_COMPONENT_TYPE)
            if (component) {  
                component = component.toJS()
                dispatch(addApprovalFormComponent(component))
            }
        }
    }

    if (baseSetting.jrAccount == 'IN_DETAIL' && propertyVal === 'SX_HW') {
        baseSetting.jrAccount = 'IN_MODEL'

        let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.ZH_COMPONENT_TYPE)
        if (component) {  
            component = component.toJS()
            dispatch(addApprovalFormComponent(component))
        }
    }
  

    // 流水类别末端与非末端

        if (baseSetting.jrCategory == 'IN_DETAIL' && propertyVal === 'SX_HW') { // 带存货的只能在模版中选择
      
            baseSetting.jrCategory = 'IN_MODEL'

            let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.LSLB_COMPONENT_TYPE)
            if (component) {  
                component = component.toJS()
                dispatch(addApprovalFormComponent(component))
            }
        }

    // 存货
    if (propertyVal === 'SX_HW') {

        const stockRange = categoryData[categoryTypeObj].stockRange
        dispatch(getApprovalStockCardList(stockRange))
        
            let componentDate = modelComponentList.find(v => v.get('jrComponentType') === Limit.DATE_COMPONENT_TYPE)
            if (componentDate) {
                componentDate = componentDate.toJS()
                dispatch(addApprovalFormComponent(componentDate))
            }

            // baseSetting.propertyVal = 'SX_HW'
            baseSetting.incomeExpensesProperty = 'SX_HW'
            baseSetting.detailScope = categoryType === 'LB_YYSR' ? suiteMap.XS_HW : suiteMap.CG_HW
            dispatch(approvalChangeMxExtraInfo(false))
            if (baseSetting.digest === 'IN_DETAIL') { // 存货摘要只能在不启用或在模版中选择
                baseSetting.digest = 'IN_MODEL'
                let componentDate = modelComponentList.find(v => v.get('jrComponentType') === Limit.ZY_COMPONENT_TYPE)
                if (componentDate) {
                    componentDate = componentDate.toJS()
                    dispatch(addApprovalFormComponent(componentDate))
                }
            }

            baseSetting.stock = 'IN_DETAIL' // 加存货范围组件

            const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
            if (enableWarehouse) {
                baseSetting.depot = 'IN_DETAIL'
            }

    } else {

        baseSetting.incomeExpensesProperty = propertyVal
        if (propertyVal === 'SX_DJ') {
            // 有 SX_DJ 的是营业收入，营业支出，费用支出 
            baseSetting.detailScope = categoryType === 'LB_YYSR' ? suiteMap.YS_ZK : suiteMap.YF_ZK

            // 费用支出如果有 费用性质 要删除组件
            if (categoryType === 'LB_FYZC') {
                dispatch(deleteApprovalFormComponentFromType(Limit.FYXZ_COMPONENT_TYPE))
                baseSetting.nature = ''
                baseSetting.natureScope = []
            }
        } else {
            baseSetting.detailScope = []

            if (propertyVal === 'SX_FS') {
                const propertyCostList = categoryData.propertyCostList
                // 费用性质处理
                if (propertyCostList.length > 0) {
                    if (propertyCostList.length === 1) {
                        if (propertyCostList[0] === 'XZ_MANAGE') {
                            baseSetting.nature = "GLFY"
                            baseSetting.natureScope = []
                        } else if (propertyCostList[0] === 'XZ_SALE') {
                            baseSetting.nature = "XSFY"
                            baseSetting.natureScope = []
                        } else if (propertyCostList[0] === 'XZ_FINANCE') {
                            baseSetting.nature = "CWFY"
                            baseSetting.natureScope = []
                        }
                    } else if (propertyCostList.length === 2) {
                        if (baseSetting.nature === "CWFY" || baseSetting.nature === '') {
                            baseSetting.nature = "XSFY"
                        }
                    }
                }
            }
        }
        
        baseSetting.stockScope = []
        baseSetting.outStockScope = []
        // 清空上一次可能有的组件
        dispatch(deleteApprovalFormComponentFromType(Limit.DATE_COMPONENT_TYPE))
        
        baseSetting.depot = 'NO'
        baseSetting.stock = 'NO'
        dispatch(deleteApprovalFormComponentFromType(Limit.CK_COMPONENT_TYPE))
    }

    dispatch({
        type: ActionTypes.CHANGE_APPROVAL_BASE_SETTING_JR_CATEGORY,
        receivedData: categoryData,
        baseSetting: baseSetting,
    })
 }

export const addApprovalFormComponent = (component) => ({
    type: ActionTypes.ADD_APPROVAL_FORM_COMPONENT,
    component
})

export const deleteApprovalFormComponent = (index) => ({
    type: ActionTypes.DELETE_APPROVAL_FORM_COMPONENT,
    index
})

export const deleteApprovalFormComponentFromType = (jrComponentType) => (dispatch, getState) => {
    const componentList = getState().approvalTemplateState.getIn(['approvalTemp', 'formSetting', 'componentList'])
    const index = componentList.findIndex(v => v.get('jrComponentType') === jrComponentType)
    if (index > -1) {
        dispatch(deleteApprovalFormComponent(index))
    } else {
        // message.info('找不到对应组件')
        return false
    }
}

const judgeApprovalComponentFromTypeExist = (jrComponentType, componentList) => {
    const index = componentList.findIndex(v => v.get('jrComponentType') === jrComponentType)
    if (index > -1) {
        return true
    } else {
        // message.info('找不到对应组件')
        return false
    }
}

export const adjustPositionApprovalFormComponent = (fromPost, toPost) => ({
    type: ActionTypes.ADJUST_POSITION_APPROVAL_FORM_COMPONENT,
    fromPost,
    toPost
})

export const changeApprovalFormOptionStringFromType = (jrComponentType, place, value) => (dispatch, getState) => {
    const componentList = getState().approvalTemplateState.getIn(['approvalTemp', 'formSetting', 'componentList'])
    const index = componentList.findIndex(v => v.get('jrComponentType') === jrComponentType)

    if (index > -1) {
        dispatch(changeApprovalFormOptionString(['approvalTemp', 'formSetting', 'componentList', index, place], value))
    } else {
        // message.info('找不到对应组件')
        return false
    }
}

export const approvalChangeMxExtraInfo = (value) => (dispatch, getState) => {
    let formComponentList = getState().approvalTemplateState.getIn(['approvalTemp', 'formSetting', 'componentList'])
    const index = formComponentList.findIndex(v => v.get('componentType') === 'TableField')
    if (index > -1) {
        dispatch(changeApprovalFormOptionString(['approvalTemp', 'formSetting', 'componentList', index, 'extraInfo'], value))
    }
}


export const checkComponentList = (componentList, checkoutList, approvalTemp) => {
    componentList.map((v, i) => {
        if (!v.get('label')) {
            checkoutList.push(`表单设置的第${i + 1}个组件标题必填`)
        } else if (v.get('label').length > 20) {
            checkoutList.push(`表单设置的第${i + 1}个组件标题最长20个字符`)
        }

        if (v.get('placeHolder') && v.get('placeHolder').length > 50) {
            checkoutList.push(`表单设置的第${i + 1}个组件提示文字最长50个字符`)
        }

        if (v.get('selectValueList')) {
            if (v.get('selectValueList').every(w => !w) && !v.get('jrComponentType')) {
                checkoutList.push(`表单设置的第${i + 1}个组件选项至少有一个可选项`)
            }
            // else if (v.get('selectValueList').some(w => w.length > 50)) {
            //     checkoutList.push(`表单设置的第${i + 1}个组件选项长度不能超过50个字符`)
            // } 
            else {
                approvalTemp = approvalTemp.updateIn(['formSetting', 'componentList', i, 'selectValueList'], w => w.filter(u => u))
            }
        }
        if (v.get('componentType') === 'NumberField') {
            if (v.get('unit') && v.get('unit').length > 20) {
                checkoutList.push(`表单设置的第${i + 1}个组件单位不能超过20字`)
            }
        }

        if (v.get('componentType') === 'DDDateRangeField') {
            if (!v.get('dateRangeLabelFirst')) {
                checkoutList.push(`表单设置的第${i + 1}个组件标题1不能为空`)
            } else if (v.get('dateRangeLabelFirst').length > 20) {
                checkoutList.push(`表单设置的第${i + 1}个组件标题1不能超过20字`)
            }
            if (!v.get('dateRangeLabelLast')) {
                checkoutList.push(`表单设置的第${i + 1}个组件标题1不能为空`)
            } else if (v.get('dateRangeLabelLast').length > 20) {
                checkoutList.push(`表单设置的第${i + 1}个组件标题1不能超过20字`)
            }
        }
    })

    return { checkoutList, approvalTemp }
}

export const saveApprovalTemplate = (approvalTemp, insertOrModify, callBack) => (dispatch, getState) => {

    approvalTemp = approvalTemp.delete('detailList')

    let checkoutList = []
    const baseSetting = approvalTemp.get('baseSetting')
    const formSetting = approvalTemp.get('formSetting')
    const componentList = formSetting.get('componentList')

    if (!baseSetting.get('modelName')) {
        checkoutList.push('审批名称必填')
    // } else if (baseSetting.get('modelName').length > 50 && baseSetting.get('componentType') !== 'DDDateRangeField') {
    } else {
        let nameLength = 50
        if (insertOrModify === 'insert') { // 新增时 加上前缀 小番-
            approvalTemp = approvalTemp.setIn(['baseSetting' ,'modelName'], '小番-' + baseSetting.get('modelName'))
            nameLength = 47
        }
        if (baseSetting.get('modelName').length > nameLength && baseSetting.get('componentType') !== 'DDDateRangeField') {
            checkoutList.push('审批名称最长50个字符')
        }
    }
    if (!baseSetting.get('jrCategoryName')) {
        checkoutList.push('关联流水类别必填')
    }
    if (baseSetting.get('remark').length > 100) {
        checkoutList.push('备注最长100个字符')
    }
    if (!baseSetting.get('detailScope').size) {
        checkoutList.push('明细范围必填')
    }
    if (baseSetting.get('jrAccount') !== 'NO') {
        const jrAccountScope = baseSetting.get('jrAccountScope')
        if (!jrAccountScope.size) {
            checkoutList.push('收款账户范围必填')
        } else if (jrAccountScope.size > 200) {
            checkoutList.push('收款账户最多200个')
        }
    }
    if (baseSetting.get('jrCategoryType') === 'LB_ZZ') {
        const jrAccountScope = baseSetting.get('jrAccountScope')
        if (!jrAccountScope.size) {
            checkoutList.push('账户范围必填')
        } else if (jrAccountScope.size > 200) {
            checkoutList.push('账户最多200个')
        }
    }

    const jrCategoryProperty = baseSetting.get('jrCategoryProperty')// 'SX_HW'
    const incomeExpensesProperty = baseSetting.get('incomeExpensesProperty')// 'SX_HW'
    const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const contact = baseSetting.get('contact')
    const project = baseSetting.get('project')
    if (incomeExpensesProperty === 'SX_HW') {
        const stockScope = baseSetting.get('stockScope')
        if (!stockScope.size) {
            checkoutList.push('存货范围必填')
        } else if (stockScope.size > 200) {
            checkoutList.push('存货卡片最多200个')
        }
        if (enableWarehouse) {
            const depotScope = baseSetting.get('depotScope')
            if (!depotScope.size) {
                checkoutList.push('仓库范围必填')
            } else if (depotScope.size > 200) {
                checkoutList.push('仓库卡片最多200个')
            }
        }
    }
    if (contact !== 'NO') {
        const contactScope = baseSetting.get('contactScope')
        if (!contactScope.size) {
            checkoutList.push('往来范围必填')
        } else if (contactScope.size > 200) {
            checkoutList.push('往来卡片最多200个')
        }
    }
    if (project !== 'NO') {
        const projectScope = baseSetting.get('projectScope')
        if (!projectScope.size) {
            checkoutList.push('项目范围必填')
        } else if (projectScope.size > 200) {
            checkoutList.push('项目卡片最多200个')
        }
    }

    const newList = checkComponentList(componentList, checkoutList, approvalTemp)
    checkoutList = newList.checkoutList
    approvalTemp = newList.approvalTemp

    if (checkoutList.length) {
        return thirdParty.Alert(checkoutList.reduce((v, pre) => v + ',' + pre))
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    if (insertOrModify === 'insert') {
        fetchApi('createApprovalModel', 'POST', JSON.stringify(approvalTemp), json => {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
            if (showMessage(json)) {
                message.info(json.message)
                dispatch(approvalActions.getProcessSelectModel())
                callBack()
            }
        })
    } else if (insertOrModify === 'modify') {
        fetchApi('modifyApprovalModel', 'POST', JSON.stringify(approvalTemp), json => {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
            if (json.code === 830001) {
                dispatch(clearApprovalModel([baseSetting.get('modelCode')], callBack))
            } else if (showMessage(json)) {
                message.info(json.message)
                dispatch(approvalActions.getProcessSelectModel())
                callBack()
            }
        })
    }
}

export const deleteApprovalTemplate = (checkList, callBack) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    fetchApi('deleteApprovalModel', 'POST', JSON.stringify(checkList), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            message.info(json.message ? json.message : '成功')
            dispatch(approvalActions.getProcessSelectModel())
            callBack()
        }
    })
}

export const clearApprovalModel = (checkList, callBack) => dispatch => {

    thirdParty.Confirm({
        message: '钉钉管理员已在OA后台删除该模版、导致该模版无法更新，请删除后重新创建。',
        title: "提示",
        buttonLabels: ['取消', '删除'],
        onSuccess : (result) => {
            if (result.buttonIndex === 1) {
                dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
                fetchApi('clearApprovalModel', 'POST', JSON.stringify(checkList), json => {
                    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
                    if (showMessage(json)) {
                        message.info(json.message ? json.message : '成功')
                        dispatch(approvalActions.getProcessSelectModel())
                        callBack && callBack()
                    }
                })
            }
        },
        onFail : (err) => console.log(err)
    })
}

export const cancelModifyApprovalTemplate = () => ({
    type: ActionTypes.CANCEL_MODIFY_APPROVAL_TEMPLATE
})

// 新增或修改审批模版
export const beforInsertOrModifyApprovalTemplate = (insertOrModify, parameter, callBack) => dispatch => {
    if (insertOrModify === 'insert') {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        fetchApi('getApprovalModel', 'GET', `modelCode=${''}&jrType=${'LB_FYZC'}`, template => {
            if (showMessage(template)) {
                dispatch({
                    type: ActionTypes.BEFOR_INSERT_OR_MODIFY_APPROVAL_TEMPLATE,
                    templateData: template.data,
                    insertOrModify: 'insert'
                })
            }
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        })
        callBack()
    } else if (insertOrModify === 'modify') {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        fetchApi('getApprovalCategoryList', 'GET', `uuid=${parameter.jrCategoryUuid}`, json => {
            if (json.code === 0) {
                const { categoryTypeObj } = getCategorynameByType(json.data.categoryType)
                fetchApi('getApprovalModel', 'GET', `modelCode=${parameter.modelCode}&jrType=${parameter.jrCategoryType}`, template => {

                    const categoryData = json.data
                    
                    // 如有变动 选择类别 需要同步修改 （changeApprovalBaseSettingJrCategory）
                    // if (categoryData.canDelete === false && categoryData.propertyCostList.length === 0) { // 为顶级类别
                    //     if (categoryData.categoryType === 'LB_FYZC') { // 为 费用支出 这个顶级类别
                    //         categoryData.propertyCostList = ['GLFY', 'XSFY']
                    //     }
                        
                    //     if (categoryData.categoryType === 'LB_YYZC' || categoryData.categoryType === 'LB_FYZC') {
                    //         categoryData[categoryTypeObj].contactsManagement = true
                    //         categoryData[categoryTypeObj].contactsRange = categoryData[categoryTypeObj].allContactsRange.map(v => v.uuid)
                    //     }
                    //     categoryData.beProject = true
                    //     categoryData.projectRange = categoryData.allProjectRange.map(v => v.uuid)
                    // }

                    dispatch({
                        type: ActionTypes.BEFOR_INSERT_OR_MODIFY_APPROVAL_TEMPLATE,
                        receivedData: categoryData,
                        templateData: template.data,
                        insertOrModify: 'modify'
                    })
                    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
                    callBack()

                    if (categoryData.beProject) {
                        const projectRange = categoryData.projectRange
                        dispatch(getApprovalProjectCardList(projectRange))
                    }
                    if (categoryData[categoryTypeObj].contactsManagement) {
                        const contactsRange = categoryData[categoryTypeObj].contactsRange
                        dispatch(getApprovalRelativeCardList(contactsRange))
                    }
                    // 存货
                    if (categoryData.propertyCarryover === 'SX_HW' || template.data.baseSetting.incomeExpensesProperty === 'SX_HW') {
                        const stockRange = categoryData[categoryTypeObj].stockRange
                        dispatch(getApprovalStockCardList(stockRange, 'synchronize', template.data.baseSetting.depotScope))
                    }

                    if (categoryData.canUse === false) {
                        message.info("关联的流水类别已被停用")
                    }
                })
            } else if (json.code === 70001) {
                fetchApi('getApprovalModel', 'GET', `modelCode=${parameter.modelCode}&jrType=${parameter.jrCategoryType}`, template => {
                    if (showMessage(template)) {
                        
                        // 如有变动 查询审批的 调整 需要同步修改

                        template.data.baseSetting.jrCategoryType = ''
                        template.data.baseSetting.jrCategoryId = ''
                        template.data.baseSetting.jrCategoryName = ''

                        let categoryData = {
                            propertyCostList: [],
                            beProject: false,
                            allProjectRange: []
                        }
                        // categoryData[categoryTypeObj] = {
                        //     allContactsRange: [],
                        //     canManagement: false
                        // }

                        dispatch({
                            type: ActionTypes.BEFOR_INSERT_OR_MODIFY_APPROVAL_TEMPLATE,
                            receivedData: categoryData,
                            templateData: template.data,
                            insertOrModify: 'modify'
                        })

                        callBack()
                        thirdParty.Alert("原关联流水类别已被删除，请重新选择类别")
                    }
                    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
                })
            } else {
                showMessage(json)
                dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
            }
        })
    }
}

export const beforInsertOrModifyApprovalhideCategoryTemp = (insertOrModify, parameter, callBack) => dispatch => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('getApprovalCategoryList', 'GET', `uuid=${parameter.jrCategoryUuid}`, json => {
        if (json.code === 0) {
            fetchApi('getApprovalModel', 'GET', `modelCode=${parameter.modelCode}&jrType=${parameter.jrCategoryType}`, template => {
                const categoryData = json.data
                dispatch({
                    type: ActionTypes.BEFOR_INSERT_OR_MODIFY_APPROVAL_TEMPLATE,
                    receivedData: categoryData,
                    templateData: template.data,
                    insertOrModify: 'modify'
                })
                dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
                callBack()
            })
        } else {
            showMessage(json)
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        }
    })
}

export const getApprovalProjectCardList = (projectRange) => (dispatch, getState) => {
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    fetchApi('getProjectCardList', 'POST', JSON.stringify({
        sobId,
        categoryList: projectRange,
        needCommonCard: true,
        needAssist: true,
        needMake: true,
        needIndirect: true,
        needMechanical: true,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_PROJECT_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })
}

export const getApprovalRelativeCardList = (contactsRange) => (dispatch, getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    fetchApi('getContactsCategoryList', 'POST', JSON.stringify({
        sobId,
        categoryList: contactsRange,
        property: 'NEEDPAY'
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_CONTACT_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })
}

export const getApprovalStockCardList = (stockRange, synchronize, depotScope) => (dispatch, getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    fetchApi('getStockCategoryList', 'POST', JSON.stringify({
        sobId,
        categoryList: stockRange,
        property: '5'
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_STOCK_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })

    const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    if (enableWarehouse) {
        fetchApi(`warehouseCardTree`, 'POST', JSON.stringify({
            uuidList:[]
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.AFTER_GET_APPROVAL_WAREHOUSE_CARD_TREE,
                    receivedData: json.data.cardList
                })

                // 修改审批时，同步仓库数据，以防删除修改等操作
                if (synchronize === 'synchronize') { // 是否同步
                    
                    if (depotScope.length) {
                        let depotScopeMap = {}
                        const warehouseCardList = json.data.cardList

                        if (warehouseCardList.length && warehouseCardList[0].childList.length > 0) {
                            const selectList = warehouseCardList[0].childList

                            const loop = (data, parentName) => data.map(item => {
                                depotScopeMap[item.uuid] = {
                                    uuid: item.uuid,
                                    code: item.code,
                                    name: `${parentName ? `${parentName}_${item.name}` : item.name}`,
                                    top: false,
                                    type: 'CTGY',
                                }
                                const childList = item.childList
                                if (childList && childList.length) {
                                    loop(childList, parentName ? `${parentName}_${item.name}` : item.name)
                                }
                            })
                            loop(selectList) // 转化成平铺的json对象
                        }

                        let newDepotScope = []
                        depotScope.forEach(v => {
                            if (depotScopeMap[v.uuid]) {
                                newDepotScope.push(depotScopeMap[v.uuid])
                            }
                        })

                        dispatch(changeApprovalBaseSettingCommonString('depotScope', fromJS(newDepotScope)))
                    }
                }
            }
        })
    }
}

export const getApprovalHideCategoryStockCardList = (cardObj) => (dispatch, getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    fetchApi('getStockCategoryList', 'POST', JSON.stringify({
        sobId,
        isUniform: null,
        openQuantity: false,
        property: "0",
        categoryList: []
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_STOCK_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })

    fetchApi(`warehouseCardTree`, 'POST', JSON.stringify({
        uuidList:[]
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_WAREHOUSE_CARD_TREE,
                receivedData: json.data.cardList
            })
        }
    })
    // const {
    //     temp = 'StockTemp',
    //     isUniform = false,
    //     inventoryUuid = '',
    //     uniformUuid = '',
    //     oriDate = '',
    //     conditionType = '',
    //     canUse = true,
    //     cardFrom = '',
    //     selectIndex = 0,
    //     stockCardTemp = 'countStockCardList',
    // } = cardObj

    // fetchApi('getCanUseCardList', 'GET', `isUniform=${isUniform}&inventoryUuid=${inventoryUuid}&uniformUuid=${uniformUuid}&oriDate=${oriDate}&conditionType=${conditionType}&canUse=${canUse}`, json => {
    //         if (showMessage(json)) {

    //             dispatch({
    //                 type: ActionTypes.AFTER_GET_APPROVAL_WAREHOUSE_CARD_TREE,
    //                 receivedData: json.data.cardList
    //             })

                // // 修改审批时，同步仓库数据，以防删除修改等操作
                // if (synchronize === 'synchronize') { // 是否同步
                    
                //     if (depotScope.length) {
                //         let depotScopeMap = {}
                //         const warehouseCardList = json.data.cardList

                //         if (warehouseCardList.length && warehouseCardList[0].childList.length > 0) {
                //             const selectList = warehouseCardList[0].childList

                //             const loop = (data, parentName) => data.map(item => {
                //                 depotScopeMap[item.uuid] = {
                //                     uuid: item.uuid,
                //                     code: item.code,
                //                     name: `${parentName ? `${parentName}_${item.name}` : item.name}`,
                //                     top: false,
                //                     type: 'CTGY',
                //                 }
                //                 const childList = item.childList
                //                 if (childList && childList.length) {
                //                     loop(childList, parentName ? `${parentName}_${item.name}` : item.name)
                //                 }
                //             })
                //             loop(selectList) // 转化成平铺的json对象
                //         }

                //         let newDepotScope = []
                //         depotScope.forEach(v => {
                //             if (depotScopeMap[v.uuid]) {
                //                 newDepotScope.push(depotScopeMap[v.uuid])
                //             }
                //         })

                //         dispatch(changeApprovalBaseSettingCommonString('depotScope', fromJS(newDepotScope)))
                //     }
                // }
        //     }
        // })
}

export const changeApprovalModelState = (modelCode, state, index) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('changeApprovalModelState', 'POST', JSON.stringify({
        modelCode,
        state
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (json.code === 830001) {
            dispatch(clearApprovalModel([modelCode]))
        } else if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_APPROVAL_MODEL_STATE,
                index
            })
        }
    })
}

export const getApprovalModelSync = (modelCode) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('getapprovalmodelsync', 'POST', JSON.stringify({
        modelCode,
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (json.code === 830001) {
            dispatch(clearApprovalModel([modelCode]))
        } else if (showMessage(json, 'show')) {
        }
    })
}

export const getProjectAllCardList = (categoryList, page, leftNotNeed, callBack) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if(!leftNotNeed) {
        fetchApi('getProjectTreeList','POST', JSON.stringify({
            sobId,
            categoryList,
        }), json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCategoryList', fromJS(json.data.typeList)))
            }
        })
    }
    fetchApi('getProjectCardList','POST', JSON.stringify({
        sobId,
        categoryList,
        needCommonCard: true,
        needAssist: true,
        needMake: true,
        needIndirect: true,
        needMechanical: true,
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.result)))
            callBack && callBack()
        }
    })
}

export const getProjectSomeCardList = (uuid,level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (level == 1) {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            categoryUuid:uuid,
            listByCategory:true,
            subordinateUuid:'',
        }),json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            subordinateUuid:uuid,
            listByCategory:false,
            categoryUuid:uuid,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    }
}

// 获取往来的选择里的类别和
export const getRelativeAllCardList = (categoryList, modalName, leftNotNeed, callBack) => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if(!leftNotNeed) {
        fetchApi('getContactsCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCategoryList', fromJS(json.data.typeList)))
            }
        })
    }

    let property = 'NEEDPAY'
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getContactsCategoryList','POST', JSON.stringify({
        sobId,
        categoryList,
        property,
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.result)))
            callBack && callBack()
        }
    })
}

// 往来选择框里选择类别下的卡片
export const getRelativeSomeCardList = (uuid, level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    const property = 'NEEDPAY'

    if (level == 1) {
        fetchApi('getRunningContactsMemberList', 'POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            property,
            subordinateUuid:''
        }), json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getRunningContactsMemberList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            property,
            listByCategory: false,
            categoryUuid: ''
        }),json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    }
}

// 获取存货的选择里的类别和
export const getStockAllCardList = (categoryList, pageType, leftNotNeed, callBack) => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if(!leftNotNeed) {
        fetchApi('getStockCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCategoryList', fromJS(json.data.typeList)))
            }
        })
    }
    
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const para = pageType == 'hidecategory' ? {
        sobId,
        isUniform: null,
        openQuantity: false,
        property: "0",
        categoryList: []
    } : {
        sobId,
        categoryList,
        property: '5'
    }

    fetchApi('getStockCategoryList', 'POST', JSON.stringify(para),json => {
        if (showMessage(json)) {
            dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.result)))
            callBack && callBack()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
    
}

// 往来选择框里选择类别下的卡片
export const getStockSomeCardList = (uuid, level) =>  (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if (level == 1) {
        fetchApi('getRunningStockMemberList','POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            subordinateUuid: '',
            property: '5'
        }), json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getRunningStockMemberList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            listByCategory: false,
            categoryUuid: '',
            property: '5',
        }),json => {
            if (showMessage(json)) {
                dispatch(changeApprovalTempCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    }
}

export const changeApprovalTempCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_TEMP_COMMON_STRING,
    place,
    value
})