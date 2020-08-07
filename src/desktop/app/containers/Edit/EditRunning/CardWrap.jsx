import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline, Icon } from 'antd'
import { RunCategorySelect, AcouontAcSelect, TableAll, TableTitle, TableBody, TableItem, Amount, TableOver } from 'app/components'
import RunningCardBody from './RunningCardBody'
import CalculateCardBody from './CalculateCardbody'
import { getCategorynameByType } from './common/common'
// import UploadImg from './UploadImg'
import Enclosure from 'app/containers/components/Enclosure'

// import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class CardWrap extends React.Component {
	constructor() {
		super()
		this.state = {
			showDetail: false,
			// show: false,
		}
	}
	componentDidMount () {
		// this.props.dispatch(editRunningActions.initLabel())
	}

	render() {
		const {
			pageTab,
			insertOrModify,
			disabledChange,
			paymentType,
			dispatch,

			flags,
            oriTemp,
            showModal,
            accountList,
            taxRateTemp,
            payOrReceive,
            runningCategory,
            disabledBeginDate,
			firstDisabledBeginDate,
			hideCategoryList,
			configPermission,
			// simplifyStatus,
			lrPermissionInfo,
			closedBy,
			reviewedBy,
			dirUrl,
			enclosureList,
			label,
			enCanUse,
			checkMoreFj,
			panes,
			homeState,
			SfglTemp,
			CommonChargeTemp,
			CqzcTemp,
			cardTemp,
			InternalTransferTemp,
			DepreciationTemp,
			InvoicingTemp,
			InvoiceAuthTemp,
			TransferOutTemp,
			CostTransferTemp,
			StockTemp,
			BalanceTemp,
			TaxTransferTemp,
			StockBuildUpTemp,
			StockIntoProjectTemp,
			ProjectCarryoverTemp,
			JzjzsyTemp,
			batchList,
			serialList,
			commonCardObj,
			defaultFlowNumber,
			disabledDate,
			// calInsertOrModify,
			calculateViews,
			memberList,
			thingsList,
			isCheckOut,
			uploadKeyJson,
			enableWarehouse,
			needSendRequest,
			openQuantity,
			accountPoundage,
			URL_POSTFIX,
			moduleInfo
		} = this.props
		const { showDetail } = this.state

		const categoryType = oriTemp.get('categoryType')
		const oriDate = oriTemp.get('oriDate')
		const {
			categoryTypeObj,
		} = getCategorynameByType(categoryType)

		return (
			<div className="editRunning" >
                {/* <CardTitle/> */}

				{
					pageTab === 'business' && paymentType !== 'LB_SFGL' ?
					<RunningCardBody
						flags={flags}
						oriTemp={oriTemp}
						dispatch={dispatch}
						accountList={accountList}
						taxRateTemp={taxRateTemp}
						payOrReceive={payOrReceive}
						insertOrModify={insertOrModify}
						runningCategory={runningCategory}
						disabledBeginDate={disabledBeginDate}
						configPermission={configPermission}
						// simplifyStatus={simplifyStatus}
						categoryTypeObj={categoryTypeObj}
						disabledDate={disabledDate}
						isCheckOut={isCheckOut}
						enableWarehouse={enableWarehouse}
						openQuantity={openQuantity}
						accountPoundage={accountPoundage}
						moduleInfo={moduleInfo}
						disabledChange={disabledChange}
					/> :
					<CalculateCardBody
						flags={flags}
						calculateViews={calculateViews}
						paymentType={paymentType}
						SfglTemp={SfglTemp}
						CommonChargeTemp={CommonChargeTemp}
						CqzcTemp={CqzcTemp}
						InternalTransferTemp={InternalTransferTemp}
						DepreciationTemp={DepreciationTemp}
						InvoicingTemp={InvoicingTemp}
						InvoiceAuthTemp={InvoiceAuthTemp}
						TransferOutTemp={TransferOutTemp}
						CostTransferTemp={CostTransferTemp}
						TaxTransferTemp={TaxTransferTemp}
						StockTemp={StockTemp}
						BalanceTemp={BalanceTemp}
						StockBuildUpTemp={StockBuildUpTemp}
						StockIntoProjectTemp={StockIntoProjectTemp}
						ProjectCarryoverTemp={ProjectCarryoverTemp}
						JzjzsyTemp={JzjzsyTemp}
						batchList={batchList}
						serialList={serialList}
						commonCardObj={commonCardObj}
						defaultFlowNumber={defaultFlowNumber}
						insertOrModify={insertOrModify}
						disabledChange={disabledChange}
						enableWarehouse={enableWarehouse}
						openQuantity={openQuantity}
						disabledDate={disabledDate}
						cardTemp={cardTemp}
						dispatch={dispatch}
						accountList={accountList}
						disabledBeginDate={disabledBeginDate}
						firstDisabledBeginDate={firstDisabledBeginDate}
						hideCategoryList={hideCategoryList}
						configPermission={configPermission}
						panes={panes}
						homeState={homeState}
						taxRateTemp={taxRateTemp}
						memberList={memberList}
						thingsList={thingsList}
						runningCategory={runningCategory}
						isCheckOut={isCheckOut}
						oriDate={oriDate}
						accountPoundage={accountPoundage}
						needSendRequest={needSendRequest}
						URL_POSTFIX={URL_POSTFIX}
					/>
				}


				{/* {
					// PageTab === 'business' || PageTab !== 'business' && (paymentType === 'LB_ZZ' || paymentType === 'LB_JZCB' || paymentType === 'LB_FPRZ' || paymentType === 'LB_KJFP' || paymentType === 'LB_ZCWJZZS' || paymentType === 'LB_GGFYFT')?
					enCanUse && checkMoreFj ?
					<UploadImg
						dispatch={dispatch}
						lrPermissionInfo={lrPermissionInfo}
						token={token}
						dirUrl={dirUrl}
						dispatch={dispatch}
						enclosureList={enclosureList}
						label={label}
						tagModal={tagModal}
						closedBy={closedBy}
						reviewedBy={reviewedBy}
						enCanUse={enCanUse}
						checkMoreFj={checkMoreFj}
						PageTab={PageTab}
						paymentType={flags.get('paymentType')}
						runningState={runningState}
					/> : ''
				} */}
				<Enclosure
					formPage={'EditRunning'}
					type="ls"
					className="lrls-enclosure-wrap"
					dispatch={dispatch}
					permission={lrPermissionInfo.getIn(['edit', 'permission'])}
					enclosureList={enclosureList}
					label={label}
					closed={closedBy}
					reviewed={reviewedBy}
					enCanUse={enCanUse}
					checkMoreFj={checkMoreFj}
					getUploadTokenFetch={() => dispatch(editRunningAllActions.getUploadTokenFetch())}
					getLabelFetch={() => dispatch(editRunningAllActions.getRunningLabelFetch())}
					deleteUploadImgUrl={(index) => dispatch(editRunningAllActions.deleteRunningEnclosureUrl(index)) }
					changeTagName={(index, tagName) => dispatch(editRunningAllActions.changeRunningTagName(index, tagName))}
					downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
					uploadEnclosureList={(value) => {
						dispatch(editRunningAllActions.uploadFiles(...value))
					}}
					uploadKeyJson={uploadKeyJson}
				/>
            </div>
		)
	}
}
