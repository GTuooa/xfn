import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, Icon, Amount, ChosenPicker } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad } from 'app/containers/components'

import Item from './Item'

import * as runningTypeMxbActions from 'app/redux/Mxb/RunningTypeMxb/runningTypeMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class RunningTypeMxb extends React.Component {

	static displayName = 'RunningTypeMxb'

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
		thirdParty.setTitle({title: '类型明细表'})
		thirdParty.setIcon({showIcon: false})
		// thirdParty.setRight({show: false})
	}

	render() {

		const { allState, dispatch, runningTypeMxbState,history } = this.props
		const { showModal } = this.state

		const issuedate = runningTypeMxbState.get('issuedate')
		const endissuedate = runningTypeMxbState.get('endissuedate')
		const issues = runningTypeMxbState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const runningCategory = runningTypeMxbState.get('runningCategoryList')
		const detailsTemp = runningTypeMxbState.get('runningTypeDetailList')
		const opendetail = runningTypeMxbState.get('opendetail')
		const totalAmountList = runningTypeMxbState.get('totalAmountList')
		const currentPage = runningTypeMxbState.get('currentPage')
		const pageCount = runningTypeMxbState.get('pageCount')
		const acName = runningTypeMxbState.getIn(['views','acName'])
		const fromPage = runningTypeMxbState.getIn(['views','fromPage'])
		const typeUuid = runningTypeMxbState.getIn(['views','typeUuid'])
		const direction = runningTypeMxbState.getIn(['views','direction']) || 'debit'
		const chooseValue = runningTypeMxbState.getIn(['views','chooseValue'])

		const directionName = {
            'debit' : '借方',
            'credit' : '贷方',
            '' : ''
		}

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendTypeExcelDetail', {begin: begin, end: end, acId: typeUuid, mergeName: acName}))
		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAllTypeExcelDetail', {
			begin: begin,
			end: end,
		}))

		dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallback, '', allddExcelCallback))

		return (
			<Container className="running-type-mxb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						if (fromPage === 'boss') {
							dispatch(runningTypeMxbActions.getJrRunningTypeList(value, '',typeUuid,direction))
							dispatch(runningTypeMxbActions.getJrAcList(value, '',typeUuid))
						} else {
							dispatch(runningTypeMxbActions.getPeriodAndRunningTypeMxbListFromReflash(value,'',typeUuid))

						}
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						if (fromPage === 'boss') {
							dispatch(runningTypeMxbActions.getJrRunningTypeList(value1,value2,typeUuid,direction))
							dispatch(runningTypeMxbActions.getJrAcList(value1,value2,typeUuid))
						} else {
						dispatch(runningTypeMxbActions.getPeriodAndRunningTypeMxbListFromReflash(value1,value2,typeUuid))
						}
					}}
					changeChooseValue={(value)=>dispatch(runningTypeMxbActions.changeRunningTypeMxbChooseValue(value))}
				/>
				<div className="running-type-mxb-select">
					<div className="select-category">
						<div className="select-category-box">

							<ChosenPicker
								district={runningCategory.toJS()}
								value={typeUuid}
								parentDisabled={false}
								onChange={(item) => {
									const valueList = item.key.split(Limit.TREE_JOIN_STR)
									fromPage === 'boss'?
									dispatch(runningTypeMxbActions.getJrRunningTypeList(issuedate, issuedate,valueList[0],valueList[2]))
									:
									dispatch(runningTypeMxbActions.getRunningTypeMxbBalanceListPages(issuedate, endissuedate,valueList[0],1,false,false))
									dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','typeUuid',valueList[0]))
									dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','acName',valueList[1]))
								}}
							>
								<Row>
									<span style={{color: acName == '请选择类型' ? '#ccc' : ''}}>{acName}</span>
									<Icon type="triangle"/>
								</Row>
							</ChosenPicker>
						</div>
					</div>
				</div>
				<Row className='item-title-qc'>
					<div className='qc-title-item'>期初余额<span className='qc-title-direction'>({`${directionName[opendetail.get('direction')]}`})</span></div>
					<div className='qc-title-item'><Amount showZero={true} isTitle={true}>{opendetail && opendetail.get('balanceAmount')}</Amount></div>
				</Row>

				<ScrollView flex="1" uniqueKey="relativemxb-scroll"  className= 'scroll-item' savePosition>

					<div className='flow-content'>
						{
							detailsTemp.map((item,i) => {
								return <div key={i}>
									<Item
										className="balance-running-tabel-width"
										item={item}
										history={history}
										dispatch={dispatch}
										issuedate={issuedate}
										detailsTemp={detailsTemp}
									/>
								</div>
							})
						}
					</div>

					<ScrollLoad
						diff={100}
						classContent='flow-content'
						callback={(_self) => {
							fromPage === 'boss'?
							dispatch(runningTypeMxbActions.getJrRunningTypeList(issuedate, issuedate,typeUuid,direction,currentPage+1,false,true,true,_self))
							:
							dispatch(runningTypeMxbActions.getRunningTypeMxbBalanceListPages(issuedate, endissuedate,typeUuid,currentPage+1,true,true,_self))

						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp.size}
					/>

				</ScrollView>


				<Row className='item-title-qc'>
					<div className='qc-title-item'>期末余额<span className='qc-title-direction'>({`${directionName[totalAmountList.get('direction')]}`})</span></div>
					<div className='qc-title-item'><Amount showZero={true} isTitle={true}>{totalAmountList.get('allBalanceAmount')}</Amount></div>
				</Row>

			</Container>
		)
	}
}
