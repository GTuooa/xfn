import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, TextListInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, SinglePicker, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, UploadFj } from '../../components'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

import { jzcbAccountActions } from 'app/redux/Edit/Lrls/Hsgl/jzcbAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

@connect(state => state)
export default
class Jzcb extends React.Component {

	render () {
		const { dispatch, homeAccountState, jzcbAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = jzcbAccountState.get('data')
		const insertOrModify = jzcbAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const radioList = [{key: 'STATE_YYSR_XS', value: '销售成本结转'}, {key: 'STATE_YYSR_TS', value: '退销转回成本'}]
		const runningState = data.get('runningState')
		const categoryUuid = data.get('categoryUuid')
		const lsCategoryName = data.get('lsCategoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const totalAmount = data.get('totalAmount')

		const stockCardList = jzcbAccountState.get('stockCardList')//存货卡片列表
		const stockCardRange = data.get('stockCardRange')//选择的存货卡片
		const isOne = stockCardRange.size == 1 ? true : false
		const hasEmpty = stockCardRange.some(v => v.get('uuid'))
		const onOk = (dataType, value, idx) => dispatch(jzcbAccountActions.changeJzcbCard(dataType, value, idx))

		let hxCom = null
		const hxList = jzcbAccountState.get('hxList')
		const showHx = hxList.some(v => v.get('isCheck'))

		const titleName = runningState === 'STATE_YYSR_XS' ? '收入金额合计：' : '退销金额合计：'
		if (showHx) {
			hxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					{titleName}<Amount showZero>{totalAmount}</Amount>
				</div>
				{
					hxList.map((v,i) => {
						if (v.get('isCheck')) {
							return (
								<div key={i} className='ylls-top-line'>
									<div className='ylls-item ylls-padding'>
										<div className='overElli'>{v.get('categoryName')}</div>
										<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
									</div>
									<div className='ylls-item'>
										<div className='overElli'>{v.get('cardStockName')}</div>
										<div><Amount className='ylls-bold' showZero>{v.get('amount')}</Amount></div>
									</div>
								</div>
							)
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
						dispatch(jzcbAccountActions.changeJzcbData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						dispatch(jzcbAccountActions.getJzcbCardList())

					}}
					callback={(value) => {
						dispatch(jzcbAccountActions.changeJzcbData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						dispatch(jzcbAccountActions.getJzcbCardList())
					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={lsCategoryName}
						/>
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(jzcbAccountActions.changeJzcbRunningState(key))
								dispatch(jzcbAccountActions.getJzcbCardList())
							}}
						/>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(jzcbAccountActions.changeJzcbData('runningAbstract', value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						{
							stockCardRange.map((v, i) => {
								let amountDisabled = true, stockTotalAmount = 0
								hxList.forEach(w => {
									if (w.get('isCheck') && (w.get('stockCardUuid') == v.get('uuid'))) {
										amountDisabled = false
										stockTotalAmount += w.get('amount')
									}
								})

								return (
									<div key={i} style={{paddingBottom: isOne ? '0' : '10px'}}>
										<div className='lrls-more-card lrls-placeholder lrls-bottom'>
											<span>存货明细({i+1})</span>
											<span
												className='lrls-blue'
												style={{display: isOne || isModify ? 'none' : ''}}
												onClick={() => {
													onOk('delete', '', i)
													dispatch(jzcbAccountActions.getJzcbList())
												}}
											>
													删除
											</span>
										</div>

										<div className='lrls-more-card lrls-bottom'>
											<label>存货:</label>
											<SinglePicker
												disabled={isModify}
												district={stockCardList.toJS()}
												value={v.get('uuid') ? `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}` : ''}
												onOk={value => {
													onOk('card', value.value, i)
													dispatch(jzcbAccountActions.getJzcbList())
												}}
											>
												<Row className='lrls-category lrls-padding'>
													{
														v.get('uuid') ? <span> {`${v.get('code')} ${v.get('name')}`} </span>
														: <span className='lrls-placeholder'>点击选择存货卡片</span>
													}
													<Icon type="triangle" />
												</Row>
											</SinglePicker>
										</div>

										<Row className='lrls-more-card lrls-bottom'>
											<label>成本金额：</label>
											<TextListInput
												disabled={amountDisabled}
												placeholder='填写成本金额'
												value={v.get('amount')}
												onChange={(value) => {
													if (/^\d*\.?\d{0,2}$/g.test(value)) {
														onOk('amount', value, i)
													}
												}}
											/>
											<span className='lrls-margin-left'>
												<Amount showZero>{stockTotalAmount}</Amount>
											</span>
										</Row>
									</div>
								)
							})
						}

						<div className='lrls-more-card' style={{fontWeight: 'bold', display: isModify ? 'none' : ''}}>
							<div></div>
							<div className='lrls-blue'
								onClick={() => {
									onOk('add', '', stockCardRange.size)
								}}
							>
								+添加存货明细
							</div>
						</div>
					</div>

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
								if (!hasEmpty) {
									return thirdParty.toast.info('请先选择存货', 2)
								}
								dispatch(homeAccountActions.changeHomeAccountData('categoryType', 'LB_JZCB_LS'))
							}}>
								{ showHx ? '修改单据' : '请选择单据'}
						</span>
					</Row>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(jzcbAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(jzcbAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
