import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Button, Menu, Modal, message, Input, Dropdown } from 'antd'
const Search = Input.Search
import { UpperClassSelect, SelectAc, ExportModal, Tab, Icon } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
// import ImportModal from '../components/ImportModal'
// import { ROOTPKT } from 'app/constants/fetch.account.js'
import RegretModal from 'app/components/RegretModal'
import * as Limit from 'app/constants/Limit.js'

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'
import * as editProjectCardActions from 'app/redux/Config/Project/editProjectCard.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

@immutableRenderDecorator
export default
class Title extends React.Component {

	static displayName = 'ProjectConfTitle'

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
			// URL_POSTFIX,
			editPermission,
			openHighTypeModal,
			openCardModal,
			cardSelectList,
			adjustBtnHide,
			// iframeload,
			// importresponlist,
			// showMessageMask,
			// curNumber,
			// totalNumber,
			// importKey,
			treeList,
			// logMessage,
			isPlay,
			views
		} = this.props
		const { adjustModal, cardTypeName, cardTypeUuid, regretModal } = this.state

		// const failJsonList = importresponlist.get('failJsonList')
		// const successJsonList = importresponlist.get('successJsonList')
		// const allSize = importresponlist.get('allSize')
		// const errorSize = importresponlist.get('errorSize')
		// const successSize = importresponlist.get('successSize')
		// const mediaId = importresponlist.get('mediaId')
		//
		// const tip = (
		// 	<div>
		// 		<div>存货设置 > Excel导入</div>
		// 		<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
		// 		<div className="import-mask-tip">温馨提示</div>
		// 		<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据)；</div>
		// 		<div className="onload"><a href={`${ROOTPKT}/data/export/model?${URL_POSTFIX}&exportModel=stock`}>1.下载模版</a></div>
		// 	</div>
		// )
		const cardList = views.get('cardList')
		const regretResultList = views.get('regretResultList')
		const regretResultIndex = views.get('regretResultIndex')
		const regretResultKey = views.get('regretResultKey')
		const usedCardList = views.get('usedCardList')
		const cardTypeList = views.get('cardTypeList')
		const parentUuid = views.get('parentUuid')
		const searchContent = views.get('searchContent')
		const selectTypeId = views.get('selectTypeId')
		const selectTypeName = views.get('selectTypeName')
		const regretPages = views.get('regretPages') || 1
		const currentPage = views.get('currentPage') || 1
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
						addButton={editPermission}
						tabList={originTags.toJS().map(v => ({key:v.name,value:v.name,item:v}))}
						activeKey={activeTapKey}
						tabFunc={(v,item) => {
							dispatch(projectConfActions.changeProjectActiveHighType(fromJS(item)))
						}}
						addFunc={() => {
							const tabKey = activeTapKey === '全部'? originTags.getIn([1,'name']):activeTapKey
							const uuid = activeTapKeyUuid || originTags.getIn([1,'uuid'])

							let value = {
								name:tabKey,
								uuid:uuid,
							}
							dispatch(projectConfActions.getProjectHighTypeOne(value, openHighTypeModal))
						}}
					/>
					{/* {originTags.map((v,index) =>
						<span
							key={v.get('uuid')}
							className={`title-conleft ${activeTapKey == v.get('name') ? 'title-selectd' : ''}`}
							onClick={() => dispatch(projectConfActions.changeProjectActiveHighType(v))}
						>
							{v.get('name')}
						</span>
					)}
					{
						editPermission ?
						<span
							onClick={() => {
								const tabKey = activeTapKey === '全部'? originTags.getIn([1,'name']):activeTapKey
								const uuid = activeTapKeyUuid || originTags.getIn([1,'uuid'])

								let value = {
									name:tabKey,
									uuid:uuid,
								}
								dispatch(projectConfActions.getProjectHighTypeOne(value, openHighTypeModal))
							}}
							className={'title-conleft'}
						>
							<Icon type="plus" />
						</span> : ''
					} */}
					<Search
						className='config-search-tree'
						placeholder="搜索项目"
						style={{height: '28px'}}
						onSearch={(value) =>{
						const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
						if (!parentUuid || !selectTypeId) {
							dispatch(projectConfActions.refreshProjectList(currentItem,currentPage,value))
						} else {
							dispatch(projectConfActions.getProjectCardListByType(parentUuid, selectTypeId, selectTypeName,currentPage,value))

						}
					}}/>
				</div>
				<div className="flex-title-right">
					<Button
						className="title-right"
						type="ghost"
						disabled={!editPermission}
						onClick={() => {
							dispatch(editProjectCardActions.beforeProjectAddCard(openCardModal, originTags))
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
							dispatch(editProjectCardActions.deleteProjectCardList())
						}}
						disabled={cardSelectList.size > 0 && editPermission ? false : true}
					>
						删除
					</Button>
					<div className="title-right">
						<span className="title-right title-dropdown" style={{margin: 0}}>
						<Dropdown overlay={
							<Menu>
								<Menu.Item
									onClick={()=> {
										this.setState({regretModal:true})
										dispatch(projectConfActions.getRegretCategoryTree(originTags.get(0),1))
									}}
									>
									<span className="setting-common-ant-dropdown-menu-item">
										反悔模式
									</span>
								</Menu.Item>
							</Menu>
						}>
							<span>更多 <Icon className="title-dropdown-icon" type="down"/></span>
						</Dropdown>
						</span>
					</div>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
							if (!parentUuid || !selectTypeId) {
								dispatch(projectConfActions.refreshProjectList(currentItem,currentPage,searchContent))
							} else {
								dispatch(projectConfActions.getProjectCardListByType(parentUuid, selectTypeId, selectTypeName,currentPage,searchContent))

							}
							dispatch(allActions.closeConfigPage('项目设置'))
						}}
					>
						刷新
					</Button>
					{/* <ImportModal
						tip={tip}
						message={logMessage}
						dispatch={dispatch}
						exportDisable={!editPermission || isPlay}
						iframeload={iframeload}
						alertStr="请选择要导入的往来单位文件"
						failJsonList={failJsonList}
						showMessageMask={showMessageMask}
						successJsonList={successJsonList}
						beforCallback={() => dispatch(projectConfActions.beforeCHImport())}
						closeCallback={() => dispatch(projectConfActions.closeVcImportContent())}
						onSubmitCallBack={(from) => dispatch(projectConfActions.getFileUploadFetch(from))}
						ddImportCallBack={value => dispatch(projectConfActions.exportReceiverlist(value))}
						curNumber={curNumber}
						totalNumber={totalNumber}
						allSize={allSize}
						errorSize={errorSize}
						successSize={successSize}
						hrefUrl={`${ROOTPKT}/data/download/stock/error?`}
						importKey={importKey}
					>
						<Menu.Item key='2' disabled={!editPermission} >
							<ExportModal
								hrefUrl={`${ROOTPKT}/data/export/stock?${URL_POSTFIX}`}
								exportDisable={!editPermission || isPlay}
								ddCallback={() => dispatch(projectConfActions.exportToNotification())}
								>
								导出
							</ExportModal>
						</Menu.Item>
					</ImportModal> */}

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
									dispatch(projectConfActions.adjustProjectCardTyepList(cardTypeName, cardTypeUuid, adjustModal))
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
						fromPage='project'
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
						// downloadResult={(key) => {
						// 	dispatch(projectConfActions.downloadResult(key))
						// }}
						downloadBefore={(cardList) => {
							dispatch(projectConfActions.downloadBefore(cardList))
						}}
						changeCategoryFunc={(item,currentPage,cb) => {
							dispatch(projectConfActions.getRegretCategoryTree(item,currentPage,cb))
						}}
						regretFunc={(cardList) => {
							dispatch(projectConfActions.regretCode(cardList))
						}}
						checkUsed={(checkList) => {
							dispatch(projectConfActions.checkUsed(checkList))
						}}
					/>:''
				}
			</FlexTitle>
		)
	}
}
