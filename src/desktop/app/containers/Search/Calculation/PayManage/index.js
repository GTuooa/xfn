import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'

import PayManageTitle from './PayManageTitle'
import ManageItem from '../ManageItem'

// yezi
// import * as accountActions from 'app/actions/account.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import { fromJS , toJS } from 'immutable'

@immutableRenderDecorator
export default
class PayManageTable extends React.Component {
	// componentDidMount() {
	// 	this.props.dispatch(accountConfActions.getRunningAccount())
	// }
	// shouldComponentUpdate(nextprops, nextstate) {
	// 	return this.props.allState != nextprops.allState || this.props.configState != nextprops.configState || this.props.qcyeState != nextprops.qcyeState || this.state !== nextstate
	// }

	render() {
		const {
			ass,
			// main,
			isCheck,
			accountingType,
			debitSum,
			creditSum,
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
			<TableAll type="with-new" className="mxb-table-left">
				<PayManageTitle
					ass={ass}
					className={'cxls-account-sfgl-table-width'}
					// main={main}
					selectAcAll={selectAcAll}
					onClick={() => dispatch(calculationActions.accountItemCheckboxCheckAll(selectAcAll, 'payManageList'))}
				/>
				<TableBody>
					{
						showList.map((v, i) => {
							return <ManageItem
								ass={ass}
								isCheck={isCheck}
								accountingType={accountingType}
								key={i}
								item={v}
								line={i}
								className={`${'cxls-account-sfgl-table-width'} account-paymanages-table`}
								// main={main}
								dispatch={dispatch}
								selectList={selectList}
								panes={panes}
								openCardModal={openCardModal}
								openRunningModal={openRunningModal}
								editLrAccountPermission={editLrAccountPermission}
								cxlsState={cxlsState}
								accountList={accountList}
								calculationState={calculationState}
								showDrawer={showDrawer}
							/>
						})
					}
					<TableItem line={showList.size+1} className={'cxls-account-sfgl-table-width'}>
						<li></li>
						<TableOver></TableOver>
						<TableOver></TableOver>
						<TableOver></TableOver>
						<TableOver textAlign="left">本期合计</TableOver>
						<TableOver></TableOver>
						<li>
							<div><p className={debitSum < 0 ? "amount-left" : "amount-right"}>{(Math.abs(debitSum)).toFixed(2)}</p></div>
						</li>
						<li>
							<div><p className={creditSum < 0 ? "amount-left" : "amount-right"}>{(Math.abs(creditSum)).toFixed(2)}</p></div>
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
