import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, Row, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem, TextListInput, SwitchText, SinglePicker, TreeSelect } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, ProjectCom, costList, propertyCostObj, UploadFj  } from '../../components'
import { zjtxAccountActions } from 'app/redux/Edit/Lrls/Hsgl/zjtxAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class Zjtx extends React.Component {

	render () {
		const { dispatch, homeAccountState, zjtxAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = zjtxAccountState.get('data')
		const categoryList = zjtxAccountState.get('categoryList')
		const insertOrModify = zjtxAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const topCategoryUuid = data.get('topCategoryUuid')
		const topCategoryName = data.get('topCategoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const flowNumber = data.get('flowNumber')

		//费用性质
		const acAssets = data.get('acAssets')
		const propertyCostList = data.get('propertyCostList')
		const propertyList = costList(propertyCostList)
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acAssets, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

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
				showCommon={true}
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
						dispatch(zjtxAccountActions.changeZjtxData(['data', 'runningDate'], new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						if (isModify) {
							return
						}
						dispatch(zjtxAccountActions.changeZjtxData(['data', 'runningDate'], value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
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
										dispatch(zjtxAccountActions.selectCategory(fromJS(item)))
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
						{
							(propertyList.length > 1) ?
								<Row className='lrls-more-card lrls-margin-top'>
									<label>费用性质: </label>
									<SinglePicker
										district={propertyList}
										value={propertyCost}
										onOk={value => {
											dispatch(zjtxAccountActions.changeZjtxData(['data', 'propertyCost'], value.value))
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
					</div>

					<div className='lrls-card zjtx'>
						<Row className='lrls-line lrls-bottom'>
							<label>摘要：</label>
							<TextareaItem
								placeholder='摘要填写'
								value={runningAbstract}
								onChange={(value) => {
									dispatch(zjtxAccountActions.changeZjtxData(['data', 'runningAbstract'], value))
								}}
							/>
						</Row>
						{ projectCardCom }
						<Row className='lrls-more-card'>
							<label>金额：</label>
							<TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(zjtxAccountActions.changeZjtxData(['data', 'amount'], value))
									}
								}}
							/>
						</Row>
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
					</div>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(zjtxAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(zjtxAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
