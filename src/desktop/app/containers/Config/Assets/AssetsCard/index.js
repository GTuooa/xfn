import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'

import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import Table from './Table'
import TreeContain from './TreeContain'
import AssetsCard from './AssetsCard.jsx'
import Delete from '../common/Delete'
import { ROOT } from 'app/constants/fetch.constant.js'
import { titleTags } from 'app/containers/Config/Assets/common/common.js'
import { Button, Icon, Input, Modal, message, Menu, Tooltip } from 'antd'
import { ImportModal, ExportModal, AlertModal, TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll, Tab } from 'app/components'
import { changeAssetsListDataToTree, changeLabelDataToTree } from 'app/utils'
import { judgePermission } from 'app/utils'
import './style.less'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'


@connect(state => state)
export default
class Assets extends React.Component {
	componentDidMount() {}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.assetsState != nextprops.assetsState || this.props.homeState != nextprops.homeState
	}

    render() {

        const { assetsState, dispatch, allState, homeState } = this.props

		// 资产类别和卡片列表（缩略）
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const CUD_ASSETS = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList','CUD_ASSETS'])
		const detailList = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList'])
        const assetslist = assetsState.get('assetslist')
		const cardList = assetsState.get('cardList')
		const cardItemStatus = assetsState.get('cardItemStatus')
		const labelTree = assetsState.get('labelTree')
		const currentSelectedKeys = assetsState.get('currentSelectedKeys').toJS()

		const currentSelectedTitle = assetsState.get('currentSelectedTitle')
		const period = allState.get('period')
		const openedyear = period.get('openedyear')
		const openedmonth = period.get('openedmonth')
		const closedyear = period.get('closedyear')
		const closedmonth = period.get('closedmonth')

		const tabSelectedIndex = assetsState.get('tabSelectedIndex')
		const avtiveItemId = assetsState.get('avtiveItemId')
		const deleteModalStatus = assetsState.getIn(['view','deleteModalStatus'])
		const cardCheckedAll = assetsState.getIn(['view','cardCheckedAll'])

		//是否显示卡片弹窗
		const showAssetsCard = assetsState.getIn(['flags', 'showAssetsCard'])
		// 卡片排序
        const sortByValue = assetsState.getIn(['flags', 'sortByValue'])
        const sortByStatus = assetsState.getIn(['flags', 'sortByStatus'])
		// 导入
		const assetsshowMessageMask = assetsState.getIn(['flags', 'assetsshowMessageMask'])
		const assetsiframeload = assetsState.getIn(['flags', 'assetsiframeload'])
		const assetsimportresponlist = assetsState.get('assetsimportresponlist')
		const failJsonList = assetsimportresponlist.get('failJsonList')
		const successJsonList = assetsimportresponlist.get('successJsonList')
		const assetsmessage = assetsState.get('assetsmessage')

		const compareyear = openedyear ? openedyear : (closedmonth == '12' ? Number(closedyear) + 1 : Number(closedyear))
		const comparemonth = openedmonth ? openedmonth : (closedmonth == '12' ? 1 : Number(closedmonth) + 1)

		//辅助核算禁用提示信息
		const showAssDisableModal = assetsState.getIn(['flags', 'showAssDisableModal'])
		const showAssDisableInfo = assetsState.getIn(['flags', 'showAssDisableInfo'])

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const tip = (
			<div>
				<div>资产设置 > 资产卡片 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据) 。</div>
				{/* <div className="onload"><a href={tabSelectedIndex=="资产卡片" ? `${ROOT}/excel/export/model?exportmodel=card` : `${ROOT}/excel/export/model?exportmodel=classification`}>1.下载模版</a></div> */}
				<div className="onload"><a href={tabSelectedIndex=="资产卡片" ? `https://www.xfannix.com/utils/template/%E8%B5%84%E4%BA%A7%E5%8D%A1%E7%89%87%E6%A8%A1%E6%9D%BF.xls` : `https://www.xfannix.com/utils/template/%E8%B5%84%E4%BA%A7%E7%B1%BB%E5%88%AB%E6%A8%A1%E6%9D%BF.xls`}>1.下载模版</a></div>
			</div>
		)

		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])

		return (
			<ContainerWrap type={"config-two"} className={'assets-category-config-wrap'}>
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
						</div>
					</div>
					<div className="flex-title-right">
						<Tooltip placement="bottom" title={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled ? '当前角色无该权限' : ''}>
							<Button
								disabled={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled}
								style={{display: tabSelectedIndex=="资产卡片" ? '' : 'none'}}
								className="title-right"
								type="ghost"
								onClick={() => {
									sessionStorage.setItem("assetsCardfrom", "Assets")
									//dispatch(homeActions.addTabpane('AssetsCardOption'))
									dispatch(assetsActions.showAssetsCard(true))
									dispatch(assetsActions.getCardNumberFetch())
								}}
							>
								新增
							</Button>
						</Tooltip>
						<Delete
							// configPermissionInfo={configPermissionInfo}
							disabledFlag={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled}
							disabled={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled || (avtiveItemId.size == 0 ? true : false)}
							style={{display: tabSelectedIndex=="资产卡片" ? '' : 'none'}}
							ButtonClick={() => dispatch(assetsActions.showDeleteModal())}
							visible={deleteModalStatus}
							tipText='删除的卡片将不可恢复，请确认是否继续删除'
							onOk={() => dispatch(assetsActions.deleteCard(avtiveItemId, currentSelectedKeys[0]))}
							onCancel={() => dispatch(assetsActions.closeDeleteModal())}
						/>
						<ImportModal
							tip={tip}
							message={assetsmessage}
							dispatch={dispatch}
							iframeload={assetsiframeload}
							// iframeName='assetsiframe'
							exportDisable={judgePermission(detailList.get('IMPORT_ASSETS_CARD')).disabled || isPlay}
							failJsonList={[]}
							alertStr={"请选择要导入的资产卡片文件"}
							showMessageMask={assetsshowMessageMask}
							successJsonList={[]}
							// actionPath={tabSelectedIndex=="资产卡片" ? `${ROOT}/excel/import/card?network=wifi&source=desktop` : `${ROOT}/excel/import/assets?network=wifi&source=desktop`}
							beforCallback={() => dispatch(assetsActions.beforeAssetsImport())}
							closeCallback={() => {
								dispatch(assetsActions.closeAssetsImportContent())
							}}
							afterCallback={() => dispatch(assetsActions.afterAssetsImport())}
							onSubmitCallBack={(form,openModal) => dispatch(assetsActions.getFileUploadFetch(form, 'assetCardImport',openModal))}
							importHaveProgress = {true}
							importProgressInfo = {assetsState.get('importProgressInfo')}
							clearProgress = {() => {
								dispatch(assetsActions.changeMessageMask())
							}}
							>
							<Menu.Item key='2'>

								<ExportModal
									hrefUrl={`${ROOT}/excel/export/card?${URL_POSTFIX}`}
									// exportDisable={!configPermissionInfo.getIn(['edit', 'permission']) || (tabSelectedIndex == "资产卡片" && avtiveItemId.size) || (tabSelectedIndex == "资产类别" && avtiveSortItemId.size)}
									exportDisable={judgePermission(detailList.get('EXPORT_ASSETS_CARD')).disabled || isPlay}
									ddCallback={(value) => {
										dispatch(allActions.allExportReceiverlist(value, 'excelcard'))
									}}
									>
									导出
								</ExportModal>
							</Menu.Item>
						</ImportModal>
						{/* 资产类别按钮 */}
						<Button
	                        className="title-right"
	                        type="ghost"
	                        onClick={() => {
								dispatch(assetsActions.getAssetsListFetch())
								dispatch(assetsActions.getCardListFetch('1'))//currentSelectedKeys[0]
								dispatch(allActions.closeConfigPage('资产设置'))
							}}
	                        >
	                        刷新
	                    </Button>
	                </div>
				</FlexTitle>
				<TableWrap className={"table-max-width-third-flex"} notPosition={true}>
					<Table
						cardList={cardList}
						dispatch={dispatch}
						sortByValue={sortByValue}
						sortByStatus={sortByStatus}
						compareyear={compareyear}
						comparemonth={comparemonth}
						cardItemStatus={cardItemStatus}
						cardCheckedAll={cardCheckedAll}
					/>
					<TreeContain
						dispatch={dispatch}
						initAssetsList={assetslist}
						assetslist={changeAssetsListDataToTree(assetslist.toJS())}
						labelTreeList={changeLabelDataToTree(labelTree.toJS())}
						currentSelectedKeys={currentSelectedKeys}
						currentSelectedTitle={currentSelectedTitle}
					/>

				</TableWrap>
				{/* 提示信息 */}
				<AlertModal
					visible={showAssDisableModal}
					message={showAssDisableInfo}
					onOk={() => dispatch(assetsActions.cancelAssDisableModal())}
				/>
				{ showAssetsCard ? <AssetsCard/> : ''}
			</ContainerWrap>
		)
	}
}
