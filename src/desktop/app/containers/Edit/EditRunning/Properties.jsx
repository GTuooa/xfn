import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon, Tooltip } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import { getCategorynameByType, numberTest, reg, regNegative, propertyName, disablePropertyFunc, projectTip } from './common/common'
import { formatNum } from 'app/utils'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class Properties extends React.Component {

    render() {
        const {
            oriTemp,
            flags,
            dispatch,
            insertOrModify
        } = this.props
        const categoryType = oriTemp.get('categoryType')
        const {
			propertyShow,
            categoryTypeObj,
            direction,
            showInvoice,
            isShowAbout,
            specialState,
		} = getCategorynameByType(categoryType)
        const runningType = oriTemp.get('runningType')
        const beManagemented = oriTemp.getIn([categoryTypeObj, 'beManagemented'])
        const handleType = oriTemp.get('handleType')
        const beAccrued = oriTemp.getIn([categoryTypeObj, 'beAccrued'])
        const oriState = oriTemp.get('oriState')
        const pendingStrongList = oriTemp.get('pendingStrongList')
        const beCertificate = oriTemp.get('beCertificate')
        const propertyInvest = oriTemp.get('propertyInvest')
        const categoryUuid = oriTemp.get('categoryUuid')
        const propertyCostList = oriTemp.get('propertyCostList')
        const propertyCost = oriTemp.get('propertyCost')
        const propertyCostName = propertyName[propertyCost]
        const disableProperty =  disablePropertyFunc(propertyCost)
        return(
            <div>
            {/* 长期资产*/}
            {
                categoryType==='LB_CQZC'  && runningType !== 'LX_JZSY_SY' && runningType !== 'LX_JZSY_SS'?
                    <div className="edit-running-modal-list-item" >
                        <label>处理类型：</label>
                        <div>
                            <Select
                                disabled={insertOrModify === 'modify'}
                                value={handleType}
                                onChange={value => {
                                    const state = {
                                        JR_HANDLE_CZ:'STATE_CQZC_YS',
                                        JR_HANDLE_GJ:'STATE_CQZC_YF',
                                    }[value] || ''
                                    dispatch(editRunningActions.changeStateAndAbstract(oriTemp,state))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState',state))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','handleType',value))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','billList',fromJS([{}])))
                                    dispatch(editRunningActions.changeLrAccountCommonString('',['flags','dropManageFetchAllowed'],true))
                                }}
                                >
                                <Option key='a' value={'JR_HANDLE_GJ'}>购进资产</Option>
                                <Option key='b' value={'JR_HANDLE_CZ'}>处置</Option>
                            </Select>
                        </div>
                    </div>
                    :
                    null
            }

            {/* 借款*/}
            {
                categoryType==='LB_JK'?
                <div className="edit-running-modal-list-item" >
                    <label>处理类型：</label>
                        <div>
                            <Select
                                disabled={insertOrModify === 'modify'}
                                value={handleType}
                                onChange={value => {
                                    const state = {
                                        JR_HANDLE_CHLX:'STATE_JK_ZFLX',
                                        JR_HANDLE_CHBJ:'STATE_JK_YF',
                                        JR_HANDLE_QDJK:'STATE_JK_YS',
                                    }[value] || ''
                                    dispatch(editRunningActions.changeStateAndAbstract(oriTemp,state))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState',state))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','handleType',value))
                                    if (value === 'JR_HANDLE_CHLX') {
                                        dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Loan'))
                                    }
                                }}
                                >
                                <Option key='a' value={'JR_HANDLE_QDJK'}>取得借款</Option>
                                <Option key='b' value={'JR_HANDLE_CHLX'}>偿还利息</Option>
                                <Option key='c' value={'JR_HANDLE_CHBJ'}>偿还本金</Option>
                            </Select>
                        </div>
                </div>
                :
                null
            }

            {/* 投资*/}
            {
                categoryType==='LB_TZ'?
                    <div className="edit-running-modal-list-item" >
                        <label>处理类型：</label>
                        <div>
                            <Select
                                disabled={insertOrModify === 'modify'}
                                value={handleType}
                                onChange={value => {
                                    if (value === 'JR_HANDLE_DWTZ') {
                                        dispatch(editRunningActions.changeStateAndAbstract(oriTemp,'STATE_TZ_YF'))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState','STATE_TZ_YF'))
                                    } else if (value === 'JR_HANDLE_SHTZ') {
                                        dispatch(editRunningActions.changeStateAndAbstract(oriTemp,'STATE_TZ_YS'))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState','STATE_TZ_YS'))
                                    } else if (value === 'JR_HANDLE_QDSY' && propertyInvest === 'SX_ZQ') {
                                        dispatch(editRunningActions.changeStateAndAbstract(oriTemp,'STATE_TZ_SRLX'))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState','STATE_TZ_SRLX'))
                                        dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Invest'))
                                    } else if (value === 'JR_HANDLE_QDSY' && propertyInvest === 'SX_GQ') {
                                        dispatch(editRunningActions.changeStateAndAbstract(oriTemp,'STATE_TZ_SRGL'))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState','STATE_TZ_SRGL'))
                                        dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Invest'))
                                    } else {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState',''))
                                    }
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','handleType',value))
                                }}
                                >
                                <Option key='a' value={'JR_HANDLE_DWTZ'}>对外投资</Option>
                                <Option key='b' value={'JR_HANDLE_QDSY'}>取得收益</Option>
                                <Option key='c' value={'JR_HANDLE_SHTZ'}>收回投资</Option>
                            </Select>
                        </div>
                    </div>
                    :
                    null
            }

            {/* 资本*/}
            {
                categoryType==='LB_ZB'?
                    <div className="edit-running-modal-list-item" >
                        <label>处理类型：</label>
                        <div>
                            <Select
                                disabled={insertOrModify === 'modify'}
                                value={handleType}
                                onChange={value => {
                                    const state = {
                                        JR_HANDLE_ZZ:'STATE_ZB_ZZ',
                                        JR_HANDLE_LRFP:'STATE_ZB_ZFLR',
                                        JR_HANDLE_JZ:'STATE_ZB_JZ',
                                        JR_HANDLE_ZBYJ:'STATE_ZB_ZBYJ'
                                    }[value] || ''
                                    dispatch(editRunningActions.changeStateAndAbstract(oriTemp,state))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState',state))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','handleType',value))
                                    value === 'JR_HANDLE_LRFP' && dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Capital'))

                                }}
                                >
                                    <Option key='a' value={'JR_HANDLE_ZZ'}>实收资本</Option>
                                <Option key='d' value={'JR_HANDLE_ZBYJ'}>资本溢价</Option>
                                <Option key='b' value={'JR_HANDLE_LRFP'}>利润分配</Option>
                                <Option key='c' value={'JR_HANDLE_JZ'}>减资</Option>
                            </Select>
                        </div>
                    </div>
                    :
                    null
            }
            {/* 费用支出／薪酬支出费用性质 */}
            {
                 propertyCostList
                 && propertyCostList.size > 1
                 && oriState !== 'STATE_XC_DK'
                 && oriState !== 'STATE_XC_DJ'
                 &&  ((categoryType === 'LB_FYZC' && oriState!== 'STATE_FY_DJ')
                    || categoryType === 'LB_XCZC'
                    || categoryType === 'STATE_XC_JN' && beAccrued && oriState === 'STATE_XC_JT'
                    || oriState === 'STATE_XC_FF'
                    || categoryType === 'LB_XCZC' && !beAccrued
                    || handleType === 'XZ_ZJTX')?
                <div className="edit-running-modal-list-item" style={{display:(oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_DJ') && pendingStrongList.filter(v => v.get('beSelect')).size >= 1?'none':''}}>
                    <label>费用性质：</label>
                    <div>
                        <Tooltip title={projectTip[propertyCost] || ''}
                            placement='topLeft'
                            >
                            <Select
                                disabled={insertOrModify === 'modify' && beCertificate || disableProperty}
                                value={propertyCostName}
                                onChange={value => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','propertyCost',value))
                                }}
                                >
                                    {
                                        propertyCostList && propertyCostList.size?
                                        propertyCostList.map((v, i) =>{
                                            const name ={
                                                XZ_SALE:'销售费用',
                                                XZ_MANAGE:'管理费用',
                                                'XZ_FINANCE':'财务费用'
                                            }[v]
                                            return <Option key={i} value={v}>
                                                {name}
                                            </Option>
                                        })
                                        :
                                        null
                                }
                            </Select>
                        </Tooltip>
                    </div>
                </div>
                :
                null
            }
        </div>
        )
    }
}
