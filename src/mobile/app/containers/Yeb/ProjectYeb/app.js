import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, Icon, ChosenPicker } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad } from 'app/containers/components'
import XfnIcon from 'app/components/Icon'

import DoubleItem from './DoubleItem'
import Item from './Item'

import * as projectYebActions from 'app/redux/Yeb/ProjectYeb/projectYeb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class ProjectYeb extends React.Component {

	static displayName = 'ProjectYeb'

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
		thirdParty.setTitle({title: '项目余额表'})
		thirdParty.setIcon({showIcon: false})
		// thirdParty.setRight({show: false})

		if (sessionStorage.getItem('prevPage') === 'home') {
			const currentProjectItem = fromJS({
				uuid: '',
				name: '全部',
				value: `${Limit.TREE_JOIN_STR}true`,
				top: true,
			})
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(projectYebActions.initState())
			this.props.dispatch(projectYebActions.getPeriodAndProjectYebBalanceList())
			this.props.dispatch(projectYebActions.getProjectYebCategoryFetch('','','Income',currentProjectItem))
		}

	}

	render() {

		const { allState, dispatch,projectYebState,history } = this.props
		const { showModal } = this.state

		const issuedate = projectYebState.getIn(['views','issuedate'])
		const endissuedate = projectYebState.getIn(['views','endissuedate'])
		const bussinessShowChild = projectYebState.getIn(['views','bussinessShowChild'])
		const issues = projectYebState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const currentProjectItem = projectYebState.getIn(['views','currentProjectItem'])
		const currentRunningItem = projectYebState.getIn(['views','currentRunningItem'])
		const currentJrTypeItem = projectYebState.getIn(['views','currentJrTypeItem'])

		const tableName = projectYebState.getIn(['views','tableName'])
		const chooseValue = projectYebState.getIn(['views','chooseValue'])

		const projectCategory = projectYebState.get('projectCategory')
		const runningCategory = projectYebState.get('runningCategory')
		const typeCategory = projectYebState.get('typeCategory')

		const balanceList = projectYebState.getIn(['balanceReport','childList'])

		const doubleLoop = (data,leve) => data.map((item,i) => {
            const showChild = bussinessShowChild.indexOf(item.get('cardCategory')) > -1
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
						currentRunningItem={currentRunningItem}
						currentProjectItem={currentProjectItem}
						chooseValue={chooseValue}
                    />
                        {showChild ? doubleLoop(item.get('childList'), leve+1) : ''}
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
						currentRunningItem={currentRunningItem}
						currentProjectItem={currentProjectItem}
						chooseValue={chooseValue}
                    />
                </div>
            }

        })

		const loop = (data,leve) => data.map((item,i) => {
            const showChild = bussinessShowChild.indexOf(item.get('cardCategory')) > -1
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
						direction={currentJrTypeItem.get('direction')}
						currentJrTypeItem={currentJrTypeItem}
						currentProjectItem={currentProjectItem}
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
						direction={currentJrTypeItem.get('direction')}
						currentJrTypeItem={currentJrTypeItem}
						currentProjectItem={currentProjectItem}
						chooseValue={chooseValue}
                    />
                </div>
            }

		})

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const exportCategoryUuid = (currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') :  '') : '')
		const exportCardCategoryUuid = (currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')) : '')
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendProjectExcelDetail', {
			begin: begin,
			end: end,
			isType: true,
			categoryUuid: exportCategoryUuid,
			cardCategoryUuid: exportCardCategoryUuid,
			jrCategoryUuid: '',
			jrJvTypeUuid: currentJrTypeItem.get('jrJvTypeUuid')
		}))
		const incomeddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendProjectIncomeExcelbalance', {
			begin: begin,
			end: end,
			categoryUuid: exportCategoryUuid,
			cardCategoryUuid: exportCardCategoryUuid,
			jrCategoryUuid: currentRunningItem.get('jrCategoryUuid'),
		}))

		tableName === 'Income' ? dispatch(allActions.navigationSetMenu('config', '', incomeddExcelCallback)) : dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="project-yeb">
				<MutiPeriodMoreSelect
					start={issuedate}
					issues={issues} //默认显示日期
					end={endissuedate}
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						if(tableName === 'Income'){
							dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriod(value, '', currentProjectItem,currentRunningItem))
						}else{
							dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriod(value, '', currentProjectItem,currentJrTypeItem))
						}
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						if(tableName === 'Income'){
							dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriod(value1,value2, currentProjectItem,currentRunningItem))
						}else{
							dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriod(value1,value2, currentProjectItem,currentJrTypeItem))
						}
					}}
					changeChooseValue={(value)=>dispatch(projectYebActions.changeProjectYebChooseValue(value))}
				/>
				<div className="project-yeb-select">
					<div className="select-change-table" onClick={()=> {
						dispatch(projectYebActions.changeProjectYebTable(issuedate, endissuedate, tableName))
					}}>
						<span>{tableName === 'Income' ? '收支' : '类型'}</span>
						<XfnIcon type='type-change' />
					</div>
					<div className="select-project-category">

						<ChosenPicker
							parentDisabled={false}
							district={projectCategory.toJS()}
							value={currentProjectItem.get('value')}
							onChange={(value)=>{
								const valueList = value.key.split(Limit.TREE_JOIN_STR)
								const projectItem = {
									uuid: valueList[0],
									name: value.label,
									top: valueList[1] === 'true',
									value: value.key,
								}
								if(tableName === 'Income'){
									dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, fromJS(projectItem), currentRunningItem))
								}else{
									dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, fromJS(projectItem), currentJrTypeItem))
								}
								dispatch(projectYebActions.getProjectYebCategoryFetch(issuedate, endissuedate,tableName,fromJS(projectItem)))
							}}
						>
							<Row>
								<span style={{color: currentProjectItem.get('name') == '请选择项目' ? '#ccc' : ''}}>{currentProjectItem.get('name')}</span>
								<Icon type="triangle"/>
							</Row>
						</ChosenPicker>
					</div>
					<div className="select-running-category">
						<div className="select-category-box">
							{
								tableName === 'Income' ?
								<ChosenPicker
									district={runningCategory.toJS()}
									value={currentRunningItem.get('value')}
									parentDisabled={false}
									onChange={(item) => {
										const valueList = item.key.split(Limit.TREE_JOIN_STR)

										const newRunningtem = {
											jrCategoryUuid: valueList[0],
											jrCategoryName: valueList[1],
											direction: valueList[2],
											value: item.key,
										}

										dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, currentProjectItem, fromJS(newRunningtem)))
									}}
								>
									<Row>
										<span style={{color: currentRunningItem.get('jrCategoryName') == '请选择类别' ? '#ccc' : ''}}>{currentRunningItem.get('jrCategoryName')}</span>
										<Icon type="triangle"/>
									</Row>
								</ChosenPicker> :
								<ChosenPicker
									district={typeCategory.toJS()}
									value={currentJrTypeItem.get('value')}
									parentDisabled={false}
									onChange={(item) => {
										const valueList = item.key.split(Limit.TREE_JOIN_STR)
										const newTypeItem = {
											jrJvTypeUuid: valueList[0],
											typeName: valueList[1],
											direction: valueList[2],
											mergeName: valueList[3],
											value: item.key,
										}

										dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, currentProjectItem, fromJS(newTypeItem)))
									}}
								>
									<Row>
										<span style={{color: currentRunningItem.get('typeName') == '请选择类别' ? '#ccc' : ''}}>{currentJrTypeItem.get('typeName')}</span>
										<Icon type="triangle"/>
									</Row>
								</ChosenPicker>

							}


						</div>
					</div>

				</div>
				{
					tableName === 'Income' ?
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
					</Row> :
					<Row className='item-title-list'>
						<div className='title-item'>期初余额</div>
						<div className='title-item'>本期借方</div>
						<div className='title-item'>本期贷方</div>
						<div className='title-item'>期末余额</div>
					</Row>
				}

				<ScrollView flex="1" uniqueKey="projectyeb-scroll"  className= 'scroll-item' savePosition>
					{tableName === 'Income' ? doubleLoop(balanceList,1) : loop(balanceList,1)}
				</ScrollView>
			</Container>
		)
	}
}
