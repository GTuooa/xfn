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
class AccruedPaymentListForXCZC extends React.Component {
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
        const runningStateTitle = {
            SX_GZXJ: '计提工资薪金',
            SX_SHBX: '计提社会保险',
            SX_QTXC: '计提其他薪酬',
            SX_ZFGJJ: '计提公积金'
        }[propertyPay]
        const listTitle = {
            SX_GZXJ: '待发放工资薪金：',
            SX_SHBX: '待发放社会保险：',
            SX_QTXC: '待发放薪酬：',
            SX_ZFGJJ: '待发放公积金：',
        }[propertyPay]
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
            <div className='accountConf-modal-list-hidden'>
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
                            </div>:''
                }
                {
                    specialStateforAccrued  && (!isQueryByBusiness || isQueryByBusiness && paymentList.size)?
                        <TableAll className="lrAccount-table">
                            <TableTitle
                                className="account-running-table-width"
                                titleList={['日期','流水号','摘要','类型','处理金额']}
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
                                                    <li>{item.get('runningDate')}</li>
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
                                                    <li><span>{runningStateTitle}</span></li>
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
                                titleList={['日期','流水号','摘要','类型','待支付金额']}
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
                                            switch (propertyPay) {
                                                case 'SX_GZXJ':
                                                    dispatch(lrAccountActions.changeLrAccountCommonString('card','amount',totalNotHandleAmount))
                                                    break
                                                case 'SX_SHBX':
                                                    dispatch(lrAccountActions.changeLrAccountCommonString('card',['acPayment', 'companySocialSecurityAmount'],totalNotHandleAmount))
                                                    break
                                                case 'SX_ZFGJJ':
                                                    dispatch(lrAccountActions.changeLrAccountCommonString('card',['acPayment', 'companyAccumulationAmount'],totalNotHandleAmount))
                                                    break
                                                case 'SX_QTXC':
                                                    dispatch(lrAccountActions.changeLrAccountCommonString('card','amount',totalNotHandleAmount))
                                                    break
                                                default:

                                            }
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','amount',totalNotHandleAmount))
                                            dispatch(lrAccountActions.autoCalculateAmount())
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
                                                            dispatch(lrAccountActions.autoCalculateAmount())
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
                                                <li><span>{runningStateTitle}</span></li>
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
                                    <li>
                                        <p>{totalAmount.toFixed(2)}</p>
                                    </li>

                                </TableItem>
                            </TableBody>
                        </TableAll>:''
                }

            </div>
        )
    }
}
