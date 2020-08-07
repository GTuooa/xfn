import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'
import './EditCalculateComp/index.less'

import { Button, message, Modal, Radio, Tooltip, Icon } from 'antd'
import { TableWrap } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import Nbzz from './EditCalculateComp/Nbzz'
import Fprz from './EditCalculateComp/Fprz'
import Kjfp from './EditCalculateComp/Kjfp'
import Zcwjzzs from './EditCalculateComp/Zcwjzzs'
import CqzcZjtx from './EditCalculateComp/CqzcZjtx'
import Cqzcjzsy from './EditCalculateComp/Cqzcjzsy'
import Sfgl from './EditCalculateComp/Sfgl'
import Cbjz from './EditCalculateComp/Cbjz'
import Ggfyft from './EditCalculateComp/Ggfyft'
import Chdb from './EditCalculateComp/Chdb'
import Chyetz from './EditCalculateComp/Chyetz'
import Jxsezc from './EditCalculateComp/Jxsezc'
import Chzz from './EditCalculateComp/Chzz'
import Chtrxm from './EditCalculateComp/Chtrxm'
import Xmjz from './EditCalculateComp/Xmjz'
import Jzjzsy from './EditCalculateComp/Jzjzsy'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import { ROOTPKT } from 'app/constants/fetch.account.js'

@connect(state => state)
export default
class CalculateCardbody extends React.Component {

	static displayName = 'CalculateCardbody'

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

