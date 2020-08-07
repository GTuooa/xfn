import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon } from 'antd'
const RadioGroup = Radio.Group
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
const Option = Select.Option
import SelectRadio from './SelectRadio'
import PayOrPreAmount from './PayOrPreAmount'

import GoodsCost from './GoodsCost'
import { formatNum } from 'app/utils'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class AccruedPaymentList extends React.Component {
    render() {
		const {
            cardTemp,
            dispatch,
            accountList,
            taxRateTemp,
            payOrReceive,
            insertOrModify,
            runningCategory,
            disabledBeginDate,
			homeState,
			flags,
            specialStateforAccrued,
            paymentList,
            isQueryByBusiness,
            panes,
            yllsState,
            showDrawer
		} = this.props
        const categoryType = cardTemp.get('categoryType')
        const propertyPay = cardTemp.get('propertyPay')
        const propertyTax = cardTemp.get('propertyTax')
        const runningState = cardTemp.get('runningState')
        const runningStateCN = {
            STATE_TZ_SRGL: '计提股利',
            STATE_TZ_SRLX: '计提利息',
            STATE_ZB_ZFLR: '利润分配',
            STATE_SF_JN: '计提未交增值税',
            STATE_SF_JN: '计提其他税费',
            STATE_ZF_SH:'暂付款项',
            STATE_ZS_TH:'暂收款项',
            STATE_JK_ZFLX:'计提利息',
            STATE_SF_SFJM:'税费减免',
        }
        let titleListQuery,titleList,listTitle
        if (categoryType === 'LB_TZ') {
            titleList = ['日期','流水号','摘要', '类型', '待收入金额']
            titleListQuery = ['日期','流水号','摘要', '类型', '处理金额']
            listTitle = '待收入金额：'
        } else if (propertyTax === 'SX_ZZS') {
            titleList = ['日期','流水号','摘要', '类型', '待处理金额']
            titleListQuery = ['日期','流水号','摘要', '类型', '税额']
            listTitle = '待处理税费：'
        }else {
            if(runningState == 'STATE_ZS_TH'){
                titleList = ['日期','流水号','摘要', '类型', '待核销付款金额']
                titleListQuery = ['日期','流水号','摘要', '类型', '核销付款金额']
                listTitle = '待核销付款金额：'
            }else if(runningState == 'STATE_ZF_SH'){
                titleList = ['日期','流水号','摘要', '类型', '待核销收款金额']
                titleListQuery = ['日期','流水号','摘要', '类型', '核销收款金额']
                listTitle = '待核销收款金额：'
            }else if(runningState == 'STATE_SF_SFJM'){
                titleList = ['日期','流水号','摘要', '类型', '税额']
                titleListQuery = ['日期','流水号','摘要', '类型', '待处理金额']
                listTitle = '待核销收款金额：'
            }else{
                titleList = ['日期','流水号','摘要', '类型', '待处理金额']
                titleListQuery = ['日期','流水号','摘要', '类型', '处理金额']
                listTitle = '待支付金额：'
            }

        }
        let totalAmount = 0
        if (isQueryByBusiness) {
            if (specialStateforAccrued) {
                paymentList && paymentList.forEach(v => totalAmount += Number(v.get('handleAmount')))
            } else {
                paymentList && paymentList.forEach(v => totalAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount')))
            }
        } else {
            if (specialStateforAccrued) {
                paymentList && paymentList.forEach(v => totalAmount += Number(v.get('handleAmount')))
            } else {
                paymentList && paymentList.forEach(v => totalAmount +=  Number(v.get('notHandleAmount')))
            }
        }
        let selectIndex = 0
        let totalNotHandleAmount = 0
        if (!isQueryByBusiness) {
            paymentList && paymentList.forEach(v => {
                if (v.get('beSelect')) {
                    totalNotHandleAmount += v.get('notHandleAmount')
                    selectIndex++
                }
            })
        } else {
            paymentList && paymentList.forEach(v => {
                if (v.get('beSelect')) {
                    totalNotHandleAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount'))
                    selectIndex++
                }
            })
        }
        const selectAcAll = paymentList && paymentList.size ? paymentList.size === selectIndex :false
    return (
        <div className="accountConf-modal-list-hidden">
            {
                !specialStateforAccrued && (!isQueryByBusiness || isQueryByBusiness && paymentList.size)?
                    <div className='lrAccount-detail-title'>
                        <div className='lrAccount-detail-title-top'>请勾选需要处理的流水：</div>
                        <div className='lrAccount-detail-title-bottom'>
                            <span>
                                已勾选流水：{selectIndex? selectIndex:''}条
                            </span>
                            <span>
                                {listTitle}<span>{formatNum(totalNotHandleAmount.toFixed(2))}</span>
                            </span>
                        </div>
                    </div>
                    :
                    isQueryByBusiness && paymentList && paymentList.size?
                    <div className='lrAccount-detail-title' style={{height:'32px'}}>
                        <div className='lrAccount-detail-title-top'>核销情况：</div>
                    </div>
                    :''
            }

            {
                specialStateforAccrued && (!isQueryByBusiness || isQueryByBusiness && paymentList.size)?
                    <TableAll className="lrAccount-table">
                        <TableTitle
                            className="account-running-table-width"
                            titleList={titleListQuery}
                                // disabled={runningIndex !== 0}
                                // selectAcAll={selectAcAll}
                                onClick={(e) => {
                                        e.stopPropagation()
                                        // if (runningIndex === 0) {
                                        // 	if(accountType === 'single') {
                                        // 		dispatch(lrAccountActions.accountItemCheckboxCheckAll(selectAcAll, fromJS([calculateTemp])))
                                        // 	} else {
                                        // 		dispatch(lrAccountActions.accountItemCheckboxCheckAll(selectAcAll, detail))
                                        // 	}
                                        // 	dispatch(lrAccountActions.accountTotalAmount(true))
                                        // }

                                }}
                        />
                        <TableBody>

                            {
                                paymentList && paymentList.map(item => {
                                    const handleAmount = item.get('handleAmount')
                                    return <TableItem className='account-running-table-width' key={item.get('uuid')}>
                                                <li	>{item.get('runningDate')}</li>
                                                <TableOver
                                                    textAlign='left'
                                                    className='account-flowNumber'
                                                    onClick={() => {
                                                        dispatch(yllsActions.getYllsBusinessData(item,showDrawer))
                                                    }}
                                                >
                                                    <span>{item.get('flowNumber')}</span>
                                                </TableOver>
                                                <li><span>{item.get('runningAbstract')}</span></li>
                                                <li><span>{propertyTax === 'SX_ZZS'?'未交增值税':runningStateCN[runningState]}</span></li>
                                                <li><p>{formatNum(handleAmount.toFixed(2))}</p></li>
                                        </TableItem>
                                })

                            }
                            <TableItem className='account-running-table-width' key='total'>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li>合计</li>
                                <li><p>{totalAmount.toFixed(2)}</p></li>
                            </TableItem>
                        </TableBody>
                    </TableAll>
                    :
                    !isQueryByBusiness || isQueryByBusiness && paymentList && paymentList.size?
                    <TableAll className="lrAccount-table">
                        <TableTitle
                            className="lrAccount-table-width"
                            titleList={titleList}
                                // disabled={runningIndex !== 0}
                                hasCheckbox={true}
                                selectAcAll={selectAcAll}
                                onClick={(e) => {
                                        e.stopPropagation()
                                        paymentList && paymentList.forEach((item,index) => {
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card', ['paymentList',index,'beSelect'],e.target.checked))
                                        })
                                        let totalNotHandleAmount = 0
                                        if (e.target.checked) {
                                            if (isQueryByBusiness) {
                                                paymentList && paymentList.forEach((v,i) => {
                                                    totalNotHandleAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount'))
                                                })
                                            } else {
                                                paymentList && paymentList.forEach(v => totalNotHandleAmount +=  Number(v.get('notHandleAmount')))
                                            }

                                        }
                                        if (propertyTax === 'SX_QTSF') {
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','amount',totalNotHandleAmount))
                                        } else if (propertyTax === 'SX_ZZS') {
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','handleAmount',totalNotHandleAmount))
                                        } else {
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','amount',totalNotHandleAmount))
                                        }
                                }}
                        />
                        <TableBody>

                            {
                                paymentList && paymentList.map((item,index) => {
                                    const handleAmount = item.get('handleAmount')
                                    const notHandleAmount = item.get('notHandleAmount')
                                    return <TableItem className='lrAccount-table-width' key={item.get('uuid')}>
                                            <li>
                                                <Checkbox
                									checked={item.get('beSelect')}
                									onChange={(e) => {
                                                        dispatch(lrAccountActions.changeLrAccountCommonString('card', ['paymentList',index,'beSelect'],e.target.checked))
                                                        dispatch(lrAccountActions.calculateAccruedAmount(isQueryByBusiness, paymentList, index, e.target.checked))
                									}}
                								/>
                                            </li>
                                            <li	>{item.get('runningDate')}</li>
                                            <TableOver
                                                textAlign='left'
                                                className='account-flowNumber'
                                                onClick={() => {
                                                    dispatch(yllsActions.getYllsBusinessData(item,showDrawer))
                                                }}
                                            >
                                                <span>{item.get('flowNumber')}</span>
                                            </TableOver>
                                            <li><span>{item.get('runningAbstract')}</span></li>
                                            <li><span>{propertyTax === 'SX_ZZS'?'未交增值税':runningStateCN[runningState]}</span></li>
                                            <li>
                                                <p>
                                                        {
                                                            !isQueryByBusiness ?
                                                                formatNum(notHandleAmount.toFixed(2))
                                                                :
                                                                formatNum((Number(notHandleAmount) + Number(handleAmount)).toFixed(2))
                                                        }
                                                </p>
                                            </li>
                                        </TableItem>
                                })

                            }
                            <TableItem className='lrAccount-table-width' key='total'>
                                <li	></li>
                                <li	></li>
                                <li></li>
                                <li></li>
                                <li>合计</li>
                                <li><p>{totalAmount.toFixed(2)}</p></li>
                            </TableItem>
                        </TableBody>
                    </TableAll>:''
            }

        </div>
    )
    }
}
