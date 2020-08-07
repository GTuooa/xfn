import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { jkAccountActions } from 'app/redux/Edit/Lrls/Qtls/jkAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, SwitchText } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ProjectCom, abstractFun, UploadFj, hxCom } from '../../components'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Jk extends React.Component {
	state = {
		showList: true
	}

	render () {
		const { dispatch, homeAccountState, jkAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = jkAccountState.get('data')
		const insertOrModify = jkAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = jkAccountState.getIn(['views', 'fromYl'])

		const flowNumber = data.get('flowNumber')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningState = data.get('runningState')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const jtAmount = data.get('jtAmount')

		const propertyList = [{key: '取得借款', value: 'XZ_QDJK'}, {key: '偿还利息', value: 'XZ_CHLX'}, {key: '偿还本金', value: 'XZ_CHBJ'}]
		const propertyCost = data.get('propertyCost')
		const propertyCostName = {XZ_QDJK: '取得借款', XZ_CHLX: '偿还利息', XZ_CHBJ: '偿还本金'}[propertyCost]

		const beAccrued = data.getIn(['acLoan', 'beAccrued'])//是否计提应付利息
		const radioList = [
			{key: 'STATE_JK_JTLX', value: '计提利息', disabled: !beAccrued, message: '流水设置中未启用'},
			{key: 'STATE_JK_ZFLX', value: '支付利息'}
		]

		let projectCardCom = null
		const project = homeAccountState.get('project')
		const beProject = data.get('beProject')
		const usedProject = project.get('usedProject')
		let showAmount = true
		let projectTotalAmount = 0
		if (beProject && (runningState == 'STATE_JK_JTLX' || (!beAccrued && runningState == 'STATE_JK_ZFLX'))) {
			showAmount = !usedProject//开启项目不显示总金额
			project.get('projectCard').forEach(v => projectTotalAmount += Number(v.get('amount')))
			const changeAmount = (value) => dispatch(jkAccountActions.changeJkData('amount', value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
				showCommon={true}
			/>
		}

		let HxCom = null
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (beAccrued && runningState === 'STATE_JK_ZFLX' && showHs) {
			HxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					待支付金额：<Amount showZero>{jtAmount}</Amount>
				</div>
				{
					paymentList.map((v,i) => {
						if (v.get('beSelect')) {
							return (<div key={i} className='ylls-top-line'>
										<div className='ylls-item ylls-padding'>
											<div>流水号：{v.get('flowNumber')}</div>
											<div className='ylls-gray'>{v.get('runningDate')}</div>
										</div>
										<div className='ylls-item'>
											<div className='overElli'>计提利息</div>
											<div><Amount showZero className='ylls-bold'>{v.get('notHandleAmount')}</Amount></div>
										</div>
									</div>)
						}
					})
				}
			</Row>
		}
		if (fromYl && beAccrued && runningState === 'STATE_JK_JTLX' && paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, '计提利息')
		}

		// 图片上传
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// const enCanUse = false
		// const checkMoreFj = false

		const showlsfj = homeAccountState.getIn(['flags', 'showlsfj'])
		const previewImageList = homeAccountState.get('previewImageList').toJS();
		const label = homeAccountState.get('label');
		const enclosureList = homeAccountState.get('enclosureList');
		const enclosureCountUser = homeAccountState.get('enclosureCountUser');


		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(jkAccountActions.changeJkData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (beAccrued && runningState === 'STATE_JK_ZFLX') {
							dispatch(jkAccountActions.getJkPaymentList())
						}

					}}
					callback={(value) => {
						dispatch(jkAccountActions.changeJkData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (beAccrued && runningState === 'STATE_JK_ZFLX') {
							dispatch(jkAccountActions.getJkPaymentList())
						}
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
						<div className='lrls-more-card lrls-switch lrls-margin-top'>
							<label>处理类型:</label>
							<SinglePicker
								disabled={isModify}
								district={propertyList}
								value={propertyCost}
								onOk={value => {
									dispatch(jkAccountActions.changePropertyCost(value.value))
									if (beAccrued && value.value === 'XZ_CHLX') {
										dispatch(jkAccountActions.getJkPaymentList())
									}
								}}
							>
								<Row className='lrls-padding lrls-category'>
									<span>
										{ propertyCostName }
									</span>
									<Icon type="triangle" />
								</Row>
							</SinglePicker>
							{
								(beProject && (runningState == 'STATE_JK_JTLX' || (!beAccrued && runningState == 'STATE_JK_ZFLX'))) ?
								<SwitchText
									checked={usedProject}
									checkedChildren='项目'
									unCheckedChildren=''
									className='topBarSwitch'
									onChange={(value) => {
										dispatch(homeAccountActions.changeHomeAccountData('project', !usedProject))
										if (usedProject) {//从开启到关闭
											dispatch(jkAccountActions.changeJkData('amount', 0))
										} else {//从关闭到开启
											dispatch(jkAccountActions.changeJkData('amount', projectTotalAmount))
										}
									}}
								/> : null
							}
						</div>
						{
							(propertyCost === 'XZ_CHLX') ? <Radio
								disabled={isModify}
								list={radioList}
								value={runningState}
								onChange={(key) => {
									dispatch(jkAccountActions.changeJkData('runningState', key))
									dispatch(jkAccountActions.changeJkData('runningAbstract', abstractFun(key, data)))
									if (beAccrued && key === 'STATE_JK_ZFLX') {
										dispatch(jkAccountActions.getJkPaymentList())
									}
								}}
							/> : null
						}
					</div>

					<Row className='lrls-card lrls-line'>
						<label>摘要:</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(jkAccountActions.changeJkData('runningAbstract', value))
							}}
						/>
					</Row>


					{ projectCardCom }

					<div className='lrls-card'
						style={{display: showAmount || runningState != 'STATE_JK_JTLX' ? '' : 'none'}}
					>
						<Row className='yysr-amount'>
							{ showAmount ? <label>金额：</label> : null }
							{ showAmount ? <TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(jkAccountActions.changeJkData('amount', value))
									}
								}}
							/> : null }
							{ !showAmount && runningState != 'STATE_JK_JTLX' ? <label>账户：</label> : null }
							{
								runningState != 'STATE_JK_JTLX' ? <Account
									history={history}
									accountList={accountList}
									accountUuid={accountUuid}
									accountName={accountName}
									onOk={(value) => dispatch(jkAccountActions.changeAccount(value))}
								/> : null
							}
						</Row>
					</div>

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
						(beAccrued && runningState === 'STATE_JK_ZFLX') ? <Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_JK_LS'))
								}}>
									{showHs ? '修改单据' : '请选择单据'}
							</span>
						</Row> : null
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(jkAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(jkAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
