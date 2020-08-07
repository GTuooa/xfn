import React, { PropTypes }	from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'

import { Switch, XfInput, Button, ButtonGroup, Icon, Container, Row, Form, ScrollView, Multiple } from 'app/components'
const { Item } = Form

import XCWater from './XCWater.js'
import SelectRadio from './SelectRadio'

import { configCheck } from 'app/utils'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RunningInsert extends React.Component {

	static displayName = 'AccountInsert'

    componentDidMount() {
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
    }

    render() {
        const {
            dispatch,
            history,
            allState,
			homeState,
			runningConfState,
		} = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const isOpenedInventory = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('INVENTORY')
		const isOpenedProject = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('PROJECT')

        const views = runningConfState.get('views')
        const taxRateTemp = allState.get('taxRate')
        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')

		let showManagemented, propertyShow, categoryTypeObj
		let direction = 'debit'
		let isShowAbout = false
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
			},
			'LB_YYWZC': () => {
				showManagemented = true
				propertyShow = '营业外支出'
				categoryTypeObj = 'acBusinessOutExpense'
				direction = 'credit'
				isShowAbout = true
			},
			'LB_JK': () => {
				showManagemented = true
				propertyShow = '借款'
				categoryTypeObj = 'acLoan'
			},
			'LB_TZ': () => {
				showManagemented = true
				propertyShow = '投资'
				categoryTypeObj = 'acInvest'
			},
			'LB_ZB': () => {
				showManagemented = true
				propertyShow = '资本'
				categoryTypeObj = 'acCapital'
			},
			'LB_CQZC': () => {
				showManagemented = true
				propertyShow = '长期资产'
				categoryTypeObj = 'acAssets'
			},
			'LB_FYZC': () => {
				showManagemented = true
				propertyShow = '费用支出'
				categoryTypeObj = 'acCost'
			},
			'LB_ZSKX': () => {
				showManagemented = true
				propertyShow = '暂收款项'
				categoryTypeObj = 'acTemporaryReceipt'
				isShowAbout = true
			},
			'LB_ZFKX': () => {
				showManagemented = true
				propertyShow = '暂付款项'
				categoryTypeObj = 'acTemporaryPay'
				isShowAbout = true
				direction = 'credit'
			},
			'LB_XCZC': () => {
				showManagemented = false
				propertyShow = '薪酬支出'
				categoryTypeObj = 'acPayment'
			},
			'LB_SFZC': () => {
				showManagemented = false
				propertyShow = '税费支出'
				categoryTypeObj = 'acTax'
			}
		}[categoryType] || (() => ''))()

		const insertOrModify = views.get('insertOrModify')
        const property = runningTemp.get('property')
		const parentName = runningTemp.get('parentName')
		const name = runningTemp.get('name')
		const beCarryover = runningTemp.getIn([categoryTypeObj,'beCarryover'])
		const beDeposited = runningTemp.getIn([categoryTypeObj, 'beDeposited'])
		const beSpecial = runningTemp.get('beSpecial')
		const canDelete = runningTemp.get('canDelete')
		const propertyCostList = runningTemp.get('propertyCostList')? runningTemp.get('propertyCostList') : fromJS([])
		const propertyPay = runningTemp.get('propertyPay')
		const mediumAssCategory = runningTemp.get('mediumAssCategory')
		const beZeroInventory = runningTemp.getIn([categoryTypeObj,'beZeroInventory'])



		const propertyCarryover = runningTemp.get('propertyCarryover')
		const propertyTax = runningTemp.get('propertyTax')

		const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
		const beInAdvance = runningTemp.getIn([categoryTypeObj, 'beInAdvance'])
		const beTurnOut = runningTemp.getIn([categoryTypeObj, 'beTurnOut'])
		const propertyInvest = runningTemp.get('propertyInvest')
		const level = runningTemp.get('level')
		const propertyAssets = runningTemp.get('propertyAssets')
		const beCleaning = runningTemp.getIn([categoryTypeObj, 'beCleaning'])



		// 应收账款、应付账款、其他应收款、其他应付款、预收账款、预付账款
		const beManagemented = runningTemp.getIn([categoryTypeObj, 'beManagemented'])
		const canManagement = runningTemp.getIn([categoryTypeObj,'canManagement'])
		const currentManagement = runningTemp.getIn([categoryTypeObj,'currentManagement'])
		const canDeposited = runningTemp.getIn([categoryTypeObj,'canDeposited'])
		const currentDeposited = runningTemp.getIn([categoryTypeObj,'currentDeposited'])
		const canSellOff = runningTemp.getIn([categoryTypeObj,'canSellOff'])
		const currentSellOff = runningTemp.getIn([categoryTypeObj,'currentSellOff'])
		const canAccrued = runningTemp.getIn([categoryTypeObj,'canAccrued'])
		const currentAccrued = runningTemp.getIn([categoryTypeObj,'currentAccrued'])
		const currentInAdvance = runningTemp.getIn([categoryTypeObj,'currentInAdvance'])
		const canInAdvance = runningTemp.getIn([categoryTypeObj,'canInAdvance'])
		const canCleaning = runningTemp.getIn([categoryTypeObj,'canCleaning'])
		const currentCleaning = runningTemp.getIn([categoryTypeObj,'currentCleaning'])
		const currentContactsRange = runningTemp.getIn([categoryTypeObj,'currentContactsRange'])
		const currentStockRange = runningTemp.getIn([categoryTypeObj,'currentStockRange'])
		const beReduce = runningTemp.getIn([categoryTypeObj, 'beReduce'])
		const currentReduce = runningTemp.getIn([categoryTypeObj, 'currentReduce'])
		const canReduce = runningTemp.getIn([categoryTypeObj, 'canReduce'])
		const curPropertyCostList = runningTemp.get('curPropertyCostList')?runningTemp.get('curPropertyCostList'):fromJS([])
		const currentPropertyTax = runningTemp.get('currentPropertyTax')
		const canUse = runningTemp.get('canUse')
		const propertyList = runningTemp.getIn([categoryTypeObj, 'propertyList'])?runningTemp.getIn([categoryTypeObj, 'propertyList']):fromJS([])
		const currentProjectRange = runningTemp.get( 'currentProjectRange')?runningTemp.get( 'currentProjectRange'):fromJS([])
		const scale = taxRateTemp.get('scale')
        const allStockRange = runningTemp.getIn([categoryTypeObj,'allStockRange'])
        const stockRange = runningTemp.getIn([categoryTypeObj,'stockRange'])
        const allContactsRange= runningTemp.getIn([categoryTypeObj,'allContactsRange'])
        const contactsRange = runningTemp.getIn([categoryTypeObj,'contactsRange'])
		const beWithholding = runningTemp.getIn([categoryTypeObj, 'beWithholding'])
		const beWithholdSocial = runningTemp.getIn([categoryTypeObj, 'beWithholdSocial'])
		const beWithholdTax = runningTemp.getIn([categoryTypeObj, 'beWithholdTax'])
		const beSellOff = runningTemp.getIn([categoryTypeObj,'beSellOff'])
		const contactsManagement = runningTemp.getIn([categoryTypeObj,'contactsManagement'])
		const canContactsManagement = runningTemp.getIn([categoryTypeObj,'canContactsManagement'])
        const currentContactsManagement = runningTemp.getIn([categoryTypeObj,'currentContactsManagement'])
		const beProject = runningTemp.get('beProject')
		const currentProject = runningTemp.get('currentProject')
		const canProject = runningTemp.get('canProject')
		const allProjectRange = runningTemp.get('allProjectRange')
		const projectRange = runningTemp.get('projectRange')

		const contactsNameList = contactsRange ? contactsRange.map(v => allContactsRange.find(w => w.get('uuid') === v).get('name')) : fromJS([])
		const projectNameList = projectRange ? projectRange.map(v => allProjectRange.find(w => w.get('uuid') === v).get('name')) : fromJS([])
		let checkList = []
		if (beWithholding) {
			checkList.push('beWithholding')
		}
		if (beWithholdSocial) {
			checkList.push('beWithholdSocial')
		}
		if (beWithholdTax) {
			checkList.push('beWithholdTax')
		}

		const selectRange = (checkTitle, checkGroup) => {
			let groupData = []
			switch (checkTitle) {
				case '存货范围':
					groupData = stockRange
					break
				case '往来单位范围':
					groupData = contactsRange
					break
				case '项目范围':
					groupData = projectRange
					break
				case '费用性质':
					groupData = propertyCostList
					break
				case '代缴款项':
				case '代扣款项':
					groupData = fromJS(checkList)
					break
				default:
			}
			// dispatch(runningConfActions.runningConfigSelectCardRange('存货范围', checkGroup, groupData, history))
			dispatch(runningConfActions.runningConfigSelectCardRange(checkTitle, checkGroup, groupData, history))
		}

		const showContacts = (contactsManagement && newJr) || (!newJr && beManagemented)//是否开启往来


        return (
			<Container className='accountConfig-modal'>
				<ScrollView flex="1" className='form'>
					{/* <Form> */}
						<Item label="类别名称：">
							<XfInput.BorderInputItem
								textAlign="right"
								value={name}
								placeholder={"请填入类别名称"}
								onChange={value => dispatch(runningConfActions.changeRunningTemp('name', value))}
							/>
						</Item>
						<Item label="上级类别：">
							<XfInput.BorderInputItem
								textAlign="right"
								value={parentName}
								disabled={true}
								// onChange={value => dispatch(runningConfActions.changeRunningTemp('name', e.target.value))}
							/>
						</Item>
						<Item label="备注：">
							<XfInput.BorderInputItem
								textAlign="right"
								value={runningTemp.get('remark')}
								placeholder={"选填(限60个字符)"}
								onChange={value => dispatch(runningConfActions.changeRunningTemp('remark', value))}
							/>
						</Item>

						<SelectRadio
							runningTemp={runningTemp}
							dispatch={dispatch}
							direction={direction}
							categoryTypeObj={categoryTypeObj}
							insertOrModify={insertOrModify}
							newJr={newJr}
							allStockRange={allStockRange}
							currentStockRange={currentStockRange}
							isOpenedInventory={isOpenedInventory}
							history={history}
						/>
						
						{
							(categoryType ==='LB_FYZC' || categoryType ==='LB_XCZC') && propertyCostList.some(v => v === 'XZ_FINANCE') ?
								<Item label='费用性质：'>
									<span
										className='over-dian  checkbox-words'
										style={{color:'#eee'}}
										>
										财务费用
									</span>
									<Icon type='arrow-right' className='config-triangle' style={{color:'#eee'}} />
								</Item> : null
						}
						{
							(categoryType === 'LB_FYZC' || categoryType ==='LB_XCZC' || categoryType ==='LB_CQZC') && !propertyCostList.some(v => v === 'XZ_FINANCE') ?
								<Multiple
									district={[
										{key: '销售费用', value: 'XZ_SALE', disabled: (insertOrModify == 'insert' && !curPropertyCostList.some(w => w === 'XZ_SALE') || insertOrModify == 'modify' && !propertyList.some(w => w === 'XZ_SALE')) && level !== 1},
										{key: '管理费用', value: 'XZ_MANAGE', disabled: (insertOrModify == 'insert' && !curPropertyCostList.some(w => w === 'XZ_MANAGE') || insertOrModify == 'modify' && !propertyList.some(w => w === 'XZ_MANAGE')) && level !== 1}
									]}
									value={propertyCostList.toJS()}
									title={'费用性质'}
									className={'form-item-wrap'}
									onOk={(value) => {
										const valueArr = value.map(v => v.value)
										dispatch(runningConfActions.changeRunningTemp('propertyCostList', fromJS(valueArr)))
									}}
								>
									<Item label={`${categoryType ==='LB_CQZC'?'折旧/摊销':'费用'}性质：`}>
										<span className='over-dian checkbox-words'>
											{
												propertyCostList.map((v,i)=> <span key={i}>{`${{XZ_SALE:'销售费用',XZ_MANAGE:'管理费用'}[v]}${i<propertyCostList.size-1?',':''}`}</span>)
											}
										</span>
										<Icon type='arrow-right' className='config-triangle'/>
									</Item>
								</Multiple>
							: null
						}

						{
							showManagemented && (!['LB_ZSKX', 'LB_ZFKX', 'LB_JK', 'LB_TZ', 'LB_ZB'].includes(categoryType)) ?
							<Item label='收付管理：' className='m-top noTextSwitch'>
								{  ['LB_YYSR', 'LB_YYZC', 'LB_FYZC'].includes(categoryType) ?
								    <span className='checkbox-words gray' onClick={() => {history.push('/config/running/management')}}>
									    {beManagemented ? `已开启${beDeposited ? `并启用预${categoryType == 'LB_YYSR' ? '收' : '付'}`  : '' }` : '未开启'}
									    <Icon type='arrow-right' className='config-triangle'/>
									</span> 
									: 
								    <Switch
								        checked={beManagemented}
								        onClick={()=> {
									        dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beManagemented'], !beManagemented))
								        }}
							        />
						        }
							</Item> : null
						}

						{
							showManagemented ?
							<Item label='往来管理：' className='m-top'>
								<span className='checkbox-words gray over-dian' onClick={() => {history.push('/config/running/contacts')}}>
									{showContacts ? `${contactsNameList.size ? contactsNameList.reduce((p, c) => `${p}${p?'、':''}${c}`, ''): '已开启'}` : '未开启'}
								</span>
								<Icon type='arrow-right' className='config-triangle gray'/>
							</Item> : null
						}

                        {
							isOpenedProject && categoryType !== 'LB_ZB' && propertyTax !== 'SX_ZZS' && propertyTax !== 'SX_GRSF' ?
							<Item label='项目管理：' className='m-top'>
								<span className='checkbox-words gray over-dian' onClick={() => {history.push('/config/running/project')}}>
									{beProject ? `${projectNameList.size ? projectNameList.reduce((p, c) => `${p}${p?'、':''}${c}`, ''): '已开启'}` : '未开启'}
									<Icon type='arrow-right' className='config-triangle gray'/>
								</span>
							</Item> : null
						}

						{
							categoryTypeObj === 'acBusinessIncome' || categoryTypeObj === 'acBusinessExpense' ?
								<Item label={`支持录入退${categoryType === 'LB_YYSR'?'销':'购'}流水：`} className='noTextSwitch m-top'>
									<Switch
										checked={beSellOff}
										onClick={()=> {
											dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beSellOff'], !beSellOff))
										}}
										disabled={(insertOrModify == 'insert' && !currentSellOff|| insertOrModify == 'modify' && !canSellOff) && level !== 1 }
										disabledToast={'上级未启用'}
									/>
								</Item> : null
						}
						
						{
							categoryTypeObj === 'acBusinessExpense' && newJr && propertyCarryover === 'SX_HW' ?
								<Item label={`启用零库存模式：`} className='m-top'>
									<span className='noTextSwitch'>
									    <Switch
									    	checked={beZeroInventory}
									    	onClick={()=> {
									    		dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beZeroInventory'], !beZeroInventory))
									    	}}
									    	disabled={false}
									    	disabledToast={'上级未启用'}
									    />
									</span>
								</Item> : null
						}

						{
							propertyShow === '借款' ?
								<Item label='计提应付利息：' className='noTextSwitch m-top'>
									<Switch
										checked={beAccrued}
										onClick={()=> {
											dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beAccrued'], !beAccrued))
										}}
										disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && (level !== 1 || beSpecial) }
										disabledToast={'上级未启用'}
									/>
								</Item> : null
						}

						{
							categoryType === 'LB_ZB' ?
								<Item label='计提应付利润' className='noTextSwitch m-top'>
									<Switch
										checked={beAccrued}
										onClick={()=> {
											dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beAccrued'], !beAccrued))
										}}
										disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && (level !== 1 || beSpecial) }
										disabledToast={'上级未启用'}
									/>
								</Item> : null
						}

						{
							categoryType === 'LB_TZ' ?
								<Item label={`计提应收${propertyInvest === 'SX_GQ'?'股利':'利息'}：`} className='noTextSwitch m-top'>
									<Switch
										checked={beAccrued}
										onClick={()=> {
											dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beAccrued'], !beAccrued))
										}}
										disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && level !== 1 }
										disabledToast={'上级未启用'}
									/>
								</Item> : null
						}


						<XCWater
							dispatch={dispatch}
							runningTemp={runningTemp}
							categoryTypeObj={categoryTypeObj}
							parent={this}
							insertOrModify={insertOrModify}
							checkList={checkList}
							onSelect={(title, checkGroup) => selectRange(title, checkGroup)}
							history={history}
						/>
						{
							categoryType === 'LB_SFZC' && propertyTax ==='SX_ZZS' && scale === 'general' ?
								<Item label='预交增值税：' className='noTextSwitch m-top'>
									<Switch
										checked={beInAdvance}
										onClick={()=> {
											dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beInAdvance'], !beInAdvance))
										}}
										disabled={(insertOrModify == 'insert' && !currentInAdvance|| insertOrModify == 'modify' && !canInAdvance) && level !== 1 }
										disabledToast={'上级未启用'}
									/>
								</Item> : null
						}
						{
							propertyTax ==='SX_QTSF' || propertyTax ==='SX_QYSDS' ?
							<Item label={'计提税费：'} className='m-top'>
								<span className='checkbox-words gray' 
								    onClick={() => {
										if ((insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && level !== 1) {
                                            return thirdParty.toast.info('上级未启用',1)
										}
										history.push('/config/running/accrued')
									}}>
									{beAccrued ? `已开启${beReduce ? `并启用税费减免` : '' }`: '未开启'}
									<Icon type='arrow-right' className='config-triangle'/>
								</span>
							</Item> : null
						}

						{
							insertOrModify === 'modify' && level !== 1 ?
							<Item label='启用流水类别：' className='noTextSwitch m-top'>
								<Switch
									checked={canUse}
									onClick={()=> {
										dispatch(runningConfActions.changeRunningTemp( 'canUse' , !canUse))
									}}
								/>
							</Item> : null
						}
					{/* </Form> */}
				</ScrollView>
				<ButtonGroup height={50}>
					<Button onClick={() => history.goBack()}>
						<Icon type="cancel"/><span>取消</span>
					</Button>
					<Button disabled={!editPermission} 
					    onClick={() => {
							const checkList = [
								{
									type: 'name',
									value: name,
								}
							]
							configCheck.beforeSaveCheck(checkList, () => dispatch(allRunningActions.saveAccountConfRunningCategory(history)))
					    }}>
						<Icon type="save"/><span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>
        )
    }
}
