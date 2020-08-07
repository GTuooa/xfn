import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message } from 'antd'
import { TableWrap } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'
import { ROOTPKT } from 'app/constants/fetch.account.js'

// import Title from './Title'
import Title from './Title'
import CardWrap from './CardWrap'
import TreeContain from './TreeContain'
import CountAdjustment from './EditCalculateComp/count/index'
// import * as allActions from 'app/redux/Home/All/all.action'

import * as middleActions from 'app/redux/Home/middle.action.js'
import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import ImportInitialValue from './ImportInitialValue'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@connect(state => state)
export default
class EidtRunning extends React.Component {

	static displayName = 'EidtCalculate'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
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
			current: 'mail',
		}
	}
	componentDidMount() {

		if (sessionStorage.getItem('previousPage') === 'home') {
			sessionStorage.setItem('previousPage', '')
			// 首页进入或查询流水的新增进入 清空状态并预置日期
			this.props.dispatch(middleActions.insertRunningFromHomePageAndSearchPage())
		}
		// const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		// //有没有开启附件
		// const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		// const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// if (enCanUse && checkMoreFj) {
		// 	this.props.dispatch(editRunningAllActions.getUploadTokenFetch())
		// }

	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.editRunningState != nextprops.editRunningState || this.props.editRunningAllState != nextprops.editRunningAllState || this.props.homeState != nextprops.homeState|| this.props.editCalculateState != nextprops.editCalculateState || this.state !== nextstate
	}

    render() {
        const { allState, editRunningState, dispatch, editRunningAllState, lrCalculateState, homeState, editCalculateState } = this.props
		const { showCardModal, showRunningModal, showPayOrReceive, payList, receivedList, showRunningInfoModal, runningInfoModalType } = this.state
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
		const moduleInfo = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo'])
		const enableWarehouse = moduleInfo.indexOf('WAREHOUSE') > -1
		const enableInventory = moduleInfo.indexOf('INVENTORY') > -1
        const openQuantity = moduleInfo.indexOf('QUANTITY') > -1
        const editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		const configPermission = homeState.getIn(['permissionInfo', 'Config', 'edit', 'permission'])
		const SCXM = moduleInfo.indexOf('SCXM') > -1
		// const issues = allState.get('accountIssues')
        // const allasscategorylist = allState.get('allasscategorylist')
		const flags = editRunningState.get('flags')
		// 改叶子
		const accountList = allState.get('accountList')
		// 小规模纳税人屏蔽右侧发票认证入口，不启用屏蔽发票认证和开具发票
		const scale = allState.getIn(['taxRate','scale'])
		const oldHideCategoryList = scale === 'small' ? allState.get('hideCategoryList').filter(v =>  v.get('childList') ? v.get('childList').filter(k => k.get('categoryType') !== 'LB_FPRZ' && k.get('categoryType') !== 'LB_JXSEZC') : v.get('categoryType') !== 'LB_FPRZ' && v.get('categoryType') !== 'LB_JXSEZC') :
								scale === 'isEnable' ? allState.get('hideCategoryList').filter(v => v.get('childList') ? v.get('childList').filter(k => k.get('categoryType') !== 'LB_FPRZ' && k.get('categoryType') !== 'LB_KJFP' && k.get('categoryType') !== 'LB_JXSEZC') : v.get('categoryType') !== 'LB_FPRZ' && v.get('categoryType') !== 'LB_KJFP' && v.get('categoryType') !== 'LB_JXSEZC'):
								allState.get('hideCategoryList').filter(v => v.get('categoryType') !== 'LB_ZCWJZZS')

		const hideCategoryList = oldHideCategoryList.filter(v => v.get('categoryType') !== 'LB_SFGL')
		// 收付管理移到录入流水
		//不开启数量核算屏蔽存货余额调整
		// const slHideCategoryList = openQuantity ? oldHideCategoryList : oldHideCategoryList.filter(v => v.get('categoryType') !== 'LB_CHYE')
		// 不启用仓库屏蔽存回调拨（目前没有存货组装，屏蔽LB_CHZZ）
		// const ckhideCategoryList = (enableWarehouse ? slHideCategoryList : slHideCategoryList.filter(v => v.get('categoryType') !== 'LB_CHDB')).filter(v => v.get('categoryType') !== 'LB_CHZZ')
		// 不启用存货管理 屏蔽结转成本
		// const hideCategoryList = enableInventory ? ckhideCategoryList : ckhideCategoryList.filter(v => v.get('categoryType') !== 'LB_JZCB')

		const taxRateTemp = allState.get('taxRate')
		// const sfglCategory = allState.get('hideCategoryList').filter(v => v.get('categoryType') !== 'LB_SFGL')
		// const noSfglCategoryChild =  allState.getIn(['runningCategory',0,'childList'])
        const runningCategory = allState.get('runningCategory')
        const sfglCategory = allState.get('sfglCategory')
        const accountPoundage = allState.get('accountPoundage')

		const oriTemp = editRunningState.get('oriTemp')
		const payOrReceive = editRunningState.getIn(['flags', 'payOrReceive'])
		const showall = editRunningState.getIn(['flags', 'showall'])
		const showMessageMask = editRunningState.getIn(['flags', 'showMessageMask'])
		const importList = editRunningState.getIn(['flags', 'importList']) || fromJS([])
		const errorList = editRunningState.getIn(['flags', 'errorList']) || fromJS([])
		const importKey = editRunningState.getIn(['flags', 'importKey'])
        const projectList = editRunningState.get('projectList')

        // const accountAssModalShow = editRunningState.getIn(['flags', 'accountAssModalShow'])

		const SfglTemp = editCalculateState.get('SfglTemp')
		const CqzcTemp = editCalculateState.get('CqzcTemp')
		const CommonChargeTemp = editCalculateState.get('CommonChargeTemp')
		const InternalTransferTemp = editCalculateState.get('InternalTransferTemp')
		const DepreciationTemp = editCalculateState.get('DepreciationTemp')
		const InvoicingTemp = editCalculateState.get('InvoicingTemp')
		const InvoiceAuthTemp = editCalculateState.get('InvoiceAuthTemp')
		const TransferOutTemp = editCalculateState.get('TransferOutTemp')
		const CostTransferTemp = editCalculateState.get('CostTransferTemp')
		const StockTemp = editCalculateState.get('StockTemp')
		const BalanceTemp = editCalculateState.get('BalanceTemp')
		const TaxTransferTemp = editCalculateState.get('TaxTransferTemp')
		const StockBuildUpTemp = editCalculateState.get('StockBuildUpTemp')
		const StockIntoProjectTemp = editCalculateState.get('StockIntoProjectTemp')
		const ProjectCarryoverTemp = editCalculateState.get('ProjectCarryoverTemp')
		const JzjzsyTemp = editCalculateState.get('JzjzsyTemp')
		const commonCardObj = editCalculateState.get('commonCardObj')
		const calculateViews = editCalculateState.get('views')
        // const calInsertOrModify = editCalculateState.getIn(['views', 'insertOrModify'])
		const defaultFlowNumber = editRunningState.getIn(['cardTemp', 'flowNumber'])
		const memberList = editRunningState.get('MemberList')
		const thingsList = editRunningState.get('thingsList')
		// const PageTab = editRunningState.getIn(['flags', 'PageTab'])
		const iframeload = flags.get('iframeload')
		const pageTab = editRunningAllState.getIn(['views', 'pageTab'])
		const insertOrModify = editRunningAllState.getIn(['views', 'insertOrModify'])
		const disabledChange = editRunningAllState.getIn(['views', 'disabledChange'])
		const paymentType = editRunningAllState.getIn(['views', 'paymentType'])
		const needSendRequest = editRunningAllState.getIn(['views', 'needSendRequest'])
		// const paymentType = editRunningState.getIn(['flags', 'paymentType'])

		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const panes = homeState.get('panes')
		// const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false

        let openedyear = '', openedmonth = '', firstyear = '', firstmonth = ''
		if (Number(allState.getIn(['period', 'openedyear'])) == 1) {
			openedmonth = 12
			openedyear = Number(allState.getIn(['period', 'openedyear'])) - 1
		} else {
			openedmonth = Number(allState.getIn(['period', 'openedmonth'])) - 1
			openedyear = Number(allState.getIn(['period', 'openedyear']))
		}
		if (Number(allState.getIn(['period', 'firstmonth'])) == 1) {
			firstmonth = 12
			firstyear = Number(allState.getIn(['period', 'firstyear'])) - 1
		} else {
			firstmonth = Number(allState.getIn(['period', 'firstmonth'])) - 1
			firstyear = Number(allState.getIn(['period', 'firstyear']))
		}
		const disabledBeginDate  = new Date(openedyear, openedmonth, 1)
		const firstDisabledBeginDate  = new Date(firstyear, firstmonth, 1) //流水账期，与是否结账无关

		const disabledDate = function (current) {
			return current && (moment(disabledBeginDate) > current)
		}

		// 附件上传
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// 区分新老版本
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])

		const lrPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const enclosureList = editRunningAllState.get('enclosureList');
		const enclosureCountUser = editRunningAllState.get('enclosureCountUser')
		const label = editRunningAllState.get('label');// 附件标签
		// let enclosureList=[],
		// 	vcKey = 0,
		// 	label = [],
		// 	tagModal = false
		// const setPlace = ({
		// 	'LB_JZCB': () => 'costTransferTemp',
		// 	'LB_FPRZ': () => 'InvoiceAuthTemp',
		// 	'LB_KJFP': () => 'InvoicingTemp',
		// 	'LB_ZCWJZZS': () => 'TransferOutTemp',
		// 	'LB_ZZ': () => 'InternalTransferTemp',
		// 	'LB_ZJTX': () => 'DepreciationTemp'
		// }[paymentType] || (() => ''))()
		// if(insertOrModify === 'insert' || insertOrModify === 'insert'){
		// 	if(PageTab === 'business' || paymentType === '' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY'){
		// 		enclosureList = editRunningState.get('enclosureList');
		// 		label = editRunningState.get('label');// 附件标签
		// 		tagModal = editRunningState.get('tagModal');// 附件标签modal
		// 	}
		// 	else{
		// 		enclosureList = editCalculateState.getIn([setPlace,'enclosureList']);
		// 		label = editCalculateState.getIn([setPlace,'label']);// 附件标签
		// 		tagModal = editCalculateState.getIn([setPlace,'tagModal']);// 附件标签modal
		// 	}
		// }else{
		// 	if(PageTab === 'business' || paymentType === '' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY'){
		// 		enclosureList = editRunningState.get('enclosureList');
		// 		label = editRunningState.get('label');// 附件标签
		// 		tagModal = editRunningState.get('tagModal');// 附件标签modal
		// 	}
		// 	else{
		// 		enclosureList = editCalculateState.getIn([setPlace,'enclosureList']);
		// 		label = editCalculateState.getIn([setPlace,'label']);// 附件标签
		// 		tagModal = editCalculateState.getIn([setPlace,'tagModal']);// 附件标签modal
		// 	}
		// }

		const sobid = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
		const useruuid = homeState.getIn(['data', 'userInfo', 'useruuid'])
		const timestamp = new Date().getTime()
		const dirUrl = `test/${sobid}/${useruuid}/${timestamp}`
		const searchRunningPreviewVisibility = allState.getIn(['views', 'searchRunningPreviewVisibility'])
		// 是否已结账，起始账期已结账，账户的期初值选框应置灰
		const isCheckOut = allState.getIn(['period', 'closedyear']) && allState.getIn(['period', 'closedmonth']) ? true : false

		const uploadKeyJson = allState.get('uploadKeyJson')
		const batchList = flags.get('batchList')
		const serialList = flags.get('serialList')
		let commonTemp = fromJS({beCertificate: false}), categoryUuid = '', commonTempName = ''
		if(pageTab === 'payment' || pageTab === 'business' && paymentType === 'LB_SFGL' ){
			switch (paymentType) {
				case 'LB_SFGL':
					commonTemp = SfglTemp
					commonTempName = 'Sfgl'
					break
				case 'LB_GGFYFT':
					commonTemp = CommonChargeTemp
					commonTempName = 'CommonCharge'
					break
				case 'LB_JZSY':
					commonTemp = CqzcTemp
					commonTempName = 'Cqzc'
					break
				case 'LB_JZCB':
					commonTemp = CostTransferTemp
					commonTempName = 'CostTransfer'
					break
				case 'LB_FPRZ':
					commonTemp = InvoiceAuthTemp
					commonTempName = 'InvoiceAuth'
					break
				case 'LB_KJFP':
					commonTemp = InvoicingTemp
					commonTempName = 'Invoicing'

					break
				case 'LB_ZCWJZZS':
					commonTemp = TransferOutTemp
					commonTempName = 'TransferOut'
					break
				case 'LB_ZZ':
					commonTemp = InternalTransferTemp
					commonTempName = 'InternalTransfer'
					break
				case 'LB_ZJTX':
					commonTemp = DepreciationTemp
					commonTempName = 'Depreciation'
					break
				case 'LB_CHDB':
					commonTemp = StockTemp
					commonTempName = 'Stock'
					break
				case 'LB_CHYE':
					commonTemp = BalanceTemp
					commonTempName = 'Balance'
					break
				case 'LB_JXSEZC':
					commonTemp = TaxTransferTemp
					commonTempName = 'TaxTransfer'
					break
				case 'LB_CHZZ':
					commonTemp = StockBuildUpTemp
					commonTempName = 'StockBuildUp'
					break
				case 'LB_CHTRXM':
					commonTemp = StockIntoProjectTemp
					commonTempName = 'StockIntoProject'
					break
				case 'LB_XMJZ':
					commonTemp = ProjectCarryoverTemp
					commonTempName = 'ProjectCarryover'
					break
				case 'LB_SYJZ':
					commonTemp = JzjzsyTemp
					commonTempName = 'JzjzsyTemp'
					break
				default:
			}

			const oriState = commonTemp.get('oriState')

			let otherCategoryUuid = ''
			const categoryLoop = (list) => list && list.map(item =>{
				if(item.get('childList')){
					categoryLoop(item.get('childList'))
				}
				if(item.get('categoryType')=== paymentType){
					otherCategoryUuid = item.get('uuid')
				}
			})
			categoryLoop(oldHideCategoryList)

			categoryUuid = oriState === 'STATE_YYSR_ZJ' ?
							commonTemp.get('dealTypeUuid') :otherCategoryUuid ? otherCategoryUuid : commonTemp.get('categoryUuid')
		}
		const isCount = calculateViews.get('isCount')
		const isAssembly = calculateViews.get('isAssembly')
		const isProduct = calculateViews.get('isProduct')
		const winTest = 1

		return (
			<div className='Page-editRunning'
				onClick={() => {
					// 为了流水预览可以点击除了流水号外关闭流水预览抽屉
					// 流水号做阻止冒泡事件
					if (searchRunningPreviewVisibility) {
						dispatch(previewRunningActions.closePreviewRunning())
					}
				}}>
                <Title
					editPermission={editPermission}
					dispatch={dispatch}
					oriTemp={oriTemp}
                    taxRateTemp={taxRateTemp}
					flags={flags}
					pageTab={pageTab}
					paymentType={paymentType}
					insertOrModify={insertOrModify}
					calculateViews={calculateViews}
					SfglTemp={SfglTemp}
					CqzcTemp={CqzcTemp}
					CommonChargeTemp={CommonChargeTemp}
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
					commonTemp={commonTemp}
					projectList={projectList}
				/>
				<TableWrap className="table-running-report editRunning-flex">
					<div className="editRunning-wrap">
						<CardWrap
							hideCategoryList={hideCategoryList}
							sfglCategory={sfglCategory}
							SfglTemp={SfglTemp}
							CqzcTemp={CqzcTemp}
							CommonChargeTemp={CommonChargeTemp}
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
							disabledDate={disabledDate}
							defaultFlowNumber={defaultFlowNumber}
							calculateViews={calculateViews}
							needSendRequest={needSendRequest}
							memberList={memberList}
							thingsList={thingsList}
							flags={flags}
							oriTemp={oriTemp}
							dispatch={dispatch}
							showModal={showCardModal}
							accountList={accountList}
							taxRateTemp={taxRateTemp}
							payOrReceive={payOrReceive}
							pageTab={pageTab}
							paymentType={paymentType}
							insertOrModify={insertOrModify}
							runningCategory={runningCategory}
							disabledBeginDate={disabledBeginDate}
							firstDisabledBeginDate={firstDisabledBeginDate}
							configPermission={configPermission}
							panes={panes}
							onCancel={() => this.setState({showCardModal: false})}
							openRunningInfoModal={() => this.setState({showRunningInfoModal: true, runningInfoModalType: false})}
							dispatch={dispatch}
							lrPermissionInfo={lrPermissionInfo}
							sobid={sobid}
							dirUrl={dirUrl}
							enclosureList={enclosureList}
							label={label}
							enCanUse={enCanUse}
							checkMoreFj={checkMoreFj}
							homeState={homeState}
							isCheckOut={isCheckOut}
							uploadKeyJson={uploadKeyJson}
							accountPoundage={accountPoundage}
							needSendRequest={needSendRequest}
							enableWarehouse={enableWarehouse}
							openQuantity={openQuantity}
							URL_POSTFIX={URL_POSTFIX}
							moduleInfo={moduleInfo}
							disabledChange={disabledChange}
						/>
					</div>
					<TreeContain
						flags={flags}
						hideCategoryList={hideCategoryList}
						sfglCategory={sfglCategory}
						dispatch={dispatch}
						taxRateTemp={taxRateTemp}
						curCategory={`${oriTemp.get('uuid')}${Limit.TREE_JOIN_STR}${oriTemp.get('name')}${Limit.TREE_JOIN_STR}hasnoChild${Limit.TREE_JOIN_STR}canClick`}
						oriTemp={oriTemp}
						runningCategory={runningCategory}
						pageTab={pageTab}
						paymentType={paymentType}
						paymentTypeStr={calculateViews.get('paymentTypeStr')}
						insertOrModify={insertOrModify}
						disabledChangeCategory={editRunningAllState.getIn(['views', 'insertOrModify']) === 'modify'}
						configPermission={configPermission}
						newJr={newJr}
					/>
				</TableWrap>
				{
					pageTab === 'business' && paymentType !== 'LB_SFGL' ?
					<ImportInitialValue
						dispatch={dispatch}
						iframeload={iframeload}
						alertStr="请选择要导入的存货文件"
						showMessageMask={showMessageMask}
						beforCallback={() => dispatch(editRunningActions.changeLrAccountCommonString('', ['flags','showMessageMask'], true))}
						closeCallback={() => dispatch(editRunningActions.changeLrAccountCommonString('', ['flags','showMessageMask'], false))}
						onSubmitCallBack={(from) => dispatch(editRunningActions.getFileUploadFetch(from,oriTemp.get('categoryUuid'),oriTemp.get('oriDate'),() => {
								dispatch(editRunningActions.changeLrAccountCommonString('', ['flags','showMessageMask'], false))
							}))}
						returnBackFun={()=>{
							dispatch(editRunningActions.changeLrAccountCommonString('', ['flags','showall'], false))
						}}
						importList={importList}
						errorList={errorList}
						InitialExporthrefUrl={`${ROOTPKT}/data/download/stock/with/insert/error?${URL_POSTFIX}`}
						downloadUrl={`${ROOTPKT}/data/export/model/jr/inventory?model=JR`}
						// downloadUrl={`https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/template/%E5%AF%BC%E5%85%A5%E5%AD%98%E8%B4%A7%E5%88%97%E8%A1%A8.xls`}
						importKey={importKey}
						openQuantity={openQuantity}
						enableWarehouse={enableWarehouse}
						showall={showall}
						failJsonList={[]}
						successJsonList={[]}
					/>	:
					<ImportInitialValue
						dispatch={dispatch}
						iframeload={calculateViews.get('iframeload')}
						alertStr="请选择要导入的存货文件"
						showMessageMask={calculateViews.get('showMessageMask')}
						beforCallback={() => dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showMessageMask', true))}
						closeCallback={() => dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showMessageMask', false))}
						onSubmitCallBack={(from) => dispatch(innerCalculateActions.getFileUploadFetch(from,categoryUuid,oriTemp.get('oriDate'),commonTempName,isCount, isProduct,isAssembly))}
						returnBackFun={()=>{
							dispatch(editCalculateActions.changeEditCalculateCommonState('views','showall', false))
						}}
						importTitle={isCount ? '盘点导入存货' : null}
						importList={calculateViews.get('importList')}
						errorList={calculateViews.get('errorList')}
						InitialExporthrefUrl={
							isCount ? `${ROOTPKT}/data/download/jr/inventory/adjustment/error?${URL_POSTFIX}`:
							(
								isAssembly ?  `${ROOTPKT}/data/download/jr/inventory/assembly/error?${URL_POSTFIX}` :
								(
									commonTempName === 'Stock' ?
									`${ROOTPKT}/data/download/stock/jr/inventory/transfer/error?${URL_POSTFIX}`:
									`${ROOTPKT}/data/download/stock/with/insert/error?${URL_POSTFIX}`
								)

							)
						}
						downloadUrl={`${ROOTPKT}/data/export/model/jr/inventory?model=${isCount ? 'ADJUSTMENT' : isAssembly ? 'ASSEMBLY' : commonTempName === 'Stock' ? 'TRANSFER' : 'JR'}&${URL_POSTFIX}`}
						importKey={calculateViews.get('importKey')}
						openQuantity={openQuantity}
						enableWarehouse={enableWarehouse}
						showall={calculateViews.get('showall')}
						failJsonList={[]}
						successJsonList={[]}
					/>
				}
				<CountAdjustment
					dispatch={dispatch}
					calculateViews={calculateViews}
					selectedKeys={fromJS([])}
					oriDate={oriTemp.get('oriDate')}
					oriState={commonTemp.get('oriState')}
					BalanceTemp={BalanceTemp}
					CostTransferTemp={CostTransferTemp}
					insertOrModify={insertOrModify}
					commonCardObj={commonCardObj}
					enableWarehouse={enableWarehouse}
					homeState={homeState}
					paymentType={paymentType}
					enclosureCountUser={enclosureCountUser}
					serialList={serialList}
				/>


			</div>
		)
	}
}
