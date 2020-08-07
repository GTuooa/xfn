import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon, Switch } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import SelectRadio from './SelectRadio'
import PayOrPreAmount from './PayOrPreAmount'
import LongTermAsset from './LongTermAsset'
import GoodsCost from './GoodsCost'
import Properties  from './Properties'
import { formatNum } from 'app/utils'
import { toJS, fromJS } from 'immutable'

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class Invoice extends React.Component {
    render() {
        const {
            dispatch,
            flags,
            cardTemp,
            taxRateTemp,
            allState
        } = this.props
        const runningState = cardTemp.get('runningState')
        const categoryType = cardTemp.get('categoryType')
        const propertyCost =cardTemp.get('propertyCost')
        const scale = cardTemp.get('scale')
        let showManagemented, propertyShow, categoryTypeObj
		let direction = 'debit'
		let showInvoice = false
		let isShowAbout = false
		let specialState = false
        ;({
			'LB_YYSR': () => {
				showManagemented = true
				propertyShow = '营业收入'
				categoryTypeObj = 'acBusinessIncome'
			},
			'LB_YYZC': () => {
				showManagemented = true
				propertyShow = '营业支出'
				categoryTypeObj = 'acBusinessExpense'
				direction = 'credit'
			},
			'LB_YYWSR': () => {
				showManagemented = true
				propertyShow = '营业外收入'
				categoryTypeObj = 'acBusinessOutIncome'
				isShowAbout = true
				direction = 'debit'
			},
			'LB_YYWZC': () => {
				showManagemented = true
				propertyShow = '营业外支出'
				categoryTypeObj = 'acBusinessOutExpense'
				direction = 'credit'
				isShowAbout = true
				direction = 'credit'
			},
			'LB_JK': () => {
				showManagemented = true
				propertyShow = '借款'
				categoryTypeObj = 'acLoan'
				specialState = true
			},
			'LB_TZ': () => {
				showManagemented = true
				propertyShow = '投资'
				categoryTypeObj = 'acInvest'
				specialState = true
			},
			'LB_ZB': () => {
				showManagemented = true
				propertyShow = '资本'
				categoryTypeObj = 'acCapital'
				specialState = true
			},
			'LB_CQZC': () => {
				showManagemented = true
				propertyShow = '长期资产'
				categoryTypeObj = 'acAssets',
				direction = 'debit'
			},
			'LB_FYZC': () => {
				showManagemented = true
				propertyShow = '费用支出'
				categoryTypeObj = 'acCost',
				direction = 'credit'
			},
			'LB_ZSKX': () => {
				showManagemented = false
				propertyShow = '暂收款项'
				categoryTypeObj = 'acTemporaryReceipt'
				isShowAbout = true
			},
			'LB_ZFKX': () => {
				showManagemented = false
				propertyShow = '暂付款项'
				categoryTypeObj = 'acTemporaryPay'
				isShowAbout = true
			},
			'LB_XCZC': () => {
				showManagemented = false
				propertyShow = '薪酬支出'
				categoryTypeObj = 'acPayment',
				direction = 'credit'
				specialState = true
			},
			'LB_SFZC': () => {
				showManagemented = false
				propertyShow = '税费支出'
				categoryTypeObj = 'acTax',
				direction = 'credit'
				specialState = true
			}
		}[categoryType] || (() => ''))()
        const useAssList = allState.get('allasscategorylist')
        const specialStateforAccrued = flags.get('specialStateforAccrued')
        const billList = cardTemp.get('billList') ? cardTemp.get('billList') : fromJS([])
        const specialStateforAssets = flags.get('specialStateforAssets')
        const payableAssCategory = taxRateTemp.get('payableAssCategory')
		const notBillingAssCategory = taxRateTemp.get('notBillingAssCategory')
		const notBillingAcId = taxRateTemp.get('notBillingAcId')
		const outputAcId = taxRateTemp.get('outputAcId')
		const payableRate = cardTemp.get('payableRate')
		const outputAssCategory = taxRateTemp.get('outputAssCategory')
		const waitOutputAcId = taxRateTemp.get('waitOutputAcId')
		const waitOutputAssCategory = taxRateTemp.get('waitOutputAssCategory')
		const inputAcId = taxRateTemp.get('inputAcId')
        const payableAcId = taxRateTemp.get('payableAcId')
		const inputAssCategory = taxRateTemp.get('inputAssCategory')
		const certifiedAcId = taxRateTemp.get('certifiedAcId')
		const certifiedAssCategory = taxRateTemp.get('certifiedAssCategory')
        const taxRate = cardTemp.get('taxRate')
        const isQueryByBusiness = flags.get('isQueryByBusiness')
        const runningType = cardTemp.get('runningType')
        const billType = cardTemp.get('billType')
        const billStates = cardTemp.get('billStates')
        const amount = cardTemp.get('amount')
        const beCheck = cardTemp.get('beCheck')
        const assetType = cardTemp.get('assetType')
        const businessList = cardTemp.get('businessList')
        const beCleaning = cardTemp.getIn([categoryTypeObj,'beCleaning'])
        let billTypeName = direction === 'debit' && assetType !== 'XZ_GJZC'  ?
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
		let taxRateSouce
		if (scale === 'general') {
			taxRateSouce = [
				{
					value: '2',
					key: '2%'
				},
				{
					value: '3',
					key: '3%'
				},
				{
					value: '4',
					key: '4%'
				},
                {
					value: '5',
					key: '5%'
				},
				{
					value: '6',
					key: '6%'
				},
                {
					value: '9',
					key: '9%'
				},
				{
					value: '10',
					key: '10%'
				},
				{
					value: '11',
					key: '11%'
				},
				{
					value: '12',
					key: '12%'
				},
				{
					value: '13',
					key: '13%'
				},
				{
					value: '16',
					key: '16%'
				},
				{
					value: '17',
					key: '17%'
				}
			]
            // if (billStates === 'bill_states_auth') {
            //     taxRateSouce.push({
			// 		value: '100',
			// 		key: '100%'
			// 	})
            // }
		} else {
			taxRateSouce = [
				{
					value: '2',
					key: '2%'
				},
				{
					value: '3',
					key: '3%'
				},
				{
					value: '5',
					key: '5%'
				}
			]
		}
        // 票据类型
        let billTypeList = direction === 'debit' && assetType !== 'XZ_GJZC'  ?
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
            //发票科目辅助核算
        const getAccountListByNameList = (nameList) => {
         return nameList.map(name => {
            let index,asscategory
            let findtypeList = useAssList ? useAssList.toJS().find((x,i) => {
                if(x.asscategory === name){
                    index = i
                    asscategory= name
                    return true
                }
            }):[]
            const chooseList = findtypeList ? findtypeList.asslist : []
            const chosenAssList = cardTemp.get('billAssList').find(v =>  v.get('assCategory') === name)
            return (
                billType && billType!== 'bill_other'?
                <div className="accountConf-modal-list-item" key={name} name='asslist'>

                    <label>{name}：</label>
                    <div>
                        <Select
                            // placeholder='必填，请选择辅助核算'
                            disabled={isQueryByBusiness && billList.size}
                            value={chosenAssList && `${chosenAssList.get('assId')} ${chosenAssList.get('assName')}`}
                            onChange={value => {
                                dispatch(lrAccountActions.updateAssList('billAssList',value))
                            }}
                            >
                                {
                                    chooseList.map((z, zi) =>{
                                        const value = `${z.assname}${Limit.TREE_JOIN_STR}${z.assid}${Limit.TREE_JOIN_STR}${asscategory}`
                                        return <Option key={z.assid} value={value}>
                                                    {`${z.assid} ${z.assname}`}
                                             </Option>
                                    })
                            }

                        </Select>
                    </div>
                </div>
                :
                null
                )
            })
        }
        return(
            <div>
                {
                    runningState
                && runningState != 'STATE_YYSR_DJ'
                && runningState != 'STATE_YYZC_DJ'
                && runningState != 'STATE_FY_DJ'
                && categoryType != 'LB_XCZC'
                && categoryType != 'LB_SFZC'
                && categoryType != 'LB_ZSKX'
                && categoryType != 'LB_ZFKX'
                && categoryType != 'LB_ZZ'
                && categoryType != 'LB_ZB'
                && categoryType != 'LB_JK'
                && categoryType != 'LB_TZ'
                && (scale !== 'small' || (direction === 'debit' && assetType !== 'XZ_GJZC'))
                && (categoryType !== 'LB_CQZC' || categoryType === 'LB_CQZC' && assetType !== '')
                && categoryType !== 'LB_YYWSR'
                && categoryType !== 'LB_YYWZC'
                && runningType !== 'LX_JZSY_SS'
                && runningType !== 'LX_JZSY_SY'
                && assetType !== 'XZ_ZJTX'
                && !specialStateforAssets?
                <div>
                <div className="accountConf-separator"></div>
                {
                    scale == 'small' || scale == 'general'?
                    <div className="accountConf-modal-list-item">
                        <label>票据类型：</label>
                        <div>
                            <Select
                                disabled={isQueryByBusiness && billList.size || assetType === 'XZ_CZZC' && isQueryByBusiness && beCleaning && businessList && businessList.size}
                                value={billTypeName}
                                onChange={value => {
                                    dispatch(lrAccountActions.changeLrAccountCommonString('card', 'billType', value))
                                         if(scale === 'small') {
                                             if (categoryType === 'LB_CQZC') {
                                                if (assetType === 'XZ_CZZC' && value !== 'bill_other') {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_make_out', direction, payableAcId, notBillingAcId))
                                                }
                                            } else if(direction === 'debit') {
                                                if(value !== 'bill_other') {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_make_out', direction, payableAcId, notBillingAcId))
                                                }
                                            }
                                        } else {
                                            if (categoryType === 'LB_CQZC') {
                                               if (assetType === 'XZ_GJZC' && value !== 'bill_other') {
                                                   dispatch(lrAccountActions.billChange(scale, 'bill_states_auth', direction, inputAcId, certifiedAcId))
                                               } else if (value !== 'bill_other') {
                                                   dispatch(lrAccountActions.billChange(scale, 'bill_states_make_out', direction, outputAcId, waitOutputAcId))
                                               }
                                           } else if(direction === 'debit') {
                                                if(value !== 'bill_other') {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_make_out', direction, outputAcId, waitOutputAcId))
                                                }

                                            } else {
                                                if(value !== 'bill_other') {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_auth', direction, inputAcId, certifiedAcId))
                                                }
                                            }
                                        }
                                        if (assetType === 'XZ_CZZC' && beCleaning) {
                                            dispatch(lrAccountActions.calculateGain(value))
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
                        <div className="accountConf-modal-list-item">
                            <label>税率：</label>
                            <div>
                                <Select
                                    className='lrAccount-rate'
                                    disabled={isQueryByBusiness && billList.size || assetType === 'XZ_CZZC' && isQueryByBusiness && beCleaning && businessList &&  businessList.size}
                                    value={`${taxRate?taxRate+'%':''}`}
                                    onChange={value => {
                                        dispatch(lrAccountActions.changeAccountTaxRate(value))}
                                    }
                                    >
                                    {taxRateSouce.map((v, i) => <Option key={i} value={v.value}>{v.key}</Option>)}
                                </Select>
                                <Switch
                                    className="use-unuse-style"
                                    checked={isQueryByBusiness &&  billList.size? beCheck  : (billStates === 'bill_states_make_out' || billStates === 'bill_states_auth')}
                                    onChange={()=> {
                                        if (scale === 'small') {
                                            if(direction === 'debit' && billType !== 'bill_other') {
                                                if((billStates === 'bill_states_make_out')) {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_not_make_out', direction, payableAcId, notBillingAcId))
                                                }else {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_make_out', direction, outputAcId, waitOutputAcId))
                                                }
                                            }
                                        }else {
                                            if (assetType === 'XZ_GJZC') {
                                                if (billStates === 'bill_states_auth') {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_not_auth', direction, inputAcId, certifiedAcId))
                                                } else {
                                                    dispatch(lrAccountActions.billChange(scale, 'bill_states_auth', direction, inputAcId, certifiedAcId))
                                                }
                                            } else if(direction === 'debit') {
                                                if(billType !== 'bill_other') {
                                                    if(billStates === 'bill_states_make_out') {
                                                        dispatch(lrAccountActions.billChange(scale, 'bill_states_not_make_out', direction, outputAcId, waitOutputAcId))
                                                    }else {
                                                        dispatch(lrAccountActions.billChange(scale, 'bill_states_make_out', direction, outputAcId, waitOutputAcId))
                                                    }

                                                }

                                            }else {
                                                if(billType !== 'bill_other') {
                                                    if(billStates === 'bill_states_auth') {
                                                        dispatch(lrAccountActions.billChange(scale, 'bill_states_not_auth', direction, inputAcId, certifiedAcId))
                                                    }else {
                                                        dispatch(lrAccountActions.billChange(scale, 'bill_states_auth', direction, inputAcId, certifiedAcId))
                                                    }

                                                }
                                            }
                                        }
                                    }}
                                    checkedChildren={direction === 'debit' && assetType !== 'XZ_GJZC'?'已开票':'已认证'}
                                    unCheckedChildren={direction === 'debit' && assetType !== 'XZ_GJZC'?'未开票':'未认证'}
                                    disabled={isQueryByBusiness && billList.size}
                                />
                            </div>
                        </div>
                        <div className="accountConf-modal-list-item accountConf-premount">
                            <label></label>
                            <label>价税合计：</label>
                            <div>
                                {amount?Number(amount).toFixed(2):''}
                            </div>
                            <label>税额：</label>
                            <div>
                                {cardTemp.get('tax')?cardTemp.get('tax'):''}
                            </div>
                        </div>
                    </div>
                    :null
                }
                </div>
                :
                null
            }
            {
                isQueryByBusiness && billList && billList.size && !specialStateforAssets && !beCheck?
                    <div>
                        <div className='business-water'>
                            <span className='green-pannel'> {`发票已${billStates === 'bill_states_make_out'?'开票':'认证'}`}</span>
                            {`${billStates === 'bill_states_make_out'?'开票':'认证'}流水:${billList.getIn([0, 'flowNumber'])}`}
                        </div>
                    </div>
                    :
                    null
            }
        </div>
        )
    }
}
