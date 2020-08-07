import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView } from 'app/components'
import { MutiPeriodMoreSelect } from 'app/containers/components'

import Item from './Item'

import * as runningTypeYebActions from 'app/redux/Yeb/RunningTypeYeb/runningTypeYeb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class RunningTypeYeb extends React.Component {

	static displayName = 'RunningTypeYeb'

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
		thirdParty.setTitle({title: '类型余额表'})
		thirdParty.setIcon({showIcon: false})
		const reportExcelPermission = this.props.homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])
		if(!reportExcelPermission){
			thirdParty.setRight({show: false})
		}

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(runningTypeYebActions.initState())
			this.props.dispatch(runningTypeYebActions.getPeriodAndRunningTypeYebBalanceList())
		}
	}

	render() {

		const { allState, dispatch, runningTypeYebState,history } = this.props
		const { showModal } = this.state

		const issuedate = runningTypeYebState.get('issuedate')
		const endissuedate = runningTypeYebState.get('endissuedate')
		const issues = runningTypeYebState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const runningShowChild = runningTypeYebState.getIn(['views','runningShowChild'])
		const chooseValue = runningTypeYebState.getIn(['views','chooseValue'])
		const balanceList = runningTypeYebState.getIn(['balanceReport','childList'])

		const loop = (data,leve) => data.map((item,i) => {
            const showChild = runningShowChild.indexOf(item.get('acId')) > -1
            // const showChild = true
            const backgroundColor = leve > 1 ? '#f8f8f8' : '#fff'
            if (item.get('childList').size) {
				let childIndex = i
                return  <div key={i}>
                    <Item
                        leve={leve}
                        className="balance-running-tabel-width"
                        style={{backgroundColor}}
                        item={item}
                        haveChild={true}
                        showChild={showChild}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
                        endissuedate={endissuedate}
						chooseValue={chooseValue}
                    />
                        {showChild ? loop(item.get('childList'), leve+1,childIndex) : ''}
                </div>
            } else {
                return <div key={i}>
                    <Item
                        leve={leve}
                        className="balance-running-tabel-width"
                        item={item}
                        style={{backgroundColor}}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
                        endissuedate={endissuedate}
						chooseValue={chooseValue}
                    />
                </div>
            }

		})

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendTypeExcelbalance', {begin: begin, end: end}))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="running-type-yeb">

				<MutiPeriodMoreSelect
					start={issuedate}
					issues={issues} //默认显示日期
					end={endissuedate}
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(runningTypeYebActions.getRunningTypeYebBalanceList(value))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(runningTypeYebActions.getRunningTypeYebBalanceList(value1,value2))
					}}
					changeChooseValue={(value)=>dispatch(runningTypeYebActions.changeRunningTypeYebChooseValue(value))}
				/>

				<Row className='item-title-list'>
					<div className='title-item'>期初余额</div>
					<div className='title-item'>本期借方</div>
					<div className='title-item'>本期贷方</div>
					<div className='title-item'>期末余额</div>
				</Row>
				<ScrollView flex="1" uniqueKey="runningTypeyeb-scroll"  className= 'scroll-item' savePosition>
					{loop(balanceList,1)}
				</ScrollView>

			</Container>
		)
	}
}
