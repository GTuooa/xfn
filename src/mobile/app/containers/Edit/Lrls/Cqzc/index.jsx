import React from 'react'
import { connect }	from 'react-redux'
import Jzsy from './Jzsy'
import NoJzsy from './NoJzsy'
import ToJzsy from './ToJzsy'
import LrCqzc from './LrCqzc'

@connect(state => state)
export default
class Cqzc extends React.Component {

	render () {
		const { cqzcAccountState, history, homeState, homeAccountState,editPermission } = this.props
		const runningState = cqzcAccountState.getIn(['data', 'runningState'])
		const isJzsy = runningState === "STATE_CQZC_JZSY" ? true : false//从预览界面跳入
		const fromYl = cqzcAccountState.getIn(['views', 'fromYl'])
		const shouldJzsy = cqzcAccountState.getIn(['views', 'shouldJzsy'])

		// 图片上传
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// const enCanUse = false
		// const checkMoreFj = false

		const showlsfj = homeAccountState.getIn(['flags', 'showlsfj'])
		const label = homeAccountState.get('label');
		const enclosureList = homeAccountState.get('enclosureList');
		const enclosureCountUser = homeAccountState.get('enclosureCountUser');

		let component = null

		if (fromYl) {//预览界面的修改
			if (isJzsy) {//是结转损益
				component = <Jzsy editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj}  label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			} else {//不是结转损益
				component = <NoJzsy history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj}  label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
				if (shouldJzsy) {
					component = <ToJzsy editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj}  label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
				}
			}
		} else {//新增和修改
			component = <LrCqzc history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj}  label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			if (shouldJzsy) {
				component = <ToJzsy editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj}  label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			}
		}


		return(
			component
		)
	}
}
