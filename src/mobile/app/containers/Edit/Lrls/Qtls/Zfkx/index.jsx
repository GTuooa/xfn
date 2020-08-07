import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { zfkxAccountActions } from 'app/redux/Edit/Lrls/Qtls/zfkxAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ProjectCom, abstractFun, UploadFj, hxCom } from '../../components'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Zfkx extends React.Component {
	state = {
		showList: true
	}
	render () {
		const { dispatch, homeAccountState, zfkxAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = zfkxAccountState.get('data')
		const insertOrModify = zfkxAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = zfkxAccountState.getIn(['views', 'fromYl'])

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
		const radioList = [{key: 'STATE_ZF_FC', value: '付出'}, {key: 'STATE_ZF_SH', value: '收回'}]

		let projectCardCom = null
		const beProject = data.get('beProject')
		const project = homeAccountState.get('project')
		let showAmount = true
		if (beProject && runningState == 'STATE_ZF_FC') {
			const usedProject = project.get('usedProject')
			showAmount = !usedProject//开启项目不显示总金额
			const changeAmount = (value) => dispatch(zfkxAccountActions.changeZfkxData('amount', value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
			/>
		}

		let HxCom = null
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (runningState === 'STATE_ZF_SH' && showHs) {
			HxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					待支付金额：<Amount showZero>{jtAmount}</Amount>
				</div>
				{
					paymentList.map((v,i) => {
						if (v.get('beSelect')) {
							return (
								<div key={i} className='ylls-top-line'>
									<div className='ylls-item ylls-padding'>
										<div>流水号：{v.get('flowNumber')}</div>
										<div className='ylls-gray'>{v.get('runningDate')}</div>
									</div>
									<div className='ylls-item'>
										<div className='overElli'>暂付款项</div>
										<div><Amount showZero className='ylls-bold'>{v.get('notHandleAmount')}</Amount></div>
									</div>
								</div>
							)
						}
					})
				}
			</Row>
		}
		if (fromYl && runningState === 'STATE_ZF_FC' && paymentList && paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
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
						dispatch(zfkxAccountActions.changeZfkxData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (runningState === 'STATE_ZF_SH') {
							dispatch(zfkxAccountActions.getZfkxPaymentList())
						}

					}}
					callback={(value) => {
						dispatch(zfkxAccountActions.changeZfkxData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (runningState === 'STATE_ZF_SH') {
							dispatch(zfkxAccountActions.getZfkxPaymentList())
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
							project={project}
							showProject={beProject && runningState == 'STATE_ZF_FC'}
							changeAmount={(value) => dispatch(zfkxAccountActions.changeZfkxData('amount', value))}
						/>
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(zfkxAccountActions.changeZfkxData('runningState', key))
								dispatch(zfkxAccountActions.changeZfkxData('runningAbstract', abstractFun(key, data)))
								if (key === 'STATE_ZF_SH') {
									dispatch(zfkxAccountActions.getZfkxPaymentList())
								}
							}}
						/>
					</div>

					<Row className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(zfkxAccountActions.changeZfkxData('runningAbstract', value))
							}}
						/>
					</Row>

					{ projectCardCom }

					<div className='lrls-card'>
						<Row className='yysr-amount'>
							<label>{showAmount ? '金额:' : '账户:'}</label>
							{ showAmount ? <TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(zfkxAccountActions.changeZfkxData('amount', value))
									}
								}}
							/> : null }
							<Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(zfkxAccountActions.changeAccount(value))}
							/>
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
						runningState === 'STATE_ZF_SH' ? <Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_ZFKX_LS'))
								}}>
									{showHs ? '修改单据' : '请选择单据'}
							</span>
						</Row> : null
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(zfkxAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(zfkxAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
