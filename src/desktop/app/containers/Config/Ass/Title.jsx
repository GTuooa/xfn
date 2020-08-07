import React from 'react'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'


import PageSwitch from 'app/containers/components/PageSwitch'
import { Button, Menu, Select, Tooltip, Icon, Modal, Radio } from 'antd'
const RadioGroup = Radio.Group
import { ROOT } from 'app/constants/fetch.constant.js'
import { ImportModal, ExportModal, Tab } from 'app/components'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'
import { judgePermission } from 'app/utils'

@immutableRenderDecorator
export default
class Title extends React.Component {

	constructor() {
		super()
		this.state = {showModal: false}
	}

	render() {

		const {
			ass,
			dispatch,
			allState,
			tags,
			expireInfo,
			activeAssList,
			fzhsState,
			activeAssCategory,
			asslist,
			asslistSelectedStatus,
			assExist,
			// configPermissionInfo,
			ambAssCategroyList,
			ambSourceList,
			isSpread,
			pageList,
			URL_POSTFIX,
			isPlay,
			detailList
		} = this.props

		const { showModal, showReversModal, reversType } = this.state

		const assshowMessageMask = fzhsState.get('assshowMessageMask')
		const assiframeload = fzhsState.get('assiframeload')
		const assimportresponlist = fzhsState.get('assimportresponlist')
		const failJsonList = assimportresponlist.get('failJsonList')
		const successJsonList = assimportresponlist.get('successJsonList')
		const assmessage = fzhsState.get('assmessage')

		const tip = (
			<div>
			<div>辅助核算 > Excel导入</div>
			<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
			<div className="import-mask-tip">温馨提示</div>
			<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据) 。</div>
			<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E8%BE%85%E5%8A%A9%E6%A0%B8%E7%AE%97%E6%A8%A1%E6%9D%BF.xls`}>1.下载模版</a></div>
			</div>
		)

		const assCategroyList = ambAssCategroyList.get('assCategroyList')
		const reserveTags = fromJS(['客户', '供应商', '职员', '项目', '部门'])
		let customTags = tags.filter(v => reserveTags.indexOf(v)<0 )
		customTags = customTags.push('+ 新增')

		return (
			<FlexTitle>
				<div className="flex-title-left">
					{isSpread ? '' :
						<PageSwitch
							pageItem={pageList.get('Config')}
							onClick={(page, name, key) => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', key, key, name))
								dispatch(homeActions.addHomeTabpane(page, key, name))
							}}
						/>
					}
					<Tab
						tabList={reserveTags.toJS().map(v => ({key:v,value:v}))}
						activeKey={activeAssCategory}
						tabFunc={(item) => {
							dispatch(fzhsActions.changeActiveAssCategory(item.key, asslist.find(w => w.get('asscategory') === item.key)))
						}}
					/>
					{/* {reserveTags.map(v =>
						<span
							key={v}
							className={`title-conleft ${activeAssCategory == v ? 'title-selectd' : ''}`}
							onClick={() => dispatch(fzhsActions.changeActiveAssCategory(v, asslist.find(w => w.get('asscategory') === v)))}
							>
							{v}
						</span>
					)} */}
					<Select
						value={customTags.indexOf(activeAssCategory)>-1 ? activeAssCategory : customTags.size>1 ? customTags.get(0) : '自定义类别'}
						style={{width: 148}}
						className={customTags.size>1  ? 'ass-select-tag' : ['ass-notCustom', 'ass-select-tag'].join(' ')}
						onSelect={(value) => {
							if (value === '+ 新增') {
								sessionStorage.setItem('handleAss', 'insert')
								sessionStorage.setItem('handleAssCustom', 'insert')
								dispatch(fzhsActions.changeFzModalDisplay())
								dispatch(fzhsActions.changeAssCategory(''))
								return
							}
							dispatch(fzhsActions.changeActiveAssCategory(value, asslist.find(w => w.get('asscategory') === value)))
						}}>
						{customTags.map(v => <Option value={v}>{v}</Option>)}
					</Select>
				</div>
				<div className="flex-title-right">
					{
						expireInfo.get('AMB') ?
						<Button
							disabled={judgePermission(detailList.get('AMB_MODEL')).disabled}
							className="title-right four-word-btn"
							type="ghost"
							onClick={() => {
								dispatch(fzhsActions.getAssGetAMB())
								this.setState({showModal: true})
							}}>
							阿米巴模式
						</Button> : ''
					}
					<Button
						disabled={judgePermission(detailList.get('CUD_ASS')).disabled}
						className="title-right"
						type="ghost"
						onClick={() => {
							sessionStorage.removeItem('handleAssCustom')
							sessionStorage.setItem('handleAss', 'insert')
							dispatch(fzhsActions.changeFzModalDisplay())
							dispatch(fzhsActions.changeAssCategory(activeAssCategory))
						}}>
						新增
					</Button>
					<Tooltip placement="bottom" title={judgePermission(detailList.get('CUD_ASS')).disabled ? '当前角色无该权限' : (!asslistSelectedStatus.some(v => v) ? '请选择需要删除的辅助项目' : '')}>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => {
								const deletelist = []
								asslistSelectedStatus.forEach((v, key) => v ? deletelist.push(key) : true)
								dispatch(allActions.deleteAss(activeAssCategory, deletelist))
							}}
							disabled={judgePermission(detailList.get('CUD_ASS')).disabled || !asslistSelectedStatus.some(v => v)}
							>
							删除
						</Button>
					</Tooltip>
					<ImportModal
						tip={tip}
						message={assmessage}
						dispatch={dispatch}
						exportDisable={judgePermission(detailList.get('IMPORT_ASS')).disabled || isPlay}
						iframeload={assiframeload}
						failJsonList={[]}
						// iframeName='assiframe'
						alertStr="请选择要导入的辅助核算文件"
						showMessageMask={assshowMessageMask}
						successJsonList={[]}
						// actionPath={`${ROOT}/excel/import/ass?network=wifi&source=desktop`}
						beforCallback={() => dispatch(fzhsActions.beforeAssImport())}
						closeCallback={() => {
							dispatch(fzhsActions.closeAssImportContent())
						}}
						// afterCallback={(value) => dispatch(fzhsActions.afterAssImport(value))}
						onSubmitCallBack={(from,openModal) => dispatch(fzhsActions.getFileUploadFetch(from,openModal))}
						importHaveProgress = {true}
						importProgressInfo = {fzhsState.get('importProgressInfo')}
						clearProgress = {() => {
							dispatch(fzhsActions.changeMessageMask())
						}}
						>
						<Menu.Item key='2' disabled={judgePermission(detailList.get('EXPORT_ASS')).disabled  || !assExist || isPlay}>
							<ExportModal
								// hrefUrl={`${ROOT}/excel/export?network=wifi&source=desktop&export=ass&year=0&month=0`}
								hrefUrl={`${ROOT}/excel/export?${URL_POSTFIX}&export=ass&year=0&month=0&action=MANAGER-ASS_SETTING-EXPORT_ASS`}
								exportDisable={judgePermission(detailList.get('EXPORT_ASS')).disabled  || !assExist || isPlay}
								ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: 0, month: 0, exportModel: 'ass', action: 'MANAGER-ASS_SETTING-EXPORT_ASS'}))}
								>
								导出
							</ExportModal>
						</Menu.Item>
						<Menu.Item key='3' disabled={judgePermission(detailList.get('REGRET_MODEL')).disabled}>
							<span 
								className={`${judgePermission(detailList.get('REGRET_MODEL')).disabled ? 'export-text-disable' : "export-button-text"} setting-common-ant-dropdown-menu-item`}
								// className="setting-common-ant-dropdown-menu-item" 
								onClick={() => {
									if (judgePermission(detailList.get('REGRET_MODEL')).disabled) {
										return
									}
								dispatch(fzhsActions.changeReversCategory(activeAssCategory))
								dispatch(fzhsActions.changeReversAssModal(true))
							}}>反悔模式</span>
						</Menu.Item>
					</ImportModal>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							dispatch(allActions.getAcListFetch())
							dispatch(allActions.getAssListFetch(true))
							// dispatch(fzhsActions.changeActiveAssCategory(activeAssCategory, activeAssList))
							dispatch(fzhsActions.changeActiveAssCategory(activeAssCategory, ass))
							dispatch(allActions.closeConfigPage('辅助设置'))
						}}
						>
						刷新
					</Button>
				</div>
				<Modal
					okText="保存"
					visible={showModal}
					maskClosable={false}
					title='阿米巴类别设置'
					onCancel={() => this.setState({showModal: false})}
					footer={[
						<Button key="cancel" type="ghost" onClick={() => this.setState({showModal: false})}>
							关 闭
						</Button>,
						<Button type="primary" disabled={judgePermission(detailList.get('AMB_MODEL')).disabled || !assCategroyList.size} key="ok" type="ghost" onClick={() => dispatch(fzhsActions.getAssrelateAMB(assCategroyList, () => this.setState({showModal: false})))}>开通</Button>
					]}
					>
					<div>
						<span>默认类别：</span>
						<Select
							style={{width: 150}}
							className=""
							value={assCategroyList && assCategroyList.size ? assCategroyList.get(0) : ''}
							onChange={value => dispatch(fzhsActions.changeAMBRelateAssCategroyList(value))}
							>
							{fromJS(ambSourceList).map((v, i) => <Option key={i} value={v}>{v}</Option>)}
						</Select>
						<ul className="uses-tip">
							{
								!ambSourceList.size ?
								<li className="form-tip-item">
									提示：<strong>当前没有辅助核算类别关联损益类科目，请前往辅助核算设置关联；</strong>
								</li> : ''
							}
							<li>前提：阿米巴类别必须关联损益类科目；</li>
							<li>可将任一关联类损益类科目的辅助核算类别开通阿米巴功能；</li>
							<li>可更改阿米巴类别。</li>
						</ul>
					</div>
				</Modal>
			</FlexTitle>
		)
	}
}