	render() {

		const {
			allState,
			dispatch,
			flags,
			paymentType,
			SfglTemp,
			CommonChargeTemp,
			CqzcTemp,
			cardTemp,
			accountList,
			disabledBeginDate,
			firstDisabledBeginDate,
			hideCategoryList,
			configPermission,
			panes,
			homeState,
			InternalTransferTemp,
			TransferOutTemp,
			CostTransferTemp,
			StockTemp,
			BalanceTemp,
			TaxTransferTemp,
			StockIntoProjectTemp,
			defaultFlowNumber,
			disabledDate,
			insertOrModify,
			DepreciationTemp,
			InvoicingTemp,
			InvoiceAuthTemp,
			StockBuildUpTemp,
			ProjectCarryoverTemp,
			JzjzsyTemp,
			commonCardObj,
			calculateViews,
			taxRateTemp,
			memberList,
			thingsList,
			runningCategory,
			isCheckOut,
			oriDate,
			accountPoundage,
			enableWarehouse,
			needSendRequest,
			openQuantity,
			batchList,
			serialList,
			URL_POSTFIX
		} = this.props
		const { showModal } = this.state

        let component = null
		let commonTemp = fromJS({beCertificate: false})
        switch (paymentType) {
            case 'LB_SFGL':
			component = <Sfgl
				flags={flags}
				SfglTemp={SfglTemp}
				dispatch={dispatch}
				accountList={accountList}
				disabledBeginDate={disabledBeginDate}
				firstDisabledBeginDate={firstDisabledBeginDate}
				hideCategoryList={hideCategoryList}
				configPermission={configPermission}
				panes={panes}
				homeState={homeState}
				insertOrModify={insertOrModify}
				calculateViews={calculateViews}
				memberList={memberList}
				thingsList={thingsList}
				paymentType={paymentType}
				isCheckOut={isCheckOut}
				oriDate={oriDate}
				accountPoundage={accountPoundage}
				needSendRequest={needSendRequest}
			/>
			commonTemp = SfglTemp

                break
            case 'LB_GGFYFT':
                component =<Ggfyft
                    CommonChargeTemp={CommonChargeTemp}
                    dispatch={dispatch}
                    hideCategoryList={hideCategoryList}
                    disabledBeginDate={disabledBeginDate}
                    panes={panes}
                    homeState={homeState}
                    insertOrModify={insertOrModify}
					commonCardObj={commonCardObj}
					paymentType={paymentType}
					oriDate={oriDate}
					calculateViews={calculateViews}
                />
				commonTemp = CommonChargeTemp

                break
            case 'LB_JZSY':
                component = <Cqzcjzsy
                    flags={flags}
                    CqzcTemp={CqzcTemp}
                    dispatch={dispatch}
                    accountList={accountList}
                    disabledBeginDate={disabledBeginDate}
                    hideCategoryList={hideCategoryList}
                    configPermission={configPermission}
                    insertOrModify={insertOrModify}
                    panes={panes}
                    homeState={homeState}
					// memberList={memberList}
					// thingsList={thingsList}
					commonCardObj={commonCardObj}
					paymentType={paymentType}
					oriDate={oriDate}
					calculateViews={calculateViews}
                />
				commonTemp = CqzcTemp
                break
            case 'LB_JZCB':
                component = <Cbjz
					commonCardObj={commonCardObj}
					disabledBeginDate={disabledBeginDate}
                    CostTransferTemp={CostTransferTemp}
					calculateViews={calculateViews}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    flags={flags}
                    panes={panes}
                    homeState={homeState}
					runningCategory={runningCategory}
					oriDate={oriDate}
					needSendRequest={needSendRequest}
					enableWarehouse={enableWarehouse}
					openQuantity={openQuantity}
					batchList={batchList}
					serialList={serialList}
                />
				commonTemp = CostTransferTemp
                break
            case 'LB_FPRZ':
                component = <Fprz
                    InvoiceAuthTemp={InvoiceAuthTemp}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    panes={panes}
                    homeState={homeState}
					oriDate={oriDate}
                    disabledBeginDate={disabledBeginDate}
					calculateViews={calculateViews}
                />
				commonTemp = InvoiceAuthTemp
                break
            case 'LB_KJFP':
                component = <Kjfp
                    InvoicingTemp={InvoicingTemp}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
					taxRateTemp={taxRateTemp}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
					calculateViews={calculateViews}
                    panes={panes}
                    homeState={homeState}
					oriDate={oriDate}
                    disabledBeginDate={disabledBeginDate}
                />
				commonTemp = InvoicingTemp

                break
            case 'LB_ZCWJZZS':
                component = <Zcwjzzs
                    TransferOutTemp={TransferOutTemp}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    panes={panes}
                    homeState={homeState}
					oriDate={oriDate}
					calculateViews={calculateViews}
                />
				commonTemp = TransferOutTemp

                break
            case 'LB_ZZ':
                component = <Nbzz
                    InternalTransferTemp={InternalTransferTemp}
					accountList={accountList}
                    defaultFlowNumber={defaultFlowNumber}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    configPermission={configPermission}
					isCheckOut={isCheckOut}
					oriDate={oriDate}
					accountPoundage={accountPoundage}
					calculateViews={calculateViews}
                />
				commonTemp = InternalTransferTemp

                break
            case 'LB_ZJTX':
                component = <CqzcZjtx
                    DepreciationTemp={DepreciationTemp}
                    defaultFlowNumber={defaultFlowNumber}
                    dispatch={dispatch}
                    flags={flags}
					calculateViews={calculateViews}
                    disabledDate={disabledDate}
					accountList={accountList}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    configPermission={configPermission}
					// memberList={memberList}
					// thingsList={thingsList}
					commonCardObj={commonCardObj}
					oriDate={oriDate}
                />
				commonTemp = DepreciationTemp

                break
			case 'LB_CHDB':
                component =<Chdb
					commonCardObj={commonCardObj}
                    StockTemp={StockTemp}
                    dispatch={dispatch}
                    hideCategoryList={hideCategoryList}
                    homeState={homeState}
                    insertOrModify={insertOrModify}
					paymentType={paymentType}
					oriDate={oriDate}
                    disabledDate={disabledDate}
					calculateViews={calculateViews}
					enableWarehouse={enableWarehouse}
					openQuantity={openQuantity}
					batchList={batchList}
					serialList={serialList}
                />
				commonTemp = StockTemp

                break
			case 'LB_CHYE':
                component =<Chyetz
					commonCardObj={commonCardObj}
                    BalanceTemp={BalanceTemp}
                    dispatch={dispatch}
                    hideCategoryList={hideCategoryList}
                    disabledBeginDate={disabledBeginDate}
                    panes={panes}
                    homeState={homeState}
                    insertOrModify={insertOrModify}
					paymentType={paymentType}
					oriDate={oriDate}
                    disabledDate={disabledDate}
					calculateViews={calculateViews}
					enableWarehouse={enableWarehouse}
					isOpenQuantity={openQuantity}
					batchList={batchList}
					serialList={serialList}
                />
				commonTemp = BalanceTemp

                break
			case 'LB_JXSEZC':
                component = <Jxsezc
					commonCardObj={commonCardObj}
					disabledBeginDate={disabledBeginDate}
                    TaxTransferTemp={TaxTransferTemp}
					calculateViews={calculateViews}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    flags={flags}
                    panes={panes}
                    homeState={homeState}
					runningCategory={runningCategory}
					oriDate={oriDate}
					enableWarehouse={enableWarehouse}
                />
				commonTemp = TaxTransferTemp
				break
			case 'LB_CHZZ':
                component =<Chzz
					commonCardObj={commonCardObj}
                    StockBuildUpTemp={StockBuildUpTemp}
                    dispatch={dispatch}
                    hideCategoryList={hideCategoryList}
                    disabledBeginDate={disabledBeginDate}
                    panes={panes}
                    homeState={homeState}
                    insertOrModify={insertOrModify}
					paymentType={paymentType}
					oriDate={oriDate}
                    disabledDate={disabledDate}
					calculateViews={calculateViews}
					enableWarehouse={enableWarehouse}
					openQuantity={openQuantity}
					batchList={batchList}
					serialList={serialList}
                />
				commonTemp = StockBuildUpTemp

                break
			case 'LB_CHTRXM':
                component = <Chtrxm
					commonCardObj={commonCardObj}
					disabledBeginDate={disabledBeginDate}
                    StockIntoProjectTemp={StockIntoProjectTemp}
					calculateViews={calculateViews}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    flags={flags}
                    panes={panes}
                    homeState={homeState}
					runningCategory={runningCategory}
					oriDate={oriDate}
					enableWarehouse={enableWarehouse}
					openQuantity={openQuantity}
					batchList={batchList}
					serialList={serialList}
                />
				commonTemp = StockIntoProjectTemp
                break
			case 'LB_XMJZ':
                component = <Xmjz
					commonCardObj={commonCardObj}
					disabledBeginDate={disabledBeginDate}
                    ProjectCarryoverTemp={ProjectCarryoverTemp}
					calculateViews={calculateViews}
                    dispatch={dispatch}
                    disabledDate={disabledDate}
                    insertOrModify={insertOrModify}
                    hideCategoryList={hideCategoryList}
                    flags={flags}
                    panes={panes}
                    homeState={homeState}
					runningCategory={runningCategory}
					oriDate={oriDate}
					enableWarehouse={enableWarehouse}
					openQuantity={openQuantity}
					batchList={batchList}
					serialList={serialList}
                />
				commonTemp = ProjectCarryoverTemp
                break
			case 'LB_SYJZ':
				component = <Jzjzsy
					JzjzsyTemp={JzjzsyTemp}
					calculateViews={calculateViews}
					dispatch={dispatch}
					disabledDate={disabledDate}
					insertOrModify={insertOrModify}
					hideCategoryList={hideCategoryList}
					oriDate={oriDate}
				/>
				commonTemp = JzjzsyTemp
				break
            default:

        }
		const chooseNumber = calculateViews.get('chooseNumber')
		const encodeType = calculateViews.get('encodeType')
		const saveWay = calculateViews.get('saveWay')
		const jrIndex = calculateViews.get('jrIndex')



		return (
			<div className="accountConf-modal-list editRunning-CardBody">
			{
				<div
					className="pcxls-account"
					style={{display: commonTemp.get('beCertificate') && insertOrModify === 'modify' ? 'block' : 'none'}}
					>
					已审核
				</div>
			}
			{component}
			<Modal
				visible={chooseNumber !== '-1'}
				title="选择保存方式"
				onCancel={() => {
					dispatch(editCalculateActions.initEncodeType())
				}}
				onOk={() => {
					dispatch(editCalculateActions.saveCalculatebusiness(paymentType, saveWay))
				}}
				okText="确定"
				cancelText="取消"

			>
				<p className='calculate-tips-title'>流水号：{jrIndex}号已存在，您可以：</p>
				<div className="save-way-choose" style={{display: chooseNumber === '2' ? 'none' : ''}}>
					<Radio checked={encodeType === '1'} onChange={() => {
						dispatch(editCalculateActions.changeEditCalculateCommonState('views','encodeType','1'))
					}}>系统自动编号</Radio>
					<Tooltip placement="top" title='维持原流水号或自动新增为末尾最新流水编号'>
						<span className="question-box">
							<Icon type="question-circle" />
						</span>
					</Tooltip>
				</div>
				<div className="save-way-choose" style={{display: chooseNumber === '1' ? 'none' : ''}}>
					<Radio checked={encodeType === '2'} onChange={() => {
						dispatch(editCalculateActions.changeEditCalculateCommonState('views','encodeType','2'))
					}}>插入流水号</Radio>
					<Tooltip placement="top" title='当前流水号不变，原流水编号将顺次后移'>
						<span className="question-box">
							<Icon type="question-circle" />
						</span>
					</Tooltip>
				</div>
			</Modal>

			</div>
		)
	}
}
