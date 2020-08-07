import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, Switch, SwitchText, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ContancsCom, ProjectCom, costList, propertyCostObj, abstractFun } from '../components'
import { cqzcAccountActions } from 'app/redux/Edit/Lrls/cqzcAccount'
import * as Limit from 'app/constants/Limit.js'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import * as Common from '../CommonData.js'
import { DateLib } from 'app/utils'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Cqzc extends React.Component {

	render () {
		const { dispatch, homeAccountState, cqzcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList,enclosureCountUser } = this.props

		const rate = homeAccountState.get('rate')
		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = cqzcAccountState.get('data')
		const insertOrModify = cqzcAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const flowNumber = data.get('flowNumber')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

		const acAssets = data.get('acAssets')
		const beManagemented = acAssets.get('beManagemented')//收付管理
		const beCleaning = acAssets.get('beCleaning')//清除处置
		const beCarryover = data.get('beCarryover')//结转损益

		// const assetTypeList = [{key: '购进资产', value: 'XZ_GJZC'}, {key: '资产折旧/摊销', value: 'XZ_ZJTX'}, {key: '处置', value: 'XZ_CZZC'}]
		const assetTypeList = [{key: '购进资产', value: 'XZ_GJZC'}, {key: '处置', value: 'XZ_CZZC'}]
		const assetType = data.get('assetType')
		const assetTypeName = {XZ_GJZC: '购进资产', XZ_CZZC: '处置', XZ_ZJTX: '资产折旧/摊销'}[assetType]

		const scale = rate.get('scale')
		const taxRate = data.get('taxRate')
		const tax = data.get('tax')
		const billType = data.get('billType')
		const billStates = data.get('billStates')
		const billList = data.get('billList')

		let carryoverCom = null//结转损益
		let invoiceCom = null//发票
		let taxRateCom = null//税率组件

		//费用性质
		const propertyCostList = data.get('propertyCostList')
		const propertyList = costList(propertyCostList)
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acAssets, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		let radioList = []
		const showAccount = runningState === 'STATE_CQZC_WF' || runningState === 'STATE_CQZC_WS' || assetType == 'XZ_ZJTX' ? false : true//是否显示账户

		;({
			'XZ_GJZC': () => {//购进资产
				radioList = [
					{key: 'STATE_CQZC_WF', value: '未付款', disabled: !beManagemented, message: '流水设置中未启用'},
					{key: 'STATE_CQZC_YF', value: '已付款'}
				]

				if (scale === 'general') {
					taxRateCom = (<Row className='lrls-more-card lrls-margin-top'>
						<label>税率:</label>
						<SinglePicker
							district={Common.taxRateList}
							value={taxRate}
							onOk={value => {
								dispatch(cqzcAccountActions.changeTaxRate(value.value))
							}}
						>
							<Row className='lrls-padding lrls-category'>
								<span>
									{ `${taxRate}%` }
									<span className='lrls-placeholder'>
										(税额：<Amount showZero>{tax}</Amount> 价税合计: <Amount showZero>{amount}</Amount>)
									</span>
								</span>
								<Icon type="triangle" />
							</Row>
						</SinglePicker>
					</Row>)


					invoiceCom = (<Row className='lrls-card'>
						<Row className='yysr-bill'>
							<div className='lrls-more-card'>
								<label>票据类型:</label>
								<SinglePicker
									district={[{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]}
									value={billType}
									onOk={value => {
										dispatch(cqzcAccountActions.changeCqzcData('billType', value.value))
									}}
								>
									<Row className='lrls-padding lrls-category'>
										<span>
											{ billType == 'bill_special' ? '增值税专用发票' : '其他票据' }
										</span>
										<Icon type="triangle" />
									</Row>
								</SinglePicker>
							</div>

							{
								billType == 'bill_special' ? <SwitchText
									checked={billStates === 'bill_states_auth' ? true : false}
									checkedChildren='已认证'
									unCheckedChildren='未认证'
									className='threeTextSwitch'
									onChange={() => {
										dispatch(cqzcAccountActions.changeBillStates())
									}}
								/> : null
							}
						</Row>
						{
							billType == 'bill_special' ? <Row>
								{ taxRateCom }
							</Row> : null
						}
					</Row>)
				}

			},
			'XZ_CZZC': () => {//处置
				radioList = [
					{key: 'STATE_CQZC_WS', value: '未收款', disabled: !beManagemented, message: '流水设置中未启用'},
					{key: 'STATE_CQZC_YS', value: '已收款'}
				]
				taxRateCom = (<Row className='lrls-more-card lrls-margin-top'>
					<label>税率:</label>
					<SinglePicker
						district={scale == 'general' ? Common.taxRateList : Common.smallTaxRateList}
						value={taxRate}
						onOk={value => {
							dispatch(cqzcAccountActions.changeTaxRate(value.value))
							dispatch(cqzcAccountActions.autoCqzcCzAmount())
						}}
					>
						<Row className='lrls-padding lrls-category'>
							<span>
								{ `${taxRate}%` }
								<span className='lrls-placeholder'>
									(税额：<Amount showZero>{tax}</Amount> 价税合计: <Amount showZero>{amount}</Amount>)
								</span>
							</span>
							<Icon type="triangle" />
						</Row>
					</SinglePicker>
				</Row>)

				invoiceCom = (<Row className='lrls-card' style={{display: scale == 'isEnable' ? 'none' : ''}}>
					<Row className='yysr-bill'>
						<div className='lrls-more-card'>
							<label>票据类型:</label>
							<SinglePicker
								district={[{key: '发票', value: 'bill_common'}, {key: '其他票据', value: 'bill_other'}]}
								value={billType}
								onOk={value => {
									dispatch(cqzcAccountActions.changeCqzcData('billType', value.value))
									if (value.value === 'bill_common') {
										dispatch(cqzcAccountActions.autoCqzcCzAmount())
									}
								}}
							>
								<Row className='lrls-padding lrls-category'>
									<span> { billType == 'bill_common' ? '发票' : '其他票据' } </span>
									<Icon type="triangle" />
								</Row>
							</SinglePicker>
						</div>

						{
							billType == 'bill_common' ? <SwitchText
								checked={billStates === 'bill_states_make_out' ? true : false}
								checkedChildren='已开票'
								unCheckedChildren='未开票'
								className='threeTextSwitch'
								onChange={() => {
									dispatch(cqzcAccountActions.changeBillStates())
								}}
							/> : null
						}
					</Row>
					{
						billType == 'bill_common' ? <Row>
							{ taxRateCom }
						</Row> : null
					}
				</Row>)

				if (beCleaning) {//开启结转损益
					const originalAssetsAmount = acAssets.get('originalAssetsAmount')// 资产原值
					const depreciationAmount = acAssets.get('depreciationAmount')// 折旧累计
					let totalAmount = 0
					if (billType === 'bill_common') {
						totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount) - Number(tax)
					} else {
						totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)
					}

					let projectCardCom = null
					const beProject = data.get('beProject')
					const project = homeAccountState.get('project')
					const usedProject = project.get('usedProject')
					const projectCard = project.getIn(['projectCard', 0])
					let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
					let projectCardList = project.get('projectCardList').filter(v => v.get('value').includes('COMNCRD')==false)

					carryoverCom = <Row className='lrls-card'>
						<Row className='lrls-more-card'>
							<span>处置损益</span>
							<div className='noTextSwitchShort'>
								<Switch
									checked={beCarryover}
									color='#FF8348'
									onClick={() => {
										dispatch(cqzcAccountActions.changeBeCarryover())
										if (!beCarryover) {//开启时
											dispatch(cqzcAccountActions.autoCqzcCzAmount())
											if (isModify) {
												dispatch(cqzcAccountActions.changeCqzcViews())
											}
										}

									}}
								/>
							</div>
						</Row>
						<div className='lrls-more-card margin-top-bot lrls-jzsy' style={{display: beProject && beCarryover ? '' : 'none'}}>
							<label>项目:</label>
							<SinglePicker
								disabled={!usedProject}
								district={projectCardList.toJS()}
								value={projectCard.get('uuid') ? `${projectCard.get('uuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
								onOk={value => { dispatch(homeAccountActions.changeProjectCard('card', value.value, 0)) }}
							>
								<Row className='lrls-category lrls-padding'>
									{
										projectCard.get('uuid') ? <span> {showName} </span>
										: <span className='lrls-placeholder'>点击选择项目卡片</span>
									}
									<Icon type="triangle" />
								</Row>
							</SinglePicker>
							<div className='noTextSwitchShort' style={{marginLeft: '6px'}}>
								<Switch
									checked={usedProject}
									color='#FF8348'
									onClick={() => {
										dispatch(homeAccountActions.changeHomeAccountData('project', !usedProject))
										if (usedProject) {
											dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
										}
									}}
								/>
							</div>
						</div>
						{
							beCarryover ?
							<Row>
								<Row>
									<label style={{marginRight: '.15rem'}}>{totalAmount >= 0 ? '净收益金额：' : '净损失金额：'}</label>
									<Amount showZero>{Math.abs(totalAmount)}</Amount>
								</Row>
								<Row className='yysr-amount margin-top-bot lrls-jzsy'>
									<label>资产原值:</label>
									<TextListInput
										placeholder='请填写资产原值'
										value={originalAssetsAmount}
										onChange={(value) => {
											if (/^\d*\.?\d{0,2}$/g.test(value)) {
												dispatch(cqzcAccountActions.changeCqzcCzAmount('originalAssetsAmount', value))
												dispatch(cqzcAccountActions.autoCqzcCzAmount())
											}
										}}
									/>
								</Row>
								<Row className='yysr-amount margin-top-bot lrls-jzsy'>
									<label>累计折旧余额:</label>
									<TextListInput
										placeholder='请填写累计折旧余额'
										value={depreciationAmount}
										onChange={(value) => {
											if (/^\d*\.?\d{0,2}$/g.test(value)) {
												dispatch(cqzcAccountActions.changeCqzcCzAmount('depreciationAmount', value))
												dispatch(cqzcAccountActions.autoCqzcCzAmount())
											}
										}}
									/>
								</Row>
							</Row> : null
						}
					</Row>
				}

			},
			'XZ_ZJTX': () => {//折旧摊销
				radioList = [{key: 'STATE_CQZC_ZJTX', value: '长期资产折旧摊销'}]
			}

		}[assetType] || (() => null))()



		let contactsCardCom = null
		if (beManagemented && assetType != 'XZ_ZJTX') {
			const contactsCardList = cqzcAccountState.get('contactsCardList')//往来关系列表
			const contactsCardRange = acAssets.get('contactsCardRange')//往来关系卡片
			const contactsRange = acAssets.get('contactsRange')
			let onOk = (value) => {
				dispatch(cqzcAccountActions.changeAcList(value.value, 'contactsCardRange'))
			}
			contactsCardCom = <ContancsCom
				cardList={contactsCardList}
				cardObj={contactsCardRange}
				onOk={onOk}
				history={history}
				dispatch={dispatch}
				isPayUnit={assetType == 'XZ_GJZC' ? true : false}
				contactsRange={contactsRange}
				disabled={isModify}
			/>
		}

		let projectCardCom = null
		const beProject = data.get('beProject')
		const project = homeAccountState.get('project')
		const usedProject = project.get('usedProject')
		if (beProject && assetType == 'XZ_ZJTX') {
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				noAmount={true}
				noMore={true}
				showCommon={true}
			/>
		}



		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(cqzcAccountActions.changeCqzcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(cqzcAccountActions.changeCqzcData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
					}}
				/>

				{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }

				<ScrollView flex="1">
					<div className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={categoryName}
						/>

						<Row className='lrls-more-card lrls-margin-top lrls-switch'>
							<label>处理类型: </label>
							<SinglePicker
								district={assetTypeList}
								value={assetType}
								onOk={value => {
									dispatch(cqzcAccountActions.changePropertyCost(value.value))
									if (beManagemented) {
										dispatch(cqzcAccountActions.getCqzcCardList('contactsRange'))
									}
								}}
							>
								<Row className='lrls-padding lrls-category'>
									<span>
										{ assetTypeName }
									</span>
									<Icon type="triangle" />
								</Row>
							</SinglePicker>
							{
								(beProject && assetType == 'XZ_ZJTX') ? <SwitchText
									checked={usedProject}
									checkedChildren='项目'
									unCheckedChildren=''
									className='topBarSwitch'
									onChange={(value) => {
										dispatch(homeAccountActions.changeHomeAccountData('project', !usedProject))
									}}
								/> : null
							}
						</Row>

						{
							(assetType == 'XZ_ZJTX' && propertyList.length > 1) ?
								<Row className='lrls-more-card lrls-margin-top'>
									<label>费用性质: </label>
									<SinglePicker
										district={propertyList}
										value={propertyCost}
										onOk={value => {
											dispatch(cqzcAccountActions.changeCqzcData('propertyCost', value.value))
										}}
									>
										<Row className='lrls-padding lrls-category'>
											<span className={propertyCostName !='请选择费用性质' ? '' : 'lrls-placeholder'}>
												{ propertyCostName }
											</span>
											<Icon type="triangle" />
										</Row>
									</SinglePicker>
								</Row>

							: null
						}

						{
							assetType == 'XZ_ZJTX' ? null : <Radio
								disabled={isModify}
								list={radioList}
								value={runningState}
								onChange={(key) => {
									dispatch(cqzcAccountActions.changeCqzcData('runningState', key))
									dispatch(cqzcAccountActions.changeCqzcData('runningAbstract', abstractFun(key, data)))
								}}
							/>
						}
					</div>

					<Row className='lrls-card lrls-line'>
						<label>摘要:</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(cqzcAccountActions.changeCqzcData('runningAbstract', value))
							}}
						/>
					</Row>

					{ projectCardCom }

					<div className='lrls-card'>
						{/* 往来关系卡片 */}
						{ contactsCardCom }
						<Row className='yysr-amount'>
							<label>金额：</label>
							<TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(cqzcAccountActions.changeAmount(value))
									}
									if (beCarryover) {//开启时
										dispatch(cqzcAccountActions.autoCqzcCzAmount())
									}
								}}
							/>
							{ showAccount ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(cqzcAccountActions.changeAccount(value))}
							/> : null }
						</Row>
					</div>

					{/* 发票 */}
					{ invoiceCom }
					{/* 结转损益 */}
					{ carryoverCom }
					<UploadFj
						dispatch={dispatch}
						enCanUse={enCanUse}
						editPermission={editPermission}
						enclosureList={enclosureList}
						showlsfj={showlsfj}
						checkMoreFj={checkMoreFj}
						label={label}
						enclosureCountUser={enclosureCountUser}
						history={history}
					/>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(cqzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>

					<Button onClick={() => {
						dispatch(cqzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
