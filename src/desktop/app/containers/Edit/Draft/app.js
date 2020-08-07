import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS }	from 'immutable'

import thirdParty from 'app/thirdParty'
import Title from './Title.jsx'
import Table from './Table.jsx'
import './style/index.less'

@connect(state => state)
export default
class Draft extends React.Component {
	constructor() {
		super()
		this.state = {inputValue: ''}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.draftState != nextprops.draftState || this.state !== nextstate
	}

	render() {
		const { dispatch, draftState, homeState } = this.props
		const { inputValue } = this.state
		const DRAFT_BOX = homeState.getIn(['data','userInfo','pageController','SAVE_VC','preDetailList','DRAFT_BOX'])
		const selectDraftType = draftState.getIn(['flags', 'selectDraftType'])
		const searchValue = draftState.getIn(['flags', 'searchValue'])
		const selectDraftAll = draftState.getIn(['flags','selectDraftAll'])
		const dateSort = draftState.getIn(['flags', 'dateSort'])
		const indexSort = draftState.getIn(['flags', 'indexSort'])
		const draftList = draftState.get('draftList')

		let vcKeyList = []
		draftState.get('draftList').map((u,i) => {
			vcKeyList.push(u.get('vckey'))
		})

		let selectList = [] 	//已选择的列表，根据 checkboxDisplay 判断
		let selectDraftList = []    //发送给后台的vckey列表
		draftList.map((u,i) => {
			if (u.get('checkboxDisplay')) {
				selectDraftList.push(u.get('vckey'))
				selectList.push(u)
			}
		})

		return (
			<div className="draft">
				<Title
					DRAFT_BOX={DRAFT_BOX}
					dispatch={dispatch}
					inputValue={inputValue}
					selectList={selectList}
					searchValue={searchValue}
					selectDraftList={selectDraftList}
					selectDraftType={selectDraftType}
					// changeInputValue={(value) => this.setState({inputValue: value})}
				/>
                <Table
					dateSort={dateSort}
					indexSort={indexSort}
					vcKeyList={vcKeyList}
					dispatch={dispatch}
					draftList={draftList}
					selectDraftAll={selectDraftAll}
				/>
			</div>
		)
	}
}
