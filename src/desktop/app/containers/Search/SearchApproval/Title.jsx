import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Select, Button, Input, Modal, DatePicker, Checkbox, Tooltip } from 'antd'
import moment from 'moment'
const { RangePicker } = DatePicker
import { Amount, TableItem } from 'app/components'
import { accountTreeData } from 'app/utils'
const Option = Select.Option
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import { formatDate } from 'app/utils'
import XfnSelect from 'app/components/XfnSelect'
import AccountPandge from './AccountPandge'
import { searchTypeStr, searchNameStr, accountingNameStr, dateTypeStr, dateNameStr, accountingTypeStr } from 'app/containers/Search/SearchApproval/common/common.js'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
	class Title extends React.Component {

	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		showAccountSelectModal: false,
	// 		showAccountModal: false, // 挂帐
	// 		showReceiveModal: false, // 收款
	// 		accountUuid: '',
	// 		accountName: '',
	// 		accountData: formatDate().substr(0,10),
	// 		payData: formatDate().substr(0,10),

	// 		setAccount: false,
	// 		needUsedPoundage: false,
	// 		account: null,
	// 		poundageAmount: 0,
	// 	}
	// }

	render() {

		const {
			pageList,
			isSpread,
			dispatch,
			receiveTotalMoney,
			selectList,
			clearSelectList,
			searchType,
			searchContent,
			beginDate,
			dateType,
			endDate,
			accountingType,
			editLrAccountPermission,
			orderField,
			approvalList,
			onShowPayModal,
			onShowAccountModal,
			onShowReceiveModal,
			onShowBookKeepingModal,
			canAccount,
			canPay,
			canReceive,
			canDisuse,
			canBookkeeping,
			setConfirmAccountingApprovalDetail,
			setConfirmReceiveApprovalDetail,
			setConfirmPayApprovalDetail,
			setBookKeepingApprovalDetail,
			pageSize,
			openDeleteModal,
		} = this.props
		// const { showPayModal, showReceiveModal, showAccountModal, setAccount, accountUuid, accountName, accountData, payData, needUsedPoundage, account, poundageAmount } = this.state

		const dateFormat = 'YYYY-MM-DD'
		const dateFormatList = ['DD-MM-YYYY', 'DD-MM-YY']

		return (
			<FlexTitle>
				<div className='flex-title-left'>
					{isSpread || pageList.getIn(['Search', 'pageList']).size <= 1 ? '' :
						<PageSwitch
							pageItem={pageList.get('Search')}
							onClick={(page, name, key) => {
								dispatch(homeActions.addPageTabPane('SearchPanes', key, key, name))
								dispatch(homeActions.addHomeTabpane(page, key, name))
							}}
						/>
					}
					<span className="search-approval-time-picker">
						<Select
							style={{ width: 80 }}
							className="search-approval-time-picker-select"
							defaultValue="流水类别"
							value={dateNameStr[dateType]}
							onSelect={value => dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType: value, beginDate, endDate, accountingType, orderField, isAsc: ''}, 1, pageSize))}
						>
							{dateTypeStr.map((v, i) => <Select.Option key={v.key} value={v.value}>{v.key}</Select.Option>)}
						</Select>
					
						<RangePicker
							className="search-approval-time-picker-range-picker"
							value={beginDate ? [moment(beginDate, dateFormat), moment(endDate, dateFormat)] : []}
							format={dateFormat}
							allowClear={false}
							onChange={(value, dateString) => {
								if (dateString.length > 1) {
									dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate: dateString[0], endDate: dateString[1], accountingType, orderField, isAsc: ''}, 1, pageSize))
								}
							}}
						/>
					</span>
					<span className="search-approval-cxls-select">
						<Select
							style={{ width: 80 }}
							className="cxls-type-choose"
							defaultValue="全部"
							value={accountingNameStr[accountingType]}
							onSelect={value => dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType: value, orderField, isAsc: ''}, 1, pageSize))}
						>
							{accountingTypeStr.map((v, i) => <Select.Option key={v.key} value={v.value}>{v.key}</Select.Option>)}
						</Select>
					</span>
					<span className="search-approval-serch">
						<Select
							style={{ width: 80 }}
							className="search-approval-serch-choose"
							defaultValue="流水类别"
							value={searchNameStr[searchType]}
							onSelect={value => dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchType', value))}
						>
							{searchTypeStr.map((v, i) => <Select.Option key={v.key} value={v.value}>{v.key}</Select.Option>)}
						</Select>
						<Input
							placeholder="搜索流水"
							className="search-approval-serch-input"
							value={searchContent}
							onChange={e => dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchContent', e.target.value))}
							onPressEnter={(e) => {
								dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent: e.target.value, dateType, beginDate, endDate, accountingType, orderField, isAsc: ''}, 1, pageSize))
							}}
						/>
						{
							searchContent ?
							<Icon
								className="search-approval-serch-icon-close"
								type="close-circle"
								theme='filled'
								onClick={() => {
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchContent', ''))
									dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent: '', dateType, beginDate, endDate, accountingType, orderField, isAsc: ''}, 1, pageSize))
								}}
							/>
							: null
						}
						<span className="search-approval-serch-icon-separation"></span>
						<Icon
							className="search-approval-serch-icon-search"
							type="search"
							onClick={() => {
								dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType, orderField, isAsc: ''}, 1, pageSize))
							}}
						/>
					</span>
				</div>
				<div className='flex-title-right'>
					<Button
						type="ghost"
						className="title-right"
						disabled={!editLrAccountPermission || !canBookkeeping}
						onClick={() => {
							// this.setState({ showAccountModal: true })
							onShowBookKeepingModal()
							setBookKeepingApprovalDetail((values, cb) => {
								dispatch(searchApprovalActions.bookKeepingApprovalProcessDetailInfo(selectList, ...values, () => {
									cb()
									clearSelectList()
								}))
							})
						}}
					>
						核记
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={!canAccount || !editLrAccountPermission}
						onClick={() => {
							// this.setState({ showAccountModal: true })
							onShowAccountModal()
							setConfirmAccountingApprovalDetail((values, cb) => {
								dispatch(searchApprovalActions.accountingApprovalProcessDetailInfo(selectList, ...values, () => {
									cb()
									clearSelectList()
								}))
							})

						}}
					>
						挂账
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={!canPay || !editLrAccountPermission}
						onClick={() => {
							// this.setState({ showPayModal: true })
							onShowPayModal()
							setConfirmPayApprovalDetail((values, cb) => {
								dispatch(searchApprovalActions.payingApprovalProcessDetailInfo(selectList, ...values, () => {
									cb()
									clearSelectList()
								}))
							})
						}}
					>
						付款
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={!canReceive || !editLrAccountPermission}
						onClick={() => {
							// this.setState({ showReceiveModal: true })
							onShowReceiveModal()
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveTotalMoney', receiveTotalMoney))
							setConfirmReceiveApprovalDetail((values, cb) => {
								dispatch(searchApprovalActions.receiveApprovalProcessDetailInfo(selectList, ...values, () => {
									cb()
									clearSelectList()
								}))
							})
						}}
					>
						收款
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={!canDisuse || !editLrAccountPermission}
						onClick={() => {
							dispatch(searchApprovalActions.disuseApprovalProcessDetailInfo(selectList, () => {
								clearSelectList()
							}))
						}}
					>
						作废
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={!approvalList.size || !editLrAccountPermission}
						onClick={() => {
							// this.setState({ showReceiveModal: true })
							dispatch(searchApprovalActions.getApprovalProcessCanDeleteList(approvalList.map(v => v.get('id')), () => openDeleteModal()))
						}}
					>
						删除
					</Button>
					<Button
						type="ghost"
						className="title-right"
						onClick={() => {
							dispatch(searchApprovalActions.getApprovalProcessList({refresh: true}))
							dispatch(allActions.freshSearchPage('查询审批'))
						}}
					>
						刷新
					</Button>
				</div>
			</FlexTitle>
		)
	}
}


