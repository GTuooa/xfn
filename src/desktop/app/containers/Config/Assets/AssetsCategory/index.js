import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'

import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import Table from './Table'

import AssetsCategoryOption from './AssetsCategoryOption'
import Delete from '../common/Delete'
import { ROOT } from 'app/constants/fetch.constant.js'
import { titleTags } from 'app/containers/Config/Assets/common/common.js'
import { Button, Icon, Input, Modal, message, Menu, Tooltip } from 'antd'
import { ImportModal, ExportModal, AlertModal, TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll, Tab } from 'app/components'
import { changeAssetsListDataToTree, changeLabelDataToTree ,judgePermission} from 'app/utils'
import './style.less'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'


@connect(state => state)
export default
class AssetsCategory extends React.Component {

	componentDidMount() {}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.assetsState != nextprops.assetsState || this.props.homeState != nextprops.homeState
	}

    render() {

		const { assetsState, dispatch, allState, homeState } = this.props
		const CUD_ASSETS = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList','CUD_ASSETS'])
		const detailList = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const tabSelectedIndex = assetsState.get('tabSelectedIndex')
		// 卡片编辑框是否显示
        const classModalShow = assetsState.getIn(['flags', 'classModalShow'])
        const assetslist = assetsState.get('assetslist')

		// 资产列表
		const sortList = assetsState.get('sortList')
		const sortItemStatus = assetsState.get('sortItemStatus')
		const avtiveSortItemId = assetsState.get('avtiveSortItemId')
		// console.log(avtiveSortItemId)
		const sortCheckedAll = assetsState.getIn(['view','sortCheckedAll'])
		const deleteSortModalStatus = assetsState.getIn(['view','deleteSortModalStatus'])

		// 点击三角下拉要显示下级的id数组
        const assetsChildShow = assetsState.getIn(['flags', 'assetsChildShow'])

		// 导入
		const assetsshowMessageMask = assetsState.getIn(['flags', 'assetsshowMessageMask'])
		const assetsiframeload = assetsState.getIn(['flags', 'assetsiframeload'])
		const assetsimportresponlist = assetsState.get('assetsimportresponlist')
		const failJsonList = assetsimportresponlist.get('failJsonList')
		const successJsonList = assetsimportresponlist.get('successJsonList')
		const assetsmessage = assetsState.get('assetsmessage')

		//辅助核算禁用提示信息
		const showAssDisableModal = assetsState.getIn(['flags', 'showAssDisableModal'])
		const showAssDisableInfo = assetsState.getIn(['flags', 'showAssDisableInfo'])

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const tip = (
			<div>
				<div>资产设置 > 资产类别 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据) 。</div>
				<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E8%B5%84%E4%BA%A7%E7%B1%BB%E5%88%AB%E6%A8%A1%E6%9D%BF.xls`}>1.下载模版</a></div>
			</div>
		)

		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])

		return (
			<ContainerWrap type='config-one' className={'assets-card-config-wrap'}>
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
						<div className="title-left">
							<Tab
								radius
								tabList={titleTags.map(v => ({key:v.category,value:v.category,item:v}))}
								activeKey={tabSelectedIndex}
								tabFunc={(v,item) => {
									dispatch(assetsActions.changeTabSelectedIndex(v.key))
									
									if(v.key=='资产卡片'){
										dispatch(assetsActions.getAssetsListFetch())
										dispatch(assetsActions.getCardListFetch('1'))
									}else if(v.key=='资产类别'){
										dispatch(assetsActions.getAssetsListFetch())
									}
								}}
							/>
							{/* {titleTags.map(v =>
								<span
									key={v.category}
									className={`title-conleft ${tabSelectedIndex == v.category ? 'title-selectd' : ''}`}
									onClick={() => {
										dispatch(assetsActions.changeTabSelectedIndex(v.category))
										if(v.category=='资产卡片'){
											dispatch(assetsActions.getAssetsListFetch())
											dispatch(assetsActions.getCardListFetch('1'))
										}else if(v.category=='资产类别'){
											dispatch(assetsActions.getAssetsListFetch())
										}
									}}
									>
									{v.category}
								</span>
							)} */}
						</div>
					</div>
					<div className="flex-title-right">
						<Delete
							// configPermissionInfo={configPermissionInfo}
							disabledFlag={judgePermission(detailList.get('CUD_ASSETS')).disabled}
							style={{display: tabSelectedIndex == "资产卡片" ? 'none' : ''}}
							disabled={judgePermission(detailList.get('CUD_ASSETS')).disabled || (avtiveSortItemId.size == 0 ? true : false)}
							ButtonClick={() => dispatch(assetsActions.showDeleteSortModal())}
							visible={deleteSortModalStatus}
							tipText='删除的数据将不可恢复，请确认是否继续删除'
							onOk={() => dispatch(assetsActions.deleteSort(avtiveSortItemId))}
							onCancel={() => dispatch(assetsActions.closeDeleteSortModal())}
						/>
						<ImportModal
							tip={tip}
							message={assetsmessage}
							dispatch={dispatch}
							iframeload={assetsiframeload}
							// iframeName='assetsiframe'
							exportDisable={judgePermission(detailList.get('IMPORT_ASSETS_CATEGORY')).disabled || isPlay}
							failJsonList={[]}
							alertStr={"请选择要导入的资产类别文件"}
							showMessageMask={assetsshowMessageMask}
							successJsonList={[]}
							// actionPath={tabSelectedIndex=="资产卡片" ? `${ROOT}/excel/import/card?network=wifi&source=desktop` : `${ROOT}/excel/import/assets?network=wifi&source=desktop`}
							beforCallback={() => dispatch(assetsActions.beforeAssetsImport())}
							closeCallback={() => {
								dispatch(assetsActions.closeAssetsImportContent())
							}}
							afterCallback={() => dispatch(assetsActions.afterAssetsImport())}
							onSubmitCallBack={(form,openModal) => dispatch(assetsActions.getFileUploadFetch(form, 'assetClassImport',openModal))}
							importHaveProgress={true}
							importProgressInfo={assetsState.get('importProgressInfo')}
							clearProgress={() => {
								dispatch(assetsActions.changeMessageMask())
							}}
							>
							<Menu.Item key='2'>
								<ExportModal
									// hrefUrl={tabSelectedIndex=="资产卡片" ? `${ROOT}/excel/export/card?network=wifi&source=desktop` : `${ROOT}/excel/export/classification?network=wifi&source=desktop`}
									hrefUrl={`${ROOT}/excel/export/classification?${URL_POSTFIX}`}
									// exportDisable={!configPermissionInfo.getIn(['edit', 'permission']) || (tabSelectedIndex == "资产卡片" && avtiveItemId.size) || (tabSelectedIndex == "资产类别" && avtiveSortItemId.size)}
									exportDisable={judgePermission(detailList.get('EXPORT_ASSETS_CATEGORY')).disabled  || isPlay}
									ddCallback={(value) => {
										dispatch(allActions.allExportReceiverlist(value, 'excelclassification'))
									}}
									>
									导出
								</ExportModal>
							</Menu.Item>
						</ImportModal>
						{/* 资产类别按钮 */}
						<Button
							style={{display: tabSelectedIndex == "资产卡片" ? 'none' : ''}}
	                        className="title-right"
	                        type="ghost"
	                        onClick={() => {
								dispatch(assetsActions.getAssetsListFetch())
								dispatch(allActions.closeConfigPage('资产设置'))
							}}
	                        >
	                        刷新
	                    </Button>
	                </div>
				</FlexTitle>
				<TableWrap notPosition={true}>
					<Table
						sortList={sortList}
						dispatch={dispatch}
						assetslist={assetslist}
						sortItemStatus={sortItemStatus}
						sortCheckedAll={sortCheckedAll}
						assetsChildShow={assetsChildShow}
						selectAssetsAll={() => dispatch(assetsActions.selectAssetsClassAll())}
						selectClass={(value) => dispatch(assetsActions.selectAssetsClass(value))}
						AssetsConfigRowClick={(value) => dispatch(assetsActions.changeAssetschildshow(value))}
					/>
				</TableWrap>
				<AssetsCategoryOption
					classModalShow={classModalShow}
				/>
				{/* 提示信息 */}
				<AlertModal
					visible={showAssDisableModal}
					message={showAssDisableInfo}
					onOk={() => dispatch(assetsActions.cancelAssDisableModal())}
				/>
			</ContainerWrap>
		)
	}
}
