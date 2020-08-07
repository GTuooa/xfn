import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'

import Title from './Title'
// 核算与管理  表格
import PayManageTable from './PayManage'
import CheckObjectTable from './checkObject'
import InvoicingTable from './invoicing'
import CostTransferTable from './costTransfer'
import CertificationTable from './certification'
import TreeContain from './TreeContain'
import FzModel from 'app/containers/Config/Ass/FzModel.jsx'
import { TableWrap } from 'app/components'
import { Button, Select, message } from 'antd'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import './style/index.less'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import { categoryTypeAll } from 'app/containers/components/moduleConstants/common'

@connect(state => state)
export default
class Calculation extends React.Component {
	componentWillMount() {

    }

	componentDidMount() {
		this.props.dispatch(calculationActions.getManageCategoryListInfo())
		this.props.dispatch(calculationActions.getPeriodCalculateList('', 'manages',true, '全部',''))
		this.props.dispatch(calculationActions.changeCalculateCommonString('calculate', 'cardUuid', ''))
		this.props.dispatch(calculationActions.changeCalculateCommonString('calculate', ['usedCard','code'], '全部'))
		this.props.dispatch(calculationActions.changeCalculateCommonString('calculate', ['usedCard','name'], ''))
    }

	constructor() {
		super()
		this.state = {
			showCardModal: false,
			showRunningModal: false,
			showPayOrReceive: false,
			showRunningInfoModal: false,
			runningInfoModalType: false,
			yllsVisible:false
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.homeState != nextprops.homeState || this.props.calculationState != nextprops.calculationState || this.props.accountConfState != nextprops.accountConfState || this.props.lrAccountState != nextprops.lrAccountState || this.props.yllsState != nextprops.yllsState || this.props.cxlsState != nextprops.cxlsState || this.state !== nextstate
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}


    render() {
        const { allState, homeState, calculationState, accountConfState, dispatch, lrAccountState, cxlsState, yllsState } = this.props
		const { showCardModal, showRunningModal, showPayOrReceive, showRunningInfoModal, runningInfoModalType, AmountValue, inputValue, yllsVisible } = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const reviewLrAccountPermission = LrAccountPermissionInfo.getIn(['review', 'permission'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPzPermission = PzPermissionInfo.getIn(['edit', 'permission'])
		const panes = homeState.get('panes')
		const issues = allState.get('accountIssues')
		const flags = calculationState.get('flags')
		const calculateTemp = calculationState.get('calculateTemp')
		const accountList = accountConfState.get('accountList')


		const assId = calculateTemp.getIn(['ass','assid'])
		const assCategory = calculateTemp.getIn(['ass','asscategory'])
		const acId = calculateTemp.getIn(['ass', 'acId'])
		const ass = calculateTemp.getIn(['ass','totalName'])
		const handlingAmount = calculateTemp.get('handlingAmount')
		const accountName = calculateTemp.get('accountName')
		const runningAbstract = calculateTemp.get('runningAbstract')
		const cardList = calculateTemp.get('cardList')
		const acList = calculateTemp.get('acList')
		const usedCard = calculateTemp.get('usedCard')
		const cardUuid = calculateTemp.get('cardUuid')

		const stockThingsList = calculateTemp.get('stockThingsList')
		const stockCard = calculateTemp.get('stockCard')
		const stockUuid = calculateTemp.get('stockUuid')
		const mainSouce = calculateTemp.get('typeList').toJS()


		const issuedate = flags.get('issuedate')
		const main = flags.get('main')
		const accountingType = flags.get('accountingType')
		const curCategory = flags.get('curCategory')
		const curAccountUuid = flags.get('curAccountUuid')
		const payOrReceive = flags.get('payOrReceive')
		const selectList = flags.get('selectList')
		const debitSum = flags.get('debitSum')
		const creditSum = flags.get('creditSum')
		const debitAmount = flags.get('debitAmount')
		const creditAmount = flags.get('creditAmount')
		const isCheck = flags.get('isCheck')
		const showCalculateModal = flags.get('showCalculateModal')
		const selectDate = flags.get('selectDate')
		const totalAmount = flags.get('totalAmount')
		const searchType = flags.get('searchType')
		const invoicingType = flags.get('invoicingType')
		const certifiedType = flags.get('certifiedType')
		const costTransferType = flags.get('costTransferType')


    	const runningCategory = calculationState.get('runningCategory')
		const payManageList = calculationState.get('payManageList')
		const invoicingList = calculationState.get('invoicingList')
		const costTransferList = calculationState.get('costTransferList')
		const certificationList = calculationState.get('certificationList')

		const billMakeOutType = invoicingList.get('billMakeOutType')
		const billAuthType = certificationList.get('billAuthType')
		const runningState = costTransferList.get('runningState')
		const mediumAcAssList = calculationState.get('calculateTemp')
		const lsItemData = yllsState.get('lsItemData')
		const modalTemp = cxlsState.get('modalTemp')
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false
		const curItem = yllsState.get('curItem')
		const runningFlowTemp = cxlsState.get('runningFlowTemp')
		const magenerType = runningFlowTemp.get('magenerType')
		const categoryType = runningFlowTemp.get('categoryType')
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange'])
		const isClose = cxlsState.getIn(['flags','isClose'])

		const businessTemp = {
			invoicing:invoicingList.get('childList'),
			manages:payManageList.get('childList').filter((v,i) => i>0 ? v.get('uuid') !== payManageList.get('childList').getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值'),
			costTransfer:costTransferList.get('childList').filter((v,i) => i>0 ? v.get('parentUuid') !== costTransferList.get('childList').getIn([i-1,'parentUuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值'),
			certification:certificationList.get('childList'),
		}[accountingType]
		const Component = ({
			'manages': () => {
				return <PayManageTable
					ass={ass}
					AmountValue={AmountValue}
					isCheck={isCheck}
					selectList={selectList}
					debitSum={debitSum}
					creditSum={creditSum}
					payManageList={payManageList}
					accountingType={accountingType}
					dispatch={dispatch}
					panes={panes}
					openCardModal={() => this.setState({showCardModal: true})}
					openRunningModal={() => this.setState({showRunningModal: true})}
					changeAmountValue={(value) => this.setState({AmountValue: value})}
					editLrAccountPermission={editLrAccountPermission}
					cxlsState={cxlsState}
					accountList={accountList}
					showDrawer={() => this.setState({yllsVisible: true})}
					calculationState={calculationState}
				/>
			},
			'invoicing': () => {
				return <InvoicingTable
					ass={ass}
					AmountValue={AmountValue}
					isCheck={isCheck}
					selectList={selectList}
					invoicingList={invoicingList}
					accountingType={accountingType}
					dispatch={dispatch}
					panes={panes}
					openCardModal={() => this.setState({showCardModal: true})}
					openRunningModal={() => this.setState({showRunningModal: true})}
					changeAmountValue={(value) => this.setState({AmountValue: value})}
					editLrAccountPermission={editLrAccountPermission}
					accountList={accountList}
					cxlsState={cxlsState}
					showDrawer={() => this.setState({yllsVisible: true})}

				/>
			},
			'costTransfer': () => {
				return <CostTransferTable
					ass={ass}
					AmountValue={AmountValue}
					isCheck={isCheck}
					selectList={selectList}
					costTransferList={costTransferList}
					accountingType={accountingType}
					dispatch={dispatch}
					panes={panes}
					openCardModal={() => this.setState({showCardModal: true})}
					openRunningModal={() => this.setState({showRunningModal: true})}
					changeAmountValue={(value) => this.setState({AmountValue: value})}
					editLrAccountPermission={editLrAccountPermission}
					accountList={accountList}
					cxlsState={cxlsState}
					showDrawer={() => this.setState({yllsVisible: true})}

				/>
			},
			'certification': () => {
				return <CertificationTable
					ass={ass}
					AmountValue={AmountValue}
					isCheck={isCheck}
					selectList={selectList}
					certificationList={certificationList}
					accountingType={accountingType}
					dispatch={dispatch}
					panes={panes}
					openCardModal={() => this.setState({showCardModal: true})}
					openRunningModal={() => this.setState({showRunningModal: true})}
					changeAmountValue={(value) => this.setState({AmountValue: value})}
					editLrAccountPermission={editLrAccountPermission}
					accountList={accountList}
					cxlsState={cxlsState}
					showDrawer={() => this.setState({yllsVisible: true})}

					/>
			}
		}[accountingType])()

		return (
			<div className="calculate-box">
				<Title
					ass={ass}
					issues={issues}
					issuedate={issuedate}
					isCheck={isCheck}
					accountingType={accountingType}
					dispatch={dispatch}
					curCategory={curCategory}
					assId={assId}
					assCategory={assCategory}
					acId={acId}
					cardList={cardList}
					stockThingsList={stockThingsList}
					acList ={acList}
					usedCard ={usedCard}
					stockCard ={stockCard}
					cardUuid ={cardUuid}
					selectList={selectList}
					selectDate={selectDate}
					runningAbstract={runningAbstract}
					showCalculateModal={showCalculateModal}
					handlingAmount={handlingAmount}
					totalAmount={totalAmount}
					accountName={accountName}
					mediumAcAssList={mediumAcAssList}
					searchType={searchType}
					inputValue={inputValue}
					invoicingType={invoicingType}
					certifiedType={certifiedType}
					billMakeOutType={billMakeOutType}
					billAuthType={billAuthType}
					costTransferType={costTransferType}
					runningState={runningState}
					cxlsState={cxlsState}
					accountList={accountList}
					mainSouce={mainSouce}
					changeInputValue={(value) => this.setState({inputValue: value})}
					newRunning={() => this.setState({showRunningModal: true})}
					payOrReceiveOnClick={() => this.setState({showPayOrReceive: true})}
					editLrAccountPermission={editLrAccountPermission}
					payManageList={payManageList}
					flags={flags}
					stockUuid={stockUuid}
				/>
				<TableWrap>
					{
						isCheck && accountingType == 'manages' ?
						<CheckObjectTable
								ass={ass}
								AmountValue={AmountValue}
								isCheck={isCheck}
								selectList={selectList}
								debitSum={debitSum}
								creditSum={creditSum}
								debitAmount={debitAmount}
								creditAmount={creditAmount}
								payManageList={payManageList}
								accountingType={accountingType}
								dispatch={dispatch}
								panes={panes}
								openCardModal={() => this.setState({showCardModal: true})}
								openRunningModal={() => this.setState({showRunningModal: true})}
								changeAmountValue={(value) => this.setState({AmountValue: value})}
								editLrAccountPermission={editLrAccountPermission}
								accountList={accountList}
								cxlsState={cxlsState}
								calculationState={calculationState}
							/>
							: Component

					}

					{/* <TreeContain
						dispatch={dispatch}
						curCategory={curCategory}
						curAccountUuid={curAccountUuid}
						runningCategory={runningCategory}
						issuedate={issuedate}
						assId={assId}
						assCategory={assCategory}
						acId={acId}
						isCheck={isCheck}
						accountingType={accountingType}
						flags={flags}
						inputValue={inputValue}
						billMakeOutType={billMakeOutType}
					/> */}
					{
						yllsVisible ?
						<Ylls
							yllsVisible={yllsVisible}
							dispatch={dispatch}
							yllsState={yllsState}
							onClose={() => this.setState({yllsVisible: false})}
							editLrAccountPermission={editLrAccountPermission}
							panes={panes}
							lsItemData={lsItemData}
							uuidList={businessTemp}
							inputValue={inputValue}
							showDrawer={() => this.setState({yllsVisible: true})}
							refreshList={() => {
								switch(accountingType){
						          case 'manages':
						             dispatch(calculationActions.getCalculateList(issuedate, accountingType,'',curCategory,cardUuid, isCheck,inputValue))
						             break
						           case 'invoicing':
						             dispatch(calculationActions.getCalculateInvoicingList(issuedate,curCategory,billMakeOutType, inputValue))
						             break
						          case 'certification':
						            dispatch(calculationActions.getCalculateCertificationList(issuedate,curCategory,billAuthType, inputValue))
						            break
						          case 'costTransfer':
						            dispatch(calculationActions.getCalculateCarryoverList(issuedate,runningState, inputValue,'',cardUuid))
						            break
						          default:

						         }
							}}
							fromCxls={true}
							curItem={curItem}
							modalTemp={modalTemp}
							intelligentStatus={intelligentStatus}
							magenerType={magenerType}
							contactsCardRange={contactsCardRange}
							categoryTypeObj={categoryTypeObj}
							accountList={accountList}
							issuedate={issuedate}
							inputValue={inputValue}
							isClose={isClose}
							simplifyStatus={simplifyStatus}
							editPzPermission={editPzPermission}
							reviewLrAccountPermission={reviewLrAccountPermission}
						/>
						: ''
					}

				</TableWrap>


			</div>
		)
	}
}
