import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { TableBody, TableAll, TableItem, Amount, TableOver, TablePagination,TablePaginationPageSize, XfInput } from 'app/components'
import { message, DatePicker, Input, Select, Switch, Tooltip, Modal } from 'antd'

import NumberInput from 'app/components/Input'
import moment from 'moment'
import { formatDate, formatMoney, numberTest, numberCalculate } from 'app/utils'
import { categoryTypeAll  } from 'app/containers/components/moduleConstants/common'
import TableTitle from './TableTitle'
import CardItem from './CardItem'
import AccountPoundage from './AccountPoundage'
import * as Limit from 'app/constants/Limit.js'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import SearchModal from 'app/containers/components/Searchclosure/SearchModal'
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'

@immutableRenderDecorator
export default
class CardTable extends React.Component {
	state = {
		manageModal: false,//单笔流水核算弹窗
		carryoverModal: false,//单笔成本结转流水弹窗
		invioceModal: false,//单笔开具发票弹窗
		defineModal: false,//单笔发票认证弹窗
		jzsyModal:false,//单笔结转损益弹窗
		grantModal:false,
		backModal:false,
		takeBackModal:false,
		defrayModal:false,
		// 开具发票价税合计
		isInvoicingAmount: true,
		showSingleJsAmount:'',
	}
	initModal = (modalName) => {
		this.setState({[modalName]:false})
		this.props.dispatch(searchRunningActions.changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate().substr(0,10)})))
		this.props.dispatch(searchRunningAllActions.clearEnclosureList())
	}
	render() {
		const {
			dispatch,
			selectList,
			openCardModal,
			openRunningModal,
			businessTemp,
			issuedate,
			endissuedate,
			curAccountUuid,
			panes,
			searchRunningState,
			dateSortType,
			indexSortType,
			categorySortType,
			certificateSortType,
			nameSortType,
			inputValue,
			accountList,
			editLrAccountPermission,
			reviewLrAccountPermission,
			editPzPermission,
			intelligentStatus,
			showDrawer,

			allItemShow,
			orderType,
			accountPoundage,
			lrPermissionInfo,
			enclosureList,
			label,
			closedBy,
			reviewedBy,
			enCanUse,
			checkMoreFj,
			uploadKeyJson,
			QUERY_VC,
			pageSize,
		} = this.props

		const { manageModal, carryoverModal, invioceModal, defineModal, jzsyModal, grantModal, defrayModal, backModal, takeBackModal, isInvoicingAmount, showSingleJsAmount } = this.state
		const selectAcAll = businessTemp.size ? selectList.size === businessTemp.size : false
		const currentPage = searchRunningState.get('currentPage')
		const pageCount = searchRunningState.get('pageCount')
		const isAccount = searchRunningState.getIn(['flags', 'isAccount'])
		const isAsc = searchRunningState.getIn(['flags', 'isAsc'])
		const accountUuid = searchRunningState.getIn(['flags', 'curAccountUuid'])
		const debitAmount = searchRunningState.getIn(['flags', 'debitAmount'])
		const creditAmount = searchRunningState.getIn(['flags', 'creditAmount'])
		const openedAmount = searchRunningState.getIn(['flags', 'openedAmount'])
		const endedAmount = searchRunningState.getIn(['flags', 'endedAmount'])
		const flags = searchRunningState.get('flags')
		const isClose = flags.get('isClose')
		const projectList = flags.get('projectList')
		const runningFlowTemp = searchRunningState.get('runningFlowTemp')
		const categoryType = runningFlowTemp.get('categoryType')
		const modalTemp = searchRunningState.get('modalTemp')
		const stockCardList = modalTemp.get('stockCardList') || []
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn(["currentCardList", 0])
		const oriDate = runningFlowTemp.get('oriDate')
		const magenerType = runningFlowTemp.get('magenerType')
		const propertyPay = runningFlowTemp.get('propertyPay')
		const showChildList = searchRunningState.getIn(['flags', 'showChildList'])
		const companySocialSecurityAmount = modalTemp.getIn(['payment','companySocialSecurityAmount'])
		const companyAccumulationAmount = modalTemp.getIn(['payment','companyAccumulationAmount'])
		return (
			<TableAll>

				<TableTitle
					className="search-running-table-width search-running-table-title"
					// className={isAccount ? 'account-waitFor-table-width' : 'account-duty-table-width'}
					dispatch={dispatch}
					curAccountUuid={curAccountUuid}
					selectAcAll={selectAcAll}
					issuedate={issuedate}
					endissuedate={endissuedate}
					dateSortType={dateSortType}
					indexSortType={indexSortType}
					categorySortType={categorySortType}
					nameSortType={nameSortType}
					certificateSortType={certificateSortType}
					inputValue={inputValue}
					isAccount={isAccount}
					isAsc={isAsc}
					intelligentStatus={intelligentStatus}
					onClick={() => dispatch(searchRunningActions.accountItemCheckboxCheckAll(selectAcAll, businessTemp))}
					allItemShow={allItemShow}
					orderType={orderType}
					pageSize={pageSize}
				/>
				<TableBody>
					{
						
						businessTemp.map((v, i) => {
							return <CardItem
								issuedate={issuedate}
								key={v.get('oriUuid')}
								item={v}
								line={i}
								className="search-running-table-width search-running-table-body"
								// className={isAccount ? 'account-waitFor-table-width' : 'account-duty-table-width'}
								dispatch={dispatch}
								selectList={selectList}
								openCardModal={openCardModal}
								openRunningModal={openRunningModal}
								panes={panes}
								flags={flags}
								accountList={accountList}
								editLrAccountPermission={editLrAccountPermission}
								reviewLrAccountPermission={reviewLrAccountPermission}
								editPzPermission={editPzPermission}
								intelligentStatus={intelligentStatus}
								uuidList={businessTemp}   //上下条要带当页流水所有数据
								showDrawer={showDrawer}

								inputValue={inputValue}
								allItemShow={allItemShow}
								parent={this}
								showChildList={showChildList}
								QUERY_VC={QUERY_VC}
								pageSize={pageSize}
							/>
						})
					}
				</TableBody>
		{/** 	
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate, accountUuid, value, orderType, inputValue, ''))}
				/>
		*/}
				<TablePaginationPageSize
					pageSize={pageSize}
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(current,pageSize) => {
						dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate, {accountUuid:accountUuid, curPage:current, pageSize:pageSize, orderBy:orderType, searchContent:inputValue, isAsc: '' }))
					}}
				/>
			<SearchModal
				id={'modal_1'}
				visible={manageModal}
				onCancel={() => {this.initModal('manageModal')}}
				className='single-manager'
				title={`${magenerType === 'debit'?'收款':'付款'}核销`}
				okText='保存'
				dispatch={dispatch}
				lrPermissionInfo={lrPermissionInfo}
				enclosureList={enclosureList}
				label={label}
				enCanUse={enCanUse}
				uploadKeyJson={uploadKeyJson}
				checkMoreFj={checkMoreFj}
				reviewedBy={reviewedBy}
				closedBy={closedBy}
				onOk={() => {
					// console.log('modalTemp', modalTemp.toJS());

					dispatch(searchRunningActions.insertRunningManagerModal(()=>{
						this.setState({'manageModal':false})
						dispatch(searchRunningAllActions.clearEnclosureList())
					},categoryTypeObj))
				}}
				>
					<div className='manager-content'>
					{
						contactsCardRange?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						:''
					}
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate'])) > current
						}}
						value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							onFocus={(e) => e.target.select()}
							value={modalTemp.get('oriAbstract')}
							onChange={(e) => {
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{`${magenerType === 'debit'?'收款':'付款'}金额：`}</label>
						<NumberInput
							value={modalTemp.get('amount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))

								})
							}}
						/>
					</div>
					<Account
						modalTemp={modalTemp}
						dispatch={dispatch}
						accountList={accountList}
					/>
					{
						magenerType === 'debit'?
						<AccountPoundage
							dispatch={dispatch}
							accountPoundage={accountPoundage}
							modalTemp={modalTemp}
							flags={flags}
						/>:''
					}

				</div>
			</SearchModal>

			<SearchModal
				id={'modal_2'}
				visible={grantModal}
				onCancel={() => {this.initModal('grantModal')}}
				className='single-manager'
				title={magenerType === 'debit'?'收款核销':'付款核销'}
				okText='保存'
				dispatch={dispatch}
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				onOk={() => {
					dispatch(searchRunningActions.insertCommonModal(()=>this.setState({'grantModal':false}),categoryTypeObj,'','insertJrPayment'))
				}}
				>
					<div className='manager-content'>
					{
						contactsCardRange?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						:''
					}
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
						}}
						value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							onFocus={(e) => e.target.select()}
							value={modalTemp.get('oriAbstract')}
							onChange={(e) => {
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{magenerType === 'debit'?'收款金额：':'付款金额：'}</label>
						<NumberInput
							value={modalTemp.get('amount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','actualAmount'], value))

								})
							}}
						/>
					</div>
					<Account
						modalTemp={modalTemp}
						dispatch={dispatch}
						accountList={accountList}
					/>
					{
						magenerType === 'debit'?
						<AccountPoundage
							dispatch={dispatch}
							accountPoundage={accountPoundage}
							modalTemp={modalTemp}
							flags={flags}
						/>:''
					}
				</div>
			</SearchModal>

			<SearchModal
				id={'modal_3'}
				visible={defrayModal}
				onCancel={() => {this.initModal('defrayModal')}}
				className='single-manager'
				title={magenerType === 'debit'?'收款核销':'付款核销'}
				okText='保存'
				dispatch={dispatch}
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				onOk={() => {
					dispatch(searchRunningActions.insertCommonModal(()=>this.setState({'defrayModal':false}),categoryTypeObj,'',categoryTypeObj === 'acTax'?'insertJrTax':'insertJrPayment'))
				}}
				>
					<div className='manager-content'>
					{
						contactsCardRange?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						:''
					}
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
						}}
						value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							onFocus={(e) => e.target.select()}
							value={modalTemp.get('oriAbstract')}
							onChange={(e) => {
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{magenerType === 'debit'?'收款金额：':'付款金额：'}</label>
						<NumberInput
							value={categoryTypeObj === 'acTax'?modalTemp.get('amount'):modalTemp.getIn(['payment','actualAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','actualAmount'], value))
									categoryTypeObj === 'acTax'?
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp','amount'], value))
									:
									propertyPay === 'SX_ZFGJJ'?
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','companyAccumulationAmount'], value))
									:dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','companySocialSecurityAmount'], value))

								})
							}}
						/>
					</div>
					<Account
						modalTemp={modalTemp}
						dispatch={dispatch}
						accountList={accountList}
						amount={
							{
								'SX_SHBX':companySocialSecurityAmount,
								'SX_ZFGJJ':companyAccumulationAmount
							}[[propertyPay]]
						}
					/>
					{
						magenerType === 'debit'?
						<AccountPoundage
							dispatch={dispatch}
							accountPoundage={accountPoundage}
							modalTemp={modalTemp}
							flags={flags}
							amount={
								{
									'SX_SHBX':companySocialSecurityAmount,
									'SX_ZFGJJ':companyAccumulationAmount
								}[[propertyPay]]
							}
						/>:''
					}
				</div>
			</SearchModal>

			<SearchModal
				id={'modal_4'}
				visible={takeBackModal}
				onCancel={() => {this.initModal('takeBackModal')}}
				className='single-manager'
				title={`收款核销`}
				okText='保存'
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				dispatch={dispatch}
				onOk={() => {
					dispatch(searchRunningActions.insertCommonModal(()=>this.setState({'takeBackModal':false}),categoryTypeObj,'','insertJrTemporaryReceipt'))
				}}
				>
					<div className='manager-content'>
					{
						contactsCardRange?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						:''
					}
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
						}}
						value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							onFocus={(e) => e.target.select()}
							value={modalTemp.get('oriAbstract')}
							onChange={(e) => {
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{`收款金额：`}</label>
						<NumberInput
							value={modalTemp.get('amount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))

								})
							}}
						/>
					</div>
					<Account
						modalTemp={modalTemp}
						dispatch={dispatch}
						accountList={accountList}
					/>
					<AccountPoundage
						dispatch={dispatch}
						accountPoundage={accountPoundage}
						modalTemp={modalTemp}
						flags={flags}
					/>
				</div>
			</SearchModal>

			<SearchModal
				id={'modal_5'}
				visible={backModal}
				onCancel={() => {this.initModal('backModal')}}
				className='single-manager'
				title={`付款核销`}
				okText='保存'
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				dispatch={dispatch}
				onOk={() => {
					dispatch(searchRunningActions.insertCommonModal(()=>this.setState({'backModal':false}),categoryTypeObj,'','insertJrTemporaryPay'))
				}}
				>
					<div className='manager-content'>
					{
						contactsCardRange?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						:''
					}
					<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
						}}
						value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
						}}
					/>
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							onFocus={(e) => e.target.select()}
							value={modalTemp.get('oriAbstract')}
							onChange={(e) => {
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{`付款金额：`}</label>
						<NumberInput
							value={modalTemp.get('amount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))

								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>账户：</label>
						<Select
							// combobox
							value={modalTemp.getIn(['accounts',0,'accountName'])}
							onChange={value => {
								const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
								const accountName = value.split(Limit.TREE_JOIN_STR)[1]
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'accounts'], fromJS([{accountName,accountUuid}])))
							}}
							>
							{accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
						</Select>
					</div>
				</div>
			</SearchModal>

			<SearchModal
				id={'modal_6'}
				visible={jzsyModal}
				onCancel={() => {this.initModal('jzsyModal')}}
				className='single-manager'
				title='处置损益'
				okText='保存'
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				dispatch={dispatch}
				onOk={() => {
					dispatch(searchRunningActions.insertlrAccountJzsyModal(()=>this.setState({'jzsyModal':false})))
				}}
			>
				<div className='manager-content'>
					<div className='manager-item'><label>日期：</label>
						<DatePicker
							allowClear={false}
							disabledDate={(current) => {
								return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
							}}
							value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
							onChange={value => {
							const date = value.format('YYYY-MM-DD')
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
							}}
						/>
						{
							runningFlowTemp.get('beProject')?
							<Switch
								className="use-unuse-style"
								style={{marginLeft:'10px'}}
								checked={modalTemp.get('usedProject')}
								checkedChildren={'项目'}
								onChange={() => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'usedProject'], !modalTemp.get('usedProject')))
								}}
							/>:''
						}
					</div>
					<div className='manager-item'>
						<label>摘要：</label>
						<Input
							onFocus={(e) => e.target.select()}
							value={modalTemp.get('oriAbstract')}
							onChange={(e) => {
								dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>{modalTemp.get('netProfitAmount')>0?'净收益金额：':'净损失金额：'}</label>
						{formatMoney(modalTemp.get('netProfitAmount')>0?modalTemp.get('netProfitAmount'):modalTemp.get('lossAmount'))}
					</div>
					{
						modalTemp.get('usedProject')?
						<div className="manager-item" >
							<label>项目：</label>
							<Select
								combobox
								showSearch
								value={`${modalTemp.getIn(['projectCardList',0,'code']) || ''} ${modalTemp.getIn(['projectCardList',0,'name']) || ''}`}
								onChange={value => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const cardUuid = valueList[0]
									const code = valueList[1]
									const name = valueList[2]
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'projectCardList'], fromJS([{cardUuid,code,name}])))
								}}
								>
								{projectList.map((v, i) =>
									<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
										{`${v.get('code')} ${v.get('name')}`}
									</Option>
								)}
							</Select>
						</div>:''
					}

					<div className='manager-item'>
						<label>资产原值：</label>
						<NumberInput
							value={modalTemp.getIn(['assets','originalAssetsAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'assets','originalAssetsAmount'], value))
									dispatch(searchRunningActions.calculateGainForJzsy())

								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>累计折旧摊销：</label>
						<NumberInput
							value={modalTemp.getIn(['assets','depreciationAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'assets','depreciationAmount'], value))
									dispatch(searchRunningActions.calculateGainForJzsy())
								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>处置金额：</label>
						{formatMoney(modalTemp.getIn(['pendingStrongList',0,'amount']))}
					</div>
				</div>

			</SearchModal>
			<SearchModal
				id={'modal_7'}
				visible={invioceModal}
				onCancel={() => {
					this.initModal('invioceModal')
					this.setState({
						isInvoicingAmount: true
					})
				}}
				className='single-manager'
				title='开具发票'
				okText='保存'
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				dispatch={dispatch}
				onOk={() => {
					dispatch(searchRunningActions.insertRunningInvioceModal(()=>this.setState({'invioceModal':false})))
				}}
			>
				<div className='manager-content'>
				<div className='manager-item'><label>日期：</label>
				<DatePicker
					allowClear={false}
					value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
					disabledDate={(current) => {
						return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
					}}
					onChange={value => {
					const date = value.format('YYYY-MM-DD')
						dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
					}}
				/>
				</div>
				<div className='manager-item'>
					<label>摘要：</label>
					<Input
						onFocus={(e) => e.target.select()}
						value={modalTemp.get('oriAbstract')}
						onChange={(e) => {
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))

						}}
					/>
				</div>
				<div className="manager-item manager-item-kjfp">
                    <label>{isInvoicingAmount ? '开票税额' : '价税合计'}</label>
					{
						isInvoicingAmount ?
						<XfInput
							autoSelect={true}
							mode="amount"
							placeholder=""
							value={modalTemp.get('amount') < 0 ? -modalTemp.get('amount') : modalTemp.get('amount')}
							onChange={(e) =>{
								numberTest(e,(value) => {
									if(value > Math.abs(modalTemp.getIn(['pendingStrongList',0,'taxAmount']))){
										message.info('金额不能大于待开发票税额')
										dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], ''))
									}else{
										dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))
									}
								})
							}}
						/> :
						<XfInput
							autoSelect={true}
							mode="amount"
							placeholder=""
							value={showSingleJsAmount}
							onChange={(e) =>{
								numberTest(e,(value) => {
									if(value > Math.abs(modalTemp.getIn(['pendingStrongList',0,'oriAmount']))){
										message.info('金额不能大于待处理价税合计')
										dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], ''))
										this.setState({
											showSingleJsAmount: ''
										})
									}else{
										let amount = numberCalculate(numberCalculate(value,modalTemp.getIn(['pendingStrongList',0,'taxAmount']),2,'multiply'),modalTemp.getIn(['pendingStrongList',0,'oriAmount']),2,'divide')
										dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], amount))
										this.setState({
											showSingleJsAmount: value
										})
									}

								})
							}}
						/>
					}
					<Tooltip title={'切换税额计算方式'}>
						<Switch
							className="use-unuse-style lend-bg"
							checked={isInvoicingAmount}
							style={{ margin: '.1rem 0 0 .2rem' }}
							checkedChildren={''}
							unCheckedChildren={''}
							onChange={() => {
								let amount = numberCalculate(numberCalculate(modalTemp.get('amount'),modalTemp.getIn(['pendingStrongList',0,'oriAmount']),2,'multiply'),modalTemp.getIn(['pendingStrongList',0,'taxAmount']),2,'divide')
								this.setState({
									showSingleJsAmount: formatMoney(amount),
									isInvoicingAmount: !isInvoicingAmount,
								})
							}}
						/>
					</Tooltip>

                </div>
				<div className="manager-item manager-item-kjfp-tips">
                    <label></label>
					{
						isInvoicingAmount ?
						<div><span>价税合计：{numberCalculate(numberCalculate(modalTemp.get('amount'),modalTemp.getIn(['pendingStrongList',0,'oriAmount']),2,'multiply'),modalTemp.getIn(['pendingStrongList',0,'taxAmount']),2,'divide')}</span> (<span>待处理价税合计：{modalTemp.getIn(['pendingStrongList',0,'oriAmount'])}</span> <span>待开票税额：{modalTemp.getIn(['pendingStrongList',0,'taxAmount'])}</span>)</div> :
						<div><span>开票税额：{formatMoney(Math.abs(modalTemp.get('amount')))}</span> （&nbsp;<span>待处理价税合计：{modalTemp.getIn(['pendingStrongList',0,'oriAmount'])}</span> <span>待开票税额：{modalTemp.getIn(['pendingStrongList',0,'taxAmount'])}</span>&nbsp;）</div>
					}


				</div>
			</div>
			</SearchModal>
			<SearchModal
				id={'modal_8'}
				visible={defineModal}
				onCancel={() => {this.initModal('defineModal')}}
				className='single-manager'
				title='发票认证'
				okText='保存'
                lrPermissionInfo={lrPermissionInfo}
                enclosureList={enclosureList}
                label={label}
                enCanUse={enCanUse}
                uploadKeyJson={uploadKeyJson}
                checkMoreFj={checkMoreFj}
                reviewedBy={reviewedBy}
                closedBy={closedBy}
				dispatch={dispatch}
				onOk={() => {
					dispatch(searchRunningActions.insertRunningInvioceDefineModal(()=>this.setState({'defineModal':false})))
				}}
			>
				<div className='manager-content'>
				<div className='manager-item'><label>日期：</label>
					<DatePicker
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
						}}
						allowClear={false}
						value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
						}}
					/>
				</div>
				<div className='manager-item'>
					<label>摘要：</label>
					<Input
						onFocus={(e) => e.target.select()}
						value={modalTemp.get('oriAbstract')}
						onChange={(e) => {
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))

						}}
					/>
				</div>
				<div className="manager-item">
                    <label>金额：</label>
					<NumberInput value={modalTemp.get('amount') < 0 ? -modalTemp.get('amount') : modalTemp.get('amount')}
						onChange={(e) =>{
							numberTest(e,(value) => {
								if(value > Math.abs(modalTemp.getIn(['pendingStrongList',0,'taxAmount']))){
									message.info('金额不能大于待认证税额')
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], ''))
								}else{
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))
								}
							})
						}}
					/>
                </div>
			</div>
			</SearchModal>
		</TableAll>
		)
	}
}

class Account extends React.Component {
	render() {
		const { modalTemp, dispatch, accountList } = this.props
		const amount = this.props.amount || modalTemp.get('amount')
		return(
			<div className='manager-item'>
				<label>账户：</label>
				<Select
					// combobox
					value={modalTemp.getIn(['accounts',0,'accountName'])}
					onChange={(value,options) => {
						const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
						const accountName = value.split(Limit.TREE_JOIN_STR)[1]
						const poundageObj = options.props.poundage
                        const poundage = poundageObj.get('poundage')
                        const poundageRate = poundageObj.get('poundageRate')
                        const sxAmount = Math.abs(amount || 0)*poundageRate/1000> poundage && poundage > 0
                            ? poundage
                            : Math.abs(amount || 0)*poundageRate/1000
						dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'accounts'], fromJS([{accountName,accountUuid,poundage:poundageObj}])))
						dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp','accounts',0,'poundageAmount'],sxAmount.toFixed(2)))
					}}
					>
					{accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) =>
						<Option
							key={i}
							value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
							poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
						>
							{v.get('name')}
						</Option>)
					}
				</Select>
			</div>
		)
	}
}
