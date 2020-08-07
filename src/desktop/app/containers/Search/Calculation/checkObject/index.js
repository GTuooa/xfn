import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'
import { formatNum, formatDate  } from 'app/utils'
import moment from 'moment'
import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'

import CheckObjectTitle from './CheckObjectTitle'
import ManageItem from '../ManageItem'

// import * as accountActions from 'app/actions/account.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'

@immutableRenderDecorator
export default
class CheckObjectTable extends React.Component {
	// componentDidMount() {
	// 	this.props.dispatch(accountConfActions.getRunningAccount())
	// }
	// shouldComponentUpdate(nextprops, nextstate) {
	// 	return this.props.allState != nextprops.allState || this.props.configState != nextprops.configState || this.props.qcyeState != nextprops.qcyeState || this.state !== nextstate
	// }

	render() {
		const {
			ass,
			isCheck,
			accountingType,
			debitSum,
			creditSum,
			debitAmount,
			creditAmount,
			payManageList,
			dispatch,
			selectList,
			openCardModal,
			openRunningModal,
			panes,
			editLrAccountPermission,
			cxlsState,
			accountList,
			calculationState,
			showDrawer
		} = this.props
		const showList = payManageList.get('childList')

		// const selectAcAll = main === 'duty' ? (showList.size ? selectList.size === showList.size : false) : false
		const selectAcAll = showList.size ? selectList.size === showList.size : false

		return (
			<TableAll className="mxb-table-left" type="with-new">
				<CheckObjectTitle
					ass={ass}
					className={'account-check-table-width'}
					accountingType={accountingType}
					selectAcAll={selectAcAll}
					onClick={() => dispatch(calculationActions.accountItemCheckboxCheckAll(selectAcAll, 'payManageList'))}
				/>
				<TableBody>
					{
						showList.map((v, i) => {
							return( <ManageItem
								ass={ass}
								key={i}
								item={v}
								line={i}
								isCheck={isCheck}
								className={`account-check-table-width min-height`}
								accountingType={accountingType}
								dispatch={dispatch}
								panes={panes}
								selectList={selectList}
								openCardModal={openCardModal}
								openRunningModal={openRunningModal}
								editLrAccountPermission={editLrAccountPermission}
								cxlsState={cxlsState}
								accountList={accountList}
								calculationState={calculationState}
								showDrawer={showDrawer}
							/>)
						})
					}
					<TableItem line={showList.size+1} className={'account-check-table-width min-height'}>
						<li></li>
						<TableOver></TableOver>
						<TableOver></TableOver>
						<TableOver></TableOver>
						<TableOver textAlign="left">本期合计</TableOver>
						<TableOver></TableOver>
						<li>
							<div>
								<div className={debitSum < 0 ? "amount-left" : "amount-right"}>{(Math.abs(debitSum)).toFixed(2)}</div>
								<div className={creditSum < 0 ? "amount-left" : "amount-right"}>{(Math.abs(creditSum)).toFixed(2)}</div>
							</div>
						</li>
						<li>
							<div>
								<div className={debitAmount < 0 ? "amount-left" : "amount-right"}>{(Math.abs(debitAmount)).toFixed(2)}</div>
								<div className={creditAmount < 0 ? "amount-left" : "amount-right"}>{(Math.abs(creditAmount)).toFixed(2)}</div>
							</div>
						</li>
						{
							ass == '全部' ?
							<TableOver></TableOver>
							:''
						}
						<li><span></span></li>
					</TableItem>
				</TableBody>
			</TableAll>
		)
	}
}
