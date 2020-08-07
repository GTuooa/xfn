import React from 'react'
import { connect }	from 'react-redux'
import Zzs from './Zzs'
import Grsf from './Grsf'
import Qtsf from './Qtsf'

@connect(state => state)
export default
class Sfzc extends React.Component {
	constructor(props) {
		super(props)
    }

	render () {
		const { sfzcAccountState, history, homeState, homeAccountState,editPermission } = this.props
		const propertyTax = sfzcAccountState.getIn(['data', 'propertyTax'])//税费属性

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
			'SX_ZZS': () => {//增值税
				component = <Zzs history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_GRSF': () => {//个人税费
				component = <Grsf history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_QTSF': () => {//其他税费
				component = <Qtsf history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			},
			'SX_QYSDS': () => {//企业所得税
				component = <Qtsf history={history} editPermission={editPermission} enCanUse={enCanUse} checkMoreFj={checkMoreFj} showlsfj={showlsfj} label={label} enclosureList={enclosureList} enclosureCountUser={enclosureCountUser}/>
			}
		}[propertyTax] || (() => null))()

		return(
			component
		)
	}
}
