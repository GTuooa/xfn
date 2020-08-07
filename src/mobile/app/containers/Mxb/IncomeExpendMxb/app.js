import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, Icon, Amount } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad, TableTreeSelect } from 'app/containers/components'
import TableAmount from 'app/containers/components/Table/TableAmount'

import SzItem from './SzItem'
import Item from './Item'

import * as incomeExpendMxbActions from 'app/redux/Mxb/IncomeExpendMxb/incomeExpendMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class IncomeExpendMxb extends React.Component {

	static displayName = 'IncomeExpendMxb'

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
		thirdParty.setTitle({title: '收支明细表'})
		thirdParty.setIcon({showIcon: false})
		const reportExcelPermission = this.props.homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])
		if(!reportExcelPermission){
			thirdParty.setRight({show: false})
		}

	}

	render() {

		const { allState, dispatch, incomeExpendMxbState,history } = this.props
		const { showModal } = this.state

		const issuedate = incomeExpendMxbState.getIn(['views','issuedate'])
		const endissuedate = incomeExpendMxbState.getIn(['views','endissuedate'])
		const issues = incomeExpendMxbState.get('issues')
		const runningCategory = incomeExpendMxbState.get('runningCategoryList')
		const detailsTemp = incomeExpendMxbState.get('incomeExpendDetailList')
		const currentPage = incomeExpendMxbState.get('currentPage')
		const pageCount = incomeExpendMxbState.get('pageCount')
		const openDetail = incomeExpendMxbState.get('openDetail')
		const totalAmountList = incomeExpendMxbState.get('totalAmountList')
		const categoryName = incomeExpendMxbState.getIn(['views','categoryName'])
		const categoryUuid = incomeExpendMxbState.getIn(['views','categoryUuid'])
		const chooseValue = incomeExpendMxbState.getIn(['views','chooseValue'])
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const directionName = {
			'debit' : '收入',
			'credit': '支出',
			'debitAndCredit': '收支'
		}

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendIncomeExcelDetail', {
			begin: begin,
			end: end,
			jrCategoryUuid: categoryUuid,
			jrCategoryCompleteName: categoryName,
		}))
		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAllIncomeExcelDetail', {
			begin: begin,
			end: end,
		}))

		dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallback, '', allddExcelCallback))

		return (
			<Container className="incomeExpend-mxb">
			<MutiPeriodMoreSelect
				start={issuedate}
				end={endissuedate}
				issues={issues} //默认显示日期
				nextperiods={nextperiods}
				chooseValue={chooseValue}
				onBeginOk={(value) => {//跨期选择完开始时间后
					dispatch(incomeExpendMxbActions.getPeriodAndIncomeExpendMxbList(value,''))

				}}
				onEndOk={(value1,value2) => {//跨期选择完结束时间后
					dispatch(incomeExpendMxbActions.getPeriodAndIncomeExpendMxbList(value1,value2))

				}}
				changeChooseValue={(value)=>{
					dispatch(incomeExpendMxbActions.changeIncomeExpendMxbChooseValue(value))
				}}
			/>
			<div className="incomeExpend-mxb-select">
				<div className="select-category">
					<div className="select-category-box">
						<TableTreeSelect
							district={runningCategory.toJS()}
							value={categoryName}
							nameString={'jrCategoryName'}
							uuidString={'jrCategoryUuid'}
							notLast={true}
							onChange={(item) => {
								dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate,item.jrCategoryUuid,'',1))
								dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','categoryUuid',item.jrCategoryUuid))
								dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','categoryName',item.jrCategoryCompleteName))
							}}

						>
							<Row>
								<span style={{color: categoryName == '请选择类别' ? '#ccc' : ''}}>{categoryName}</span>
								<Icon type="triangle"/>
							</Row>
						</TableTreeSelect>
					</div>
				</div>
			</div>
			<Row className='item-title-qc'>
				<div className='qc-title-item'>期初<span className='qc-title-direction'>({directionName[openDetail.get('direction')]})</span></div>
				{
					totalAmountList.get('direction') === 'debitAndCredit' ?
					<div className='qc-title-item'>
						{
							openDetail && openDetail.get('closeARBalance')!== null ?
							<div>应收余额 <TableAmount direction={'debit'} isTitle={true}>{openDetail.get('closeARBalance')}</TableAmount></div> : null
						}
						{
							openDetail && openDetail.get('closeAPBalance')!== null ?
							<div>应付余额 <TableAmount direction={'credit'} isTitle={true}>{openDetail.get('closeAPBalance')}</TableAmount></div> : null
						}
					</div> :
					<div className='qc-title-item'>
						{
							openDetail && openDetail.get('closeARBalance')!== null ?
							<div>应收余额 <Amount showZero={true} isTitle={true}>{openDetail.get('closeARBalance')}</Amount></div> : null
						}
						{
							openDetail && openDetail.get('closeAPBalance')!== null ?
							<div>应付余额 <Amount showZero={true} isTitle={true}>{openDetail.get('closeAPBalance')}</Amount></div> : null
						}
					</div>
				}

			</Row>
			<ScrollView flex="1" uniqueKey="relativemxb-scroll"  className= 'scroll-item' savePosition>

				<div className='flow-content'>
					{
						totalAmountList.get('direction') === 'debitAndCredit'  ?
						detailsTemp.map((item,i) => {
							return <div key={item.get('oriUuid')}>
								<SzItem
									className="balance-running-tabel-width"
									item={item}
									history={history}
									dispatch={dispatch}
									issuedate={issuedate}
									detailsTemp={detailsTemp}
								/>
							</div>
						}):
						detailsTemp.map((item,i) => {
							return <div key={item.get('oriUuid')}>
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
						dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate, categoryUuid,'',currentPage+1,true,true,_self))

					}}
					isGetAll={currentPage >= pageCount }
					itemSize={detailsTemp.size}
				/>

			</ScrollView>
			{
				totalAmountList.get('direction') === 'debitAndCredit' ?
				<Row className='item-title-qm'>
					<div className='qm-title-item'>期末<span className='qc-title-direction'>(收支)</span></div>
					<div className='qm-title-item'>
						<div>
							<TableAmount direction={'debit'} isTitle={true}>{totalAmountList.get('incomeAmount')}</TableAmount>
							<TableAmount direction={'debit'} isTitle={true}>{totalAmountList.get('realIncomeAmount')}</TableAmount>
							<TableAmount direction={'debit'} isTitle={true}>{totalAmountList.get('closeARBalance')}</TableAmount>
						</div>
						<div>
							<TableAmount direction={'credit'} isTitle={true}>{totalAmountList.get('expenseAmount')}</TableAmount>
							<TableAmount direction={'credit'} isTitle={true}>{totalAmountList.get('realExpenseAmount')}</TableAmount>
							<TableAmount direction={'credit'} isTitle={true}>{totalAmountList.get('closeAPBalance')}</TableAmount>
						</div>
					</div>
				</Row> :
				<Row className='item-title-qm'>
					<div className='qm-title-item'>期末<span className='qc-title-direction'>({directionName[totalAmountList.get('direction')]})</span></div>
					<div className='qm-title-item'>
						<div>
							<Amount showZero={true} isTitle={true}>{totalAmountList.get('direction') === 'debit' ? totalAmountList.get('incomeAmount') :totalAmountList.get('expenseAmount') }</Amount>
							<Amount showZero={true} isTitle={true}>{totalAmountList.get('direction') === 'debit' ? totalAmountList.get('realIncomeAmount')-totalAmountList.get('realExpenseAmount') :totalAmountList.get('realExpenseAmount')- totalAmountList.get('realIncomeAmount')}</Amount>
							<Amount showZero={true} isTitle={true}>{totalAmountList.get('closeAPBalance') ? totalAmountList.get('closeAPBalance') :totalAmountList.get('closeARBalance') }</Amount>
						</div>
					</div>
				</Row>
			}


			</Container>
		)
	}
}
