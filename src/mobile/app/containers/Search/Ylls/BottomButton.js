import React from 'react'
import { connect }	from 'react-redux'
import { Icon, Button, ButtonGroup } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'

@connect(state => state)
export default
class BottomButton extends React.Component {
	render() {

		const { dispatch, history, yllsState, cxAccountState, lsmxbState } = this.props

		const ylPage = sessionStorage.getItem('ylPage')
		let selectedIndex, idx, preIdx, nextIdx, ylList = []
		if (ylPage == 'lsmxb') {
			selectedIndex = yllsState.getIn(['lsmxbData', 'selectedIndex'])
			idx = yllsState.getIn(['lsmxbData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			ylList = lsmxbState.get('ylDataList')
		} else {
			selectedIndex = yllsState.getIn(['cxlsData', 'selectedIndex'])
			idx = yllsState.getIn(['cxlsData', 'idx'])
			preIdx = idx - 1
			nextIdx = idx + 1
			switch (selectedIndex) {
				case 0:
					ylList = cxAccountState.get('ylDataList')
					break
				case 1:
					ylList = cxAccountState.get('ylDataListforDuty')
					break
				case 2:
					ylList = cxAccountState.get('ylDataListforRealize')
					break
			}
		}

		return (
				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					{/* <Button
						disabled={preIdx == -1}
						onClick={() => {
							dispatch(yllsActions.getYllsSingleAccount(history, selectedIndex, ylList.getIn([preIdx,'uuid']), preIdx))
					}}>
						<Icon type="edit"/>
						<span>上一条</span>
					</Button> */}
					<Button
						onClick={() => {
							sessionStorage.setItem("ylToLr", true)
							history.push('/lrls')
					}}>
						<Icon type="edit"/>
						<span>修改</span>
					</Button>
					{/* <Button
						disabled={nextIdx == ylList.size}
						onClick={() => {
							dispatch(yllsActions.getYllsSingleAccount(history, selectedIndex, ylList.getIn([nextIdx,'uuid']), nextIdx))
						}}>
						<Icon type="edit"/>
						<span>下一条</span>
					</Button> */}
				</ButtonGroup>
		)
	}
}
