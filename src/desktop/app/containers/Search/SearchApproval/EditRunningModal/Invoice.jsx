import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Select, Switch, Input, message } from 'antd'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { getCategorynameByType, numberTest, regNegative, reg } from 'app/containers/Edit/EditRunning/common/common.js'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { XfInput } from 'app/components'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
    class Invoice extends React.Component {

    componentWillReceiveProps(nextprops) {
        const newAmount = nextprops.amount
        const amount = this.props.amount
        const taxRate = nextprops.billList.getIn([0,'taxRate'])
        if (newAmount !== amount && taxRate != '-1' && Math.abs(taxRate) > 0) {
            this.props.dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate, newAmount))
        }
    }

    render() {

        const {
            dispatch,
            billList,
            taxRateConf,
            handleType,
            direction,
            amount,
            categoryType,
            currentbillType
        } = this.props

        const scale = taxRateConf.get('scale')
        const rateOptionList = taxRateConf.get('rateOptionList') || fromJS([])
		const taxRateSouce = rateOptionList.toJS().map(v => ({key:`${v}%`,value:v}))
        taxRateSouce.push({value: '-1',key: '**%'})
        const billData = billList.get(0)
        const billState = billData ? billData.get('billState') : ''
        const billType = billData ? billData.get('billType') : ''
        const billUuid = billData ? billData.get('billUuid') : ''
        const tax = billData ? billData.get('tax') : ''
        const taxRate = billData ? billData.get('taxRate') : ''

        let billTypeList = direction === 'debit' && handleType !== 'JR_HANDLE_GJ'  ?
        [
            {
                value: '发票',
                key: 'bill_common'
            },
            {
                value: '其他票据',
                key: 'bill_other'
            },
        ]
        :
        [
            {
                value: '增值税专用发票',
                key: 'bill_special'
            },
            {
                value: '其他票据',
                key: 'bill_other'
            },
        ]

        const billTypeName = {
            'bill_common': '发票',
            'bill_special': '增值税专用发票',
            'bill_other': '其他票据',
        }

        return (
            <div>
                {
                    scale == 'small' && direction !== 'credit' && handleType !== 'JR_HANDLE_GJ' || scale == 'general'
                    || (billType === 'bill_special' || billType === 'bill_common' || currentbillType === 'bill_common' || currentbillType === 'bill_special') ?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">票据类型：</span>
                        <span className="approval-running-card-input">
                            <Select
                                value={billTypeName[billType] ? billTypeName[billType] : ''}
                                onChange={value => {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billType', value))
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
                                        } else if(direction === 'debit' && value !== 'bill_other') {
                                            dispatch(searchApprovalActions.searchApproalBillchange('bill_states_make_out'))
                                        } else if(value !== 'bill_other') {
                                            dispatch(searchApprovalActions.searchApproalBillchange('bill_states_auth'))
                                        }
                                    }
                                }}
                            >
                                {billTypeList.map((v, i) => <Option key={i} value={v.key}>{v.value}</Option>)}
                            </Select>
                        </span>
                    </div>
                    : null
                }
                {
                    billType === 'bill_common' || billType === 'bill_special' ?
                        <div>
                            <div className="approval-running-card-input-wrap">
                                <span className="approval-running-card-input-tip">税率：</span>
                                <span className="approval-running-card-input">
                                    <Select
                                        disabled={false}
                                        value={`${taxRate == -1 ? '**%' : taxRate ? taxRate + '%' : ''}`}
                                        onChange={value => {
                                            dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(value))
                                        }}
                                    >
                                        {taxRateSouce.map((v, i) => <Select.Option key={i} value={v.value}>{v.key}</Select.Option>)}
                                    </Select>
                                </span>
                                <Switch
                                    className="use-unuse-style"
                                    style={{ marginLeft: '10px' }}
                                    checked={billState === 'bill_states_make_out' || billState === 'bill_states_auth'}
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
                                                    if(billState === 'bill_states_auth') {
                                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_not_auth'))
                                                    } else {
                                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('billState', 'bill_states_auth'))
                                                    }

                                                }
                                            }
                                        }
                                    }}
                                    checkedChildren={direction === 'debit' && handleType !== 'JR_HANDLE_GJ' ? '已开票' : '已认证'}
                                    unCheckedChildren={direction === 'debit' && handleType !== 'JR_HANDLE_GJ' ? '未开票' : '未认证'}
                                    disabled={false}
                                />
                            </div>
                            {
                                taxRate == -1 ?
                                    <div className="approval-running-card-input-wrap">
                                        <span className="approval-running-card-input-tip">税额：</span>
                                        <span className="approval-running-card-input">
                                            <XfInput
                                                mode="amount"
                                                value={tax}
                                                negativeAllowed={true}
                                                onChange={(e) => {
                                                    // numberTest(e, (value) => {
                                                        const value = e.target.value
                                                        if (Math.abs(value) > Math.abs(amount)) {
                                                            message.info('税额有误，不允许大于价税合计')
                                                        } else {
                                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoBillCommonString('tax', value))
                                                        }
                                                    // }, categoryType === 'LB_FYZC' || categoryType === 'LB_CQZC' ? true : false)
                                                    // }, categoryType === 'LB_YYWSR' || categoryType === 'LB_YYWZC' ? false : true)
                                                }}
                                            />
                                        </span>
                                    </div>
                                    :
                                    <div className="approval-running-card-input-wrap">
                                        <span className="approval-running-card-input-tip"></span>
                                        <span className="approval-running-card-input">
                                            <span className="approval-running-card-input-text">价税合计：</span>
                                            <span className="approval-running-card-input-text">{formatMoney(amount)}</span>
                                            <span className="approval-running-card-input-text">税额：</span>
                                            <span className="approval-running-card-input-text">{tax ? formatMoney(tax) : ''}</span>
                                        </span>
                                    </div>
                            }
                        </div>
                        : null
                }

            </div>
        )
    }
}
