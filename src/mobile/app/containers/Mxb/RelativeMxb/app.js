import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, TreeSelect, Icon, SinglePicker, Amount, SwitchText, ChosenPicker } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad } from 'app/containers/components'
import { PickerView } from 'antd-mobile';

import TableAmount from 'app/containers/components/Table/TableAmount.js'
import RelativeTreeSelect from './RelativeTreeSelect'
import Item from './Item'

import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class RelativeMxb extends React.Component {

	static displayName = 'RelativeMxb'

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
		thirdParty.setTitle({title: '往来明细表'})
		thirdParty.setIcon({showIcon: false})
		// thirdParty.setRight({show: false})
	}

	render() {

		const { allState, dispatch, relativeMxbState,history } = this.props
		const { showModal } = this.state
		const issuedate = relativeMxbState.getIn(['views','issuedate'])
		const endissuedate = relativeMxbState.getIn(['views','endissuedate'])
		const issues = relativeMxbState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)


		const selectTypeValue = relativeMxbState.getIn(['views','selectTypeValue'])
		const contactsCategory = relativeMxbState.getIn(['views','contactsCategory'])
		const runningCategory = relativeMxbState.getIn(['views','runningCategory'])
		const runningCategoryName = relativeMxbState.getIn(['views','runningCategoryName'])
		const categoryOrTypeUuid = relativeMxbState.getIn(['views','categoryOrTypeUuid'])
		const cardName = relativeMxbState.getIn(['views','cardName'])
		const cardUuid = relativeMxbState.getIn(['views','cardUuid'])
		const cardList = relativeMxbState.getIn(['views','cardList'])
		const typeCategory = relativeMxbState.getIn(['views','typeCategory'])
		const typeName = relativeMxbState.getIn(['views','typeName'])
		const currentPage = relativeMxbState.getIn(['views','currentPage'])
		const pageCount = relativeMxbState.getIn(['views','pageCount'])
		const chooseDirection = relativeMxbState.getIn(['views','chooseDirection'])
		const chooseValue = relativeMxbState.getIn(['views','chooseValue'])
		const selectRelativeItem = relativeMxbState.getIn(['views','selectRelativeItem'])
		const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])
		const categoryUuid = currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''
		const cardCategoryUuid = currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')

		const selectTypeName = {
			'type' : '类型',
			'category': '流水类别',
			'': '流水类别'
		}[selectTypeValue]

		const QcqmDirection = relativeMxbState.getIn(['views','QcqmDirection'])
		const QcData = relativeMxbState.get('QcData')
		const QmData = relativeMxbState.get('QmData')
		const detailsTemp = relativeMxbState.get('detailsTemp')

		const relativeChooseType = [
			{key:'类型',value:'type'},
			{key:'流水类别',value:'category'}
		]
		const directionName = {
			'debit' : '借方',
			'credit': '贷方',
			'': '借方'
		}[QcqmDirection]

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendRelativeExcelDetail', {
			begin: begin,
			end: end,
			jrCategoryUuid: categoryOrTypeUuid,
			cardUuid: cardUuid,
			direction: chooseDirection,
			categoryUuid,
			cardCategoryUuid
		}))
		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAllRelativeExcelDetail', {
			begin: begin,
			end: end,
			jrCategoryUuid: categoryOrTypeUuid,
			cardUuid: cardUuid,
			direction: chooseDirection
		}))

		dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallback, '', allddExcelCallback))

		return (
			<Container className="relative-mxb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(relativeMxbActions.getRelativeMxbListFromChangePeriod(value,''))

					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(relativeMxbActions.getRelativeMxbListFromChangePeriod(value1,value2))

					}}
					changeChooseValue={(value)=>{
						dispatch(relativeMxbActions.changeRelativeMxbChooseValue(value))

					}}
				/>
				<div className="relative-mxb-select">
					<div className="select-account">
						{
							// <TreeSelect
							// 	district={contactsCategory.toJS()}
							// 	value={cardName}
							// 	notLast={true}
							// 	onChange={(item) => {
							// 		dispatch(relativeMxbActions.changeContactsCategory(item,selectTypeValue))
							// 	}}
							// >
							// 	<Row>
							// 		<span style={{color: cardName == '请选择类别' ? '#ccc' : ''}}>{cardName}</span>
							// 		<Icon type="triangle"/>
							// 	</Row>
							// </TreeSelect>
						}

						<ChosenPicker
							type={'card'}
							parentDisabled={false}
							district={contactsCategory.toJS()}
							cardList={cardList.toJS()}
							onChange={(value)=>{
								dispatch(relativeMxbActions.changeContactsCategory(value,selectTypeValue))
								dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCardItem({name:'全部',uuid:''}))
							}}
							onOk={(result)=>{
								dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCardItem(result[0]))
							}}
							cardValue={[cardUuid]}
							value={selectRelativeItem.get('value')}
							children={cardName}
						>
							<Row>
								<span style={{color: typeName == '请选择卡片' ? '#ccc' : ''}}>{cardName === '全部' ? selectRelativeItem.get('name'):cardName}</span>
								<Icon type="triangle"/>
							</Row>
						</ChosenPicker>
					</div>
					<div className="select-category">
						<div className="select-category-box">
							{
								selectTypeValue === 'category' ?
								<ChosenPicker
									district={runningCategory.toJS()}
									value={`${categoryOrTypeUuid}${Limit.TREE_JOIN_STR}${chooseDirection}`}
									parentDisabled={false}
									onChange={(item) => {
										const valueList = item.key.split(Limit.TREE_JOIN_STR)
										dispatch(relativeMxbActions.changeRelativeDetailCommonString('views','runningCategoryName',item.label))
										dispatch(relativeMxbActions.changeRelativeDetailCommonString('views','categoryOrTypeUuid',valueList[0]))
										dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCategoryOrType(selectTypeValue,valueList[0],valueList[1]))
									}}
								>
									<Row>
										<span style={{color: typeName == '请选择类别' ? '#ccc' : ''}}>{runningCategoryName}</span>
										<Icon type="triangle"/>
									</Row>
								</ChosenPicker> :
								<SinglePicker
									className='antd-single-picker'
									district={typeCategory.toJS()}
									value={typeName}
									onOk={result => {
										const valueList = result.value.split(Limit.TREE_JOIN_STR)

										dispatch(relativeMxbActions.changeRelativeDetailCommonString('views','typeName',valueList[1]))
										dispatch(relativeMxbActions.changeRelativeDetailCommonString('views','categoryOrTypeUuid',valueList[0]))
										dispatch(relativeMxbActions.changeRelativeDetailCommonString('views','QcqmDirection',valueList[2]))
										dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCategoryOrType(selectTypeValue,valueList[0],valueList[2]))
									}}
								>
									<Row style={{color: typeName ? '' : '#999'}} className='relative-type'>
										<span className='overElli'>{ typeName ? typeName : '全部' }</span>
										<Icon type="triangle" />
									</Row>
								</SinglePicker>
							}


						</div>
					</div>
					{
						// 往来明细表：屏蔽“类型”入口
						// <div className="select-types">
						// 	<div className="select-types-box">
						// 		<SinglePicker
						// 			className='antd-single-picker'
						// 			district={relativeChooseType}
						// 			value={selectTypeName}
						// 			onOk={result => {
						// 				dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCategoryOrType(result.value,''))
						// 				dispatch(relativeMxbActions.initCategoryAndType())
						// 			}}
						// 		>
						// 			<Row style={{color: selectTypeName ? '' : '#999'}} className='relative-type'>
						// 				<span className='overElli'>{ selectTypeName ? selectTypeName : '流水类别' }</span>
						// 				<Icon type="triangle" />
						// 			</Row>
						// 		</SinglePicker>
						// 	</div>
						//
						// </div>
					}
				</div>
				<Row className='item-title-qc'>
					<div className='qc-title-item'>期初余额<span className='qc-title-direction'>
					{
						chooseDirection == 'double_debit' || chooseDirection == 'double_credit' ?
						<SwitchText
							checked={chooseDirection == 'double_debit' ? false : true}
							checkedChildren="支出"
							unCheckedChildren="收入"
							className='qc-title-switch'
							onChange={() => {
								dispatch(relativeMxbActions.changeRelativeMxbReportDirection(chooseDirection == 'double_debit' ? 'double_credit' : 'double_debit'))
							}}
						/> : <span className='qc-title-switch-name'>({chooseDirection === 'debit' ? '收入' : '支出'})</span>
					}
					</span></div>
					<div className='qc-title-item'><TableAmount direction={chooseDirection === 'double_debit' ? 'debit' : chooseDirection === 'double_credit' ? 'credit' : chooseDirection} isTitle={true}>{QcData && QcData.get('balance')}</TableAmount></div>
				</Row>

				<ScrollView flex="1" uniqueKey="relativemxb-scroll"  className= 'scroll-item' savePosition>

					<div className='flow-content'>
						{
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
							})
						}
					</div>

					<ScrollLoad
						diff={100}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(relativeMxbActions.getRelativeMxbListFromPage(currentPage+1,true,true,_self))

						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp ? detailsTemp.size : 0}
					/>

				</ScrollView>



				<Row className='item-title-qm'>
					<div className='qm-title-item'>期末</div>
					<div className='qm-title-item'>
						<div>
							<TableAmount direction={'debit'} isTitle={true}>{QmData.get('debitAmount')}</TableAmount>
							<TableAmount direction={'debit'} isTitle={true}>{QmData.get('realDebitAmount')}</TableAmount>
							<TableAmount direction={'debit'} isTitle={true}>{chooseDirection === 'debit' || chooseDirection === 'double_debit'  ? QmData.get('balance') : null}</TableAmount>
						</div>
						<div>
							<TableAmount direction={'credit'} isTitle={true}>{QmData.get('creditAmount')}</TableAmount>
							<TableAmount direction={'credit'} isTitle={true}>{QmData.get('realCreditAmount')}</TableAmount>
							<TableAmount direction={'credit'} isTitle={true}>{chooseDirection === 'credit' || chooseDirection === 'double_credit'  ? QmData.get('balance') : null}</TableAmount>
						</div>
					</div>
				</Row>

			</Container>
		)
	}
}
