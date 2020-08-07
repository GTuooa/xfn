import React from 'react'
import { connect }	from 'react-redux'
import Gzxj from './Gzxj'
import Shbx from './Shbx'
import Zfgjj from './Zfgjj'
import Flf from './Flf'
import Qtxc from './Qtxc'
import './index.less'

@connect(state => state)
export default
class Xczc extends React.Component {
	constructor(props) {
		super(props)
    }

	render () {
		const { xczcAccountState, history, homeState, homeAccountState,editPermission } = this.props
		const propertyPay = xczcAccountState.getIn(['data', 'propertyPay'])//薪酬属性

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

		let component = null

		;({
			'SX_GZXJ': () => {
				component = <Gzxj history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_SHBX': () => {
				component = <Shbx history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_ZFGJJ': () => {
				component = <Zfgjj history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_FLF': () => {
				component = <Flf history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_QTXC': () => {
				component = <Qtxc history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			}
		}[propertyPay] || (() => null))()

		return(
			component
		)
	}
}
