import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Button, Menu, Icon, Modal, message, Input } from 'antd'
const Search = Input.Search
import { UpperClassSelect, SelectAc, ExportModal, Tab } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
// import ImportModal from '../components/ImportModal'
import { ROOTPKT } from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import RegretModal from 'app/components/RegretModal'
import ImportInitialValue from './ImportInitialValue'

import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

@immutableRenderDecorator
export default
class Title extends React.Component {

	static displayName = 'InventoryConfTitle'

	constructor() {
		super()
		this.state = {
			adjustModal : false,
			cardTypeName:'',
			cardTypeUuid:'',
			regretModal:false
		}
	}

	render() {
		const {
			dispatch,
			originTags,
			activeTapKey,
			activeTapKeyUuid,
			isSpread,
			pageList,
			URL_POSTFIX,
			editPermission,
			openHighTypeModal,
			openCardModal,
			cardSelectList,
			adjustBtnHide,
			iframeload,
			importresponlist,
			showMessageMask,
			curNumber,
			totalNumber,
			importKey,
			treeList,
			logMessage,
			isPlay,
			enableWarehouse,
			openAdjustAllCardListModal,
			openQuantity,
			newJr,
			currentPage,
			selectTypeId,
			selectTypeName,
			views
		} = this.props
		const { adjustModal, cardTypeName, cardTypeUuid, regretModal } = this.state

		const failJsonList = importresponlist.get('failJsonList')
		const successJsonList = importresponlist.get('successJsonList')
		const allSize = importresponlist.get('allSize')
		const errorSize = importresponlist.get('errorSize')
		const successSize = importresponlist.get('successSize')
		const mediaId = importresponlist.get('mediaId')
		const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
		const cardList = views.get('cardList')
		const regretResultList = views.get('regretResultList')
		const regretResultIndex = views.get('regretResultIndex')
		const regretResultKey = views.get('regretResultKey')
		const usedCardList = views.get('usedCardList')
		const cardTypeList = views.get('cardTypeList')
		const regretPages = views.get('regretPages') || 1

		const tip = (
			<div>
				<div>存货设置 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据)；</div>
				<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E5%AD%98%E8%B4%A7%E8%AE%BE%E7%BD%AE%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls`}>1.下载模版</a></div>
			</div>
		)

		return (
			<FlexTitle>
				<div className="flex-title-left flex-title-left-min-width">
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
						addButton={editPermission}
						tabList={originTags.toJS().map(v => ({key:v.name,value:v.name,item:v}))}
						activeKey={activeTapKey}
						tabFunc={(v,item) => {
							dispatch(inventoryConfActions.changeInventoryActiveHighType(fromJS(item),1))
						}}
						addFunc={() => {
							dispatch(inventoryConfActions.beforeEditInventoryHighType(openHighTypeModal))
						}}
					/>
					{/* {
						editPermission ?
						<span
							onClick={() => {
								dispatch(inventoryConfActions.beforeEditInventoryHighType(openHighTypeModal))
							}}
							className={'title-conleft'}
						>
							<Icon type="plus" />
						</span> : ''
					} */}
					<Search style={{height:"28px"}} className='config-search-tree' placeholder="搜索存货"  onSearch={(value) =>{
						activeTapKey === '全部'?
						dispatch(inventoryConfActions.refreshInventoryList(currentItem, 1,value))
						:
						dispatch(inventoryConfActions.getInventoryCardListByType(activeTapKeyUuid, selectTypeId, selectTypeName,1,value))
					}}/>
				</div>
				<div className="flex-title-right">
					<Button
						className="title-right"
						type="ghost"
						disabled={!editPermission}
						onClick={() => {
							dispatch(editInventoryCardActions.beforeInventoryAddCard(openCardModal, originTags))
						}}
					>
						新增
					</Button>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							this.setState({adjustModal: true, cardTypeName: '', cardTypeUuid: ''})
						}}
						disabled={cardSelectList.size > 0 && editPermission ? false : true}
						style={{display: adjustBtnHide ? 'none' : ''}}
					>
						调整
					</Button>
					<Button
						className="title-right"
						type="ghost"
						disabled={!editPermission}
						onClick={() => {
							dispatch(editInventoryCardActions.deleteInventoryCardList())
						}}
						disabled={cardSelectList.size > 0 && editPermission ? false : true}
					>
						删除
					</Button>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							dispatch(inventoryConfActions.adjustAllRelativeCardList(openAdjustAllCardListModal))
						}}
						style={{display: adjustBtnHide ? '' : 'none'}}
						disabled={cardSelectList.size > 0 && editPermission ? false : true}
					>
						调整
					</Button>
					<ImportInitialValue
						// tip={tip}
						message={logMessage}
						dispatch={dispatch}
						exportDisable={!editPermission || isPlay}
						iframeload={iframeload}
						alertStr="请选择要导入的存货文件"
						failJsonList={failJsonList}
						showMessageMask={showMessageMask}
						successJsonList={successJsonList}
						beforCallback={() => dispatch(inventoryConfActions.beforeCHImport())}
						closeCallback={() => dispatch(inventoryConfActions.closeVcImportContent())}
						onSubmitCallBack={(from) => dispatch(inventoryConfActions.getFileUploadFetch(from))}
						onSubmitInitialCallBack={(from) => dispatch(inventoryConfActions.getFileUploadInitialFetch(from))}
						ddImportCallBack={value => dispatch(inventoryConfActions.exportReceiverlist(value))}
						curNumber={curNumber}
						totalNumber={totalNumber}
						allSize={allSize}
						errorSize={errorSize}
						successSize={successSize}
						hrefUrl={`${ROOTPKT}/data/download/stock/error?${URL_POSTFIX}`}
						hrefUrlexport={`${ROOTPKT}/data/download/stock/error?${URL_POSTFIX}`}
						InitialExporthrefUrl={`${ROOTPKT}/data/download/stock/open/error?${URL_POSTFIX}`}
						importKey={importKey}
						openQuantity={openQuantity}
						enableWarehouse={enableWarehouse}
					>
						<Menu.Item key='3' disabled={!editPermission}>
							<ExportModal
								style={{color: 'rgb(34, 34, 34)'}}
								typeInitial='stoke'
								hrefUrlValue={`${ROOTPKT}/data/export/stock?${URL_POSTFIX}`}
								hrefUrlInitial={`${ROOTPKT}/data/export/stock/open?${URL_POSTFIX}`}
								exportDisable={!editPermission || isPlay}
								ddCallback={(value) => {dispatch(inventoryConfActions.exportToNotification(value, 'chExport'))}}
								ddInitialCallback={(value) => {dispatch(inventoryConfActions.exportToNotification(value, 'chExportInitial'))}}
								openQuantity={openQuantity}
								enableWarehouse={enableWarehouse}
								>
								导出
							</ExportModal>
						</Menu.Item>
						<Menu.Item
							onClick={()=> {
								this.setState({regretModal:true})
								dispatch(inventoryConfActions.getRegretCategoryTree(originTags.get(0),1))
							}}
						>
							<span className="setting-common-ant-dropdown-menu-item">
								反悔模式
							</span>
						</Menu.Item>
					{/* </ImportModal> */}
					</ImportInitialValue>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
							dispatch(inventoryConfActions.refreshInventoryList(currentItem))
							dispatch(allActions.closeConfigPage('存货设置'))
						}}
					>
						刷新
					</Button>
				</div>
				<Modal
					title={'调整'}
					visible={adjustModal}
					onCancel={()=> this.setState({adjustModal:false})}
					footer={[
						<Button
							key="cancel"
							type="ghost"
							onClick={() => this.setState({adjustModal:false})}>
							取 消
						</Button>,
						<Button
							key="ok"
							type={'primary'}
							disabled={!editPermission}
							onClick={() => {
								if (cardTypeUuid === '') {
									message.info('请选择调整类别')
								} else {
									const adjustModal = () => {
										this.setState({adjustModal: false})
									}
									dispatch(inventoryConfActions.adjustInventoryCardTyepList(cardTypeName, cardTypeUuid, adjustModal))
								}
							}}
						>
							确 定
						</Button>,
					]}
				>
					<div className="jxc-config-card-modal-wrap">
						<div className="jxc-config-card-modal-row">
							<div className="jxc-config-card-modal-item">
								<label className="jxc-config-card-modal-label">所属类别：</label>
								<div className="jxc-config-card-modal-input">
									<UpperClassSelect
										className='jxc-config-modal-select'
										treeData={treeList}
										disabled={false}
										disabledEnd={true}
										treeDefaultExpandAll={true}
										value={cardTypeName}
										disabledParent={true}
										onSelect={value => {
											const valueList = value.split(Limit.TREE_JOIN_STR)
											const cardTypeName = valueList[1]
											const cardTypeUuid = valueList[0]
											this.setState({
												cardTypeName,
												cardTypeUuid
											})
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</Modal>
				{
					regretModal?
					<RegretModal
						maskClosable={false}
						visible={regretModal}
						fromPage='inventory'
						categoryList={originTags}
						cardList={cardList}
						regretPages={regretPages}
						onCancel={() => this.setState({regretModal:false})}
						open={() => this.setState({regretModal:true})}
						regretResultList={regretResultList}
						regretResultIndex={regretResultIndex}
						regretResultKey={regretResultKey}
						usedCardList={usedCardList}
						cardTypeList={cardTypeList}
						downloadResult={(key) => {
							dispatch(inventoryConfActions.downloadResult(key))
						}}
						downloadBefore={(cardList) => {
							dispatch(inventoryConfActions.downloadBefore(cardList))
						}}
						changeCategoryFunc={(item,currentPage,cb) => {
							dispatch(inventoryConfActions.getRegretCategoryTree(item,currentPage,cb))
						}}
						regretFunc={(cardList) => {
							dispatch(inventoryConfActions.regretCode(cardList))
						}}
						checkUsed={(checkList) => {
							dispatch(inventoryConfActions.checkUsed(checkList))
						}}
					/>:''
				}
			</FlexTitle>
		)
	}
}
