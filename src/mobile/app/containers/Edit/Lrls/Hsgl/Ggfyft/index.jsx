import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, TextListInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, SinglePicker, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, UploadFj } from '../../components'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

import { ggfyftAccountActions } from 'app/redux/Edit/Lrls/Hsgl/ggfyftAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

@connect(state => state)
export default
class Ggfyft extends React.Component {

	render () {
		const { dispatch, homeAccountState, ggfyftAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = ggfyftAccountState.get('data')
		const insertOrModify = ggfyftAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const totalAmount = data.get('totalAmount')

		const projectCardList = ggfyftAccountState.get('projectCardList').toJS()//所有项目卡片列表
		const selectCardList = data.get('selectCardList')//选择的项目卡片
		const selectCardListUuid = selectCardList.toJS().map(v => v['uuid'])//选择的项目卡片
		let unSelectProjectCardList = projectCardList.filter((v => !selectCardListUuid.includes(v['value'].split(Limit.TREE_JOIN_STR)[0])))
		const onOk = (dataType, value, idx) => dispatch(ggfyftAccountActions.changeGgfyftProjectCard(dataType, value, idx))
		const isOne = selectCardList.size == 1 ? true : false

		let hxCom = null
		const hxList = ggfyftAccountState.get('hxList')
		const showHx = hxList.some(v => v.get('beSelect'))

		if (showHx) {
			hxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					待分摊金额：<Amount showZero>{totalAmount}</Amount>
				</div>
				{
					hxList.map((v,i) => {
						if (v.get('beSelect')) {
							return (
								<div key={i} className='ylls-top-line'>
									<div className='ylls-item ylls-padding'>
										<div className='overElli'>{v.get('categoryName')}</div>
										<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
									</div>
									<div className='ylls-item'>
										<div className='overElli'>{v.get('runningAbstract')}</div>
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
						dispatch(ggfyftAccountActions.changeGgfyftData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						dispatch(ggfyftAccountActions.getGgfyftList())

					}}
					callback={(value) => {
						dispatch(ggfyftAccountActions.changeGgfyftData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						dispatch(ggfyftAccountActions.getGgfyftList())
					}}
				/>

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
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(ggfyftAccountActions.changeGgfyftData('runningAbstract', value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						<div>
							{
								selectCardList.map((v, i) => {

									return (
										<div key={i}  style={{paddingBottom: isOne ? '0' : '10px'}}>
											<div className='lrls-more-card lrls-placeholder lrls-bottom'>
												<span>项目({i+1})</span>
												<span
													className='lrls-blue'
													style={{display: isOne ? 'none' : ''}}
													onClick={() => {
														onOk('delete', '', i)
													}}
												>
													删除
												</span>
											</div>

											<div className='lrls-more-card lrls-bottom'>
												<label>项目:</label>
												<SinglePicker
													district={unSelectProjectCardList}
													value={v.get('uuid') ? `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}` : ''}
													onOk={value => {
														onOk('card', value.value, i)
													}}
												>
													<Row className='lrls-category lrls-padding'>
														{
															v.get('uuid') ? <span> {`${v.get('code')} ${v.get('name')}`} </span>
															: <span className='lrls-placeholder'>点击选择项目</span>
														}
														<Icon type="triangle" />
													</Row>
												</SinglePicker>
											</div>

											<Row className='lrls-more-card lrls-bottom'>
												<label>分摊金额：</label>
												<TextListInput
													disabled={!showHx}
													placeholder='填写分摊金额'
													value={v.get('amount')}
													onChange={(value) => {
														if (/^[-\d]\d*\.?\d{0,2}$/g.test(value) || value == '') {
															onOk('amount', value, i)
														}
													}}
												/>
											</Row>

											<Row className='lrls-more-card lrls-bottom'>
												<label>分摊占比：</label>
												<TextListInput
													disabled={!showHx}
													placeholder='填写占比率'
													value={v.get('percent')}
													onChange={(value) => {
														if (/^\d*\.?\d{0,2}$/g.test(value)) {
															onOk('percent', value, i)
														}
													}}
												/>
												<span className='lrls-margin-left'>%</span>
											</Row>
										</div>
									)
								})
							}
							<div className='lrls-more-card' style={{fontWeight: 'bold'}}>
								<div></div>
								<div className='lrls-blue'
									onClick={() => {
										onOk('add', '', selectCardList.size)
									}}
								>
									+添加项目
								</div>
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
								dispatch(homeAccountActions.changeHomeAccountData('categoryType', 'LB_GGFYFT_LS'))
							}}>
								{ showHx ? '修改单据' : '请选择单据'}
						</span>
					</Row>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(ggfyftAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(ggfyftAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
