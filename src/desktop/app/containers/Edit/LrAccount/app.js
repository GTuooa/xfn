import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'

import { toJS, fromJS } from 'immutable'
import { Button, Select, message, Tabs, Menu } from 'antd'
const Option = Select.Option
const TabPane = Tabs.TabPane
import * as Limit from 'app/constants/Limit.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import { TableWrap } from 'app/components'
import Title from './Title'
import CardWrap from './CardWrap'
import TreeContain from './TreeContain'
import ModifyModal from './ModifyModal'

@connect(state => state)
export default
class LrAccount extends React.Component {

	componentWillMount() {

    }

	componentDidMount() {
		// const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		// const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		// const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// if (enCanUse && checkMoreFj) {
		// 	this.props.dispatch(lrAccountActions.getUploadGetTokenFetch())
		// }
	}

	constructor() {
		super()
		this.state = {
			showCardModal: false,
			showRunningModal: false,
			showPayOrReceive: false,
			payList: fromJS([]),
			receivedList : fromJS([]),
			showRunningInfoModal: false,
			runningInfoModalType: false,
			current: 'mail'
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.yllsState != nextprops.yllsState || this.props.allState != nextprops.allState || this.props.lrAccountState != nextprops.lrAccountState || this.props.accountConfState != nextprops.accountConfState || this.props.cxlsState != nextprops.cxlsState || this.props.lrCalculateState != nextprops.lrCalculateState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}

    render() {
        const { allState, lrAccountState, accountConfState, dispatch, cxlsState, lrCalculateState, homeState, yllsState } = this.props
		const { showCardModal, showRunningModal, showPayOrReceive, payList, receivedList, showRunningInfoModal, runningInfoModalType } = this.state

        const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
        const editPermission = lrAccountPermission.getIn(['edit', 'permission'])
				// const issues = allState.get('accountIssues')
        const allasscategorylist = allState.get('allasscategorylist')
		const flags = lrAccountState.get('flags')
		const accountList = accountConfState.get('accountList')
		const hideCategoryList = lrAccountState.get('hideCategoryList') ? lrAccountState.get('hideCategoryList').filter(v => v.get('categoryType') !== 'LB_CHYE' && v.get('categoryType') !== 'LB_CHDB' && v.get('categoryType') !== 'LB_CHZZ' && v.get('categoryType') !== 'LB_JXSEZC') : lrAccountState.get('hideCategoryList')
		const taxRateTemp = accountConfState.get('taxRateTemp')
        const runningCategory = accountConfState.get('runningCategory')
		const assId = accountConfState.getIn(['flags', 'assId'])
		const assCategory = accountConfState.getIn(['flags', 'assCategory'])
		const acId = accountConfState.getIn(['flags', 'acId'])
		const cardTemp = lrAccountState.get('cardTemp')
        const payOrReceive = lrAccountState.getIn(['flags', 'payOrReceive'])
        const insertOrModify = lrAccountState.getIn(['flags', 'insertOrModify'])
        const accountAssModalShow = lrAccountState.getIn(['flags', 'accountAssModalShow'])
		const calculateTemp = lrAccountState.get('calculateTemp')
		const CqzcTemp = lrAccountState.get('CqzcTemp')
		const commonChargeTemp = lrAccountState.get('commonChargeTemp')
		const PageTab = lrAccountState.getIn(['flags', 'PageTab'])
		const isQuery = lrAccountState.getIn(['flags', 'isQuery'])
		const specialStateforAssets = lrAccountState.getIn(['flags', 'specialStateforAssets'])
		const issues = lrAccountState.get('issues')
		const runningInsertOrModify = flags.get('runningInsertOrModify')
		const paymentType = flags.get('paymentType')
		// 新增账户
		const showAccountModal = lrAccountState.getIn(['flags', 'showAccountModal'])
		const accountTemp = accountConfState.get('accountTemp')
		const lrAclist = allState.get('lrAclist')

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const panes = homeState.get('panes')
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false

        let firstyear = '', firstmonth = ''
		if (Number(allState.getIn(['period', 'firstmonth'])) == 1) {
			firstmonth = 12
			firstyear = Number(allState.getIn(['period', 'firstyear'])) - 1
		} else {
			firstmonth = Number(allState.getIn(['period', 'firstmonth'])) - 1
			firstyear = Number(allState.getIn(['period', 'firstyear']))
		}
		const disabledBeginDate  = new Date(firstyear, firstmonth, 1)

		// 附件上传
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// const enCanUse = true
		// const checkMoreFj = true
		const lrPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		let enclosureList=[],
			vcKey = 0,
			label = [],
			tagModal = false
		;const setPlace = ({
			'LB_JZCB': () => 'costTransferTemp',
			'LB_FPRZ': () => 'invoiceAuthTemp',
			'LB_KJFP': () => 'invoicingTemp',
			'LB_ZCWJZZS': () => 'transferOutTemp',
			'LB_ZZ': () => 'InternalTransferTemp',
			'LB_ZJTX': () => 'DepreciationTemp'
		}[paymentType] || (() => ''))();
		if(insertOrModify === 'insert' || runningInsertOrModify === 'insert'){
			if(PageTab === 'business' || paymentType === '' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY'){
				enclosureList = lrAccountState.get('enclosureList');
				label = lrAccountState.get('label');// 附件标签
				tagModal = lrAccountState.get('tagModal');// 附件标签modal
			}else{
				enclosureList = lrCalculateState.getIn([setPlace,'enclosureList']);
				label = lrCalculateState.getIn([setPlace,'label']);// 附件标签
				tagModal = lrCalculateState.getIn([setPlace,'tagModal']);// 附件标签modal
			}
		}else{
			if(PageTab === 'business' || paymentType === '' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY'){
				enclosureList = lrAccountState.get('enclosureList');
				label = lrAccountState.get('label');// 附件标签
				tagModal = lrAccountState.get('tagModal');// 附件标签modal
			}else{
				enclosureList = lrCalculateState.getIn([setPlace,'enclosureList']);
				label = lrCalculateState.getIn([setPlace,'label']);// 附件标签
				tagModal = lrCalculateState.getIn([setPlace,'tagModal']);// 附件标签modal
			}
		}



		const token = allState.get('token')
		const sobid = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
		const useruuid = homeState.getIn(['data', 'userInfo', 'useruuid'])
		const timestamp = new Date().getTime()
		const dirUrl = `test/${sobid}/${useruuid}/${timestamp}`
		const homeActiveKey = homeState.get('homeActiveKey')

		const uploadKeyJson = allState.get('uploadKeyJson')

		return (
			<div className='Page-lrAccount'>
                <Title
					editPermission={editPermission}
					dispatch={dispatch}
                    cardTemp={cardTemp}
                    insertOrModify={insertOrModify}
					flags={flags}
					issues={issues}
					calculateTemp={calculateTemp}
					runningCategory={runningCategory}
					lrCalculateState={lrCalculateState}
					commonChargeTemp={commonChargeTemp}
					CqzcTemp={CqzcTemp}
				/>
				<TableWrap className="table-running-report lrAccount-flex">
					<div className="lrAccount-wrap">
						<CardWrap
							hideCategoryList={hideCategoryList}
							calculateTemp={calculateTemp}
							CqzcTemp={CqzcTemp}
							commonChargeTemp={commonChargeTemp}
							flags={flags}
							cardTemp={cardTemp}
							dispatch={dispatch}
							showModal={showCardModal}
							accountList={accountList}
							taxRateTemp={taxRateTemp}
							payOrReceive={payOrReceive}
							insertOrModify={insertOrModify}
							runningCategory={runningCategory}
							disabledBeginDate={disabledBeginDate}
							configPermissionInfo={configPermissionInfo}
							simplifyStatus={simplifyStatus}
							yllsState={yllsState}
							panes={panes}
							onCancel={() => this.setState({showCardModal: false})}
							openRunningInfoModal={() => this.setState({showRunningInfoModal: true, runningInfoModalType: false})}

							dispatch={dispatch}
							lrPermissionInfo={lrPermissionInfo}
							token={token}
							sobid={sobid}
							dirUrl={dirUrl}
							enclosureList={enclosureList}
							label={label}
							tagModal={tagModal}
							enCanUse={enCanUse}
							checkMoreFj={checkMoreFj}
							homeState={homeState}
							homeActiveKey={homeActiveKey}
							uploadKeyJson={uploadKeyJson}
						/>
					</div>
					<TreeContain
						cardTemp={cardTemp}
						flags={flags}
						hideCategoryList={hideCategoryList}
						dispatch={dispatch}
						taxRateTemp={taxRateTemp}
						curCategory={`${cardTemp.get('uuid')}${Limit.TREE_JOIN_STR}${cardTemp.get('name')}${Limit.TREE_JOIN_STR}hasnoChild${Limit.TREE_JOIN_STR}canClick`}
						// curAccountUuid={curAccountUuid}
						runningCategory={runningCategory}
						// issuedate={issuedate}
						// main={main}
						assId={assId}
						assCategory={assCategory}
						acId={acId}
						PageTab={PageTab}
						disabledChangeCategory={lrCalculateState.getIn(['flags', 'insertOrModify']) === 'modify' || isQuery}
						homeState={homeState}
						// account={account}
					/>
				</TableWrap>
				<ModifyModal
					dispatch={dispatch}
					showModal={showAccountModal}
					accountTemp={accountTemp}
					lrAclist={lrAclist}
					simplifyStatus={simplifyStatus}
					accountList={accountList.getIn([0,'childList'])}
				/>
			</div>
		)
	}
}
