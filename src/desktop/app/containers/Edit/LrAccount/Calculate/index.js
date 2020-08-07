import React from 'react'
import { connect } from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Radio } from 'antd'
const RadioGroup = Radio.Group
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount} from 'app/components'
import moment from 'moment'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as accountConfActions from 'app/redux/Config/Account/account.action'

import CostTransferBody from './CostTransferBody'
import InvoiceAuth from './InvoiceAuth'
import Invoicing from './Invoicing'
import TransferOut from './TransferOut'
import InternalTransfer from './InternalTransfer'
import Depreciation from './Depreciation'

import { toJS } from 'immutable'

@connect(state => state)
export default
class CalculateBody extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	// componentWillReceiveProps(nextprops) {
	// }
	componentDidMount() {
		// this.props.dispatch(lrAccountActions.getAccountObjectList())
	}

	shouldComponentUpdate(nextprops) {
		return this.props.lrCalculateState != nextprops.lrCalculateState
		|| this.props.allState != nextprops.allState
		|| this.props.lrAccountState != nextprops.lrAccountState
		|| this.props.accountConfState != nextprops.accountConfState
		|| this.props.configPermissionInfo != nextprops.configPermissionInfo
		|| this.props.yllsState != nextprops.yllsState
		|| this.props.panes != nextprops.panes
		|| this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey')
	}

	render() {
		const { lrCalculateState, allState, dispatch, lrAccountState, accountConfState, configPermissionInfo, yllsState, panes, homeState } = this.props

		const cardTemp = lrAccountState.get('cardTemp')
		const calculateTemp = lrAccountState.get('calculateTemp')
		const flags = lrAccountState.get('flags')
		const allasscategorylist = allState.get('allasscategorylist')

        const paymentType = lrAccountState.getIn(['flags', 'paymentType'])
		const hideCategoryList = lrAccountState.get('hideCategoryList') ? lrAccountState.get('hideCategoryList').filter(v => v.get('categoryType') !== 'LB_CHYE' && v.get('categoryType') !== 'LB_CHDB' && v.get('categoryType') !== 'LB_CHZZ') : lrAccountState.get('hideCategoryList')
		const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])

		let firstyear = '', firstmonth = ''
		if (Number(allState.getIn(['period', 'firstmonth'])) == 1) {
			firstmonth = 12
			firstyear = Number(allState.getIn(['period', 'firstyear'])) - 1
		} else {
			firstmonth = Number(allState.getIn(['period', 'firstmonth'])) - 1
			firstyear = Number(allState.getIn(['period', 'firstyear']))
		}
		const disabledBeginDate  = new Date(firstyear, firstmonth, 1)

		const disabledDate = function (current) {
			return current && (moment(disabledBeginDate) > current)
		}

        const calculateContainer = ({
			'LB_JZCB': () => <CostTransferBody
				lrCalculateState={lrCalculateState}
				accountConfState={accountConfState}
				dispatch={dispatch}
                disabledDate={disabledDate}
				// accountConfState={accountConfState}
				insertOrModify={insertOrModify}
				allasscategorylist={allasscategorylist}
				hideCategoryList={hideCategoryList}
				calculateTemp={calculateTemp}
				cardTemp={cardTemp}
				flags={flags}
				yllsState={yllsState}
				panes={panes}
				homeState={homeState}
			/>,
			'LB_FPRZ': () => <InvoiceAuth
				lrCalculateState={lrCalculateState}
				dispatch={dispatch}
				disabledDate={disabledDate}
				accountConfState={accountConfState}
				insertOrModify={insertOrModify}
				allasscategorylist={allasscategorylist}
				hideCategoryList={hideCategoryList}
				yllsState={yllsState}
				panes={panes}
				homeState={homeState}
			/>,
			'LB_KJFP': () => <Invoicing
				lrCalculateState={lrCalculateState}
				dispatch={dispatch}
				disabledDate={disabledDate}
				accountConfState={accountConfState}
				insertOrModify={insertOrModify}
				allasscategorylist={allasscategorylist}
				hideCategoryList={hideCategoryList}
				yllsState={yllsState}
				panes={panes}
				homeState={homeState}
			/>,
			'LB_ZCWJZZS': () => <TransferOut
				lrCalculateState={lrCalculateState}
				dispatch={dispatch}
				disabledDate={disabledDate}
				accountConfState={accountConfState}
				insertOrModify={insertOrModify}
				allasscategorylist={allasscategorylist}
				hideCategoryList={hideCategoryList}
				yllsState={yllsState}
				panes={panes}
				homeState={homeState}
			/>,
			'LB_ZZ': () => <InternalTransfer
				lrCalculateState={lrCalculateState}
				lrAccountState={lrAccountState}
				dispatch={dispatch}
				disabledDate={disabledDate}
				accountConfState={accountConfState}
				insertOrModify={insertOrModify}
				allasscategorylist={allasscategorylist}
				hideCategoryList={hideCategoryList}
				configPermissionInfo={configPermissionInfo}
				homeState={homeState}
			/>,
			'LB_ZJTX': () => <Depreciation
				lrCalculateState={lrCalculateState}
				lrAccountState={lrAccountState}
				dispatch={dispatch}
				flags={flags}
				disabledDate={disabledDate}
				accountConfState={accountConfState}
				insertOrModify={insertOrModify}
				allasscategorylist={allasscategorylist}
				hideCategoryList={hideCategoryList}
				configPermissionInfo={configPermissionInfo}
				homeState={homeState}
			/>
		}[paymentType] || (() => <div>{paymentType}惊不惊喜</div>))()

		return calculateContainer
    }
}
