import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { fromJS } from 'immutable'
import './style/index.less'

import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { ExportModal} from 'app/components'
import { Button, Menu } from 'antd'
import thirdParty from 'app/thirdParty'
import { ROOTPKT } from 'app/constants/fetch.account.js'

import Table from './Table'
import ImportModal from '../components/ImportModal'
import WarehouseModifyModal from './WarehouseModifyModal'

import * as warehouseConfigActions from 'app/redux/Config/warehouseConfig/warehouseConfig.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class AccountCongig extends React.Component {

	static displayName = 'WarehouseModifyModal'

	constructor() {
		super()
		this.state = {
			showModal: false
		}
	}

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

	componentDidMount() {
		this.props.dispatch(warehouseConfigActions.getWarehouseTree(true))
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.warehouseConfigState != nextprops.warehouseConfigState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, allState, accountConfigState, homeState, warehouseConfigState } = this.props
		const { showModal } = this.state

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const warehouseTemp = warehouseConfigState.get('warehouseTemp')
		const views = warehouseConfigState.get('views')
		const selectItem = views.get('selectItem')
		const logMessage = warehouseConfigState.get('message')
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const iframeload = views.get('iframeload')
		const importresponlist = warehouseConfigState.get('importresponlist')
		const failJsonList = importresponlist.get('failJsonList')
		const successJsonList = importresponlist.get('successJsonList')
		const allSize = importresponlist.get('allSize')
		const errorSize = importresponlist.get('errorSize')
		const successSize = importresponlist.get('successSize')
		const showMessageMask = views.get('showMessageMask')
		const curNumber = views.get('curNumber')
		const totalNumber = views.get('totalNumber')
		const importKey = views.get('importKey')
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		// selectAll checkBox是否全选
		const tip = (
			<div>
				<div>仓库设置 > Excel导入</div>
				<div>1.下载模版 > 2.导入Excel > 3.导入完毕</div>
				<div className="import-mask-tip">温馨提示</div>
				<div>请下载统一的模版，并按相应的格式在Excel软件中填写您的业务数据，然后再导入到系统中(系统将自动读取Excel中的第一个sheet作为导入数据)；</div>
				<div className="onload"><a href={`https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/template/%E4%BB%93%E5%BA%93%E8%AE%BE%E7%BD%AE%E6%A8%A1%E7%89%88.xls`}>1.下载模版</a></div>
			</div>
		)

		return (
			<ContainerWrap type="config-one" className="warehouse-config">
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
					</div>
					<div className="flex-title-right">
						<Button
							disabled={!editPermission}
							className="title-right"
							type="ghost"
							onClick={() => {

								dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('warehouse','insertParentDisabled',true))
								dispatch(warehouseConfigActions.beforeInsertWarehouseCard(() => this.setState({showModal: true})))
								dispatch(warehouseConfigActions.changeWarehouseConfingCommonViews('insertOrModify','insert'))
							}}
							>
							新增
						</Button>
						<Button
							disabled={!editPermission || !selectItem.size}
							className="title-right"
							type="ghost"
							onClick={() => selectItem.size && dispatch(warehouseConfigActions.deleteWarehouseCard(selectItem.toJS()))}
						>
							删除
						</Button>
						<ImportModal
							tip={tip}
							message={logMessage}
							dispatch={dispatch}
							exportDisable={!editPermission || isPlay}
							iframeload={iframeload}
							alertStr="请选择要导入的仓库文件"
							failJsonList={failJsonList}
							showMessageMask={showMessageMask}
							successJsonList={successJsonList}
							beforCallback={() => dispatch(warehouseConfigActions.beforeCkImport())}
							closeCallback={() => dispatch(warehouseConfigActions.closeVcImportContent())}
							onSubmitCallBack={(from) => dispatch(warehouseConfigActions.getFileUploadFetch(from))}
							// onSubmitInitialCallBack={(from) => dispatch(warehouseConfigActions.getFileUploadInitialFetch(from))}
							// ddImportCallBack={value => dispatch(warehouseConfigActions.exportReceiverlist(value))}
							curNumber={curNumber}
							totalNumber={totalNumber}
							allSize={allSize}
							errorSize={errorSize}
							successSize={successSize}
							hrefUrl={`${ROOTPKT}/data/download/warehouse/error?${URL_POSTFIX}`}
							hrefUrlexport={`${ROOTPKT}/data/download/warehouse/error?${URL_POSTFIX}`}
							InitialExporthrefUrl={`${ROOTPKT}/data/download/warehouse/error?${URL_POSTFIX}`}
							importKey={importKey}
						>
							<Menu.Item key='3' disabled={!editPermission}>
								<ExportModal
									style={{color: 'rgb(34, 34, 34)'}}
									typeInitial='stoke'
									hrefUrlValue={`${ROOTPKT}/data/export/warehouse?${URL_POSTFIX}`}
									// hrefUrlInitial={`${ROOTPKT}/data/export/stock/open?${URL_POSTFIX}`}
									exportDisable={!editPermission || isPlay}
									ddCallback={(value) => {dispatch(warehouseConfigActions.exportToNotification())}}
									// ddInitialCallback={(value) => {dispatch(warehouseConfigActions.exportToNotification())}}
									>
									导出
								</ExportModal>
							</Menu.Item>
						</ImportModal>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => this.props.dispatch(warehouseConfigActions.getWarehouseTree())}
							>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<Table
					dispatch={dispatch}
					showModal={() => this.setState({showModal: true})}
					warehouseTemp={warehouseTemp}
					views={views}
				/>
				<WarehouseModifyModal
					dispatch={dispatch}
					showModal={showModal}
					onClose={() => this.setState({showModal: false})}
				/>
			</ContainerWrap>
		)
	}
}
