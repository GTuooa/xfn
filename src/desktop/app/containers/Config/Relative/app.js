import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message } from 'antd'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import * as Limit from 'app/constants/Limit.js'

import Title from './Title.jsx'
import Table from './Table.jsx'
import AddHypeTypeModal from './AddHypeTypeModal'
import AddCardTypeModal from './AddCardTypeModal'
import AddCardModal from './AddCardModal'
import AdjustAllCardlistModal from './AdjustAllCardListModal'

import * as relativeConfActions from 'app/redux/Config/Relative/relative.action.js'

@connect(state => state)
export default
class RelativeConf extends React.Component {

	static displayName = 'RelativeConf'

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
		this.props.dispatch(relativeConfActions.getRelativeConfInit())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.relativeConfState !== nextprops.relativeConfState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, relativeConfState, homeState } = this.props
		const { showHighTypeModal, showCardTypeModal, showCardModal ,showAdjustAllCardListModal } = this.state

		//console.log('relativeConfState');

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

		const originTags = relativeConfState.get('originTags')
		const cardList = relativeConfState.get('cardList')
		const importresponlist = relativeConfState.get('importresponlist')
		const logMessage = relativeConfState.get('message')
		const typeTree = relativeConfState.get('typeTree')
		const relativeHighTypeTemp = relativeConfState.get('relativeHighTypeTemp')
		const relativeTypeTemp = relativeConfState.get('relativeTypeTemp')
		const relativeTypeBtnStatus = relativeConfState.get('relativeTypeBtnStatus')

		const views = relativeConfState.get('views')
		const activeTapKey = views.get('activeTapKey')
		const searchContent = views.get('searchContent')
		const activeTapKeyUuid = views.get('activeTapKeyUuid')
		const activeRelativeType = views.get('activeRelativeType')
		const activeRelativeTypeUuid = views.get('activeRelativeTypeUuid')
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
		const currentPage = views.get('currentPage')
		const pageCount = views.get('pageCount')

		const anotherTabName = Limit.ALL_TAB_NAME_STR
		const adjustBtnHide = activeTapKey === anotherTabName ? true : false

		return (
			<ContainerWrap type="config-one" className="relative-conf">
				<Title
					dispatch={dispatch}
					// tags={tags}
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
					views={views}
					currentPage={currentPage}
					selectTypeId={selectTypeId}
					selectTypeName={selectTypeName}
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
					activeRelativeType={activeRelativeType}
					relativeHighTypeTemp={relativeHighTypeTemp}
				/>
				<AddCardTypeModal
					editPermission={editPermission}
					showModal={showCardTypeModal}
					closeModal={() => this.setState({showCardTypeModal: false})}
					dispatch={dispatch}
					relativeTypeTemp={relativeTypeTemp}
					typeTreeSelectList={typeTreeSelectList}
					relativeTypeBtnStatus={relativeTypeBtnStatus}
					activeTapKeyUuid={activeTapKeyUuid}
					treeList={typeTree}
					originTags={originTags}
				/>
				<AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
					cardList={cardList}
					originTags={originTags}
					fromPage={'relativeConfig'}
				/>
				<AdjustAllCardlistModal
					showModal={showAdjustAllCardListModal}
					closeModal={() => this.setState({showAdjustAllCardListModal: false})}
					cardSelectList={cardSelectList}
					originTags={originTags}
					dispatch={dispatch}
				/>
			</ContainerWrap>
		)
	}
}
