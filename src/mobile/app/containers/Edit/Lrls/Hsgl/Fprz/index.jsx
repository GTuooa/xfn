import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, UploadFj  } from '../../components'
import { fprzAccountActions } from 'app/redux/Edit/Lrls/Hsgl/fprzAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Fprz extends React.Component {

	render () {
		const { dispatch, homeAccountState, fprzAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = fprzAccountState.get('data')
		const insertOrModify = fprzAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const radioList = [{key: 'BILL_AUTH_TYPE_CG', value: '采购发票认证'}, {key: 'BILL_AUTH_TYPE_TG', value: '退购发票认证'}]
		const billAuthType = data.get('billAuthType')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const totalAmount = data.get('totalAmount')

		let hxCom = null
		const hxList = fprzAccountState.get('hxList')
		const showHx = hxList.some(v => v.get('isCheck'))

		if (showHx) {
			hxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					待认证税额：<Amount showZero>{totalAmount}</Amount>
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
										<span className='ylls-blue'>税率：{`${v.get('taxRate')}%`}</span>
										<div><Amount className='ylls-bold' showZero>{v.get('tax')}</Amount></div>
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
						dispatch(fprzAccountActions.changeFprzData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						dispatch(fprzAccountActions.getFprzList())

					}}
					callback={(value) => {
						dispatch(fprzAccountActions.changeFprzData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						dispatch(fprzAccountActions.getFprzList())
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
						<Radio
							disabled={isModify}
							list={radioList}
							value={billAuthType}
							onChange={(key) => {
								dispatch(fprzAccountActions.changeFprzRunningState(key))
								dispatch(fprzAccountActions.getFprzList())
							}}
						/>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(fprzAccountActions.changeFprzData('runningAbstract', value))
							}}
						/>
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
								dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_FPRZ_LS'))
							}}>
								{ showHx ? '修改单据' : '请选择单据'}
						</span>
					</Row>

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(fprzAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(fprzAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
