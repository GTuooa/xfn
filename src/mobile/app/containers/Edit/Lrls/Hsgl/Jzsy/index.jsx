import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, TextListInput, SwitchText, TreeSelect } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, ProjectCom, UploadFj  } from '../../components'
import { jzsyAccountActions } from 'app/redux/Edit/Lrls/Hsgl/jzsyAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class Jzsy extends React.Component {

	render () {
		const { dispatch, homeAccountState, jzsyAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = jzsyAccountState.get('data')
		const categoryList = jzsyAccountState.get('categoryList')
		const insertOrModify = jzsyAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false


		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const topCategoryUuid = data.get('topCategoryUuid')
		const topCategoryName = data.get('topCategoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const flowNumber = data.get('flowNumber')

		const amount = data.get('amount')
		const originalAssetsAmount = data.getIn(['acAssets', 'originalAssetsAmount'])
		const depreciationAmount = data.getIn(['acAssets', 'depreciationAmount'])
		let totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)


		let hxCom = null
		const hxList = jzsyAccountState.get('hxList')
		const showHx = hxList.some(v => v.get('beSelect'))

		if (showHx) {
			hxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					处置收入金额：<Amount showZero>{amount}</Amount>
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
										<span className='ylls-blue'></span>
										<div><Amount className='ylls-bold' showZero>{v.get('amount')- Number(v.get('tax'))}</Amount></div>
									</div>
								</div>
							)
						}
					})
				}
			</Row>
		}

		let projectCardCom = null
		const beProject = data.get('beProject')
		const project = homeAccountState.get('project')
		const usedProject = project.get('usedProject')
		if (beProject) {
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				noAmount={true}
				noMore={true}
			/>
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
			<Container className="iuManage-config lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						if (isModify) {
							return
						}
						dispatch(jzsyAccountActions.changeJzsyData(['data', 'runningDate'], new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						dispatch(jzsyAccountActions.getJzsyList())

					}}
					callback={(value) => {
						if (isModify) {
							return
						}
						dispatch(jzsyAccountActions.changeJzsyData(['data', 'runningDate'], value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						dispatch(jzsyAccountActions.getJzsyList())
					}}
				/>

				<ScrollView flex="1">
					{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }
					<div className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={topCategoryUuid}
							categoryName={topCategoryName}
						/>
						<Row className='lrls-more-card lrls-margin-top lrls-switch'>
							<label>处理类别: </label>
							<div className='antd-single-picker'>
								<TreeSelect
									district={categoryList.getIn([0, 'childList']).toJS()}
									value={categoryUuid}
									disabled={isModify}
									onChange={(item) => {
										dispatch(jzsyAccountActions.changeJzsyData(['data', 'categoryUuid'], item['uuid']))
										dispatch(jzsyAccountActions.changeJzsyData(['data', 'categoryName'], item['name']))
										dispatch(jzsyAccountActions.changeJzsyData(['data', 'beProject'], item['beProject']))
										dispatch(jzsyAccountActions.getJzsyList())
										if (item['beProject'] && !beProject) {//新的开启了项目并且上一个类别没开启项目
											dispatch(homeAccountActions.getProjectCardList(item['projectRange']))
										}
									}}
								>
									<Row className='lrls-padding lrls-category'
										onClick={(e) => {
											if (categoryList.getIn([0, 'childList']).size==0) {
												e.stopPropagation()
												return thirdParty.toast.info('无处理类别，请在流水设置-长期资产中新建', 2)
											}
										}}
									>
										<span className={categoryName =='请选择类别' ? 'lrls-placeholder' : ''}>{categoryName}</span>
										<Icon type="triangle" style={{color: isModify ? '#ccc' : ''}}/>
									</Row>
								</TreeSelect>
							</div>
							{
								(beProject) ? <SwitchText
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
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(jzsyAccountActions.changeJzsyData(['data', 'runningAbstract'], value))
							}}
						/>
					</div>

					{ projectCardCom }

					<div className='lrls-card'>
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
										dispatch(jzsyAccountActions.changeJzsyData(['data', 'acAssets', 'originalAssetsAmount'], value))
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
										dispatch(jzsyAccountActions.changeJzsyData(['data', 'acAssets', 'depreciationAmount'], value))
									}
								}}
							/>
						</Row>
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
								if (categoryUuid == '') {
									return thirdParty.toast.info('请选择处理类别', 2)
								}
								dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_JZSY_LS'))
							}}>
								{ showHx ? '修改单据' : '请选择单据'}
						</span>
					</Row>

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(jzsyAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(jzsyAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
