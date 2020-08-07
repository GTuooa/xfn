import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Select, Checkbox, Button, message, Radio, Icon, Switch } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import SelectRadio from './SelectRadio'
import Properties  from './Properties'
import { formatNum, DateLib, formatMoney } from 'app/utils'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Invoice extends React.Component {
    componentWillReceiveProps(nextprops) {
        const newAmount = nextprops.oriTemp.get('amount')
        const amount = this.props.oriTemp.get('amount')
        const taxRate = nextprops.oriTemp.getIn(['billList',0,'taxRate'])
        const handleType = this.props.oriTemp.get('handleType')
        const beCleaning = this.props.oriTemp.get('beCleaning')
        if (newAmount !== amount && taxRate != '-1' && Math.abs(taxRate) > 0) {
            this.props.dispatch(editRunningActions.changeAccountTaxRate(taxRate,newAmount))
        }
        if (handleType === 'JR_HANDLE_CZ' && beCleaning) {
            this.props.dispatch(editRunningActions.calculateGain())
        }
    }
    render() {
        const {
            dispatch,
            flags,
            oriTemp,
            taxRateTemp,
            insertOrModify
        } = this.props
        const oriState = oriTemp.get('oriState')
        const categoryType = oriTemp.get('categoryType')
        const scale = taxRateTemp.get('scale')
        const rateOptionList = taxRateTemp.get('rateOptionList') || fromJS([])
		const taxRateSouce = rateOptionList.toJS().map(v => ({key:`${v}%`,value:v}))
        taxRateSouce.push({value: '-1',key: '**%'})
        const {
			propertyShow,
            categoryTypeObj,
            direction,
		} = getCategorynameByType(categoryType)
        const billList = oriTemp.get('billList')
        const taxRate = billList.getIn([0,'taxRate'])
        const tax = billList.getIn([0,'tax'])
        const billStates = billList.getIn([0,'billState'])
        const runningType = oriTemp.get('runningType')
        const billType = oriTemp.getIn(['billList',0,'billType'])
        const currentbillType = oriTemp.getIn(['currentBillList',0,'billType'])
        const amount = oriTemp.get('amount')
        const billStrongList = oriTemp.get('billStrongList')
        const handleType = oriTemp.get('handleType')
        const businessList = oriTemp.get('businessList')
        const beCleaning = oriTemp.getIn([categoryTypeObj,'beCleaning'])
        let billTypeName = direction === 'debit' && handleType !== 'JR_HANDLE_GJ'  ?
			({
				'': () => '',
				'bill_common': () => '发票',
				'bill_other': () => '其他票据',

			}[billType]||(() => ''))()
			:
			({
				'': () => '',
				'bill_special': () => '增值税专用发票',
				'bill_other': () => '其他票据',

			}[billType]||(() => ''))()

		// 税率

        // 票据类型
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
        return(
            <div>
                <div className="accountConf-separator"></div>
                {
                    scale == 'small' && direction !== 'credit' && handleType !== 'JR_HANDLE_GJ' || scale == 'general'
                    || insertOrModify === 'modify' && (billType === 'bill_special' || billType === 'bill_common' || currentbillType === 'bill_common' || currentbillType === 'bill_special')?
                    <div className="edit-running-modal-list-item" >
                        <label>票据类型：</label>
                        <div>
                            <Select
                                disabled={insertOrModify === 'modify' && billStrongList.size > 0}
                                value={billTypeName}
                                onChange={value => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['billList',0,'billType'], value))
                                    if (scale === 'small') {
                                        if ((handleType !== 'JR_HANDLE_GJ' && direction === 'debit') && value !== 'bill_other') {
                                            dispatch(editRunningActions.billChange('bill_states_make_out'))
                                        }
                                    } else if (scale === 'general') {
                                        if (categoryType === 'LB_CQZC') {
                                            if (handleType === 'JR_HANDLE_GJ' && value !== 'bill_other') {
                                                dispatch(editRunningActions.billChange('bill_states_auth'))
                                            } else if (handleType === 'JR_HANDLE_CZ' && value !== 'bill_other') {
                                                dispatch(editRunningActions.billChange('bill_states_make_out'))
                                            }
                                        } else if(direction === 'debit' && value !== 'bill_other') {
                                            dispatch(editRunningActions.billChange('bill_states_make_out'))
                                        } else if(value !== 'bill_other') {
                                            dispatch(editRunningActions.billChange('bill_states_auth'))
                                        }
                                    }
                                }}
                                >
                                {billTypeList.map((v, i) => <Option key={i} value={v.key}>{v.value}</Option>)}
                            </Select>
                        </div>
                    </div>
                    : ''
                }

                {	billType === 'bill_common'|| billType === 'bill_special'?
                    <div>
                        <div className="edit-running-modal-list-item">
                            <label>税率：</label>
                            <div>
                                <Select
                                    className='editRunning-rate'
                                    disabled={insertOrModify === 'modify' && billStrongList.size}
                                    value={`${taxRate == -1 ?'**%':taxRate?taxRate+'%':''}`}
                                    onChange={value => {
                                        dispatch(editRunningActions.changeAccountTaxRate(value))
                                    }}
                                    >
                                    {taxRateSouce.map((v, i) => <Option key={i} value={v.value}>{v.key}</Option>)}
                                </Select>

                                <Switch
                                    className="use-unuse-style"
                                    checked={billStates === 'bill_states_make_out' || billStates === 'bill_states_auth'}
                                    onChange={()=> {
                                        if (scale === 'small') {
                                            if (direction === 'debit' && billType !== 'bill_other') {
                                                if ((billStates === 'bill_states_make_out')) {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_not_make_out'))
                                                } else {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_make_out'))
                                                }
                                            } else if (billStates === 'bill_states_auth') {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_not_auth'))
                                            } else if (billStates === 'bill_states_not_auth') {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_auth'))
                                            }
                                        } else {
                                            if (handleType === 'JR_HANDLE_GJ') {
                                                if (billStates === 'bill_states_auth') {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_not_auth'))
                                                } else {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_auth'))
                                                }
                                            } else if (direction === 'debit') {
                                                if (billType !== 'bill_other') {
                                                    if (billStates === 'bill_states_make_out') {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_not_make_out'))
                                                    } else {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_make_out'))
                                                    }

                                                }

                                            } else {
                                                if (billType !== 'bill_other') {
                                                    if(billStates === 'bill_states_auth') {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_not_auth'))
                                                    } else {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'billState'],'bill_states_auth'))
                                                    }

                                                }
                                            }
                                        }
                                    }}
                                    checkedChildren={direction === 'debit' && handleType !== 'JR_HANDLE_GJ'?'已开票':'已认证'}
                                    unCheckedChildren={direction === 'debit' && handleType !== 'JR_HANDLE_GJ'?'未开票':'未认证'}
                                    disabled={insertOrModify === 'modify' && billStrongList.size}
                                />
                            </div>
                        </div>
                        {
                            taxRate == -1?
                            <div className="edit-running-modal-list-item">
                                <label>税额：</label>
                                <Input
                                    value={tax}
                                    disabled={insertOrModify === 'modify' && billStrongList.size > 0}
                                    onChange={(e) => {
                                        numberTest(e,(value) => {
                                            if (Math.abs(value) > Math.abs(amount)) {
                                                message.info('税额有误，不允许大于价税合计')
                                            } else {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori',['billList',0,'tax'],value))
                                            }
                                    },['LB_FYZC','LB_CQZC','LB_YYWSR','LB_YYWZC'].includes(categoryType) ? true : false)
                                }}
                                />
                            </div>
                            :
                            <div className="edit-running-modal-list-item accountConf-premount">
                                <label></label>
                                <label>价税合计：</label>
                                <div>
                                    {formatMoney(amount)}
                                </div>
                                <label>税额：</label>
                                <div>
                                    {tax?formatMoney(tax):''}
                                </div>
                            </div>
                        }

                    </div>
                    :null
                }
                {
                    insertOrModify === 'modify' && billStrongList.size?
                        <div className="edit-running-modal-list-item">
                        <span>{direction === 'debit' && handleType !== 'JR_HANDLE_GJ'?'开票流水：':'认证流水：'}</span>
                        {
                            billStrongList.map(item =>
                                <span
                                    className='flowNumber-area'
                                    onClick={(e)=>{
                                        e.stopPropagation()
                                        dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'lrls'))
                                    }}
                                >{`${item.get('oriDate')} ${item.get('jrIndex')}号`}</span>
                            )
                        }
                        </div>
                        :
                        null
                }
            </div>
        )
    }
}
