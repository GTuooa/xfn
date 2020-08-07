import React from 'react'
import { connect }	from 'react-redux'
import { Icon, Row, Button, ButtonGroup } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'

@connect(state => state)
export default
class YlTop extends React.Component {
	render() {

		const { dispatch, history, yllsState, cxAccountState, lsmxbState,zhmxbState,wlmxbState,xmmxbState } = this.props

		const ylPage = sessionStorage.getItem('ylPage')
		const runningDate = yllsState.getIn(['data', 'runningDate'])

		let selectedIndex, idx, preIdx, nextIdx, ylList = []
		if (ylPage == 'lsmxb') {
			selectedIndex = yllsState.getIn(['lsmxbData', 'selectedIndex'])
			idx = yllsState.getIn(['lsmxbData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			ylList = lsmxbState.get('ylDataList')
		}else if(ylPage == 'zhmxb'){
			selectedIndex = yllsState.getIn(['zhmxbData', 'selectedIndex'])
			idx = yllsState.getIn(['zhmxbData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			ylList = zhmxbState.get('ylDataList')
		}else if(ylPage == 'wlmxb'){
			selectedIndex = yllsState.getIn(['wlmxbData', 'selectedIndex'])
			idx = yllsState.getIn(['wlmxbData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			ylList = wlmxbState.get('ylDataList')
		}else if(ylPage == 'xmmxb'){
			selectedIndex = yllsState.getIn(['xmmxbData', 'selectedIndex'])
			idx = yllsState.getIn(['xmmxbData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			ylList = xmmxbState.get('ylDataList')
		} else {//查询流水
			selectedIndex = yllsState.getIn(['cxlsData', 'selectedIndex'])
			idx = yllsState.getIn(['cxlsData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			ylList = cxAccountState.get('ylDataList')
		}

		return (
			<Row className="date-header-wrap ylls">
				<Icon
					className="header-left"
					type="last"
					style={{color: preIdx == -1 ? '#ccc' : ''}}
					onClick={() => {
						if (preIdx == -1) {
							return
						}
						dispatch(yllsActions.getYllsSingleAccount(history, selectedIndex, ylList.getIn([preIdx,'uuid']), preIdx))
					}}
				/>
				<div className="thirdparty-date-select">
					<span className="thirdparty-date-date">{runningDate.replace(/-/g, '/')}</span>
				</div>
				<Icon
					className="header-right"
					type="next"
					style={{color: nextIdx == ylList.size ? '#ccc' : ''}}
					onClick={() => {
						if (nextIdx == ylList.size) {
							return
						}
						dispatch(yllsActions.getYllsSingleAccount(history, selectedIndex, ylList.getIn([nextIdx,'uuid']), nextIdx))
					}}
				/>
			</Row>
		)
	}
}
