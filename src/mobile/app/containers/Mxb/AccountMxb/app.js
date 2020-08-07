import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView, TreeSelect, Icon, SinglePicker, Amount, ChosenPicker } from 'app/components'
import { MutiPeriodMoreSelect, ScrollLoad } from 'app/containers/components'

// import Account from './Account'
import Item from './Item'

import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class AccountMxb extends React.Component {

	static displayName = 'AccountMxb'

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
		thirdParty.setTitle({title: '账户明细表'})
		thirdParty.setIcon({showIcon: false})
		const reportExcelPermission = this.props.homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])
		if(!reportExcelPermission){
			thirdParty.setRight({show: false})
		}
	}


	render() {

		const { allState, dispatch, accountMxbState, history } = this.props
		const { showModal } = this.state

		const accountListArr = accountMxbState.getIn(['category','accountList'])
		// const accountListArr = allState.get('accountList')
		// const accountList = accountListArr.size ? accountListArr.getIn([0, 'childList']) : []
		const accountList = accountListArr.size ? accountListArr : []

		const issuedate = accountMxbState.getIn(['views','issuedate'])
		const endissuedate = accountMxbState.getIn(['views','endissuedate'])
		const issues = accountMxbState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const accountUuid = accountMxbState.getIn(['views','accountUuid'])
		const accountName = accountMxbState.getIn(['views','accountName'])
		const accountDetailType = accountMxbState.getIn(['views','accountDetailType'])
		const accountDetailName = accountMxbState.getIn(['views','accountDetailName'])
		const categoryUuid = accountMxbState.getIn(['views','categoryUuid'])
		const categoryName = accountMxbState.getIn(['views','categoryName'])
		const QcqmDirection = accountMxbState.getIn(['views','QcqmDirection'])
		const chooseValue = accountMxbState.getIn(['views','chooseValue'])
		const accountType = accountMxbState.getIn(['views','accountType'])

		const accountCategory = accountMxbState.getIn(['category','accountCategory'])
		const accountTypeList = accountMxbState.getIn(['category','accountTypeList'])
		// const otherCategory = accountMxbState.getIn(['category','otherCategory'])
		// const otherType = accountMxbState.getIn(['category','otherType'])
		const detailsTemp = accountMxbState.get('detailsTemp')
		const needPeriod = accountMxbState.get('needPeriod')
		const QcData = accountMxbState.get('QcData')
		const QmData = accountMxbState.get('QmData')
		const currentPage = accountMxbState.get('currentPage')
		const pageCount = accountMxbState.get('pageCount')
		// const category = {
		// 	'ACCOUNT_CATEGORY': accountCategory,
		// 	'OTHER_CATEGORY': otherCategory,
		// 	'OTHER_TYPE': otherType
		// }[accountDetailType]
		const category = accountCategory
		const accountChooseType = [
			{key:'账户流水',value:'ACCOUNT_CATEGORY'},
			{key:'对方流水-按流水类别',value:'OTHER_CATEGORY'},
			{key:'对方流水-按类型',value:'OTHER_TYPE'}
		]
		const qcqmDirectionName = {
			'debit' : '借方',
			'credit': '贷方',
			'': '贷方'
		}[QcqmDirection]
		const directionName = accountDetailType === 'ACCOUNT_CATEGORY' ? '借方' :
		accountDetailType === 'OTHER_CATEGORY' ? '贷方' : qcqmDirectionName

		const typeNameList = {cash: '现金', general: '一般户', basic: '基本户', Alipay: '支付宝', 'WeChat': '微信', other: '其它', spare: '备用金','':'全部'}
		let dataList = accountList ? accountList.toJS() : []
        dataList.unshift({
			name: '全部',
			uuid: 'all'
		})

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAccountExcelDetail', {begin: begin, end: end, accountUuid: accountUuid, accountDetailType: accountDetailType, 'typeUuid': categoryUuid,accountType}))
		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAccountExcelDetail', {begin: begin, end: end, accountUuid: accountUuid, accountDetailType: accountDetailType, 'typeUuid': categoryUuid,isExportAll:true}))

		dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallback, '', allddExcelCallback))

		return (
			<Container className="account-mxb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(value,'','true',accountUuid,accountName,accountDetailType,accountType))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(value1,value2,'true',accountUuid,accountName,accountDetailType,accountType))

					}}
					changeChooseValue={(value)=>
						dispatch(accountMxbActions.changeAccountMxbChooseValue(value))
					}
				/>
				<div className="account-mxb-select">
					<div className="select-account">
						{
							// <Account
							// 	accountList={accountList && accountList.map(v => {return {key: v.get('name'), value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}})}
							// 	accountUuid={accountUuid}
							// 	accountName={accountName}
							// 	noInsert={true}
							// 	onOk={(result) =>{
							// 		if(result){
							// 			const valueList = result.split(Limit.TREE_JOIN_STR)
							// 			dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(issuedate,endissuedate,'',valueList[0],valueList[1],accountDetailType))
							// 			dispatch(accountMxbActions.changeAccountDetailCommonString('views','accountUuid',valueList[0]))
							// 			dispatch(accountMxbActions.changeAccountDetailCommonString('views','accountName',valueList[1]))
							//
							// 		}
							// 	}}
							// />
						}

						<ChosenPicker
							type={'card'}
							parentDisabled={false}
							cardValue={accountUuid ? accountUuid : 'all'}
							value={accountType}
							district={accountTypeList.toJS()}
							cardList={dataList}
							onChange={(value)=>{
								dispatch(accountMxbActions.changeAccountMxbAccountType(value.key))
								dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(issuedate,endissuedate,'','','全部',accountDetailType,value.key))
							}}
							onOk={(result)=>{
								const uuid = result[0].uuid === 'all' ? '' : result[0].uuid
								dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(issuedate,endissuedate,'',uuid,result[0].name,accountDetailType,accountType))
							}}
						>
							<Row>
								<span>{accountName === '全部' ? typeNameList[accountType] : accountName}</span>
								<Icon type="triangle"/>
							</Row>
						</ChosenPicker>
					</div>
					<div className="select-category">
						<div className="select-category-box">
							<TreeSelect
								district={category.toJS()}
								value={categoryName}
								notLast={true}
								onChange={(item) => {
									const categoryUuid = item.name === '全部' ? '' : item.uuid
									dispatch(accountMxbActions.changeAccountDetailCommonString('views','categoryUuid',categoryUuid))
									dispatch(accountMxbActions.changeAccountDetailCommonString('views','categoryName',item.name))
									dispatch(accountMxbActions.changeAccountDetailCommonString('views','QcqmDirection',item.direction ? item.direction : ''))
									dispatch(accountMxbActions.getDetailList(issuedate,endissuedate,'',accountUuid,accountDetailType,categoryUuid,1,false))
								}}
							>
								<Row>
									<span style={{color: categoryName == '请选择类别' ? '#ccc' : ''}}>{categoryName}</span>
									<Icon type="triangle"/>
								</Row>
							</TreeSelect>
						</div>
					</div>
				{
					// 账户明细表：屏蔽“对方流水”内容
					// <div className="select-types">
					// 	<div className="select-types-box">
					// 		<SinglePicker
					// 			className='antd-single-picker'
					// 			district={accountChooseType}
					// 			value={accountDetailName}
					// 			onOk={result => {
					// 				dispatch(accountMxbActions.changeAccountDetailCommonString('views','accountDetailType',result.value))
					// 				dispatch(accountMxbActions.changeAccountDetailCommonString('views','accountDetailName',result.key))
					// 				dispatch(accountMxbActions.getDetailList(issuedate,endissuedate,'',accountUuid,result.value,categoryUuid,1,false))
					// 			}}
					// 		>
					// 			<Row style={{color: accountDetailName ? '' : '#999'}} className='lrls-account lrls-type'>
					// 				<span className='overElli'>{ accountDetailName ? accountDetailName : '账户流水' }</span>
					// 				<Icon type="triangle" />
					// 			</Row>
					// 		</SinglePicker>
					// 	</div>
					//
					// </div>
				}
				</div>
				{
					accountDetailType === 'ACCOUNT_CATEGORY' ?
					<Row className='item-title-qc'>
						<div className='qc-title-item'>期初余额</div>
						<div className='qc-title-item'><Amount showZero={true}>{QcData && QcData.get('balance')}</Amount></div>
					</Row> : ''
				}



				<ScrollView flex="1" uniqueKey="accountmx-scroll"  className= 'scroll-item' savePosition>
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
							dispatch(accountMxbActions.getDetailList(issuedate,endissuedate,'',accountUuid,accountDetailType,categoryUuid,currentPage+1,true,true,_self))

						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp.size}
					/>
				</ScrollView>

				<Row className='item-title-qc'>
					<div className='qc-title-item'>期末余额</div>
					<div className='qc-title-item'><Amount showZero={true}>{QmData.get('balance')}</Amount></div>
				</Row>

			</Container>
		)
	}
}