// {
// 	showPayModal ?
// 	<Modal
// 		ref="modal"
// 		visible={true}
// 		title="填写付款信息"
// 		onCancel={() => this.setState({ 'showPayModal': false, account: null, payData: formatDate().substr(0,10) })}
// 		footer={[
// 			<Button key="back" type="ghost" size="large" onClick={() => this.setState({ 'showPayModal': false, account: null, payData: formatDate().substr(0,10) })}>
// 				取消
// 			</Button>,
// 			<Button key="submit" type="primary" size="large"
// 				onClick={() => {
// 					dispatch(searchApprovalActions.payingApprovalProcessDetailInfo(selectList, account, payData, () => {
// 						this.setState({ 'showPayModal': false, account: null, payData: formatDate().substr(0,10) })
// 						callBack()
// 					}))
// 				}}>
// 				确定
// 			</Button>
// 		]}>
// 		<div className="approval-running-modal-wrap">
// 			<div className="approval-running-base-config-wrap">
// 				<div className="approval-running-card-input-wrap">
// 					<span className="approval-running-card-input-tip">日期：</span>
// 					<span className="approval-running-card-input">
// 						<DatePicker
// 							format={dateFormat}
// 							value={payData ? moment(payData, dateFormat) : ''}
// 							onChange={(date, dateString) => {
// 								this.setState({payData: dateString})
// 							}}
// 						/>
// 					</span>
// 				</div>
// 				<div className="approval-running-card-input-wrap">
// 					<span className="approval-running-card-input-tip">账户：</span>
// 					<span className="approval-running-card-input">
// 						<XfnSelect
// 							showSearch
// 							value={account ? `${account.accountName}` : ''}
// 							onSelect={(value,options) => {
// 								const valueList = value.split(Limit.TREE_JOIN_STR)
// 								const poundageObj = options.props.poundage

