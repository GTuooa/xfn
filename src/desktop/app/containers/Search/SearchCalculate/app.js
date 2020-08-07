import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message } from 'antd'
import { TableWrap } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

// import Title from './Title'

// import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class SearchCalculate extends React.Component {

	static displayName = 'SearchCalculate'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}

	componentDidMount() {

	}

	shouldComponentUpdate() {

	}

	render() {

		const { allState, dispatch } = this.props
		const { showModal } = this.state

		return (
			<div>
				没写呢
			</div>
		)
	}
}
