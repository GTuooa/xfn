import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import './style.less'

import { Drawer, Modal, Button, Icon, message, DatePicker, Input, Select, Switch } from 'antd'
import { fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { categoryTypeAll, type, business, beforejumpCxToLr, runningStateType, categoryTypeName } from 'app/containers/components/moduleConstants/common'
import {  showImg, formatNum, formatDate, formatMoney } from 'app/utils'
import * as lsItemComponents from './LsItem'
import * as calLsItemComponents from './CalLsItem'

import ButtonBar from './ButtonBar'
import ChildDrawer from './ChildDrawer'
import Enclosure from './Enclosure'
import Journal from './Journal'
import ProcessInfo from './ProcessInfo'
// import ChildDrawer from './ChildDrawer'
// import ManageModal from './ManageModal'
// import CarryoverModal from './CarryoverModal'
// import JzsyModal from './JzsyModal'
// import InvioceModal from './InvioceModal'
// import InvoiceAuthModal from './InvoiceAuthModal'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'

export let accountPoundage = null
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'

@connect(state => state)
export default
class RunningPreview extends React.Component {

	constructor() {
		super()
		this.state = {
			activeKey: ['1'],
			deleteModal:false,
			tagModal: false, //标签组件的状态
			tagValue: '无标签', //标签名
			currentIdx:'',//单前操作的id
			manageModal: false,//单笔流水核算弹窗
			carryoverModal: false,//单笔成本结转流水弹窗
			invioceModal: false,//单笔开具发票弹窗
			defineModal: false,//单笔发票认证弹窗
			jzsyModal:false,
			isSeleck: false,//是否勾选
			deleteHasFj: false,//删除的凭证中是否有附件

			relatedActiveKey: ['1'],
			relatedRunningShow: false,
			showMask: false,
			page:'detail'
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState
		|| this.props.runningPreviewState != nextprops.runningPreviewState
		|| this.props.homeState != nextprops.homeState
		|| this.props.editRunningState != nextprops.editRunningState
		|| this.props.searchRunningState != nextprops.searchRunningState
		|| this.state !== nextstate
		|| this.props.searchRunningAllState !== nextprops.searchRunningAllState
	}

	onChangeActiveKey = () => this.setState({activeKey: this.state.activeKey.length > 0 ? [] : ['1']})
	onChangeRelatedActiveKey = () => this.setState({relatedActiveKey: this.state.relatedActiveKey.length > 0 ? [] : ['1']})

	render() {
        const {
			dispatch,
			runningPreviewState,
			allState,
			homeState,
			searchRunningState,
			searchRunningAllState
		} = this.props

		const {
			activeKey,
			tagValue,
			currentIdx,
			tagModal,
			manageModal,
			carryoverModal,
			invioceModal,
			defineModal,
			deleteModal,
			jzsyModal,
			isSeleck,
			deleteHasFj,

			relatedActiveKey,
			relatedRunningShow,
			showMask
		} = this.state
		const panes = homeState.get('panes')
		const accountList = allState.get('accountList')
		accountPoundage = allState.get('accountPoundage')
		const enclosureList = searchRunningAllState.get('enclosureList')
		const uploadKeyJson = allState.get('uploadKeyJson')
		const lrPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const label = searchRunningAllState.get('label')// 附件标签
		// 附件上传
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const sobInfo = homeState.getIn(['data', 'userInfo', 'sobInfo'])
		const pageActive = homeState.get('pageActive')

		const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false
		const currentItem = runningPreviewState.get('currentItem')
		const jrOri = runningPreviewState.get('jrOri')
		const category = runningPreviewState.get('category')
		const processInfo = runningPreviewState.get('processInfo')
		const relatedJrOri = runningPreviewState.get('relatedJrOri')
		const relatedCategory = runningPreviewState.get('relatedCategory')
		const relatedProcessInfo = runningPreviewState.get('relatedProcessInfo')
		const fromPage = runningPreviewState.getIn(['views', 'fromPage'])
		const refreshList = runningPreviewState.getIn(['views', 'refreshList'])
		const uuidList = runningPreviewState.getIn(['views', 'uuidList'])
		const oriState = jrOri.get('oriState')
		const jrState = jrOri.get('jrState')
		const beBusiness = jrOri.get('beBusiness')
		const oriAbstract = jrOri.get('oriAbstract')
		const lsItemData = runningPreviewState.get('lsItemData')
		const categoryType = category.get('categoryType')
		const propertyPay = category.get('propertyPay')
		let deleteVcId = [], deleteYear, deleteMonth
		lsItemData && lsItemData.get('vcList') && lsItemData.get('vcList').map((u, i) => {
			deleteVcId.push({
				vcIndex: u.get('vcIndex')
			})
			deleteYear = u.get('year')
			deleteMonth = u.get('month')
		})
		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPzPermission = PzPermissionInfo.getIn(['edit', 'permission'])
		const reviewLrAccountPermission = LrAccountPermissionInfo.getIn(['review', 'permission'])
		const canCreateVc = editLrAccountPermission
		const uuid = jrOri.get('oriUuid')
		const lsItemNameJson = {
			LB_YYSR: 'Yysz',  // 类别对应的组件名字
			LB_YYZC: 'Yysz',
			LB_FYZC: 'Fyzc',
			LB_XCZC: 'Xczc',
			LB_SFZC: 'Sfzc',
			LB_CQZC: 'Cqzc',
			LB_YYWSR: 'Yywsz',
			LB_YYWZC: 'Yywsz',
			LB_ZSKX: 'Zszf',
			LB_ZFKX: 'Zszf',
			LB_JK: 'JkTzZb',
			LB_TZ: 'JkTzZb',
			LB_ZB: 'JkTzZb',
		}
		const calLsItemJson = {
			STATE_FPRZ_CG:'FpKr',
			STATE_FPRZ_TG:'FpKr',
			STATE_KJFP_XS:'FpKr',
			STATE_KJFP_TS:'FpKr',
			STATE_ZCWJZZS:'Zcwjzzs',
			STATE_ZZ:'Nbzz',
			STATE_CQZC_ZJTX:'Zjtx',
			STATE_CQZC_JZSY:'Jzsy',
			STATE_SFGL: 'Sfgl',
			STATE_SFGL_ML: 'Sfgl',
			STATE_YYSR_JZCB: 'Jzcb',
			STATE_GGFYFT: 'Xmft',
			STATE_FZSCCB: 'Xmft',
			STATE_ZZFY: 'Xmft',
			STATE_JJFY: 'Xmft',
			STATE_JXZY: 'Xmft',
			STATE_CHDB: 'Chdb',
			STATE_CHYE: 'Chyetz',
			STATE_JXSEZC_FS: 'Jxsezc',
			STATE_JXSEZC_TFS: 'Jxsezc',
			STATE_CHZZ_ZZCX: 'Chzzcx',
			STATE_CHZZ_ZZD: 'Chzzcx',
			STATE_CHTRXM: 'Chtrxm',
			STATE_XMJZ_XMJQ: 'Xmjz',
			STATE_XMJZ_JZRK: 'Xmjz',
			STATE_XMJZ_QRSRCB: 'Xmjz',
			STATE_SYJZ_JZSR: 'Jzjzsy',
			STATE_SYJZ_JZCBFY: 'Jzjzsy',
			STATE_SYJZ_JZBNLR: 'Jzjzsy',
		}
		const oriStateName = {
			STATE_YYSR_DJ:'预收款',
			STATE_YYSR_XS:`销售`,
			STATE_YYSR_TS:`退售`,
			STATE_YYZC_DJ:'预付款',
			STATE_YYZC_GJ:`购进`,
			STATE_YYZC_TG:`退购`,
			STATE_FY_DJ:'预付款',
			STATE_FY:`发生`,
			STATE_XC_JT:`计提`,
			STATE_XC_FF:`${propertyPay === 'SX_FLF'?'支付':'发放'}`,
			STATE_XC_JN:`缴纳`,
			STATE_XC_DK:'代扣',
			STATE_XC_DJ:'代缴',
			STATE_SF_YJZZS:'预缴',
			STATE_SF_JN:`缴纳`,
			STATE_SF_JT:`计提`,
			STATE_SF_SFJM:`减免`,
			// STATE_YYWSR:name,
			// STATE_YYWZC:name,
			STATE_ZS_SQ:'收取',
			STATE_ZS_TH:'退还',
			STATE_ZF_FC:'付出',
			STATE_ZF_SH:'收回',
			// STATE_JK_YS:'收到借款',
			STATE_JK_JTLX:'计提',
			STATE_JK_ZFLX:'支付利息',
			// STATE_JK_YF:'偿还本金支出',
			// STATE_TZ_YF:'对外投资支出',
			STATE_TZ_SRGL:'收入股利',
			STATE_TZ_JTGL:'计提',
			STATE_TZ_JTLX:'计提',
			STATE_TZ_SRLX:'收入利息',
			// STATE_TZ_WS:'收回投资款',
			// STATE_TZ_YS:'收回投资款',
			// STATE_ZB_ZZ:'增加注册资本',
			STATE_ZB_ZFLR:'支付利润',
			STATE_ZB_LRFP:'利润分配',
			// STATE_ZB_JZ:'减少注册资本',
			STATE_SF_ZCWJZZS:'转出未交增值税',
			STATE_KJFP_XS:'销售开票',
			STATE_KJFP_TS:'退销开票',
			STATE_FPRZ_CG:'采购发票认证',
			STATE_FPRZ_TG:'退购发票认证',
		}

		// 所有流水部分
		const mainContain = (name) => {
			const Component = name ? lsItemComponents[name] : lsItemComponents['Other']
			return (
				<Component
					dispatch={dispatch}
					jrOri={jrOri}
					category={category}
					oriState={oriState}
					activeKey={activeKey}
					onChangeActiveKey={this.onChangeActiveKey}
					isCurrentRunning={true}
					showRelatedRunning={() => this.setState({relatedRunningShow: true, showMask: true})}
					enableWarehouse={enableWarehouse}
				/>
			)
		}

		// 核算管理主体部分
		const calLsMainContain = (name,categoryType) => {

			const Component = categoryType === 'LB_JZCB'? calLsItemComponents['Jzcb'] : calLsItemComponents[name]
			return (
				Component?
					<Component
						dispatch={dispatch}
						lsItemData={lsItemData}
						jrOri={jrOri}
						category={category}
						oriState={oriState}
						activeKey={activeKey}
						onChangeActiveKey={this.onChangeActiveKey}
						isCurrentRunning={true}
						showRelatedRunning={() => this.setState({relatedRunningShow: true, showMask: true})}
						enableWarehouse={enableWarehouse}
					/> : ''
			)
		}

		return (
			<div>
				<Drawer
					// className={relatedRunningShow ? "ylls-wrap ylls-wrap-show-mask" : "ylls-wrap"}
					className="ylls-wrap"
					width={479}
					closable={false}
					onClose={() => dispatch(previewRunningActions.closePreviewRunning(false))}
					visible={true}
					maskClosable={false}
					mask={false}
					placement={fromPage === 'approval' || fromPage === 'serialFollow' ? 'left' : 'right'}
					// maskStyle={showMask ? {width: '100%'} : {}}
				>
					<ChildDrawer
						relatedJrOri={relatedJrOri}
						relatedCategory={relatedCategory}
						relatedProcessInfo={relatedProcessInfo}
						lsItemNameJson={lsItemNameJson}
						calLsItemJson={calLsItemJson}
						relatedActiveKey={relatedActiveKey}
						onChangeRelatedActiveKey={this.onChangeRelatedActiveKey}
						relatedRunningShow={relatedRunningShow}
						runningPreviewState={runningPreviewState}
						dispatch={dispatch}
						searchRunningState={searchRunningState}
						editLrAccountPermission={editLrAccountPermission}
						accountList={accountList}
						intelligentStatus={intelligentStatus}
						enableWarehouse={enableWarehouse}
						jrOri={jrOri}
						refreshList={refreshList}
						onClose={() => {
							this.setState({relatedRunningShow: false})
							setTimeout(() => this.setState({showMask: false}), 500)
						}}
						oriStateName={oriStateName}
						lrPermissionInfo={lrPermissionInfo}
						placement={fromPage === 'approval' || fromPage === 'serialFollow' ? 'left' : 'right'}
						reviewLrAccountPermission={reviewLrAccountPermission}
						pageActive={pageActive}
					/>
					<div>
						<div className="ylls-title">
							<span className="ylls-title-text">查看流水</span>
							<span
								onClick={() => dispatch(previewRunningActions.closePreviewRunning(false))}
								className="ylls-title-icon"
							>
								<Icon type="close" />
							</span>
						</div>
						<ButtonBar
							dispatch={dispatch}
							fromPage={fromPage}
							canCreateVc={canCreateVc}
							isClose={false} // 是否已结账
							jrOri={jrOri}
							lsItemData={lsItemData}
							deleteYear={deleteYear}
							deleteMonth={deleteMonth}
							deleteVcId={deleteVcId}
							panes={panes}
							Modal={Modal}
							uuidList={uuidList}
							uuid={uuid}
							editLrAccountPermission={editLrAccountPermission}
							beBusiness={beBusiness}
							oriState={oriState}
							currentItem={currentItem}
							categoryType={categoryType}
							isCurrentRunning={true}
							reviewLrAccountPermission={reviewLrAccountPermission}
							refreshList={refreshList}
							pageActive={pageActive}
							currentOri={jrOri}
							onClose={() => {this.setState({relatedRunningShow: false})}}
						/>
						<div className={'ylls-drawer-content'}>

							<ul className='ylls-item-detail'>
								<div
									className="pcxls-account"
									style={{display: jrOri.get('beCertificate') ? 'block' : 'none'}}
									>
									已审核
								</div>
								<li className='ylls-category-name'>
									<div className='ylls-category-name-word'>
										{jrOri.get('categoryFullName')}
										<div className='ylls-bulebtn' style={{display:categoryType === 'LB_JZCB' || oriStateName[oriState]?'':'none'}}>{categoryType === 'LB_JZCB'?{STATE_YYSR_ZJ:'直接结转',STATE_YYSR_XS:'销售成本结转',STATE_YYSR_TS:'退销转回成本'}[oriState]:oriStateName[oriState]}</div>
										<div className='ylls-bulebtn' style={{display:categoryType === 'LB_CHYE' && jrState && enableWarehouse ? '':'none'}}>{{STATE_CHYE_CH:'按存货调整',STATE_CHYE_CK:'按仓库调整',STATE_CHYE_TYDJ:'按统一单价调整'}[jrState]}</div>
										<div className='ylls-bulebtn' style={{display:categoryType === 'LB_CHZZ' && oriState ? '':'none'}}>{{STATE_CHZZ_ZZCX:'组装拆卸',STATE_CHZZ_ZZD:'组装单组装'}[oriState]}</div>
										<div className='ylls-bulebtn' style={{display:categoryType === 'LB_XMJZ' && oriState ? '':'none'}}>{{STATE_XMJZ_XMJQ:'项目结清',STATE_XMJZ_JZRK:'结转入库',STATE_XMJZ_QRSRCB: '确认收入成本'}[oriState]}</div>
										<div className='ylls-bulebtn' style={{display:categoryType === 'LB_GGFYFT' && oriState ? '':'none'}}>{{STATE_GGFYFT:'损益公共项目',STATE_FZSCCB:'辅助生产成本',STATE_ZZFY:'制造费用',STATE_JJFY: '间接费用',STATE_JXZY: '机械作业'}[oriState]}</div>
										<div className='ylls-bulebtn' style={{display:categoryType === 'LB_SYJZ' && oriState ? '':'none'}}>{{STATE_SYJZ_JZSR:'结转收入',STATE_SYJZ_JZCBFY:'结转成本费用',STATE_SYJZ_JZBNLR:'结转本年利润'}[oriState]}</div>
									</div>
								</li>
								<li><span>流水号：</span><span style={{display:jrOri.get('jrIndex')?'':'none'}}>{jrOri.get('jrIndex')}号</span></li>
								<li><span>流水日期：</span><span>{jrOri.get('oriDate')}</span></li>
								<li style={{lineHeight:'150%'}}><span>摘要：</span><span>{oriAbstract}</span></li>
							</ul>
							<div className='ylls-detail-menu'>
								<span
									onClick={() => {
										this.setState({page:'detail'})
									}}
									className={this.state.page === 'detail'?'ylls-detail-menu-active':''}

								>流水详情</span>
								<span
									onClick={() => {
										this.setState({page:'other'})
									}}
									className={this.state.page === 'other'?'ylls-detail-menu-active':''}
								>流水分录</span>
								<span>
									制单人：{`${lsItemData.get('createUserName')} ${lsItemData.get('createTime')}`}
								</span>
							</div>
							{
								this.state.page === 'detail'?
								calLsMainContain(calLsItemJson[oriState],categoryType) || mainContain(lsItemNameJson[categoryType])
								:
								<Journal
									dispatch={dispatch}
									lsItemData={lsItemData}
									categoryType={categoryType}
									editLrAccountPermission={editLrAccountPermission}
									searchRunningState={searchRunningState}
									accountList={accountList}
									intelligentStatus={intelligentStatus}
									isCurrentRunning={true}
									showRelatedRunning={() => this.setState({relatedRunningShow: true, showMask: true})}
									lrPermissionInfo={lrPermissionInfo}
                                    enclosureList={enclosureList}
                                    label={label}
                                    enCanUse={enCanUse}
                                    uploadKeyJson={uploadKeyJson}
                                    checkMoreFj={checkMoreFj}
								/>
							}
							{
								this.state.page === 'detail'?
								<Enclosure
									dispatch={dispatch}
									enclosureList={jrOri.get('enclosureList')}
									editLrAccountPermission={editLrAccountPermission}
								/>:''
							}
							{
								processInfo ?
								<ProcessInfo
									processInfo={processInfo}
								/>
								: null
							}
							<div className='ylls-end-content'>
								<span style={{visibility:lsItemData.get('auditUserName')?'':'hidden'}}>审核人：{`${lsItemData.get('auditUserName')} ${lsItemData.get('auditTime')}`}</span>
								<span style={{visibility:lsItemData.get('modifyUserName')?'':'hidden'}}>修改人：{`${lsItemData.get('modifyUserName')} ${lsItemData.get('modifyTime')}`}</span>
							</div>
						</div>
					</div>
				</Drawer>
				{/* <ManageModal
					manageModal={manageModal}
					dispatch={dispatch}
					modalTemp={modalTemp}
					lsItemData={lsItemData}
					showDrawer={showDrawer}
					contactsCardRange={contactsCardRange}
					magenerType={magenerType}
					accountList={accountList}
					categoryTypeObj={categoryTypeObj}
				/>
				<CarryoverModal
					carryoverModal={carryoverModal}
					dispatch={dispatch}
					modalTemp={modalTemp}
					lsItemData={lsItemData}
					showDrawer={showDrawer}
					categoryTypeObj={categoryTypeObj}
				/>
				<InvioceModal
					invioceModal={invioceModal}
					dispatch={dispatch}
					modalTemp={modalTemp}
					lsItemData={lsItemData}
					categoryTypeObj={categoryTypeObj}
					showDrawer={showDrawer}
				/>
				<InvoiceAuthModal
					defineModal={defineModal}
					dispatch={dispatch}
					lsItemData={lsItemData}
					showDrawer={showDrawer}
					categoryTypeObj={categoryTypeObj}
					modalTemp={modalTemp}
				/>
				<JzsyModal
					jzsyModal={jzsyModal}
					dispatch={dispatch}
					modalTemp={modalTemp}
					lsItemData={lsItemData}
					projectList={projectList}
					curItem={curItem}
				/> */}
			</div>
        )
    }
}
