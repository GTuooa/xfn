import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView } from 'app/components'
import { MutiPeriodMoreSelect } from 'app/containers/components'

import DoubleItem from './DoubleItem'

import * as incomeExpendYebActions from 'app/redux/Yeb/IncomeExpendYeb/incomeExpendYeb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class IncomeExpendYeb extends React.Component {

	static displayName = 'IncomeExpendYeb'

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
		thirdParty.setTitle({title: '收支余额表'})
		thirdParty.setIcon({showIcon: false})
		const reportExcelPermission = this.props.homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])
		if(!reportExcelPermission){
			thirdParty.setRight({show: false})
		}

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(incomeExpendYebActions.initState())
			this.props.dispatch(incomeExpendYebActions.getPeriodAndIncomeExpendYebBalanceList('','','true'))
		}
	}

	render() {

		const { allState, dispatch, incomeExpendYebState, history } = this.props
		const { showModal } = this.state

		const issuedate = incomeExpendYebState.get('issuedate')
		const endissuedate = incomeExpendYebState.get('endissuedate')
		const incomeExpendBalanceList = incomeExpendYebState.get('incomeExpendBalanceList')
		const runningShowChild = incomeExpendYebState.getIn(['views','runningShowChild'])
		const chooseValue = incomeExpendYebState.getIn(['views','chooseValue'])

		const issues = incomeExpendYebState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const loop = (data,leve) => data.map((item,i) => {
			const showChild = runningShowChild.indexOf(item.get('jrCategoryUuid')) > -1
			const backgroundColor = leve > 1 ? '#f8f8f8' : '#fff'
			if (item.get('childList').size) {
				return  <div key={i}>
					<DoubleItem
						leve={leve}
						className="balance-incomeExpend-tabel-width"
						style={{backgroundColor}}
						ba={item}
						haveChild={true}
						showChild={showChild}
						history={history}
						dispatch={dispatch}
						issuedate={issuedate}
						issuedate={issuedate}
						endissuedate={endissuedate}
						chooseValue={chooseValue}
					/>
					{showChild ? loop(item.get('childList'), leve+1) : ''}
				</div>
			} else {
				return  <div key={i}>
					<DoubleItem
						leve={leve}
						className="balance-incomeExpend-tabel-width"
						style={{backgroundColor}}
						ba={item}
						haveChild={false}
						showChild={showChild}
						history={history}
						dispatch={dispatch}
						issuedate={issuedate}
						issuedate={issuedate}
						endissuedate={endissuedate}
						chooseValue={chooseValue}
					/>
					{showChild ? loop(item.get('childList'), leve+1) : ''}
				</div>

			}
		})

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendIncomeExcelbalance', {
			begin: begin,
			end: end
		}))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="incomeExpend-yeb">
				<MutiPeriodMoreSelect
					start={issuedate}
					issues={issues} //默认显示日期
					end={endissuedate}
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(incomeExpendYebActions.getPeriodAndIncomeExpendYebBalanceList(value, ''))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(incomeExpendYebActions.getPeriodAndIncomeExpendYebBalanceList(value1,value2))
					}}
					changeChooseValue={(value)=>dispatch(incomeExpendYebActions.changeIncomeExpendYebChooseValue(value))}
				/>
				<Row className='ba-title-double'>
					<div className='ba-title-item'>
						<span className="item-item">期初应收</span>
						<span className="item-item">期初应付</span>
					</div>
					<div className='ba-title-item'>
						<span className="item-item">本期收入</span>
						<span className="item-item">本期支出</span>
					</div>
					<div className='ba-title-item'>
						<span className="item-item">本期实收</span>
						<span className="item-item">本期实付</span>
					</div>
					<div className='ba-title-item'>
						<span className="item-item">期末应收</span>
						<span className="item-item">期末应付</span>
					</div>
				</Row>
				<ScrollView flex="1" uniqueKey="xmye-scroll"  className= 'scroll-item' savePosition>
					<div className='ba-list flow-content'>
						{loop(incomeExpendBalanceList,1)}
					</div>
				</ScrollView>

			</Container>
		)
	}
}
