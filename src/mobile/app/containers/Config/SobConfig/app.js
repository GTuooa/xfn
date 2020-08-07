import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'

import { Button, ButtonGroup, Container, ScrollView, Row, Icon } from 'app/components'
import './sob-config.less'
import Sob from './Sob.jsx'
import * as thirdParty from 'app/thirdParty'

import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'
import { homeActions } from 'app/redux/Home/home.js'

@connect(state => state)
export default
class ConfigSob extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '账套编辑'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({show: false})

	
		this.props.dispatch(homeActions.setDdConfig())
		// this.props.dispatch(sobConfigActions.getSobListFetch())

		// if (sessionStorage.getItem("toSecurity") === 'welcome') {
		// 	sessionStorage.removeItem("toSecurity")
		// 	this.props.history.push('/config/security/index')
		// }
	}
	render() {
		const {
			homeState,
			dispatch,
			sobConfigState,
			history
		} = this.props

		const sobList = sobConfigState.get('sobList').map((v, i) => v.set('key', i))
		const allCheckboxDisplay = sobConfigState.get('allCheckboxDisplay')
		const toolBarDisplayIndex = sobConfigState.get('toolBarDisplayIndex')
		const xuanzeboxDisplay = sobConfigState.get('xuanzeboxDisplay')
		const username = homeState.getIn(['data', 'userInfo', 'username'])
		const userInfo = homeState.getIn(['data', 'userInfo'])
        const isAdmin = userInfo.get('isAdmin')
        const isDdAdmin = userInfo.get('isDdAdmin')
        const isDdPriAdmin = userInfo.get('isDdPriAdmin')
        const isFinance = userInfo.get('isFinance')
		// const isddAdmin = homeState.getIn(['data', 'userInfo', 'isAdmin']) === 'TRUE' || homeState.getIn(['data', 'userInfo', 'isFinance']) === 'TRUE'

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])
		const GLCanUse = moduleInfo ? (moduleInfo.get('GL') && moduleInfo.get('GL') === true ? true : false) : false

		return (
			<Container className="sob-config">
				<ScrollView flex="1">
					{sobList.map((v, i) =>
						<Sob
							allCheckboxDisplay={allCheckboxDisplay}
							key={i}
							sob={v}
							idx={i}
							username={username}
							dispatch={dispatch}
							history={history}
							isEnd={i == sobList.size-1 ? true : false}
							isAdmin={isAdmin}
						/>
					)}
					<div className="sob-config-tip-text">仅账套管理员可编辑账套</div>
				</ScrollView>
				{/* <Row
					className="top-tip"
					style={{display: allCheckboxDisplay ? '' : 'none'}}
					onClick={() => {
						dispatch(sobconfigActions.changeXuanzeboxStatus())
					}}
					>
					<Icon
						className="top-tip-icon"
						type='xuanze'
						style={{color: xuanzeboxDisplay ? '#cc0000' : '#ccc', border: 'none'}}
					/>
					<div className="top-tip-text">
						<span className="top-tip-title">继续删除请勾选：</span>
						<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;删除账套为不可逆操作；</span>
						<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;该账套下所有数据将被删除且无法恢复！</span>
					</div>
				</Row> */}
				<ButtonGroup type="ghost" height={50} style={{display: toolBarDisplayIndex === 1 ? '' : 'none'}}>
					<Button disabled={!GLCanUse && (isAdmin || isDdAdmin || isDdPriAdmin || isFinance)} onClick={() => dispatch(sobConfigActions.beforeInsertOrModifySob('', history))}><Icon type='add-plus'/><span>新增</span></Button>
					{/* <Button
						disabled={!isddAdmin}
						onClick={() => {
							dispatch(feeActions.switchFeeActivePage('Tcxq'))
							history.push('/fee')
							// thirdParty.Alert('手机端暂不支持购买，请前往电脑端的"管理"-"账套购买"里购买')
						}}
						>
						<Icon type='admin'/>
						<span>超级管理</span>
					</Button> */}
				</ButtonGroup>
				{/* <ButtonGroup type="ghost" height={50} style={{display: toolBarDisplayIndex === 2 ? '' : 'none'}}>
					<Button onClick={() => {
						if (sobList.every(v => v.get('selected'))) {
							dispatch(allActions.unselectSobAll())
						} else {
							dispatch(allActions.selectSobAll())
						}
					}}><Icon type='choose'/><span>全选</span></Button>
					<Button disabled={ !sobList.some(v => v.get('selected')) || !xuanzeboxDisplay} onClick={() => dispatch(allActions.deleteSobFetch())}><Icon type='delete'/><span>删除</span></Button>
					<Button onClick={() => !dispatch(allActions.unselectSobAll()) & dispatch(sobConfigActions.hideAllSobCheckbox())}><Icon type='cancel' /><span>取消</span></Button>
				</ButtonGroup> */}
			</Container>
		)
	}
}
