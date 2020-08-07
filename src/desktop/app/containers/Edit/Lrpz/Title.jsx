import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'

import { debounce } from 'app/utils'
import { Icon, Input, Button, Menu, Tooltip, Modal, Checkbox } from 'antd'
import {  message as msg  } from 'antd'
import { judgePermission } from 'app/utils'
import { ROOT } from 'app/constants/fetch.constant.js'
import { ImportModal, ExportModal } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class Title extends React.Component {

	constructor() {
		super()
		this.state = {
			deleteVcModal: false, //凭证删除弹窗状态
			isSeleck: false,	//凭证删除是否勾选
			deleteHasFj: false, //删除的凭证中是否有附件
			// saveWay:false,	   //凭证重复保存方式
			// autoEncode:true    //true系统自动编号false插入凭证
		}
	}

	render() {

		const {
			PzPermissionInfo,
			jvList,
			month,
			year,
			vcKey,
			message,
			vcIndex,
			oldVcIndex,
			closedBy,
			dispatch,
			draftList,
			isEnterDraft,
			changeDraftIdx,
			showLrModalMask,
			lrIframeload,
			importResponList,
			reviewedBy,
			voucherIdx,
			voucherIndexList,
			lrpzHandleMode,
			shortcutClick,
			enclosureList,
			titleFixed,
			openedYear,
			openedMonth,
			URL_POSTFIX,
			importProgressInfo,
			isPlay,
			saveWayModal,
			preDetailList,
			QUERY_VC
		} = this.props

		const { deleteVcModal, isSeleck, deleteHasFj } = this.state
		// const editPermission = PzPermissionInfo.getIn(['edit', 'permission'])
		// const exportPermission = PzPermissionInfo.getIn(['exportExcel', 'permission'])
		//查询凭证审核反审核权限
		const auditPermission=QUERY_VC.getIn(['preDetailList','AUDIT'])
		const cancelAuditPermission=QUERY_VC.getIn(['preDetailList','CANCEL_AUDIT'])
		//录入增删改权限
		const rudVcDisable = judgePermission(preDetailList.get('RUD_VC')).disabled
		// console.log('录入的正删改', rudVcDisable,'lrpzHandleMode',lrpzHandleMode);
		
		const nextDraftIdx = changeDraftIdx + 1   //草稿
		const lastDraftIdx = changeDraftIdx - 1

		const nextVoucherIdx = voucherIdx + 1
		const lastVoucherIdx = voucherIdx - 1
		const failJsonList = importResponList.get('failJsonList')
		const successJsonList = importResponList.get('successJsonList')
		const mediaId = importResponList.get('mediaId')
		const isInsert = sessionStorage.getItem('lrpzHandleMode') == 'insert' ? true : false

		const tip = (
			<div>
				<div>录入凭证 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据)；</div>
				<div>单次导入最大分录数限定为3500条，不足时按最后一张完整凭证划分。</div>
				{/* <div className="onload" onClick={() => dispatch(allActions.usersUseLog('lrpz_export_model'))}><a href={`${ROOT}/excel/export/model?exportmodel=vcmodel`}>1.下载模版</a></div> */}
				{/* <div className="onload"><a href={`${ROOT}/excel/export/model?network=wifi&source=desktop&exportmodel=vcmodel`}>1.下载模版</a></div> */}
				<div className="onload"><a href={'https://www.xfannix.com/utils/template/%E5%87%AD%E8%AF%81%E6%A8%A1%E6%9D%BF.xls'}>1.下载模版</a></div>
			</div>
		)

		return (
			<div className="title">
				<ImportModal
					tip={tip}
					message={message}
					dispatch={dispatch}
					// exportDisable={!editPermission || isPlay}
					exportDisable={ rudVcDisable || isPlay}
					iframeload={lrIframeload}
					alertStr="请选择要导入的凭证文件"
					showMessageMask={showLrModalMask}
					failJsonList={failJsonList}
					successJsonList={successJsonList}
					beforCallback={() => {
						// dispatch(allActions.usersUseLog('lrpz_import'))
						dispatch(lrpzActions.beforeLrVcImport())
					}}
					closeCallback={() => dispatch(lrpzActions.closeLrImportContent())}
					afterCallback={(value) => dispatch(lrpzActions.afterLrVcImport(value))}
					onClickCallback={() => dispatch(lrpzActions.judgeTitleFixed())}
					// importLogAction={() => dispatch(allActions.usersUseLog('lrpz_enter_import'))}
					// inputLogAction={() => dispatch(allActions.usersUseLog('lrpz_import_selectFile'))}
					importLogAction={() => {}}
					inputLogAction={() => {}}
					mediaId={mediaId}
					onSubmitCallBack={(from,openModal) => dispatch(lrpzActions.getFileUploadFetch(from,openModal))}
					ddImportCallBack={value => dispatch(allActions.allExportReceiverlist(value, 'pzsendFailExcel', {mediaId: mediaId}))}
					importHaveProgress = {true}
					importProgressInfo = {importProgressInfo}
					clearProgress = {() => {
						dispatch(lrpzActions.changeMessageMask())
					}}
					errorSize = {importProgressInfo.get('failList').size > 0 ? true : false}
					errorUrl = {`${ROOT}/excel/import/vc/error?accessToken=${importProgressInfo.get('accessToken')}`}
					>
					<Menu.Item key='2' disabled={ rudVcDisable || lrpzHandleMode == 'insert'}>
						<span
							// className="export-button-text setting-common-ant-dropdown-menu-item"
							className={`${rudVcDisable ? 'export-text-disable' : "export-button-text"} setting-common-ant-dropdown-menu-item`}
							onClick={() => {

								if (rudVcDisable || lrpzHandleMode == 'insert') {
									return
								} else {
									let vcDate = ''
									if (!openedYear) {
										vcDate = new Date()
									} else{
										const lastDate = new Date(openedYear, openedMonth, 0)
										const currentDate = new Date()
										const currentYear = new Date().getFullYear()
										const currentMonth = new Date().getMonth() + 1
										if (lastDate < currentDate ) { //本月之前
											vcDate = lastDate
										} else if (Number(openedYear) == Number(currentYear) && Number(openedMonth) == Number(currentMonth)) { //本月
											vcDate = currentDate
										} else { //本月之后
											vcDate = new Date(openedYear, Number(openedMonth)-1, 1)
										}
									}
									// dispatch(allActions.usersUseLog('lrpz_copy'))
									sessionStorage.setItem('lrpzHandleMode', 'insert')
									dispatch(lrpzActions.initAndGetLastVcIdFetch('getLastVcIdFetch', vcDate))
									dispatch(lrpzActions.afterCopyClick(jvList))

									const haveFCNmuber = jvList.some(v => v.get('fcNumber'))
									//判断凭证是否有外币
									if (haveFCNmuber) {
										dispatch(lrpzActions.getFCListDataFetch('modify'))
									}
								}
							}}>
							复制
						</span>
					</Menu.Item>
					{/* 导出时可能修改了凭证号，临时补救所以将原来的凭证号传入 */}
					{/*<Menu.Item key='3' disabled={!editPermission || lrpzHandleMode == 'insert' }>*/}
					<Menu.Item key='3' disabled={rudVcDisable || lrpzHandleMode == 'insert' }>
						{/*<ExportModal
							title="导出为PDF"
							type="cxpzPDF"
							// hrefUrl={`${ROOT}/pdf/export?network=wifi&source=desktop&year=${year}&month=${month}&vcIndex=${oldVcIndex}`}
							hrefUrl={`${ROOT}/pdf/export?${URL_POSTFIX}&year=${year}&month=${month}&vcIndex=${oldVcIndex}`}
							exportDisable={lrpzHandleMode == 'insert' || isPlay}
							exportLogAction={() => {}}
							urldownloadLog={(needA4, needCreatedby) => {}}
							// exportLogAction={() => dispatch(allActions.usersUseLog('lrpz_enter_export'))}
							// urldownloadLog={(needA4, needCreatedby) => dispatch(allActions.usersUseLog(`lrpz_PDF_download_${needA4}_${needCreatedby}`))}
							ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'cxpzpdfexport', {year, month, 'vcIndexList':[oldVcIndex]}))}
							cxpzPDFddCallback={(resultlist, needA4, needCreatedby, needAss) => {
								// dispatch(allActions.usersUseLog(`lrpz_PDF_dd_${needA4}_${needCreatedby}`))
								dispatch(allActions.allExportReceiverlist(resultlist, 'cxpzpdfexport', {year, month, 'vcIndexList':[oldVcIndex], needA4, needCreatedby, needAss}))}}
							>
							导出PDF打印
						</ExportModal>*/ }
						<span 
							// className="export-button-text setting-common-ant-dropdown-menu-item" 
							className={`${rudVcDisable ? 'export-text-disable' : "export-button-text"} setting-common-ant-dropdown-menu-item`}
							onClick={()=>{
								if (rudVcDisable || lrpzHandleMode == 'insert' || isPlay){
									return
								} else {
									sessionStorage.setItem('fromPos', 'lrpz')
									dispatch(allActions.handlePrintModalVisible(true))
									dispatch(printActions.setPrintVcIndexAndDate(year, month,[oldVcIndex]))
							}
						}}>
							打印
						</span>
					</Menu.Item>
				</ImportModal>
				<Tooltip placement="top" title={ !judgePermission(auditPermission).disabled ? (lrpzHandleMode == 'insert' ? '当前凭证需保存后方能审核' : '') : '当前角色无该权限'}>
					<Button
						className="title-right"
						type="ghost"
						style={{display: reviewedBy ? 'none' : ''}}
						// disabled={!PzPermissionInfo.getIn(['review', 'permission']) || !!closedBy || !!reviewedBy || lrpzHandleMode == 'insert'}
						disabled={ judgePermission(auditPermission).disabled || !!closedBy || !!reviewedBy || lrpzHandleMode == 'insert'}
						onClick={() => debounce(() => {
							// dispatch(allActions.usersUseLog('lrpz_reviewed'))
							dispatch(lrpzActions.reviewedJvlist(year, month, vcIndex))
						})()}
						>
						审核
					</Button>
				</Tooltip>
				<Tooltip placement="top" title={ !judgePermission(cancelAuditPermission).disabled ? '' : '当前角色无该权限'}>
					<Button
						className="title-right three-word-btn"
						type="ghost"
						style={{display: reviewedBy ? '' : 'none'}}
						// disabled={ !PzPermissionInfo.getIn(['review', 'permission']) || !!closedBy || lrpzHandleMode == 'insert'}
						disabled={ judgePermission(cancelAuditPermission).disabled || !!closedBy || lrpzHandleMode == 'insert'}
						onClick={() => debounce(() => {
							// dispatch(allActions.usersUseLog('lrpz_unReviewed'))
							dispatch(lrpzActions.cancelReviewedJvlist(year, month, vcIndex))
						})()}
						>
						反审核
					</Button>
				</Tooltip>
				<Button
					className="title-right draft-button three-word-btn"
					type="ghost"
					// disabled={!editPermission}
					disabled={ judgePermission(preDetailList.get('DRAFT_BOX')).disabled }
					style={{ display: sessionStorage.getItem('lrpzHandleMode') == 'insert' ? 'block' : 'none'}}
					onClick={() => {
						// dispatch(allActions.usersUseLog('lrpz_draft'))
						dispatch(homeActions.addPageTabPane('EditPanes', 'Draft', 'Draft', '草稿箱'))
						dispatch(homeActions.addHomeTabpane('Edit', 'Draft', '草稿箱'))
						dispatch(draftActions.getDraftListFetch('全部'))
					}}
					>
					草稿箱
				</Button>
				<Button
					className="title-right"
					type="ghost"
					// disabled={!editPermission}
					disabled={ judgePermission(preDetailList.get('DRAFT_BOX')).disabled}
					style={{display: sessionStorage.getItem('lrpzHandleMode') == 'insert' ? 'block' : 'none'}}
					onClick={() => debounce(() => {
						// dispatch(allActions.usersUseLog('lrpz_temporary'))
						dispatch(lrpzActions.draftSaveFetch(vcKey))
					})()}
					>
					暂存
				</Button>
				<Button
					className="title-right four-word-btn"
					type="ghost"
					onClick={() => {
						// dispatch(allActions.usersUseLog('lrpz_saveAndNew'))
						// const saveWayModal = () => this.setState({'saveWay':true})
						let list =jvList.toJS()
						let error = false
						for (let i in list) {
							if(list[i].asslist.some(v => !v.assid)){
								error=true
								break
							}
						}
						if (error) {
							msg.warn('辅助核算不能为空')
						} else {
							// dispatch(lrpzActions.saveJvItemFetch('true','',saveWayModal,PzPermissionInfo))
							dispatch(lrpzActions.saveJvItemFetch('true','',saveWayModal,PzPermissionInfo))
						}
					}}
					// disabled={!editPermission || !!closedBy || !!reviewedBy}
					disabled={ rudVcDisable || !!closedBy || !!reviewedBy}
					// disabled={ !!closedBy || !!reviewedBy}
					// style={{display: !!closedBy || !!reviewedBy || !isInsert  ? 'none' : 'block'}}
					style={{display: !!closedBy || !!reviewedBy ? 'none' : 'block'}}
					>
					保存并新增
				</Button>
				<Button
					className="title-right"
					type="ghost"
					onClick={() => {
						// dispatch(allActions.usersUseLog('lrpz_save'))
						// const saveWayModal = () => this.setState({'saveWay':true})

						let list =jvList.toJS()
						let error = false
						for (let i in list) {
							if(list[i].asslist.some(v => !v.assid)){
								error=true
								break
							}
						}
						if (error) {
							msg.warn('辅助核算不能为空')
						} else {
							// dispatch(lrpzActions.saveJvItemFetch('false','',saveWayModal,PzPermissionInfo))
							dispatch(lrpzActions.saveJvItemFetch('false','',saveWayModal,PzPermissionInfo))
						}

					}}
					// disabled={!editPermission || !!closedBy || !!reviewedBy}
					// disabled={ rudVcDisable || !!closedBy || !!reviewedBy}
					disabled={ !!closedBy || !!reviewedBy}
					style={{display: !!closedBy || !!reviewedBy ? 'none' : 'block'}}
					>
					保存
				</Button>
				{/* lrpz的上下张凭证数组voucherIndexList包含的是 ['2017-01_1'], 日期和凭证号的分隔符为 "_" */}
				<Button
					style={{display: isInsert ? '' : 'none'}}
					className="title-right"
					type="ghost"
					// disabled={!editPermission || !!closedBy || !!reviewedBy}
					disabled={ rudVcDisable || !!closedBy || !!reviewedBy}
					onClick={() => {
						thirdParty.Confirm({
							message: `本操作将清空此凭证数据`,
							title: "提示",
							buttonLabels: ['取消', '确定'],
							onSuccess : (result) => {
								if (result.buttonIndex === 1) {
									// dispatch(allActions.usersUseLog('lrpz_clear'))
									dispatch(lrpzActions.clearLrpz())
								}
							}
						})
					}}
					>
					清空
				</Button>
				<Button
					style={{display: isInsert ? 'none' : ''}}
					className="title-right"
					type="ghost"
					// disabled={!editPermission || !!closedBy || !!reviewedBy}
					disabled={ rudVcDisable || !!closedBy || !!reviewedBy}
					onClick={() => this.setState({deleteVcModal: true,deleteHasFj: enclosureList.size ? true : false}) }>
					删除
				</Button>
				<Button
					type="ghost"
					className="title-right"
					disabled={isEnterDraft ?
						draftList.size && nextDraftIdx != draftList.size ? false : true
						:
						voucherIndexList.size && nextVoucherIdx != voucherIndexList.size ? false : true
					}
					onClick={() => debounce(() => {
						if (isEnterDraft) {
							dispatch(lrpzActions.getDraftItemFetch(draftList.get(nextDraftIdx), nextDraftIdx))
						} else {
							// dispatch(allActions.usersUseLog('lrpz_nextVoucher'))
							dispatch(lrpzActions.getVcFetch(voucherIndexList.get(nextVoucherIdx).split('_')[0], voucherIndexList.get(nextVoucherIdx).split('_')[1], nextVoucherIdx))
						}
					})()}
					>
					<Icon type="caret-right"/>
				</Button>
				<Button
					type="ghost"
					className="title-right"
					disabled={isEnterDraft ?
						draftList.size && lastDraftIdx != -1 ? false : true
						:
						voucherIndexList.size && lastVoucherIdx != -1 ? false : true
					}
					onClick={() => debounce(() => {
						if (isEnterDraft) {
							dispatch(lrpzActions.getDraftItemFetch(draftList.get(lastDraftIdx), lastDraftIdx))
						} else {
							// dispatch(allActions.usersUseLog('lrpz_lastVoucher'))
							dispatch(lrpzActions.getVcFetch(voucherIndexList.get(lastVoucherIdx).split('_')[0], voucherIndexList.get(lastVoucherIdx).split('_')[1], lastVoucherIdx))
						}
					})()}
					>
					<Icon type="caret-left"/>
				</Button>
				<span className='title-lrb-rule' onClick={() => {
					// dispatch(allActions.usersUseLog('lrpz_help'))
					dispatch(lrpzActions.shortcut())
				}}>快捷键说明</span>

				{/* 删除弹窗 */}
				<Modal ref="modal"
					visible={deleteVcModal}
					title="确定删除吗？"
					onCancel={() => this.setState({'deleteVcModal': false, 'isSeleck': false})}
					footer={[
						<Button key="back" type="ghost" size="large" onClick={() => this.setState({'deleteVcModal': false, 'isSeleck': false})}>
							取消
						</Button>,
						<Button key="submit" type="primary" size="large" disabled={deleteHasFj ? !isSeleck : false}
							onClick={() => {
								this.setState({
									'deleteVcModal': false,
									'isSeleck': false
								})
								dispatch(lrpzActions.deleteVcFetch())
							}}>
							确定
						</Button>
					]}
				>
					<Checkbox
						checked={isSeleck}
						style={{display: deleteHasFj ? '' : 'none'}}
						onChange={()=>this.setState({'isSeleck':!isSeleck})}
					/>
					<span style={{'marginRight': '10px',display: deleteHasFj ? '' : 'none'}}>
						凭证中含有附件附件也将被删除
					</span>
					<p style={{display: deleteHasFj ? 'none' : ''}}>确定删除凭证吗？</p>
				</Modal>
			</div>
		)
	}
}