// 								this.setState({
// 									account: {
// 										accountUuid: valueList[0],
// 										accountName: valueList[1],
// 										// poundage: poundageObj.toJS(),
// 									}
// 								})
// 							}}
// 						>
// 							{accountSelectList && accountSelectList.map((v, i) =>
// 								<Option
// 									key={i}
// 									value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
// 									poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
// 								>
// 									{v.get('name')}
// 								</Option>
// 							)}
// 						</XfnSelect>
// 					</span>
// 				</div>
// 			</div>
// 		</div>
// 	</Modal>
// 	: null
// }
// {
// 	showReceiveModal ? 
// 	<Modal
// 		ref="modal2"
// 		visible={true}
// 		title="填写收款信息"
// 		onCancel={() => {
// 			this.setState({ 'showReceiveModal': false, setAccount: false,  payData: formatDate().substr(0,10), account: null, poundageAmount: 0, needUsedPoundage: false })
// 			dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
// 			dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
// 		}}
// 		footer={[
// 			<Button key="back" type="ghost" size="large" onClick={() => {
// 				this.setState({ 'showReceiveModal': false, setAccount: false, payData: formatDate().substr(0,10), account: null, poundageAmount: 0, needUsedPoundage: false })
// 				dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
// 				dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
// 			}}>
// 				取消
// 			</Button>,
// 			<Button key="submit" type="primary" size="large"
// 				onClick={() => {
// 					dispatch(searchApprovalActions.receiveApprovalProcessDetailInfo(selectList, accountUuid, payData, setAccount, needUsedPoundage, account, poundageAmount, receiveTotalMoney, () => {
// 						this.setState({ 'showReceiveModal': false, setAccount: false, payData: formatDate().substr(0,10), account: null, poundageAmount: 0, needUsedPoundage: false  })
// 						callBack()
// 					}))
// 				}}>
// 				确定
// 			</Button>
// 		]}>
// 		<div className="approval-running-modal-wrap">
// 			<div className="approval-running-base-config-wrap">
// 				<div className="approval-running-card-input-wrap">
// 					<span className="approval-running-card-input-tip">日期：</span>
// 					<span className="approval-running-card-input">
// 						<DatePicker
// 							format={dateFormat}
// 							value={payData ? moment(payData, dateFormat) : ''}
// 							onChange={(date, dateString) => {
// 								this.setState({payData: dateString})
// 							}}
// 						/>
// 					</span>
// 				</div>
// 				<div className="approval-running-card-input-wrap">
// 					<span className="approval-running-card-input-tip">账户：</span>
// 					<span className="approval-running-card-input">
// 						<XfnSelect
// 							showSearch
// 							value={account ? `${account.accountName}` : ''}
// 							onSelect={(value,options) => {
// 								const valueList = value.split(Limit.TREE_JOIN_STR)
// 								const poundageObj = options.props.poundage
// 								const poundage = poundageObj.get('poundage')
// 								const poundageRate = poundageObj.get('poundageRate')
// 								const amount = receiveTotalMoney
// 								const sxAmount = ((Math.abs(amount || 0)*poundageRate/1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0)*poundageRate/1000
// 								this.setState({
// 									account: {
// 										accountUuid: valueList[0],
// 										accountName: valueList[1],
// 										poundage: poundageObj.toJS(),
// 									},
// 									poundageAmount: sxAmount,
// 								})
								
