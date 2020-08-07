import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as qcyeActions	from 'app/redux/Config/Qcye/qcye.action.js'

import { Button, Menu, Tooltip } from 'antd'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { ROOT } from 'app/constants/fetch.constant.js'
import { ImportModal, ExportModal, Tab } from 'app/components'
import { judgePermission } from 'app/utils'
import PageSwitch from 'app/containers/components/PageSwitch'


@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {

		const { tabSelectedIndex, dispatch, acidlist, configState, acStatus, allState, aclistExist, acTags, configPermissionInfo, reverseClick, isSpread, pageList, URL_POSTFIX, isPlay,detailList } = this.props

		const acshowMessageMask = configState.get('acshowMessageMask')
		const aciframeload = configState.get('aciframeload')
		const acimportresponlist = configState.get('acimportresponlist')
		const failJsonList = acimportresponlist.get('failJsonList')
		const successJsonList = acimportresponlist.get('successJsonList')

		const acmessage = configState.get('acmessage')


		const tip = (
			<div>
				<div>科目设置 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>导入科目会覆盖系统中的相同科目，且不可恢复请谨慎操作！</div>
				<div>1、请确保导入涉及的科目未录入凭证及初始余额，如有录入凭证或初始余额，先删除相关内容再导入；</div>
				<div>2、导入科目可能影响财务报表的取数，需手工修正。</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据) 。</div>
				{/* <div className="onload"><a href={`${ROOT}/excel/export/model?network=wifi&source=desktop&exportmodel=acmodel`}>1.下载模版</a></div> */}
				<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E7%A7%91%E7%9B%AE%E6%A8%A1%E6%9D%BF.xls`}>1.下载模版</a></div>
			</div>
		)

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
						tabList={acTags.toJS().map(v => ({key:v.category,value:v.category}))}
						activeKey={tabSelectedIndex}
						tabFunc={(item) => {
							dispatch(configActions.changeTabPane(item.key, allState.getIn(['categoryAclist', item.key])))
						}}
					/>
					{/* {acTags.map(v =>
						<span
							key={v.get('category')}
							className={`title-conleft ${tabSelectedIndex == v.get('category') ? 'title-selectd' : ''}`}
							onClick={() => dispatch(configActions.changeTabPane(v.get('category'), allState.getIn(['categoryAclist', v.get('category')])))}
							>
							{v.get('category')}
						</span>
					)} */}
					<Button
						className='title-btn three-word-btn'
						type="ghost"
						onClick={() => {
							dispatch(homeActions.addPageTabPane('ConfigPanes', 'Qcye', 'Qcye', '期初值'))
							dispatch(homeActions.addHomeTabpane('Config', 'Qcye', '期初值'))
						}}
						>
						期初值
					</Button>
				</div>
				<div className="flex-title-right">
					{/**title={judgePermission(detailList.get('CUD_AC_SETTING')).disabled ? '当前角色无该权限' : '' */}
					<Tooltip placement="bottom" title={judgePermission(detailList.get('CUD_AC_SETTING')).disabled ? '当前角色无该权限' : ''}>
						<Button
							disabled={judgePermission(detailList.get('CUD_AC_SETTING')).disabled}
							className="title-right"
							type="ghost"
							onClick={() => {
								dispatch(configActions.insertAcItem())
								dispatch(configActions.changeModalDisplay())
								sessionStorage.setItem('changeAcInfo', true)

							}}
							>
							新增
						</Button>
					</Tooltip>
					<Tooltip placement="bottom" title={judgePermission(detailList.get('CUD_AC_SETTING')).disabled ? '当前角色无该权限' : (!acStatus.some(v => v) ? '请选择需要删除的科目' : '')}>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => dispatch(allActions.deleteAcItemFetch(acidlist, true, tabSelectedIndex + 1 + ''))}
							// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || !acStatus.some(v => v)}
							disabled={judgePermission(detailList.get('CUD_AC_SETTING')).disabled || !acStatus.some(v => v)}
							>
							删除
						</Button>
					</Tooltip>
					<ImportModal
						tip={tip}
						message={acmessage}
						dispatch={dispatch}
						iframeload={aciframeload}
						// iframeName='aciframe'
						exportDisable={judgePermission(detailList.get('IMPORT_AC')).disabled  || isPlay}
						failJsonList={[]}
						alertStr="请选择要导入的科目文件"
						showMessageMask={acshowMessageMask}
						successJsonList={[]}
						// actionPath={`${ROOT}/excel/import/ac?network=wifi&source=desktop`}
						actionPath={`${ROOT}/excel/import/ac?${URL_POSTFIX}`}
						beforCallback={() => dispatch(configActions.beforeAcImport())}
						closeCallback={() => {
							dispatch(configActions.closeAcImportContent())
						}}
						afterCallback={(value) => dispatch(configActions.afterAcImport(value))}
						onSubmitCallBack={(from,openModal) => dispatch(configActions.getFileUploadFetch(from,openModal))}
						importHaveProgress = {true}
						importProgressInfo = {configState.get('importProgressInfo')}
						clearProgress = {() => {
							dispatch(configActions.changeMessageMask())
						}}
						>
						<Menu.Item key='2' disabled={judgePermission(detailList.get('EXPORT_AC')).disabled  || !aclistExist || isPlay}>
							<ExportModal
								// hrefUrl={`${ROOT}/excel/export?network=wifi&source=desktop&export=ac&year=0&month=0`}
								hrefUrl={`${ROOT}/excel/export?${URL_POSTFIX}&export=ac&year=0&month=0&action=MANAGER-AC_SETTING-EXPORT_AC`}
								exportDisable={judgePermission(detailList.get('EXPORT_AC')).disabled || !aclistExist || isPlay}
								ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: 0, month: 0, exportModel: 'ac', action: 'MANAGER-AC_SETTING-EXPORT_AC'}))}
								>
								导出
							</ExportModal>
						</Menu.Item>
						<Menu.Item key='3' 
							// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || !aclistExist}
							disabled={judgePermission(detailList.get('REGRET_MODEL')).disabled || !aclistExist}
						>
							<span 
							 	style={{color:judgePermission(detailList.get('REGRET_MODEL')).disabled ? '#ccc' : '#222'}}
								className="setting-common-ant-dropdown-menu-item" onClick={() => {
									if (!judgePermission(detailList.get('REGRET_MODEL')).disabled  && aclistExist) {
										reverseClick()
									}
								
							}}>反悔模式</span>
						</Menu.Item>
					</ImportModal>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							dispatch(allActions.getAcListFetch(true))
							dispatch(configActions.clearAcChildshow())
							dispatch(allActions.closeConfigPage('科目设置'))
						}}
						>
						刷新
					</Button>
				</div>
			</FlexTitle>
		)
	}
}
