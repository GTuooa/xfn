import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount,  MonthPicker, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, UploadFj  } from '../../components'
import { zcwjzzsAccountActions } from 'app/redux/Edit/Lrls/Hsgl/zcwjzzsAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Zcwjzzs extends React.Component {

	render () {
		const { dispatch, homeAccountState, zcwjzzsAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = zcwjzzsAccountState.get('data')
		const insertOrModify = zcwjzzsAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')

		const handleMonth = data.get('handleMonth')

		const hxList = zcwjzzsAccountState.get('hxList')
		const showHx = hxList.get('flowDtoList').size
		const totalAmount = hxList.get('outputAmount') - hxList.get('inputAmount')

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
						dispatch(zcwjzzsAccountActions.changeWjzzsData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(zcwjzzsAccountActions.changeWjzzsData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
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
								dispatch(zcwjzzsAccountActions.changeWjzzsData('runningAbstract', value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						<div className='lrls-more-card lrls-jzsy'>
							<label>处理税额月份:</label>
							<div className='antd-single-picker'>
								<MonthPicker
									disabled={isModify}
									value={handleMonth}
									format={'YYYY_MM'}
									maxDate={new Date()}
									onChange={value => {
										let month = new DateLib(value).valueOf().slice(0,7)
										dispatch(zcwjzzsAccountActions.changeWjzzsData('handleMonth', month))
										dispatch(zcwjzzsAccountActions.getWjzzsList(month))
									}}
								>
									<Row className='lrls-padding lrls-category'>
										{
											handleMonth ? <span> {handleMonth} </span>
											: <span className='lrls-placeholder'>点击选择处理税额月份</span>
										}
										<Icon type="triangle" />
									</Row>
								</MonthPicker>
							</div>

						</div>
						<div className='lrls-more-card lrls-margin-top'>
							<span>未交税额：</span>
							<Amount showZero>{totalAmount}</Amount>
						</div>
					</div>

					{ showHx ? <Row className='ylls-card yysr-carryover'>
						<div>
							<div>销项税-流水数：{hxList.get('outputCount')}条；合计税额：<Amount showZero>{hxList.get('outputAmount')}</Amount></div>
							<div>进项税-流水数：{hxList.get('inputCount')}条；合计税额：<Amount showZero>{hxList.get('inputAmount')}</Amount></div>
						</div>
						<Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_ZCWJZZS_LS'))
								}}>
									查看
							</span>
						</Row>
					</Row> : null }
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
						dispatch(zcwjzzsAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(zcwjzzsAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