// 								if (!poundageObj.get('needPoundage')) {
// 									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
// 									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
// 								}
// 							}}
// 						>
// 							{accountSelectList && accountSelectList.map((v, i) =>
// 							<Option
// 								key={i}
// 								value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
// 								poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
// 							>
// 								{v.get('name')}
// 							</Option>)}
// 						</XfnSelect>
// 					</span>
// 				</div>
// 				<div>
// 					<span style={{display: canSetAccount ? '' : 'none'}}>
// 						<Checkbox checked={setAccount} onClick={() => this.setState({setAccount: !setAccount})}> 批量设置“明细账户”<Tooltip placement="bottom" title={'不勾选，已选择账户的明细保留原“明细账户”'}><Icon type="question-circle" /></Tooltip></Checkbox>
// 					</span>
// 				</div>
// 				{
// 					account && account.poundage.needPoundage && receiveTotalMoney > 0 ? 
// 					<AccountPandge
// 						account={account}
// 						amount={receiveTotalMoney}
// 						needUsedPoundage={needUsedPoundage}
// 						receiveTotalMoney={receiveTotalMoney}
// 						changePoundageAmount={(value) => this.setState({poundageAmount: value})}
// 						poundageAmount={poundageAmount}
// 						changeNeedUsedPoundage={() => {
// 							this.setState({needUsedPoundage: !needUsedPoundage})
// 						}}
// 					/>
// 					: null
// 				}
// 			</div>
// 		</div>
// 	</Modal>
// 	: null
// }
// {
// 	showAccountModal ?
// 		<Modal
// 		ref="modal3"
// 		visible={true}
// 		title="填写挂账信息"
// 		onCancel={() => this.setState({ 'showAccountModal': false, accountData: formatDate().substr(0,10) })}
// 		footer={[
// 			<Button key="back" type="ghost" size="large" onClick={() => this.setState({ 'showAccountModal': false, accountData: formatDate().substr(0,10) })}>
// 				取消
// 			</Button>,
// 			<Button key="submit" type="primary" size="large"
// 				onClick={() => {
// 					dispatch(searchApprovalActions.accountingApprovalProcessDetailInfo(selectList, accountData, () => {
// 						this.setState({ 'showAccountModal': false, accountData: formatDate().substr(0,10) })
// 						callBack()
// 					}))
// 				}}>
// 				确定
// 			</Button>
// 		]}>
// 		<div className="approval-running-modal-wrap">
// 			<div className="approval-running-base-config-wrap">
// 				<div className="approval-running-card-input-wrap">
// 					<span className="approval-running-card-input-tip">日期：</span>
// 					<span className="approval-running-card-input">
// 						<DatePicker
// 							format={dateFormat}
// 							value={accountData ? moment(accountData, dateFormat) : ''}
// 							onChange={(date, dateString) => {
// 								this.setState({accountData: dateString})
// 							}}
// 						/>
// 					</span>
// 				</div>
// 			</div>
// 		</div>
// 	</Modal>
// 	: null
// }