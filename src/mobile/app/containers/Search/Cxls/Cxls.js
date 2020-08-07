import React, { PropTypes } from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Checkbox, Amount, Button, ButtonGroup, Icon, Container, Row, ScrollView, Single } from 'app/components'

import Vc from './Vc.jsx'
import './index.less'

@connect(state => state)
export default
class CxAccount extends React.Component {

	state = {
		isEdit: false
    }

	render() {
		const { isEdit } = this.state
		const { dispatch, cxAccountState, history, homeState } = this.props

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		// simplifyStatus true为专业版 intelligentStatus  true为智能总账
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false


		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const reviewLrAccountPermission = LrAccountPermissionInfo.getIn(['review', 'permission'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPzPermission = PzPermissionInfo.getIn(['edit', 'permission'])

		const views = cxAccountState.get('views')
		const dataList = cxAccountState.get('dataList')
		let accountList = cxAccountState.get('accountList').toJS()
		let accountNameList = ['全部'], accountUuidList = ['']
		accountList.forEach(v => {
			let arr = v['value'].split(Limit.TREE_JOIN_STR)
			accountUuidList.push(arr[0])
			accountNameList.push(arr[1])
		})
		accountList.unshift({key: '全部', value: `${Limit.TREE_JOIN_STR}全部`})

		const selectedIndex = views.get('selectedIndex')
		const issues = views.get('issues')//所有账期
		const year = views.get('year')//当前账期年份
		const month = views.get('month')//当前账期月份
		const isAccount = views.get('isAccount')//是否按账户查询
		const accountName = views.get('accountName')
		const accountUuid = views.get('accountUuid')
		const currentPage = views.get('currentPage')
		const pageCount = views.get('pageCount')

		return (
			<Container className="cxls">
				<TopMonthPicker
					issuedate={`${year}-${month}`}
					source={issues}
					callback={(value) => {
						const dateArr = value.split('-')
						dispatch(cxAccountActions.changeCxlsData(['views', 'year'], dateArr[0]))
						dispatch(cxAccountActions.changeCxlsData(['views', 'month'], dateArr[1]))
						dispatch(cxAccountActions.getBusinessList(1, false))
					}}
					onOk={(result) => {
						const dateArr = result.value.split('-')
						dispatch(cxAccountActions.changeCxlsData(['views', 'year'], dateArr[0]))
						dispatch(cxAccountActions.changeCxlsData(['views', 'month'], dateArr[1]))
						dispatch(cxAccountActions.getBusinessList(1, false))
					}}
				/>

				<div className='cxls-flex cxls-margin-bottom'>
					<div className={isAccount ? 'cxls-account' : 'cxls-account cxls-account-select'}
						onClick={() => {
							if (!isAccount) {
								return
							}
							dispatch(cxAccountActions.changeCxlsData(['views', 'isAccount'], false))
							dispatch(cxAccountActions.changeCxlsData(['views', 'accountUuid'], ''))
							dispatch(cxAccountActions.changeCxlsData(['views', 'accountName'], '全部'))
							dispatch(cxAccountActions.getBusinessList(1, false))
					}}>
						全部
					</div>
					{/* <div className={!isAccount ? 'cxls-account' : 'cxls-account cxls-account-select'}
						onClick={() => {
							if (isAccount) {
								thirdParty.actionSheet({
									title: "选择账户",
									cancelButton: "取消",
									otherButtons: accountNameList,
									onSuccess: function(result) {
										if (result.buttonIndex == -1 || result.buttonIndex >= accountNameList.length) {
											return
										}
										dispatch(cxAccountActions.changeCxlsData(['views', 'accountUuid'], accountUuidList[result.buttonIndex]))
										dispatch(cxAccountActions.changeCxlsData(['views', 'accountName'], accountNameList[result.buttonIndex]))
										dispatch(cxAccountActions.getBusinessList(1, false))
									}
								})
								return
							}
							dispatch(cxAccountActions.changeCxlsData(['views', 'isAccount'], true))
							dispatch(cxAccountActions.getBusinessList(1, false))
					}}>

						<div className='cxls-flex'>
							<div className='overElli'>{isAccount ? `账户：${accountName}` : '账户流水'}</div>
							{isAccount ? <Icon type="arrow-down"/> : null}
						</div>
					</div> */}
					<Single
						className={!isAccount ? 'cxls-account' : 'cxls-account cxls-account-select'}
						district={accountList}
						title='选择账户'
						onOk={(value) => {
							const arr = value.value.split(Limit.TREE_JOIN_STR)
							dispatch(cxAccountActions.changeCxlsData(['views', 'accountUuid'], arr[0]))
							dispatch(cxAccountActions.changeCxlsData(['views', 'accountName'], arr[1]))
							dispatch(cxAccountActions.getBusinessList(1, false))
					}}>

						<div className='cxls-flex'
							onClick={(e)=>{
								if (!isAccount) {
									e.stopPropagation()
									dispatch(cxAccountActions.changeCxlsData(['views', 'isAccount'], true))
									dispatch(cxAccountActions.getBusinessList(1, false))
								}
							}}
						>
							<div className='overElli'>{isAccount ? `账户：${accountName}` : '账户流水'}</div>
							{isAccount ? <Icon type="arrow-down"/> : null}
						</div>
					</Single>
				</div>

				<ScrollView flex="1" uniqueKey="cxls-scroll" savePosition>
					<div className='flow-content'>
						{dataList.map((v, i) => {
							return <Vc
								idx={i}
								item={v}
								isEdit={isEdit}
								history={history}
								key={v.get('uuid')}
								dispatch={dispatch}
								selectedIndex={selectedIndex}
								editPermission={editPermission}
								simplifyStatus={simplifyStatus}
								editPzPermission={editPzPermission}
								reviewLrAccountPermission={reviewLrAccountPermission}
								intelligentStatus={intelligentStatus}
							/>
						})}
					</div>
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(cxAccountActions.getBusinessList(currentPage + 1, true,  _self))
						}}
						isGetAll={currentPage >= pageCount}
						itemSize={dataList.size}
					/>
				</ScrollView>

				<ButtonGroup style={{display: isEdit ? 'none' : ''}}>
					{/* <Button disabled={!editPermission} onClick={() => history.push('/lrls')}>
						<Icon type="add-plus"/><span>新增</span>
					</Button> */}
					<Button
						disabled={dataList.size === 0}
						onClick={() => this.setState({ isEdit: true })}
					>
						<Icon type="select" size='15'/><span>选择</span>
					</Button>
					<Button
						onClick={() => {
							dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], 'CX_HSGL'))
						}}
					>
						<Icon type="increase"/><span style={{paddingLeft: '.05rem'}}>管理</span>
					</Button>
				</ButtonGroup>
				<ButtonGroup style={{display: isEdit ? '' : 'none'}}>
					<Button onClick={() => dispatch(cxAccountActions.selectLsAll(selectedIndex, true))}>
						<Icon type="choose"/><span>全选</span>
					</Button>
					<Button onClick={() => {
						this.setState({ isEdit: false })
						dispatch(cxAccountActions.selectLsAll(selectedIndex, false))
					}}>
						<Icon type="cancel"/><span>取消</span>
					</Button>
					<Button disabled={!(dataList.some(v => v.get('selected'))) || !editPermission}
						onClick={() => dispatch(cxAccountActions.deleteLs(dataList, selectedIndex, `${year}-${month}`))}
					>
						<Icon type="delete"/><span>删除</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
