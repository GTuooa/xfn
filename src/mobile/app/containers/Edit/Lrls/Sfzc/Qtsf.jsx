import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Radio, TextListInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, Switch } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, costList, propertyCostObj, CategoryCom, xczcCom, ProjectCom, abstractFun, hxCom } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { sfzcAccountActions } from 'app/redux/Edit/Lrls/sfzcAccount'
import * as Limit from 'app/constants/Limit.js'
import * as Common from '../CommonData.js'
import { DateLib, decimal } from 'app/utils'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Qtsf extends React.Component {
	state = {
		showList: true
	}

	render () {
		const { dispatch, homeAccountState, sfzcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList,enclosureCountUser } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = sfzcAccountState.get('data')
		const insertOrModify = sfzcAccountState.getIn(['views', 'insertOrModify'])
		const flowNumber = sfzcAccountState.getIn(['data', 'flowNumber'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = sfzcAccountState.getIn(['views', 'fromYl'])

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const amount = data.get('amount')
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const reduceAmount = data.get('reduceAmount')//减免金额

		const propertyTax = data.get('propertyTax')//属性
		const acTax = data.get('acTax')
		const beAccrued = acTax.get("beAccrued")// 是否计提
		const beReduce =  acTax.get("beReduce")// 设置中是否开启减免
		const usedReduce =  data.get("beReduce")// 流水中是否开启减免

		const radioList = [
			{key: 'STATE_SF_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
			{key: 'STATE_SF_JN', value: '缴纳'}
		]
		let shouldGetPaymentList = false//是否获取未处理金额
		let showAccount = false
		let jtCom = null//计提组件
		let reduceCom = null

		;({
			'STATE_SF_JT': () => {//计提
				showAccount = false
			},
			'STATE_SF_JN': () => {//缴纳
				shouldGetPaymentList = true
				showAccount = true
				if (beReduce) {//开启预交
					reduceCom = <Row className='lrls-card'>
						<Row className='lrls-more-card'>
							<span>税费减免</span>
							<span className='noTextSwitchShort'>
								<Switch
									checked={usedReduce}
									color='#FF8348'
									onClick={() => {
										if (usedReduce) {//变为不开启
											dispatch(sfzcAccountActions.changeSfzcData('beReduce', false))
											dispatch(sfzcAccountActions.changeSfzcData('reduceAmount', ''))
										} else {
											dispatch(sfzcAccountActions.changeSfzcData('beReduce', true))
										}
									}}
								/>
							</span>
						</Row>
						{
							(usedReduce) ? <Row className='yysr-amount lrls-padding-top'>
								<label>金额： </label>
								<TextListInput
									placeholder='填写金额'
									value={reduceAmount}
									onChange={(value) => {
										if (/^\d*\.?\d{0,2}$/g.test(value)) {
											dispatch(sfzcAccountActions.changeSfzcData('reduceAmount', value))
										}
									}}
								/>
							</Row> : null
						}
					</Row>
				}
			}
		}[runningState] || (() => null))()

		let projectCardCom = null
		const beProject = data.get('beProject')
		let showAmount = true
		const project = homeAccountState.get('project')
		if (beProject && !(beAccrued && runningState == 'STATE_SF_JN')) {
			const usedProject = project.get('usedProject')
			showAmount = !usedProject//开启项目不显示总金额
			const changeAmount = (value) => dispatch(sfzcAccountActions.changeSfzcData('amount', value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
			/>
		}

		let HxCom = null
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (beAccrued && runningState === 'STATE_SF_JN' && showHs) {
			HxCom = xczcCom('待支付金额', jtAmount, paymentList, propertyTax == 'SX_QTSF' ? '计提其他税费' : '计提企业所得税')
		}

		if (fromYl && beAccrued && runningState === 'STATE_SF_JT' && paymentList.size) {//从查询流水跳进来显示计提的核销情况
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, propertyTax === 'SX_QTSF' ? '计提其他税费' : '计提企业所得税')
		}

		return(
			<Container className="lrls">
				<TopDatePicker
					disabled={isModify}
					value={runningDate}
					onChange={date => {
						dispatch(sfzcAccountActions.changeSfzcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (shouldGetPaymentList) {
							dispatch(sfzcAccountActions.getSfzcPaymentList(true))
						}
					}}
					callback={(value) => {
						dispatch(sfzcAccountActions.changeSfzcData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (shouldGetPaymentList) {
							dispatch(sfzcAccountActions.getSfzcPaymentList(true))
						}
					}}
				/>

				{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					<Row className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={categoryName}
							showProject={beProject && !(beAccrued && runningState == 'STATE_SF_JN')}
							project={project}
							changeAmount={(value) => dispatch(sfzcAccountActions.changeSfzcData('amount', value))}
						/>

						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(sfzcAccountActions.changeSfzcRunningState(propertyTax, key))
								dispatch(sfzcAccountActions.changeSfzcData('runningAbstract', abstractFun(key, data)))
								if (key == 'STATE_SF_JN') {
									dispatch(sfzcAccountActions.getSfzcPaymentList(true))
								}
							}}
						/>
					</Row>

					<Row className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(sfzcAccountActions.changeSfzcData('runningAbstract',value))
							}}
						/>
					</Row>

					{ projectCardCom }

					<Row className='lrls-card' style={{display: showAmount || (amount > 0 && showAccount) ? '' : 'none'}}>
						{/* 金额组件 */}
						<Row className='yysr-amount'>
							{ showAmount ? <label> 金额： </label> : null }
							{
								showAmount ? <TextListInput
									placeholder='填写金额'
									value={amount}
									onChange={(value) => {
										if (/^\d*\.?\d{0,2}$/g.test(value)) {
											dispatch(sfzcAccountActions.changeSfzcData('amount', value))
										}
									}}
								/> : null
							}
							{ !showAmount && showAccount ? <label>账户：</label> : null }
							{ (amount > 0 && showAccount) ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(sfzcAccountActions.changeSfzcAccount(value))}
							/> : null }
						</Row>
					</Row>

					{ reduceCom }

					{ HxCom }
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
					{
						(beAccrued && runningState === 'STATE_SF_JN') ? <Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_SFZC_LS'))
								}}>
									{showHs ? '修改单据' : '请选择单据'}
							</span>
						</Row> : null
					}
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(sfzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(sfzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
