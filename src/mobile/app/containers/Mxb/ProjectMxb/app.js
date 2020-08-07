import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, Icon, SwitchText, ChosenPicker, Amount } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad } from 'app/containers/components'
import XfnIcon from 'app/components/Icon'
import TableAmount from 'app/containers/components/Table/TableAmount'

import Item from './Item'
import TypeItem from './TypeItem'

import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class ProjectMxb extends React.Component {

	static displayName = 'ProjectMxb'

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
		thirdParty.setTitle({title: '项目明细表'})
		thirdParty.setIcon({showIcon: false})
		// thirdParty.setRight({show: false})
	}

	render() {

		const { allState, dispatch, projectMxbState, history } = this.props
		const { showModal } = this.state

		const issuedate = projectMxbState.getIn(['views','issuedate'])
		const endissuedate = projectMxbState.getIn(['views','endissuedate'])
		const tableName = projectMxbState.getIn(['views','tableName'])
		const issues = projectMxbState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const projectCategoryList = projectMxbState.get('projectCategoryList')
		const runningCategoryList = projectMxbState.get('runningCategoryList')
		const runningTypeList = projectMxbState.get('runningTypeList')
		const cardList = projectMxbState.get('cardList')

		const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
		const currentRunningCategoryItem = projectMxbState.getIn(['views','currentRunningCategoryItem'])
		const currentRunningTypeItem = projectMxbState.getIn(['views','currentRunningTypeItem'])
		const currentCardItem = projectMxbState.getIn(['views','currentCardItem'])
		const chooseDirection = projectMxbState.getIn(['views','chooseDirection'])
		const chooseValue = projectMxbState.getIn(['views','chooseValue'])

		const QcData = projectMxbState.get('QcData')
		const QmData = projectMxbState.get('QmData')
		const detailsTemp = projectMxbState.get('detailsTemp')
		const currentPage = projectMxbState.get('currentPage')
		const pages = projectMxbState.get('pages')

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin
		const exportCategoryUuid = currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : '')
		const exportCardCategoryUuid = currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid'))

		let allCardUUidList = []
		cardList && cardList.map(item => {
			allCardUUidList.push(item.get('uuid'))
		})
		const exportCardUUidList = currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendProjectExcelbalance', {
			begin: begin,
			end: end,
			cardUuidList: exportCardUUidList,
			direction: chooseDirection,
			jrTypeUuid: currentRunningTypeItem.get('jrJvTypeUuid'),
			mergeName: currentRunningTypeItem.get('mergeName'),
		}))
		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAllProjectExcelDetail', {
			begin: begin,
			end: end,
			direction: chooseDirection,
		}))
		const ddExcelCallbackIncome = () => dispatch => dispatch(allActions.allExportDo('sendProjectIncomeExcelDetail', {
			begin: begin,
			end: end,
			cardUuidList: exportCardUUidList,
			direction: chooseDirection,
			jrCategoryUuid: currentRunningCategoryItem.get('jrCategoryUuid'),
			categoryUuid: exportCategoryUuid,
			cardCategoryUuid: exportCardCategoryUuid
		}))
		const allddExcelCallbackIncome = () => dispatch => dispatch(allActions.allExportDo('sendAllProjectIncomeExcelDetail', {
			begin: begin,
			end: end,
			direction: chooseDirection,
		}))

		tableName === 'Income' ? dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallbackIncome, '', allddExcelCallbackIncome)) : dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallback, '', allddExcelCallback))

		return (
			<Container className="project-mxb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						if(tableName === 'Income'){
							dispatch(projectMxbActions.getProjectMxbBalanceListFromChangePeriod(value, '', currentCardItem, chooseDirection))
						}else{
							dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromChangePeriod(value, '', currentCardItem, chooseDirection))
						}
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						if(tableName === 'Income'){
							dispatch(projectMxbActions.getProjectMxbBalanceListFromChangePeriod(value1,value2, currentCardItem, chooseDirection))
						}else{
							dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromChangePeriod(value1,value2, currentCardItem, chooseDirection))
						}
					}}
					changeChooseValue={(value)=>dispatch(projectMxbActions.changeProjectMxbChooseValue(value))}
				/>
				<div className="project-mxb-select">
					<div className="select-change-table" onClick={()=> {
						dispatch(projectMxbActions.changeProjectMxbTable())
					}}>
						<span>{tableName === 'Income' ? '收支' : '类型'}</span>
						<XfnIcon type='type-change' />
					</div>
					<div className="select-project-category">

					<ChosenPicker
						type={'card'}
						parentDisabled={false}
						cardValue={[currentCardItem.get('uuid')]}
						value={currentProjectItem.get('value')}
						district={projectCategoryList.toJS()}
						cardList={cardList.toJS()}
						onChange={(value)=>{
							const valueList = value.key.split(Limit.TREE_JOIN_STR)
							const projectItem = {
								uuid: valueList[0],
								name: value.label,
								top: valueList[1] === 'true',
								value: value.key,
							}
							if(tableName === 'Income'){
								dispatch(projectMxbActions.getProjectMxbBalanceListFromProject(fromJS(projectItem)))
							}else{
								dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromProject(fromJS(projectItem)))
							}
						}}
						onOk={(result)=>{
							const valueList = result[0]

							const cardItem = {
								uuid: valueList.uuid,
								name: valueList.name
							}
							if(tableName === 'Income'){
								dispatch(projectMxbActions.getProjectMxbBalanceListFromCardItem(fromJS(cardItem)))
							}else{
								dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromCardItem(fromJS(cardItem)))
							}
						}}
						// cardValue={[cardUuid]}
						// children={cardName}
					>
						<Row>
							<span>{currentCardItem.get('name') === '全部' ? currentProjectItem.get('name') : currentCardItem.get('name')}</span>
							<Icon type="triangle"/>
						</Row>
					</ChosenPicker>
					</div>
					<div className="select-running-category">
						<div className="select-category-box">
							{
								tableName === 'Income' ?
								<ChosenPicker
									district={runningCategoryList.toJS()}
									value={`${currentRunningCategoryItem.get('jrCategoryUuid')}${Limit.TREE_JOIN_STR}${currentRunningCategoryItem.get('direction')}`}
									parentDisabled={false}
									onChange={(item) => {
										const valueList = item.key.split(Limit.TREE_JOIN_STR)
										const direction = valueList[1]
										const categoryItem = {
											jrCategoryUuid: valueList[0],
											jrCategoryName: item.label,
											direction: valueList[1],
										}
										dispatch(projectMxbActions.getProjectMxbBalanceListFromCategory('Income', fromJS(categoryItem)))
										dispatch(projectMxbActions.changeProjectMxbReportDirection(direction))
									}}
								>
									<Row>
										<span>{currentRunningCategoryItem.get('jrCategoryName')}</span>
										<Icon type="triangle"/>
									</Row>
								</ChosenPicker> :
								<ChosenPicker
									district={runningTypeList.toJS()}
									value={`${currentRunningTypeItem.get('jrJvTypeUuid')}${Limit.TREE_JOIN_STR}${currentRunningTypeItem.get('direction')}${Limit.TREE_JOIN_STR}${currentRunningTypeItem.get('mergeName')}`}
									parentDisabled={false}
									onChange={(item) => {
										const valueList = item.key.split(Limit.TREE_JOIN_STR)
										const direction = valueList[1]
										const categoryItem = {
											jrJvTypeUuid: valueList[0],
											typeName: item.label,
											direction: valueList[1],
											mergeName: valueList[2]
										}
										dispatch(projectMxbActions.getProjectMxbBalanceListFromType('Type', fromJS(categoryItem)))
										dispatch(projectMxbActions.changeProjectMxbReportDirection(direction ? direction : 'double_credit'))

									}}
								>
									<Row>
										<span>{currentRunningTypeItem.get('typeName')}</span>
										<Icon type="triangle"/>
									</Row>
								</ChosenPicker>

							}


						</div>
					</div>

				</div>
				{
					tableName === 'Income' ?
					<Row className='item-title-qc'>
						<div className='qc-title-item'>期初<span className='qc-title-direction'>
						{
							chooseDirection == 'double_debit' || chooseDirection == 'double_credit' ?
							<SwitchText
								checked={chooseDirection == 'double_debit' ? false : true}
								checkedChildren="支出"
								unCheckedChildren="收入"
								className='qc-title-switch'
								onChange={() => {
									dispatch(projectMxbActions.changeProjectMxbReportDirection(chooseDirection == 'double_debit' ? 'double_credit' : 'double_debit'))
								}}
							/> : <span className='qc-title-switch-name'>({chooseDirection === 'debit' ? '收入' : '支出'})</span>
						}
						</span></div>
						<div className='qc-title-item'><TableAmount direction={chooseDirection === 'double_debit' ? 'debit' : chooseDirection === 'double_credit' ? 'credit' : chooseDirection} isTitle={true}>{QcData && QcData.get('balance')}</TableAmount></div>
					</Row> :
					<Row className='item-title-qc'>
						<div className='qc-title-item'>期初<span className='qc-title-direction'>
						{
							chooseDirection == 'double_debit' || chooseDirection == 'double_credit' ?
							<SwitchText
								checked={chooseDirection == 'double_debit' ? false : true}
								checkedChildren="贷"
								unCheckedChildren="借"
								className='qc-title-switch'
								onChange={() => {
									dispatch(projectMxbActions.changeProjectMxbReportDirection(chooseDirection == 'double_debit' ? 'double_credit' : 'double_debit'))
								}}
							/> : <span className='qc-title-switch-name'>({chooseDirection === 'debit' ? '借方' : '贷方'})</span>
						}
						</span></div>
						<div className='qc-title-item'><Amount isTitle={true}>{QcData && QcData.get('balance')}</Amount></div>
					</Row>
				}

				<ScrollView flex="1" uniqueKey="relativemxb-scroll"  className= 'scroll-item' savePosition>

					<div className='flow-content'>
						{
							tableName === 'Income' ?
							detailsTemp && detailsTemp.map((item,i) => {
								return <div key={i}>
									<Item
										className="balance-running-tabel-width"
										item={item}
										history={history}
										dispatch={dispatch}
										issuedate={issuedate}
										detailsTemp={detailsTemp}
										chooseDirection={chooseDirection}
									/>
								</div>
							}) :
							detailsTemp && detailsTemp.map((item,i) => {
								return <div key={i}>
									<TypeItem
										className="balance-running-tabel-width"
										item={item}
										history={history}
										dispatch={dispatch}
										issuedate={issuedate}
										detailsTemp={detailsTemp}
										chooseDirection={chooseDirection}
									/>
								</div>
							})
						}
					</div>

					<ScrollLoad
						diff={100}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(projectMxbActions.getProjectMxbBalanceListFromFilterOrPage(tableName,currentPage+1,true,true,_self))

						}}
						isGetAll={currentPage >= pages }
						itemSize={detailsTemp ? detailsTemp.size : 0}
					/>

				</ScrollView>
				{
					tableName === 'Income' ?
					<Row className='item-title-qm'>
						<div className='qm-title-item'>期末</div>
						<div className='qm-title-item'>
							<div>
								<TableAmount direction={'debit'} isTitle={true}>{QmData.get('incomeAmount')}</TableAmount>
								<TableAmount direction={'debit'} isTitle={true}>{QmData.get('realIncomeAmount')}</TableAmount>
								<TableAmount direction={'debit'} isTitle={true}>{chooseDirection === 'debit' || chooseDirection === 'double_debit'  ? QmData.get('balance') : null}</TableAmount>
							</div>
							<div>
								<TableAmount direction={'credit'} isTitle={true}>{QmData.get('expenseAmount')}</TableAmount>
								<TableAmount direction={'credit'} isTitle={true}>{QmData.get('realExpenseAmount')}</TableAmount>
								<TableAmount direction={'credit'} isTitle={true}>{chooseDirection === 'credit' || chooseDirection === 'double_credit'  ? QmData.get('balance') : null}</TableAmount>
							</div>
						</div>
					</Row> :
					<Row className='item-title-qc'>
						<div className='qc-title-item'>期末<span className='qc-title-direction'>({chooseDirection === 'debit' || chooseDirection === 'double_debit' ? '借方' : '贷方'})</span></div>
						<div className='qc-title-item'><Amount showZero={true} isTitle={true}>{QmData.get('balance')}</Amount></div>
					</Row>
				}


			</Container>
		)
	}
}
