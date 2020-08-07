import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { connect }	from 'react-redux'
import { toJS, is ,fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon, Switch } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import SelectRadio from './SelectRadio'
import PayOrPreAmount from './PayOrPreAmount'

import GoodsCost from './GoodsCost'
import { formatNum } from 'app/utils'

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class TransferProfitorCost extends React.Component {
    componentWillReceiveProps() {
        // this.props.dispatch(lrAccountActions.calculateGain())
    }
    render() {
        const {
            dispatch,
            flags,
            cardTemp,
            taxRateTemp,
            allState,
            callback
        } = this.props
        const runningState = cardTemp.get('runningState')
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
        const beCarryover = cardTemp.getIn([categoryTypeObj,'beCarryover'])
        const isQueryByBusiness = flags.get('isQueryByBusiness')
        const runningInsertOrModify = flags.get('runningInsertOrModify')
        const beCarryoverOut = cardTemp.get('beCarryover')
        const stockAc = cardTemp.getIn([categoryTypeObj, 'stockAc'])
        const carryoverAc = cardTemp.getIn([categoryTypeObj, 'carryoverAc'])
        const beCleaning = cardTemp.getIn([categoryTypeObj,'beCleaning'])
        const propertyCost =cardTemp.get('propertyCost')
        const specialStateforAccrued = flags.get('specialStateforAccrued')
        const specialStateforAssets = flags.get('specialStateforAssets')
        const cleaningAmount = cardTemp.getIn([categoryTypeObj, 'cleaningAmount'])
        const originalAssetsAmount = cardTemp.getIn([categoryTypeObj, 'originalAssetsAmount'])
        const incomeAc = cardTemp.getIn([categoryTypeObj, 'incomeAc'])
        const lossAmount = cardTemp.getIn([categoryTypeObj, 'lossAmount'])
        const lossAc = cardTemp.getIn([categoryTypeObj, 'lossAc'])
        const beAccrued = cardTemp.getIn([categoryTypeObj, 'beAccrued'])
        const netProfitAmount = cardTemp.getIn([categoryTypeObj, 'netProfitAmount'])
		const carryoverCardList = cardTemp.getIn([categoryTypeObj, 'carryoverCardList'])
        const businessList = cardTemp.get('businessList')
        const runningType = cardTemp.get('runningType')
        const beProject = cardTemp.get('beProject')
        const usedProject = cardTemp.get('usedProject')
        const propertyCarryover = cardTemp.get('propertyCarryover')
        const projectCard = cardTemp.get('projectCard')
        const projectRange = cardTemp.get('projectRange')
        const assetType = cardTemp.get('assetType')
        const projectList = flags.get('projectList')?flags.get('projectList'):fromJS([])
        //数字校验
        const numberTest = (e, dispatchFunc) => {
            if (e.target.value === undefined)
                return

            let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
            if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
                value = value.substr(1)
            }
            if (reg.test(value) || (value === '')) {
                dispatchFunc(value)
            } else {
                message.info('金额只能输入带两位小数的数字')
            }
        }
        const reg = /^\d*\.?\d{0,2}$/
        return(
            <div>
                {/*  营业收入 结转成本 */}
        		{
        			runningState && runningState!='STATE_YYSR_DJ' && categoryType === 'LB_YYSR' && propertyCarryover !== 'SX_FW' && beCarryover && runningInsertOrModify !== 'modify'?
        				<div>
        					<div className="accountConf-separator"></div>
        					<label>
        						<Checkbox
        							checked={beCarryoverOut}
        							onChange={(e) => {
        								dispatch(lrAccountActions.changeLrAccountCommonString('card','beCarryover', e.target.checked))
        							}}
        						/>
        					<span>
        						{`${runningState === 'STATE_YYSR_XS'?'结转成本':'转回成本'}`}
        					</span>
        					</label>
        					{
        						beCarryoverOut && carryoverCardList?
                                    carryoverCardList.map((v,i) =>
                                        <div>
                                        {
                                            carryoverCardList.size>1?
                                            <div className="accountConf-modal-list-item">
                    							<label>存货：</label>
                    							<div>
                                                    {`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
                    							</div>
                    						</div>
                                            :null
                                        }
                                         <div className="accountConf-modal-list-item">
                 							<label>成本金额：</label>
                 							<div>
                 								<Input
                 									value={v.get('amount')}
                 									onChange={(e) => {
                 										numberTest(e,(value) => {
                 											dispatch(lrAccountActions.changeLrAccountCommonString('card',[categoryTypeObj,'carryoverCardList',i,'amount'], value))

                 										})
                 									}}

                 								/>
                 							</div>
                 						</div>
                                    </div>
                                    )
            						:
            						null
        					}
        				</div>
        				:
        				null
        		}
                {/* 处置损益 */}
        		{
        			beCleaning && assetType ==='XZ_CZZC' || runningState === 'STATE_CQZC_JZSY' ?
        			<div>
        				<div className="accountConf-modal-list-item" style={{display:runningType !== 'LX_JZSY_SS' && runningType !== 'LX_JZSY_SY' && !specialStateforAssets && runningInsertOrModify === 'insert'? '' : 'none'}}>
        					<label>
        						<Checkbox
        							checked={beCarryoverOut}
        							onChange={(e) => {
        									dispatch(lrAccountActions.changeLrAccountCommonString('card','beCarryover', e.target.checked))
        							}}
        						/>
        					<span>
        						处置损益
        					</span>
        					</label>
                            {
                                beProject
                             && categoryType === 'LB_CQZC'
                             && runningState !== 'STATE_CQZC_JZSY'
                             && beCarryoverOut ?
                                <Switch
                                    className="use-unuse-style"
                                    style={{marginLeft:'.2rem'}}
                                    checked={usedProject}
                                    checkedChildren={'项目'}
                                    onChange={() => {
                                        dispatch(lrAccountActions.changeLrAccountCommonString('card','usedProject',!usedProject))
                                    }}
                                />:null
                            }

        				</div>
        				{
        					beCarryoverOut && (businessList && !businessList.size || !businessList)  || runningType === 'LX_JZSY_SY' || runningType === 'LX_JZSY_SS' ?
        					<div >
        							{
        								 netProfitAmount >= 0?
        								<div className="accountConf-modal-list-item">
        									<label>净收益金额：</label>
        									<div>
        											{netProfitAmount}
        									</div>
        								</div>
        								:
        								(
        									lossAmount > 0?
        									<div className="accountConf-modal-list-item">
        										<label>净损失金额：</label>
        										<div>
        												{lossAmount}
        										</div>
        									</div>
        									:
        									''
        								)
        							}
                                    {
                    					   beProject
                    					&& usedProject
                                        && categoryType === 'LB_CQZC'
                                        && runningState !== 'STATE_CQZC_JZSY'?
                    						projectCard.map((v,i) =>
                    						<div key={i}>
                    						<div className="accountConf-modal-list-item" >
                    							<label>项目：</label>
                    							<div className='chosen-right'>
                    								{
                    									specialStateforAccrued?
                    										<div>
                    											{`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
                    										</div>
                    										:
                    										<Select
                    											combobox
                                                                showSearch
                    											value={`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
                    											onChange={value => {
                    												const valueList = value.split(Limit.TREE_JOIN_STR)
                    												const uuid = valueList[0]
                    												const code = valueList[1]
                    												const name = valueList[2]
                    												const amount = v.get('amount')
                    												dispatch(lrAccountActions.changeLrAccountCommonString('card', ['projectCard',i], fromJS({uuid,name,code,amount})))
                    											}}
                    											>
                                                                    {projectList.filter(v => {
                        												if (categoryType === 'LB_FYZC'
                        											    || runningState === 'STATE_XC_JT'
                        											    || !beAccrued && runningState === 'STATE_XC_JN'
                        											    || propertyCost === 'XZ_CHLX' && (runningState === 'STATE_JK_JTLX' || !beAccrued && runningState === 'STATE_JK_ZFLX' )) {
                        													return true
                        											    } else if (v.get('code') === 'COMNCRD') {
                        													return false
                        												}
                        												return true
                        												}).map((v, i) =>
                        												<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                        													{`${v.get('code') !== 'COMNCRD'?v.get('code'):''} ${v.get('name')}`}
                        												</Option>
                        											)}
                    										</Select>

                    								}
                    								<div className='chosen-word'
                    									onClick={() => {
                    										dispatch(lrAccountActions.getProjectAllCardList(projectRange,'showContactsModal'))
                    										dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'project'))
                                                            callback()

                    								}}>选择</div>
                    							</div>


                    						</div>
                    						</div>
                    					):null

                    				}
        							<div className="accountConf-modal-list-item">
        								<label>资产原值：</label>
        								<div>
        									<Input
        										value={cardTemp.getIn([categoryTypeObj,'originalAssetsAmount'])}
        										onChange={(e) => {
        											numberTest(e,(value) => {
        												dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj,'originalAssetsAmount'], value))
        												dispatch(lrAccountActions.calculateGain())

        											})
        										}}

        									/>
        								</div>
        							</div>
        							<div className="accountConf-modal-list-item">
        								<label>累计折旧余额：</label>
        								<div>
        									<Input
        										value={ cardTemp.getIn([categoryTypeObj,'depreciationAmount'])}
        										onChange={(e) => {
        											numberTest(e,(value) => {
        												dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj,'depreciationAmount'], value))
        												dispatch(lrAccountActions.calculateGain())

        											})
        										}}

        									/>
        								</div>
        							</div>
        						</div>
        						:
        						null
        				}

        				</div>
        				:
        				null
        			}
        			{
        			   beCleaning && !beCarryover && runningState !== 'STATE_CQZC_JZSY' && assetType === 'XZ_CZZC' && runningInsertOrModify === 'modify' && (businessList && !businessList.size || !businessList)?
        				<div style={{marginBottom:'10px'}}>
        					<Button
        						type="ghost"
        						onClick={() => {
        							dispatch(lrAccountActions.AsssetsInsert())
        							dispatch(lrAccountActions.changeLrAccountCommonString('card','runningState', 'STATE_CQZC_JZSY'))
        							dispatch(lrAccountActions.changeLrAccountCommonString('card','beCarryover', true))
        							dispatch(lrAccountActions.calculateGain())
                                    dispatch(lrAccountActions.changeStateAndAbstract(fromJS(cardTemp),'STATE_CQZC_JZSY'))

        						}}
        						>
        						处置损益
        					</Button>
        				</div>

        				:
        				null
	             }
            </div>
        )
    }
}
