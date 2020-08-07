import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Row, Button, ButtonGroup } from 'app/components'

import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class Title extends React.Component {
	render() {

		const {
			dispatch,
			oriDate,
			oriUuid,
			uuidList,
		} = this.props

		let selectedIndex, idx, preIdx, nextIdx
		const uuidListJs = uuidList.toJS()
		let hash = {}
		const newUuidList = uuidListJs.reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
		idx = newUuidList.findIndex(v => v.oriUuid === oriUuid)
		preIdx = idx - 1
		nextIdx = idx + 1

		return (
			<Row className="date-header-wrap">
				<Icon
					className="running-preview-header-left"
					type="last"
					style={{color: preIdx <= -1 ? '#ccc' : ''}}
					onClick={() => {
						if (preIdx <= -1) {
							return
						}
						dispatch(runningPreviewActions.getPreviewNextRunningBusinessFetch(newUuidList[preIdx]['oriUuid']))
					}}
				/>
				<div className="thirdparty-date-select">
					<span className="thirdparty-date-date">{oriDate ? oriDate.replace(/-/g, '/') : ''}</span>
				</div>
				<Icon
					className="running-preview-header-right"
					type="next"
					style={{color: nextIdx == newUuidList.length ? '#ccc' : ''}}
					onClick={() => {
						if (nextIdx == newUuidList.length) {
							return
						}
						dispatch(runningPreviewActions.getPreviewNextRunningBusinessFetch(newUuidList[nextIdx]['oriUuid']))
					}}
				/>
			</Row>
		)
	}
}
