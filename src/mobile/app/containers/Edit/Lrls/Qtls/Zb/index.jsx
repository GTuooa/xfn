import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { zbAccountActions } from 'app/redux/Edit/Lrls/Qtls/zbAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, SwitchText } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, abstractFun, UploadFj, hxCom } from '../../components'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Zb extends React.Component {
	state = {
		showList: true
	}
	render () {
		const { dispatch, homeAccountState, zbAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = zbAccountState.get('data')
		const insertOrModify = zbAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = zbAccountState.getIn(['views', 'fromYl'])

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

		const propertyList = [{key: '增资', value: 'XZ_ZZ'}, {key: '利润分配', value: 'XZ_LRFP'}, {key: '减资', value: 'XZ_JZ'}]
		const propertyCost = data.get('propertyCost')
		const propertyCostName = {XZ_ZZ: '增资', XZ_LRFP: '利润分配', XZ_JZ: '减资'}[propertyCost]

		const beAccrued = data.getIn(['acCapital', 'beAccrued'])//是否计提应付利润
		const radioList = [
			{key: 'STATE_ZB_LRFP', value: '利润分配', disabled: !beAccrued, message: '流水设置中未启用'},
			{key: 'STATE_ZB_ZFLR', value: '支付利润'}
		]//利润分配专用

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (beAccrued && runningState === 'STATE_ZB_ZFLR' && showHs) {
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
											<div className='overElli'>利润分配</div>
											<div><Amount showZero className='ylls-bold'>{v.get('notHandleAmount')}</Amount></div>
										</div>
									</div>)
						}
					})
				}
			</Row>
		}
		if (fromYl && runningState === 'STATE_ZB_LRFP' && paymentList && paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, '利润分配')
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
						dispatch(zbAccountActions.changeZbData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (beAccrued && runningState === 'STATE_ZB_ZFLR') {
							dispatch(zbAccountActions.getZbPaymentList())
						}

					}}
					callback={(value) => {
						dispatch(zbAccountActions.changeZbData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (beAccrued && runningState === 'STATE_ZB_ZFLR') {
							dispatch(zbAccountActions.getZbPaymentList())
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

						<div className='lrls-more-card lrls-margin-top'>
							<label>处理类型:</label>
							<SinglePicker
								disabled={isModify}
								district={propertyList}
								value={propertyCost}
								onOk={value => {
									dispatch(zbAccountActions.changePropertyCost(value.value))
									if (beAccrued && value.value === 'XZ_LRFP') {
										dispatch(zbAccountActions.getZbPaymentList())
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
						</div>
						{
							(propertyCost === 'XZ_LRFP') ? <Radio
								disabled={isModify}
								list={radioList}
								value={runningState}
								onChange={(key) => {
									dispatch(zbAccountActions.changeZbData('runningState', key))
									dispatch(zbAccountActions.changeZbData('runningAbstract', abstractFun(key, data)))
									if (beAccrued && key === 'STATE_ZB_ZFLR') {
										dispatch(zbAccountActions.getZbPaymentList())
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
								dispatch(zbAccountActions.changeZbData('runningAbstract', value))
							}}
						/>
					</Row>

					<div className='lrls-card'>
						<Row className='yysr-amount'>
							<label>金额：</label>
							<TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(zbAccountActions.changeZbData('amount', value))
									}
								}}
							/>
							{
								runningState != 'STATE_ZB_LRFP' ? <Account
									history={history}
									accountList={accountList}
									accountUuid={accountUuid}
									accountName={accountName}
									onOk={(value) => dispatch(zbAccountActions.changeAccount(value))}
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
					/>
					{
						(beAccrued && runningState === 'STATE_ZB_ZFLR') ? <Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_ZB_LS'))
								}}>
									{showHs ? '修改单据' : '请选择单据'}
							</span>
						</Row> : null
					}
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(zbAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(zbAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
