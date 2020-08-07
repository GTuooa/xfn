import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import './style.less'

import thirdParty from 'app/thirdParty'

import ApprovalAll from './ApprovalAll/index.js'
import Detail from './Detail/index.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
class SearchApprovalApp extends React.Component {

	constructor() {
		super()
		this.state = {
		}
	}

	componentDidMount() {
        thirdParty.setTitle({title: '查询审批'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(searchApprovalActions.changeSearchApprovalCommonString('currentPageType', 'ApprovalAll'))	
			this.props.dispatch(searchApprovalActions.getApprovalProcessList({searchType: 'PROCESS_SEARCH_TITLE', searchContent:'', dateType: 'DATE_TYPE_END', beginDate: null, endDate: null, processCode: 'PROCESS_CODE_ALL'}, 1))
			this.props.dispatch(searchApprovalActions.getApprovalProcessModelList({dateType: 'DATE_TYPE_END', beginDate: null, endDate: null}, 1))
		}
	}

	render() {
        const {
            allState,
            dispatch,
			homeState,
			searchApprovalState,
			history,
		} = this.props
		
		const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])

		if (currentPageType === 'ApprovalAll') {
			return <ApprovalAll history={history} />
		} else if (currentPageType === 'Detail') {
			return <Detail history={history} />
		} else {
			return <div>未匹配</div>
		}
	}
}
