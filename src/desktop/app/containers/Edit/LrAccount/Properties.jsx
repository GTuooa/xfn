import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import SelectRadio from './SelectRadio'
import PayOrPreAmount from './PayOrPreAmount'
import AccruedPaymentList from './AccruedPaymentList'
import AccruedPaymentListForXCZC from './AccruedPaymentListForXCZC'

import GoodsCost from './GoodsCost'
import { formatNum } from 'app/utils'
import { toJS } from 'immutable'

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class Properties extends React.Component {

    render() {
        const {
            cardTemp,
            flags,
            dispatch,
            hasChecked
        } = this.props
        const categoryType = cardTemp.get('categoryType')
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
        const specialStateforAssets = flags.get('specialStateforAssets')
        const runningInsertOrModify = flags.get('runningInsertOrModify')
        const runningType = cardTemp.get('runningType')
        const beManagemented = cardTemp.getIn([categoryTypeObj, 'beManagemented'])
        const propertyCost = cardTemp.get('propertyCost')
        const assetType = cardTemp.get('assetType')
        const beAccrued = cardTemp.getIn([categoryTypeObj, 'beAccrued'])
        const specialStateforAccrued = flags.get('specialStateforAccrued')
        const isQueryByBusiness = flags.get('isQueryByBusiness')
        const runningState = cardTemp.get('runningState')
        const propertyCostList = cardTemp.get('propertyCostList')
        const beCertificate = cardTemp.get('beCertificate')
        const propertyInvest = cardTemp.get('propertyInvest')

        return(
            <div>
            {/* 长期资产*/}
            {
                categoryType==='LB_CQZC' && !specialStateforAssets && runningType !== 'LX_JZSY_SY' && runningType !== 'LX_JZSY_SS'?
                    <div className="accountConf-modal-list-item" >
                        <label>处理类型：</label>
                        <div>
                            <Select
                                disabled={runningInsertOrModify === 'modify'}
                                value={assetType}
                                onChange={value => {
                                    if (beManagemented) {
                                        dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                    } else {
                                        if (value === 'XZ_CZZC') {
                                            dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_CQZC_YS'))
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_CQZC_YS'))
                                        } else if (value === 'XZ_GJZC') {
                                            dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_CQZC_YF'))
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_CQZC_YF'))
                                        }
                                    }
                                    if (value === 'XZ_ZJTX') {
                                        dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_CQZC_ZJTX'))
                                        dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_CQZC_ZJTX'))
                                    }
                                    dispatch(lrAccountActions.changeLrAccountCommonString('card','billType',''))
                                    dispatch(lrAccountActions.changeLrAccountCommonString('card','assetType',value))
                                }}
                                >
                                <Option key='a' value={'XZ_GJZC'}>购进资产</Option>
                                {/* <Option key='c' value={'XZ_ZJTX'}>资产折旧/摊销</Option> */}
                                <Option key='b' value={'XZ_CZZC'}>处置</Option>
                            </Select>

                                {/* <div>
                                    <RadioGroup
                                        disabled={runningInsertOrModify === 'modify'}
                                        onChange={e => {
                                            if (beManagemented) {
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                            }
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','billType',''))
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',e.target.value))
                                        }}
                                        value={propertyCost}
                                        >
                                        <Radio key="a" value={'XZ_GJZC'} >购进资产</Radio>
                                        <Radio key="b" value={'XZ_CZZC'}>处置</Radio>
                                    </RadioGroup>
                                </div> */}


                        </div>
                    </div>
                    :
                    null
            }

            {/* 借款*/}
            {
                categoryType==='LB_JK'?
                <div className="accountConf-modal-list-item" >
                    <label>处理类型：</label>
                    {
                        specialStateforAccrued?
                            <div>
                                {{
                                    'XZ_QDJK': '取得借款',
                                    'XZ_CHLX': '偿还利息',
                                    'XZ_CHBJ': '偿还本金'
                                }[propertyCost]}
                            </div>
                            :
                            <div>
                                <Select
                                    disabled={runningInsertOrModify === 'modify'}
                                    value={propertyCost}
                                    onChange={value => {
                                        if(value === 'XZ_CHLX' && !beAccrued ) {
                                            dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_JK_ZFLX'))
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_JK_ZFLX'))
                                        } else if (value === 'XZ_CHBJ') {
                                            dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_JK_YF'))
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_JK_YF'))
                                        } else if (value === 'XZ_QDJK') {
                                            dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_JK_YS'))
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_JK_YS'))
                                        } else {
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                        }
                                        dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',value))
                                    }}
                                    >
                                    <Option key='a' value={'XZ_QDJK'}>取得借款</Option>
                                    <Option key='b' value={'XZ_CHLX'}>偿还利息</Option>
                                    <Option key='c' value={'XZ_CHBJ'}>偿还本金</Option>
                                </Select>
                            </div>

                            //  {/* <div>
                            //     <RadioGroup
                            //         disabled={runningInsertOrModify === 'modify'}
                            //         onChange={e => {
                            //             if(e.target.value === 'XZ_CHLX' && !beAccrued ) {
                            //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_JK_ZFLX'))
                            //             } else if (e.target.value === 'XZ_CHBJ') {
                            //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_JK_YF'))
                            //             } else if (e.target.value === 'XZ_QDJK') {
                            //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_JK_YS'))
                            //             } else {
                            //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                            //             }
                            //             dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',e.target.value))
                            //         }}
                            //         value={propertyCost}
                            //         >
                            //         <Radio key="a" value={'XZ_QDJK'} >取得借款</Radio>
                            //         <Radio key="b" value={'XZ_CHLX'}>偿还利息</Radio>
                            //         <Radio key="c" value={'XZ_CHBJ'}>偿还本金</Radio>
                            //     </RadioGroup>
                            // </div>  */}
                    }
                </div>
                :
                null
            }

            {/* 投资*/}
            {
                categoryType==='LB_TZ'?
                    <div className="accountConf-modal-list-item" >
                        <label>处理类型：</label>
                        {
                            specialStateforAccrued?
                                <div>
                                    {{
                                        'XZ_DWTZ': '对外投资',
                                        'XZ_QDSY': '取得收益',
                                        'XZ_SHTZ': '收回投资'
                                    }[propertyCost]}
                                </div>
                                :
                                <div>
                                    <Select
                                        disabled={runningInsertOrModify === 'modify'}
                                        value={propertyCost}
                                        onChange={value => {
                                            if (value === 'XZ_DWTZ') {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_TZ_YF'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_YF'))
                                            } else if (value === 'XZ_SHTZ') {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_TZ_YS'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_YS'))
                                            } else if (value === 'XZ_QDSY' && !beAccrued && propertyInvest === 'SX_ZQ') {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_TZ_SRLX'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_SRLX'))
                                            } else if (value === 'XZ_QDSY' && !beAccrued && propertyInvest === 'SX_GQ') {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_TZ_SRGL'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_SRGL'))
                                            } else {
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                            }
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',value))
                                        }}
                                        >
                                        <Option key='a' value={'XZ_DWTZ'}>对外投资</Option>
                                        <Option key='b' value={'XZ_QDSY'}>取得收益</Option>
                                        <Option key='c' value={'XZ_SHTZ'}>收回投资</Option>
                                    </Select>
                                </div>

                                // {/* <div>
                                //     <RadioGroup
                                //         disabled={runningInsertOrModify === 'modify'}
                                //         onChange={e => {
                                //             if (e.target.value === 'XZ_DWTZ') {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_YF'))
                                //             } else if (e.target.value === 'XZ_SHTZ') {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_YS'))
                                //             } else if (e.target.value === 'XZ_QDSY' && !beAccrued && propertyInvest === 'SX_ZQ') {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_SRLX'))
                                //             } else if (e.target.value === 'XZ_QDSY' && !beAccrued && propertyInvest === 'SX_GQ') {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_TZ_SRGL'))
                                //             } else {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                //             }
                                //             dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',e.target.value))
                                //         }}
                                //         value={propertyCost}
                                //         >
                                //         <Radio key="a" value={'XZ_DWTZ'} >对外投资</Radio>
                                //         <Radio key="b" value={'XZ_QDSY'}>取得收益</Radio>
                                //         <Radio key="c" value={'XZ_SHTZ'}>收回投资</Radio>
                                //     </RadioGroup>
                                // </div> */}
                            }
                    </div>
                    :
                    null
            }

            {/* 资本*/}
            {
                categoryType==='LB_ZB'?
                    <div className="accountConf-modal-list-item" >
                        <label>处理类型：</label>
                        {
                            specialStateforAccrued?
                                <div>
                                    {{
                                        'XZ_ZZ': '增资',
                                        'XZ_LRFP': '利润分配',
                                        'XZ_JZ': '减资'
                                    }[propertyCost]}
                                </div>
                                :
                                <div>
                                    <Select
                                        disabled={runningInsertOrModify === 'modify'}
                                        value={propertyCost}
                                        onChange={value => {
                                            if(value === 'XZ_ZZ' ) {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_ZB_ZZ'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_ZB_ZZ'))
                                            } else if (value === 'XZ_JZ') {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_ZB_JZ'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_ZB_JZ'))
                                            } else if (value === 'XZ_LRFP' && !beAccrued) {
                                                dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,'STATE_ZB_ZFLR'))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_ZB_ZFLR'))
                                            } else {
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                            }
                                            dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',value))
                                        }}
                                        >
                                        <Option key='a' value={'XZ_ZZ'}>增资</Option>
                                        <Option key='b' value={'XZ_LRFP'}>利润分配</Option>
                                        <Option key='c' value={'XZ_JZ'}>减资</Option>
                                    </Select>
                                </div>
                                // {/* <div>
                                //     <RadioGroup
                                //         disabled={runningInsertOrModify === 'modify'}
                                //         onChange={e => {
                                //             if(e.target.value === 'XZ_ZZ' ) {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_ZB_ZZ'))
                                //             } else if (e.target.value === 'XZ_JZ') {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_ZB_JZ'))
                                //             } else if (e.target.value === 'XZ_LRFP' && !beAccrued) {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState','STATE_ZB_ZFLR'))
                                //             } else {
                                //                 dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState',''))
                                //             }
                                //             dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',e.target.value))
                                //         }}
                                //         value={propertyCost}
                                //         >
                                //         <Radio key="a" value={'XZ_ZZ'} >增资</Radio>
                                //         <Radio key="b" value={'XZ_LRFP'}>利润分配</Radio>
                                //         <Radio key="c" value={'XZ_JZ'}>减资</Radio>
                                //     </RadioGroup>
                                // </div> */}
                            }
                    </div>
                    :
                    null
            }
            {/* 费用支出／薪酬支出费用性质 */}
            {
                 propertyCostList
                 && propertyCostList.size > 1
                 &&  ((categoryType === 'LB_FYZC' && runningState!== 'STATE_FY_DJ')
                    || categoryType === 'LB_XCZC'
                    || categoryType === 'STATE_XC_JN' && beAccrued && runningState === 'STATE_XC_JT'
                    || runningState === 'STATE_XC_FF'
                    || categoryType === 'LB_XCZC' && !beAccrued
                    || assetType === 'XZ_ZJTX')
                 && !hasChecked?
              // propertyCostList && propertyCostList.size > 1 && (categoryType==='LB_FYZC'||categoryType==='LB_XCZC' && beAccrued && runningState === 'STATE_XC_JT'||categoryType==='LB_XCZC' && !beAccrued )?
                <div className="accountConf-modal-list-item">
                    <label>费用性质：</label>
                    <div>
                        <Select
                            disabled={isQueryByBusiness && beCertificate }
                            value={propertyCost}
                            onChange={value => {
                                dispatch(lrAccountActions.changeLrAccountCommonString('card','propertyCost',value))
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
                    </div>
                </div>
                :
                null
            }
        </div>
        )
    }
}
