import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, TreeSelect, Icon, ChosenPicker } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad } from 'app/containers/components'

import DoubleItem from './DoubleItem'

import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class RelativeYeb extends React.Component {

	static displayName = 'RelativeYeb'

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
		thirdParty.setTitle({title: '往来余额表'})
		thirdParty.setIcon({showIcon: false})
		const reportExcelPermission = this.props.homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])
		if(!reportExcelPermission){
			thirdParty.setRight({show: false})
		}

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(relativeYebActions.initState())
			this.props.dispatch(relativeYebActions.getPeriodAndRelativeBalanceList())
			this.props.dispatch(relativeYebActions.getRelativeCategory())
		}
	}

	render() {

		const { allState, dispatch, relativeYebState, history } = this.props
		const { showModal } = this.state

		const issuedate = relativeYebState.getIn(['views','issuedate'])
		const endissuedate = relativeYebState.getIn(['views','endissuedate'])
		const categoryName = relativeYebState.getIn(['views','categoryName'])
		const categoryUuid = relativeYebState.getIn(['views','categoryUuid'])
		const categoryTop = relativeYebState.getIn(['views','categoryTop'])
		const bussinessShowChild = relativeYebState.getIn(['views','bussinessShowChild'])
		const chooseValue = relativeYebState.getIn(['views','chooseValue'])
		const contactCategory = relativeYebState.get('contactCategory')
		const runningCategory = relativeYebState.get('runningCategory')
		const runningCategoryName = relativeYebState.getIn(['views','runningCategoryName'])
		const runningCategoryUuid = relativeYebState.getIn(['views','runningCategoryUuid'])
		const categoryValue = relativeYebState.getIn(['views','categoryValue'])
		const runningCategoryValue = relativeYebState.getIn(['views','runningCategoryValue'])
		const balanceList = relativeYebState.getIn(['balanceReport','childList'])
		const issues = relativeYebState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const runningCategoryObj = {
			runningCategoryName,
			runningCategoryUuid,
			dirction: relativeYebState.getIn(['views','chooseDirection'])
		}

		const loop = (data,leve) => data.map((item,i) => {
            const showChild = bussinessShowChild.indexOf(item.get('categoryUuid')) > -1
            // const showChild = true
            const backgroundColor = leve > 1 ? '#F8F8F8' : '#fff'
            if (item.get('childList').size) {
                return  <div key={i}>
                    <DoubleItem
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
						categoryTop={categoryTop}
						categoryUuid={categoryUuid}
						chooseValue={chooseValue}
						runningCategoryObj={runningCategoryObj}
                    />
                        {showChild ? loop(item.get('childList'), leve+1) : ''}
                </div>
            } else {
                return <div key={i}>
                    <DoubleItem
                        leve={leve}
                        className="balance-running-tabel-width"
                        item={item}
                        style={{backgroundColor}}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
                        endissuedate={endissuedate}
						categoryTop={categoryTop}
						categoryUuid={categoryUuid}
						chooseValue={chooseValue}
						runningCategoryObj={runningCategoryObj}
                    />
                </div>
            }

        })

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendRelativeExcelbalance', {
			begin: begin,
			end: end,
			categoryUuid: categoryUuid
		}))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="relative-yeb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(relativeYebActions.getRelativeBalanceList(value, '',categoryUuid,categoryTop,runningCategoryUuid))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(relativeYebActions.getRelativeBalanceList(value1,value2,categoryUuid,categoryTop,runningCategoryUuid))
					}}
					changeChooseValue={(value)=>dispatch(relativeYebActions.changeRelativeYebChooseValue(value))}
				/>
				<Row className="select-category-box">


					<ChosenPicker
						district={contactCategory.toJS()}
						value={categoryValue}
						parentDisabled={false}
						onChange={(item) => {
							const valueList = item.key.split(Limit.TREE_JOIN_STR)
							dispatch(relativeYebActions.changeRelativeCategory(item))
							dispatch(relativeYebActions.getRelativeBalanceList(issuedate, endissuedate,valueList[0],valueList[1],runningCategoryUuid))
						}}
					>
						<Row>
							<span style={{color: categoryName == '请选择往来类别' ? '#ccc' : ''}}>{categoryName}</span>
							<Icon type="triangle"/>
						</Row>
					</ChosenPicker>
					<ChosenPicker
						district={runningCategory.toJS()}
						value={runningCategoryValue}
						parentDisabled={false}
						onChange={(item) => {
							const valueList = item.key.split(Limit.TREE_JOIN_STR)
							dispatch(relativeYebActions.changeRunningCategory(item))
							dispatch(relativeYebActions.changeRelativeYebChooseDirction(valueList[2]))
							dispatch(relativeYebActions.getRelativeBalanceList(issuedate, endissuedate,categoryUuid,categoryTop,valueList[0]))
						}}
					>
						<Row>
							<span style={{color: runningCategoryName == '请选择流水类别' ? '#ccc' : ''}}>{runningCategoryName}</span>
							<Icon type="triangle"/>
						</Row>
					</ChosenPicker>
				</Row>
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
				<ScrollView flex="1" uniqueKey="relaticeyeb-scroll"  className= 'scroll-item' savePosition>
					{loop(balanceList,1)}
				</ScrollView>


			</Container>
		)
	}
}
