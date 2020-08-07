import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom, UploadFj  } from '../../components'
import { kjfpAccountActions } from 'app/redux/Edit/Lrls/Hsgl/kjfpAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { DateLib } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

@connect(state => state)
export default
class Kjfp extends React.Component {

	render () {
		const { dispatch, homeAccountState, kjfpAccountState, homeState, editPermission, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = kjfpAccountState.get('data')
		const insertOrModify = kjfpAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const radioList = [{key: 'BILL_MAKE_OUT_TYPE_XS', value: '销售开票'}, {key: 'BILL_MAKE_OUT_TYPE_TS', value: '退售开票'}]
		const billMakeOutType = data.get('billMakeOutType')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const totalAmount = data.get('totalAmount')

		let hxCom = null
		const hxList = kjfpAccountState.get('hxList')
		const showHx = hxList.some(v => v.get('isCheck'))

		if (showHx) {
			hxCom = <Row className='ylls-card'>
				<div className='hx-title'>
					待开发票税额：<Amount showZero>{totalAmount}</Amount>
				</div>
				{
					hxList.map((v,i) => {
						if (v.get('isCheck')) {
							return (<div key={i} className='ylls-top-line'>
										<div className='ylls-item ylls-padding'>
											<div className='overElli'>{v.get('categoryName')}</div>
											<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
										</div>
										<div className='ylls-item'>
											<span className='ylls-blue'>税率：{`${v.get('taxRate')}%`}</span>
											<div><Amount className='ylls-bold' showZero>{v.get('tax')}</Amount></div>
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
						dispatch(kjfpAccountActions.changeKjfpData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						dispatch(kjfpAccountActions.getKjfpList())

					}}
					callback={(value) => {
						dispatch(kjfpAccountActions.changeKjfpData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						dispatch(kjfpAccountActions.getKjfpList())
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
							value={billMakeOutType}
							onChange={(key) => {
								dispatch(kjfpAccountActions.changeKjfpRunningState(key))
								dispatch(kjfpAccountActions.getKjfpList())
							}}
						/>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(kjfpAccountActions.changeKjfpData('runningAbstract', value))
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
								dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_KJFP_LS'))
							}}>
								{ showHx ? '修改单据' : '请选择单据'}
						</span>
					</Row>

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(kjfpAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(kjfpAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
