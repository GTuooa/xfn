import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Button, Menu, Icon, Tooltip } from 'antd'
import { ImportModal, ExportModal, Tab } from 'app/components'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { ROOT } from 'app/constants/fetch.constant.js'
import { judgePermission } from 'app/utils'
import thirdParty from 'app/thirdParty'

import * as qcyeActions	from 'app/redux/Config/Qcye/qcye.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {

		const { tabSelectedIndex, dispatch, allState, acbalist, hasClosed, qcyeState, configPermissionInfo, isModified, URL_POSTFIX, isPlay ,detailList} = this.props
		// console.log(this.props.acbalist)
		const category = ['资产', '负债', '权益', '成本']
		const qcshowMessageMask = qcyeState.getIn(['flags', 'qcshowMessageMask'])
		const qciframeload = qcyeState.getIn(['flags','qciframeload'])
		const qcimportresponlist = qcyeState.get('qcimportresponlist')
		const failJsonList = qcimportresponlist.get('failJsonList')
		const successJsonList = qcimportresponlist.get('successJsonList')

		const qcmessage = qcyeState.get('qcmessage')

		const tip = (
			<div>
				<div>期初余额 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中。</div>
				<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E6%9C%9F%E5%88%9D%E5%80%BC%E6%A8%A1%E6%9D%BF.xls`}>1.下载模版</a></div>
			</div>
		)

		return (
			<FlexTitle>
				<div className="flex-title-left">
					<Tab
						radius
						tabList={category.map(v => ({key:v,value:v}))}
						activeKey={tabSelectedIndex}
						tabFunc={(item) => {
							dispatch(qcyeActions.changeQcyeTabPane(item.key))
						}}
					/>
					{/* {category.map(v => {
						return(
							<span
								key={v}
								className={`title-conleft ${tabSelectedIndex == v ? 'title-selectd' : ''}`}
								onClick={() => dispatch(qcyeActions.changeQcyeTabPane(v))}
								>
								{v}
							</span>
						)
					})} */}
				</div>
				<div className="flex-title-right">
					<Button
						className="title-right"
						type="ghost"
						// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || hasClosed}
						disabled={hasClosed}
						onClick={() => {
							if (isModified) {
								thirdParty.Confirm({
									message: "是否保存对期初值的修改？",
									title: "提示",
									buttonLabels: ['取消', '确定'],
									onSuccess : (result) => {
										if (result.buttonIndex === 0) {
											dispatch(qcyeActions.getBaInitListFetch(hasClosed))
										} else if (result.buttonIndex === 1) {
											dispatch(qcyeActions.setAcBalanceFetch(acbalist))
										}
									}
								})
							} else {
								this.props.dispatch(qcyeActions.getBaInitListFetch(hasClosed))
							}
						}}
					>
						刷新
					</Button>
					<Tooltip placement="bottom" title={judgePermission(detailList.get('BEGIN_VALUE_SETTING')).disabled  ? '当前角色无该权限' : ''}>
						<Button
							className="title-right"
							type="ghost"
							disabled={judgePermission(detailList.get('BEGIN_VALUE_SETTING')).disabled  || hasClosed}
							onClick={() => {
								if (isModified) {
									dispatch(qcyeActions.setAcBalanceFetch(acbalist))
								} else {
									thirdParty.Alert('未进行期初值修改！')
								}
							}}
							>
							保存
						</Button>
					</Tooltip>
					<Button
						className="title-right"
						type="ghost"
						disabled={judgePermission(detailList.get('BEGIN_VALUE_SETTING')).disabled  || hasClosed}
						onClick={() => {
							thirdParty.Confirm({
								message: "确定已完成期初值导出备份？",
								title: "提示",
								buttonLabels: ['取消', '确定'],
								onSuccess : (result) => {
									if (result.buttonIndex === 1) {
										const acbalist = []
										dispatch(qcyeActions.setAcBalanceFetch(acbalist))
									}
								}
							})
						}}
						>
						清空
					</Button>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							if (isModified) {
								thirdParty.Confirm({
									message: "是否保存对期初值的修改？",
									title: "提示",
									buttonLabels: ['取消', '确定'],
									onSuccess : (result) => {
										if (result.buttonIndex === 0) {
											dispatch(qcyeActions.getBaInitListFetch(hasClosed))
											dispatch(homeActions.addPageTabPane('ConfigPanes', 'Ac', 'Ac', '科目设置'))
											dispatch(homeActions.addHomeTabpane('Config', 'Ac', '科目设置'))
										} else if (result.buttonIndex === 1) {
											dispatch(qcyeActions.setAcBalanceFetch(acbalist))
											dispatch(homeActions.addPageTabPane('ConfigPanes', 'Ac', 'Ac', '科目设置'))
											dispatch(homeActions.addHomeTabpane('Config', 'Ac', '科目设置'))
										}
									}
								})
							} else {
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Ac', 'Ac', '科目设置'))
								dispatch(homeActions.addHomeTabpane('Config', 'Ac','科目设置'))
							}
						}}
						>
						返回
					</Button>
					<ImportModal
						// exportDisable={hasClosed}
						tip={tip}
						message={qcmessage}
						dispatch={dispatch}
						iframeload={qciframeload}
						exportDisable={judgePermission(detailList.get('IMPORT_BEGIN_VALUE')).disabled || hasClosed || isPlay}
						// iframeName='qciframe'
						failJsonList={failJsonList}
						alertStr="请选择要导入的期初余额文件"
						showMessageMask={qcshowMessageMask}
						successJsonList={successJsonList}
						// actionPath={`${ROOT}/excel/import/periodBa`}
						beforCallback={() => dispatch(qcyeActions.beforeQcyeImport())}
						closeCallback={() => dispatch(qcyeActions.closeQcyeImportContent())}
						// afterCallback={(value) => {
						// 	dispatch(qcyeActions.afterQcyeImport(value))
						// 	// dispatch(qcyeActions.getBaInitListFetch())
						// }}
						onSubmitCallBack={(from,openModal) => dispatch(qcyeActions.getFileUploadFetch(from,openModal))}
						importHaveProgress = {true}
						importProgressInfo = {qcyeState.get('importProgressInfo')}
						clearProgress = {() => {
							dispatch(qcyeActions.changeMessageMask())
						}}
						>
						<Menu.Item key='2' disabled={judgePermission(detailList.get('EXPORT_BEGIN_VALUE')).disabled}>
							<ExportModal
								exportDisable={acbalist.size === 0 || judgePermission(detailList.get('EXPORT_BEGIN_VALUE')).disabled || isPlay}
								hrefUrl={`${ROOT}/excel/export/periodBas?${URL_POSTFIX}`}
								ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'qcyeexcelsend'))}
								>
								导出
							</ExportModal>
						</Menu.Item>
						<Menu.Item key='3' disabled={judgePermission(detailList.get('TRIAL_BALANCE')).disabled || hasClosed}>
							<span className={`${judgePermission(detailList.get('TRIAL_BALANCE')).disabled ? 'export-text-disable' : "export-button-text"} setting-common-ant-dropdown-menu-item`}
							onClick={() => {
								if (!judgePermission(detailList.get('TRIAL_BALANCE')).disabled && !hasClosed) {
									if (isModified) {
										thirdParty.Alert('保存数据后方能进行试算平衡')
									} else {
										dispatch(qcyeActions.getTrailBalanceFetch())
									}
								}
							}}>试算平衡</span>
						</Menu.Item>
					</ImportModal>
				</div>
			</FlexTitle>
		)
	}
}
