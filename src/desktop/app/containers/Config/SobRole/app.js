import React, { PropTypes } from 'react'
import { Map,List } from 'immutable'
import { connect } from 'react-redux'
import { toJS } from 'immutable'

import { ROOT, ROOTURL } from 'app/constants/fetch.constant.js'

import { Button, Tooltip, Icon, Input, Modal } from 'antd'
import { TableWrap, TableBody, TableTitle, TableItem, TableOver, TableAll, TableTree, ExportModal } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import RunningDetail from './RunningDetail'
import GLDetail from './GLDetail'
import RoleEdit from './RoleEdit'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

import './style.less'

@connect(state => state)
export default
class SobRole extends React.Component {

	constructor() {
		super()
		this.state = { deleteModalShow: false, inputValue: '', deleteSobName: '', deleteSobId: '', chooseModal: false, demo: 'ACCOUNTING_DEMO'}
	}

	componentDidMount() {

	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.sobConfigState != nextprops.sobConfigState || this.props.sobRoleState != nextprops.sobRoleState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, allState, sobConfigState, sobRoleState, homeState } = this.props
		const { deleteModalShow, inputValue, deleteSobName, deleteSobId, chooseModal, demo } = this.state

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])
		const GLCanUse = moduleInfo ? (moduleInfo.get('GL') && moduleInfo.get('GL') === true ? true : false) : false


		// const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		// const isPlay = homeState.getIn(['views', 'isPlay'])

		// const userInfo = homeState.getIn(['data', 'userInfo'])
		// const sobInfo = userInfo.get('sobInfo')
		// const corpId = userInfo.get('corpId')

		const views = sobRoleState.get('views')
		const sobId = views.get('sobId')
		const sobType = views.get('sobType')
		const sobName = views.get('sobName')
		const insertOrModify = views.get('insertOrModify')
		const haveChanged = views.get('haveChanged')
		const roleTemp = sobRoleState.get('roleTemp')
		const roleList = sobRoleState.get('roleList')
		const roleModuleTemp = sobRoleState.get('roleModuleTemp')

		const categoryRange = sobRoleState.get('categoryRange')
		const allCardListL = sobRoleState.get('allCardListL')
		const modalCategoryList = sobRoleState.get('modalCategoryList')
		const modalCardList = sobRoleState.get('modalCardList')
		const selectCardList = sobRoleState.get('selectCardList')
		const processModelList = sobRoleState.get('processModelList')

		return (
			<ContainerWrap type="config-four" className="sob-role-wrap">
				<FlexTitle>
					<div className="flex-title-left">
						<Button
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobOption', 'SobOption', '账套编辑'))
                                dispatch(homeActions.addHomeTabpane('Config', 'SobOption', '账套编辑'))
							}}
						>
							返回编辑页面
						</Button>
					</div>
				</FlexTitle>
				<div className="sob-role-table-wrap table-contaner">
					<RoleEdit
						roleList={roleList}
						roleTemp={roleTemp}
						dispatch={dispatch}
						haveChanged={haveChanged}
						insertOrModify={insertOrModify}
						sobName={sobName}
					/>
					{
						sobType === 'SMART' ?
						<RunningDetail
							dispatch={dispatch}
							roleModuleTemp={roleModuleTemp}
							roleTemp={roleTemp}
							haveChanged={haveChanged}
							categoryRange={categoryRange}
							allCardListL={allCardListL}
							modalCategoryList={modalCategoryList}
							modalCardList={modalCardList}
							selectCardList={selectCardList}
							processModelList={processModelList}
							sobId={sobId}
						/>
						:
						<GLDetail
							dispatch={dispatch}
							roleModuleTemp={roleModuleTemp}
							roleTemp={roleTemp}
							haveChanged={haveChanged}
						/>
					}
				</div>
			</ContainerWrap>
		)
	}
}
