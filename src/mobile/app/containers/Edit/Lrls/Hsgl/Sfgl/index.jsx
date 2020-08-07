import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, Switch } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ContancsCom, UploadFj  } from '../../components'
import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'

import { sfglAccountActions } from 'app/redux/Edit/Lrls/Hsgl/sfglAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const runningName = (flowType, direction) => {
	let name = ''
	if (flowType == 'FLOW_INADVANCE') {
		if (direction=='credit') {
			name = '预付'
		} else {
			name = '预收'
		}
	} else {
		if (direction=='credit') {
			name = '应付'
		} else {
			name = '应收'
		}
	}
	return name
}

@connect(state => state)
export default
class Sfgl extends React.Component {

	render () {
		const { dispatch, homeAccountState, sfglAccountState, history, homeState, editPermission } = this.props

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = sfglAccountState.get('data')
		const insertOrModify = sfglAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const absAmount = data.get('amount') < 0 ? -data.get('amount') : data.get('amount')
		const totalAmount = data.get('totalAmount')
		const absTotalAmount = data.get('totalAmount') < 0 ? -data.get('totalAmount') : data.get('totalAmount')
		const flowNumber = data.get('flowNumber')
		const beMoed = data.get('beMoed')//抹零
        const moedAmount = data.get('moedAmount')//抹零金额

		let contactsCardCom = null
		const cardList = sfglAccountState.get('cardList')
		const contactsCardRange = data.get('contactsCardRange')//往来关系卡片
		const onOk = (value) => {
			dispatch(sfglAccountActions.changeSfglCard(value.value, '', runningDate))
		}
		contactsCardCom = <ContancsCom
			cardList={cardList}
			cardObj={contactsCardRange}
			noBottom={'contactsCardRange'}
			onOk={onOk}
			noInsert={true}
			disabled={isModify}
		/>

		let hxCom = null
		const manageList = sfglAccountState.getIn(['manageList', 'childList'])
		const showHs = manageList.some(v => v.get('isCheck'))
		if (showHs) {
			hxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					待核销{totalAmount >= 0 ? '收' : '付'}款金额：<Amount showZero>{absTotalAmount}</Amount>
				</div>
				{
					manageList.map((v,i) => {
						if (v.get('isCheck')) {
							return (<div key={i} className='ylls-top-line'>
										<div className='ylls-item ylls-padding'>
											<div className='overElli'>{v.get('categoryName')}</div>
											{
												v.get('beOpened') ? <span></span> : <div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
											}
										</div>
										<div className='ylls-item'>
											<div className='ylls-blue'> { runningName(v.get('flowType'), v.get('direction')) } </div>

											<div><Amount showZero className='ylls-bold'>{v.get('notHandleAmount')}</Amount></div>
										</div>
									</div>)
						}
					})
				}
			</Row>
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
						if (isModify) {
							return
						}
						dispatch(sfglAccountActions.changeSfglData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						dispatch(sfglAccountActions.getSfglCardList(new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						if (isModify) {
							return
						}
						dispatch(sfglAccountActions.changeSfglData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						dispatch(sfglAccountActions.getSfglCardList('runningDate', value))
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
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要:</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(sfglAccountActions.changeSfglData('runningAbstract', value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						{ contactsCardCom }
						<Row className='yysr-amount'>
							<label>{totalAmount >= 0 ? '收款金额' : '付款金额'}:</label>
							<TextListInput
								placeholder='填写金额'
								value={absAmount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(sfglAccountActions.changeSfglData('amount', value))
									}
								}}
							/>
							{
								((beMoed && moedAmount >= absTotalAmount) || absAmount == 0) ? null : <Account
									history={history}
									accountList={accountList}
									accountUuid={accountUuid}
									accountName={accountName}
									onOk={(value) => dispatch(sfglAccountActions.changeSfglAccount(value))}
								/>
							}
						</Row>
					</div>

					<Row className='lrls-card'>
						<Row className='lrls-more-card'>
							<span>应{totalAmount >= 0 ? '收' : '付'}抹零</span>
							<span className='noTextSwitchShort'>
								<Switch
									checked={beMoed}
									onClick={() => {
										dispatch(sfglAccountActions.changeSfglData('beMoed', !beMoed))
									}}
								/>
							</span>
						</Row>
						{
							(beMoed) ? <Row className='lrls-padding-top'>
								<Row className='yysr-amount'>
									<label>抹零金额： </label>
									<TextListInput
										placeholder='填写金额'
										value={moedAmount}
										onChange={(value) => {
											if (/^\d*\.?\d{0,2}$/g.test(value)) {
												dispatch(sfglAccountActions.changeSfglData('moedAmount', value))
											}
										}}
									/>
								</Row>
							</Row> : null
						}
					</Row>

					{ hxCom }
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
					<Row className='lrls-button-wrap'>
						<span
							className='lrls-button'
							onClick={() => {
								if (data.get('cardUuid') == '') {
									return thirdParty.toast.info('请选择往来单位', 2)
								}
								dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_SFGL_LS'))
							}}>
								{showHs ? '修改单据' : '请选择单据'}
						</span>
					</Row>



				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(sfglAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(sfglAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
