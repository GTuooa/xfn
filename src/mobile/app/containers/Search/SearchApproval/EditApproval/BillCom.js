import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import thirdParty from 'app/thirdParty'
import { Row, Single, Icon, Amount, SwitchText, XfInput } from 'app/components'
import * as editRunning from 'app/constants/editRunning.js'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

//流水状态组件
export default class BillCom extends Component {
    taxRateList = []
    componentDidMount(){
        const rateOptionList = this.props.rateOptionList.toJS()
        rateOptionList.forEach(v => { this.taxRateList.push({key:`${v}%`, value: v}) })
        this.taxRateList.push({key: '**%', value: -1})
    }
    render() {
        const { dispatch, categoryType, oriState, billList, amount, scale, isModify, oriBillType, handleType, direction, isDJ } = this.props

        const billType = billList ? billList.getIn([0, 'billType']) : ''
        const billState = billList ? billList.getIn([0, 'billState']) : ''
        const taxRate = billList ? billList.getIn([0, 'taxRate']) : ''
        const tax = billList ? billList.getIn([0, 'tax']) : ''
        const isCustomize = taxRate == -1 ? true : false

        let billTypeList = []
        const billTypeName = { 'bill_other': '其他票据', 'bill_common': '发票', 'bill_special': '增值税专用发票' }[billType]

        let showBill = false
        const billChecked = billState === 'bill_states_make_out' || billState === 'bill_states_auth' ? true : false

        switch (categoryType) {
            case 'LB_YYSR': {
                showBill = isDJ ? false : true
                billTypeList = [{ key: '发票', value: 'bill_common' }, { key: '其他票据', value: 'bill_other' }]
                break
            }
            case 'LB_YYZC': {
                if (scale == 'general' || isModify) {
                    showBill = isDJ ? false : true
                    billTypeList = [{ key: '增值税专用发票', value: 'bill_special' }, { key: '其他票据', value: 'bill_other' }]
                }
                break
            }
            case 'LB_FYZC': {
                if (scale == 'general' || isModify) {
                    showBill = isDJ ? false : true
                    billTypeList = [{ key: '增值税专用发票', value: 'bill_special' }, { key: '其他票据', value: 'bill_other' }]
                }
                break
            }
            // case 'LB_CQZC': {
            //     billTypeList = [{key: '发票', value: 'bill_common'}, {key: '其他票据', value: 'bill_other'}]//处置
            //     if (oriState == 'STATE_CQZC_YF') {//购进资产
            //         billTypeList = [{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]
            //     }

            //     if (scale == 'general') {
            //         showBill = true
            //     }

            //     if (scale == 'small') {
            //         showBill = oriState == 'STATE_CQZC_YS' ? true : false

            //         if (isModify && oriState == 'STATE_CQZC_YF' && oriBillType=='bill_special') {
            //             showBill = true
            //         }
            //     }

            //     break
            // }
            case 'LB_YYWSR': {
                showBill = true
                billTypeList = [{ key: '发票', value: 'bill_common' }, { key: '其他票据', value: 'bill_other' }]
                break
            }
            case 'LB_YYWZC': {
                if (scale == 'general' || isModify) {
                    showBill = true
                    billTypeList = [{ key: '增值税专用发票', value: 'bill_special' }, { key: '其他票据', value: 'bill_other' }]
                }
                break
            }
            default: null
        }

        if (scale == 'isEnable') {
            showBill = false
            if (isModify && ['bill_special', 'bill_common'].includes(oriBillType)) {
                showBill = true
            }
        }

        if (scale == 'small' && ['LB_YYZC', 'LB_FYZC', 'LB_YYWZC'].includes(categoryType) && ['', 'bill_other'].includes(billType)) {
            showBill = false
            if (isModify && oriBillType == 'bill_special') {
                showBill = true
            }
        }

        return showBill ? (
            <Row className='lrls-card'>
                <Row className='yysr-bill'>
                    <div className='lrls-more-card'>
                        <label>票据类型:</label>
                        <Single
                            className='lrls-single'
                            district={billTypeList}
                            value={billType}
                            onOk={value => {
                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billType', value.value))
                                if (scale === 'small') {
                                    if ((handleType !== 'JR_HANDLE_GJ' && direction === 'debit') && value !== 'bill_other') {
                                        dispatch(searchApprovalActions.searchApproalBillchange('bill_states_make_out'))
                                    }
                                } else if (scale === 'general') {
                                    if (categoryType === 'LB_CQZC') {
                                        if (handleType === 'JR_HANDLE_GJ' && value !== 'bill_other') {
                                            dispatch(searchApprovalActions.searchApproalBillchange('bill_states_auth'))
                                        } else if (handleType === 'JR_HANDLE_CZ' && value !== 'bill_other') {
                                            dispatch(searchApprovalActions.searchApproalBillchange('bill_states_make_out'))
                                        }
                                    } else if (direction === 'debit' && value !== 'bill_other') {
                                        dispatch(searchApprovalActions.searchApproalBillchange('bill_states_make_out'))
                                    } else if (value !== 'bill_other') {
                                        dispatch(searchApprovalActions.searchApproalBillchange('bill_states_auth'))
                                    }
                                }
                            }}
                        >
                            <Row className='lrls-category lrls-padding'>
                                <span>{billTypeName}</span>
                                <Icon type="triangle" />
                            </Row>
                        </Single>
                    </div>
                    {
                        billType == 'bill_special' || billType == 'bill_common' ? <SwitchText
                            checked={billState === 'bill_states_make_out' || billState === 'bill_states_auth'}
                            checkedChildren={direction === 'debit' && handleType !== 'JR_HANDLE_GJ' ? '已开票' : '已认证'}
                            unCheckedChildren={direction === 'debit' && handleType !== 'JR_HANDLE_GJ' ? '未开票' : '未认证'}
                            className='threeTextSwitch'
                            onChange={() => {
                                if (scale === 'small') {
                                    if (direction === 'debit' && billType !== 'bill_other') {
                                        if ((billState === 'bill_states_make_out')) {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_not_make_out'))
                                        } else {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_make_out'))
                                        }
                                    } else if (billState === 'bill_states_auth') {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_not_auth'))
                                    } else if (billState === 'bill_states_not_auth') {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_auth'))
                                    }
                                } else {
                                    if (handleType === 'JR_HANDLE_GJ') {
                                        if (billState === 'bill_states_auth') {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_not_auth'))
                                        } else {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_auth'))
                                        }
                                    } else if (direction === 'debit') {
                                        if (billType !== 'bill_other') {
                                            if (billState === 'bill_states_make_out') {
                                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_not_make_out'))
                                            } else {
                                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_make_out'))
                                            }

                                        }

                                    } else {
                                        if (billType !== 'bill_other') {
                                            if (billState === 'bill_states_auth') {
                                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_not_auth'))
                                            } else {
                                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_auth'))
                                            }

                                        }
                                    }
                                }
                            }}
                        /> : null
                    }
                </Row>

                {
                    billType != 'bill_other' ? <Row>
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>税率:</label>
                            <Single
                                className='lrls-single'
                                district={this.taxRateList}
                                value={taxRate}
                                onOk={value => {
                                    dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(value.value))
                                }}
                            >
                                <Row className='lrls-category lrls-padding'>
                                    <span>
                                        {`${taxRate == -1 ? '**' : taxRate}%`}
                                        <span className='lrls-placeholder' style={{ display: isCustomize ? 'none' : '' }}>
                                            (税额：<Amount showZero>{tax}</Amount> 价税合计: <Amount showZero>{amount}</Amount>)
                                        </span>
                                    </span>
                                    <Icon type="triangle" />
                                </Row>
                            </Single>
                        </Row>
                        <Row className='yysr-amount lrls-margin-top' style={{ display: isCustomize ? '' : 'none' }}>
                            <label>税额：</label>
                            <XfInput.BorderInputItem
                                mode={'amount'}
                                placeholder='填写金额'
                                value={tax}
                                // negativeAllowed={!['LB_YYWSR', 'LB_YYWZC'].includes(categoryType)}
                                negativeAllowed={true}
                                onChange={(value) => {
                                    // let reg = /^\d*\.?\d{0,2}$/g
                                    // if (['LB_FYZC', 'LB_CQZC'].includes(categoryType)) {
                                    // if (!['LB_YYWSR', 'LB_YYWZC'].includes(categoryType)) {
                                    //     reg = /^[-\d]\d*\.?\d{0,2}$/g
                                    // }
                                    // if (reg.test(value) || value == '') {
                                        if (Math.abs(value) > Math.abs(amount)) {
                                            thirdParty.toast.info('税额有误，不允许大于价税合计')
                                        } else {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('tax', value))
                                        }
                                    // }

                                }}
                            />
                        </Row>
                    </Row> : null
                }
            </Row>

        ) : null
    }
};