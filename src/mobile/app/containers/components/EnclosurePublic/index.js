import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS }	from 'immutable'

import Enclosure from 'app/containers/components/Enclosure'
import { enclosureActions } from 'app/redux/Home/All/enclosure.js'

@connect(state => state)
export default
class EnclosurePublic extends React.Component {
	componentDidMount () {
		const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		if (enCanUse && checkMoreFj) {
			this.props.dispatch(enclosureActions.getLabelFetch())
		}
		this.props.dispatch(enclosureActions.initEnclosure())
	}

	render () {
		const { enclosureState, allState, homeState, dispatch, history } = this.props

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const label = enclosureState.get('label')
		const enclosureList = enclosureState.get('enclosureList')
		const uploadKeyJson = allState.get('uploadKeyJson')

		let previewImageList = []
		enclosureList.map(v => {
			if(v.get('imageOrFile') === 'TRUE'){
				previewImageList.push(v.get('signedUrl'))
			}
		})

		return (
			<Enclosure
				formPage={'searchRunning'}
				className={''}
				dispatch={dispatch}
				enCanUse={enCanUse}
				editPermission={editPermission}
				enclosureList={enclosureList}
				showPzfj={false}
				checkMoreFj={checkMoreFj}
				label={label.toJS()}
				previewImageList={previewImageList}
				showckpz={false}
				uploadFiles={(value) => {
					dispatch(enclosureActions.uploadFiles(...value))
				}}
				getUploadGetTokenFetch={() => {
					dispatch(enclosureActions.getUploadGetTokenFetch())
				}}
				getLabelFetch={() => dispatch(enclosureActions.getLabelFetch())}
				deleteUploadImgUrl={(index) => dispatch(enclosureActions.deleteUploadFJUrl(index))}
				changeTagName={(index, tagValue) => dispatch(enclosureActions.changeTagName(index, tagValue))}
				uploadKeyJson={uploadKeyJson}
				history={history}
			/>
		)
	}
}
