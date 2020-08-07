import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Modal } from 'antd'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import * as Limit from 'app/constants/Limit.js'

import Title from './Title.jsx'
import Table from './Table.jsx'
import AddHypeTypeModal from './AddHypeTypeModal'
import AddCardTypeModal from './AddCardTypeModal'
import AddCardModal from './AddCardModal'
import AdjustAllCardlistModal from './AdjustAllCardListModal'
import BatchManageModal from './BatchManageModal'

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'

@connect(state => state)
export default
class InventoryConf extends React.Component {

	static displayName = 'InventoryConf'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showHighTypeModal: false,
			showCardTypeModal: false,
			showCardModal: false,
			showAdjustAllCardListModal:false
		}
	}

	componentDidMount() {
		this.props.dispatch(inventoryConfActions.getInventoryConfigInit())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.inventoryConfState !== nextprops.inventoryConfState || this.props.inventoryCardState !== nextprops.inventoryCardState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, inventoryConfState, homeState, allState, inventoryCardState } = this.props
		const { showHighTypeModal, showCardTypeModal, showCardModal, showAdjustAllCardListModal } = this.state
		const isJz = allState.getIn(['period','closedyear'])
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const openQuantity = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('QUANTITY') > -1
		const BATCH = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('BATCH') > -1
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const Psi = homeState.getIn(['data', 'userInfo', 'moduleInfo', 'PSI'])
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

		const originTags = inventoryConfState.get('originTags')
		const cardList = inventoryConfState.get('cardList')
		const importresponlist = inventoryConfState.get('importresponlist')
		const logMessage = inventoryConfState.get('message')
		const typeTree = inventoryConfState.get('typeTree')
		const inventoryHighTypeTemp = inventoryConfState.get('inventoryHighTypeTemp')
		const inventoryCardTypeTemp = inventoryConfState.get('inventoryCardTypeTemp')
		const inventorySettingBtnStatus = inventoryConfState.get('inventorySettingBtnStatus')

		const views = inventoryConfState.get('views')
		const activeTapKey = views.get('activeTapKey')
		const searchContent = views.get('searchContent')
		const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
		const activeTapKeyUuid = views.get('activeTapKeyUuid')
		const activeInventoryType = views.get('activeInventoryType')
		const activeInventoryTypeUuid = views.get('activeInventoryTypeUuid')
		const activeTreeKeyUuid = views.get('activeTreeKeyUuid')
		const insertOrModify = views.get('insertOrModify')
		const typeTreeSelectList = views.get('typeTreeSelectList')
		const cardSelectList = views.get('cardSelectList')
		const selectTypeId = views.get('selectTypeId')
		const selectTypeName = views.get('selectTypeName')
		const iframeload = views.get('iframeload')
		const showMessageMask = views.get('showMessageMask')
		const curNumber = views.get('curNumber')
		const totalNumber = views.get('totalNumber')
		const importKey = views.get('importKey')
		const materialModal = views.get('materialModal')
		const activeUuid = views.get('activeUuid')
		const currentPage = views.get('currentPage')
		const pageCount = views.get('pageCount')
		const batchManageModal = inventoryCardState.getIn(['views','batchManageModal'])
		const batchList = inventoryCardState.getIn(['views','batchList'])
		const batchUuid = inventoryCardState.getIn(['views','batchUuid'])
		const openShelfLife = inventoryCardState.getIn(['views','openShelfLife'])
		const shelfLife = inventoryCardState.getIn(['views','shelfLife'])
		const anotherTabName = Limit.ALL_TAB_NAME_STR
		const adjustBtnHide = activeTapKey === anotherTabName ? true : false

		return (
			<ContainerWrap type="config-one" className="inventory-conf">
				<Title
					dispatch={dispatch}
					originTags={originTags}
					activeTapKey={activeTapKey}
					activeTapKeyUuid={activeTapKeyUuid}
					isSpread={isSpread}
					pageList={pageList}
					URL_POSTFIX={URL_POSTFIX}
					editPermission={editPermission}
					openHighTypeModal={() => this.setState({showHighTypeModal: true})}
					openCardModal={() => this.setState({showCardModal: true})}
					cardSelectList={cardSelectList}
					adjustBtnHide={adjustBtnHide}
					iframeload={iframeload}
					importresponlist={importresponlist}
					showMessageMask={showMessageMask}
					curNumber={curNumber}
					totalNumber={totalNumber}
					importKey={importKey}
					treeList={typeTree}
					isPlay={isPlay}
					logMessage={logMessage}
					enableWarehouse={enableWarehouse}
					openQuantity={openQuantity}
					newJr={newJr}
					currentPage={currentPage}
					selectTypeId={selectTypeId}
					selectTypeName={selectTypeName}
					views={views}
					openAdjustAllCardListModal={()=>this.setState({showAdjustAllCardListModal:true})}
				/>
				<Table
					dispatch={dispatch}
					activeTapKey={activeTapKey}
					anotherTabName={anotherTabName}
					cardList={cardList}
					cardSelectList={cardSelectList}
					editPermission={editPermission}
					selectTypeId={selectTypeId}
					selectTypeName={selectTypeName}
					treeList={typeTree}
					originTags={originTags}
					activeTapKeyUuid={activeTapKeyUuid}
					showModal={() => this.setState({showCardTypeModal: true})}
					showCardModal={() => this.setState({showCardModal: true})}
					searchContent={searchContent}
					openQuantity={openQuantity}
					BATCH={BATCH}
					Psi={Psi}

					currentPage={currentPage}
					pageCount={pageCount}
				/>
				<AddHypeTypeModal
					editPermission={editPermission}
					showModal={showHighTypeModal}
					closeModal={() => this.setState({showHighTypeModal: false})}
					dispatch={dispatch}
					// tags={tags}
					originTags={originTags}
					activeTapKey={activeTapKey}
					activeTapKeyUuid={activeTapKeyUuid}
					anotherTabName={anotherTabName}
					activeInventoryType={activeInventoryType}
					inventoryHighTypeTemp={inventoryHighTypeTemp}
				/>
				<AddCardTypeModal
					editPermission={editPermission}
					showModal={showCardTypeModal}
					closeModal={() => this.setState({showCardTypeModal: false})}
					dispatch={dispatch}
					inventoryCardTypeTemp={inventoryCardTypeTemp}
					typeTreeSelectList={typeTreeSelectList}
					inventorySettingBtnStatus={inventorySettingBtnStatus}
					activeTapKeyUuid={activeTapKeyUuid}
					treeList={typeTree}
					originTags={originTags}
				/>
				{
					showCardModal?
					<AddCardModal
						isJz={isJz}
						showModal={showCardModal}
						closeModal={() => {
							this.setState({showCardModal: false})
							dispatch(editInventoryCardActions.initInventoryCard())
							}}
						dispatch={dispatch}
						enableWarehouse={enableWarehouse}
						Psi={Psi}
						fromPage={'inventoryConfig'}
						cardList={cardList}
						originTags={originTags}
					/>:''
				}
				<AdjustAllCardlistModal
					showModal={showAdjustAllCardListModal}
					closeModal={() => this.setState({showAdjustAllCardListModal: false})}
					cardSelectList={cardSelectList}
					originTags={originTags}
					dispatch={dispatch}
				/>
				<Modal
					visible={materialModal}
					title={'关闭组装'}
					onCancel={() => {
						dispatch(inventoryConfActions.changeViews('materialModal',false))
					}}
					footer={
						[
							<Button onClick={() => {
								dispatch(inventoryConfActions.changeViews('materialModal',false))
							}}>取消</Button>,
							<Button onClick={() => {
								dispatch(inventoryConfActions.changeViews('materialModal',false))
								dispatch(inventoryConfActions.modifyInventoryAssemblyStatus(activeUuid,false))
							}}
							type='primary'
							>确认关闭</Button>
						]
					}
				>
					<span>关闭组装后，组装单设置内容会被清空。</span>
				</Modal>
				<BatchManageModal
					visible={batchManageModal}
					batchList={batchList}
					batchUuid={batchUuid}
					openShelfLife={openShelfLife}
					dispatch={dispatch}
					shelfLife={shelfLife}
				/>
			</ContainerWrap>
		)
	}
}
