import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import BalanceAdjustment from './BalanceAdjustment' //按仓库盘点、直接结转成本盘点
import UniformAdjustment from './UniformAdjustment' //调整统一单价

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class CountAdjustment extends React.Component{
	static displayName = 'pandianjiezhuan'
	constructor() {
		super()
		this.state = {
		}
	}
	render() {
		const {
			dispatch,
			calculateViews,
			oriDate,
			BalanceTemp,
            CostTransferTemp,
			insertOrModify,
			commonCardObj,
			enableWarehouse,
			homeState,
            paymentType,
			oriState,
			enclosureCountUser,
			serialList,
		} = this.props


		return (
			oriState === 'STATE_CHYE_CK' || oriState === 'STATE_YYSR_ZJ' ?
				<BalanceAdjustment
					dispatch={dispatch}
					returnBackFun={()=>{
						dispatch(editCalculateActions.changeEditCalculateCommonState('views','showCount', false))
					}}
					calculateViews={calculateViews}
					oriDate={oriDate}
					dateFromTemp={oriState === 'STATE_CHYE_CK' ? BalanceTemp : CostTransferTemp}
					insertOrModify={insertOrModify}
					commonCardObj={commonCardObj}
					enableWarehouse={enableWarehouse}
					homeState={homeState}
					paymentType={paymentType}
					tempName={oriState === 'STATE_CHYE_CK' ? 'Balance' : 'CostTransfer'}
					needHidePrice={true}
					enclosureCountUser={enclosureCountUser}
					serialList={serialList}
				/> :
				<UniformAdjustment
					dispatch={dispatch}
					returnBackFun={()=>{
						dispatch(editCalculateActions.changeEditCalculateCommonState('views','showCount', false))
					}}
					calculateViews={calculateViews}
					oriDate={oriDate}
					BalanceTemp={BalanceTemp}
					insertOrModify={insertOrModify}
					commonCardObj={commonCardObj}
					enableWarehouse={enableWarehouse}
					homeState={homeState}
					paymentType={paymentType}
					tempName={'Balance'}
					needHidePrice={true}
					enclosureCountUser={enclosureCountUser}
					serialList={serialList}
				/>

		)
	}
}
