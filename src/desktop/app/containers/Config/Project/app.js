import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'
import '../components/common.less'

import { Button, message } from 'antd'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import * as Limit from 'app/constants/Limit.js'

import Title from './Title.jsx'
import Table from './Table.jsx'
import AddHypeTypeModal from './AddHypeTypeModal'
import AddCardTypeModal from './AddCardTypeModal'
import AddCardModal from './AddCardModal'

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'

@connect(state => state)
export default
class ProjectConf extends React.Component {

	static displayName = 'ProjectConf'

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
		}
	}

	componentDidMount() {
		this.props.dispatch(projectConfActions.getProjectConfigInit())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.projectConfState !== nextprops.projectConfState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, projectConfState, homeState, allState } = this.props
		const { showHighTypeModal, showCardTypeModal, showCardModal } = this.state

		console.log('ProjectConfindex');

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const SCXM = moduleInfo.indexOf('SCXM') > -1
		const SGXM = moduleInfo.indexOf('SGXM') > -1
		const isCheckOut = allState.getIn(['period', 'closedyear']) ? true : false

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

		const originTags = projectConfState.get('originTags')
		const cardList = projectConfState.get('cardList')
		// const importresponlist = projectConfState.get('importresponlist')
		// const logMessage = projectConfState.get('message')
		const typeTree = projectConfState.get('typeTree')
		const projectHighTypeTemp = projectConfState.get('projectHighTypeTemp')
		const projectTypeTemp = projectConfState.get('projectTypeTemp')
		const projectTypeBtnStatus = projectConfState.get('projectTypeBtnStatus')

		const views = projectConfState.get('views')
		const activeTapKey = views.get('activeTapKey')
		const searchContent = views.get('searchContent')
		const activeTapKeyUuid = views.get('activeTapKeyUuid')
		const activeProjectType = views.get('activeProjectType')
		const activeProjectTypeUuid = views.get('activeProjectTypeUuid')
		const activeTreeKeyUuid = views.get('activeTreeKeyUuid')
		const insertOrModify = views.get('insertOrModify')
		const typeTreeSelectList = views.get('typeTreeSelectList')
		const cardSelectList = views.get('cardSelectList')
		const selectTypeId = views.get('selectTypeId')
		const selectTypeName = views.get('selectTypeName')
		const parentUuid = views.get('parentUuid')
		const pageCount = views.get('pageCount')
		const currentPage = views.get('currentPage')

		// const showMessageMask = views.get('showMessageMask')
		// const iframeload = views.get('iframeload')
		// const curNumber = views.get('curNumber')
		// const totalNumber = views.get('totalNumber')
		// const importKey = views.get('importKey')

		const anotherTabName = Limit.ALL_TAB_NAME_STR
		const adjustBtnHide = activeTapKey === anotherTabName ? true : false

		return (
			<ContainerWrap type="config-one" className="project-conf">
				<Title
					dispatch={dispatch}
					originTags={originTags}
					activeTapKey={activeTapKey}
					activeTapKeyUuid={activeTapKeyUuid}
					isSpread={isSpread}
					pageList={pageList}
					// URL_POSTFIX={URL_POSTFIX}
					editPermission={editPermission}
					openHighTypeModal={() => this.setState({showHighTypeModal: true})}
					openCardModal={() => this.setState({showCardModal: true})}
					cardSelectList={cardSelectList}
					adjustBtnHide={adjustBtnHide}
					// iframeload={iframeload}
					// importresponlist={importresponlist}
					// showMessageMask={showMessageMask}
					// curNumber={curNumber}
					// totalNumber={totalNumber}
					// importKey={importKey}
					treeList={typeTree}
					isPlay={isPlay}
					views={views}
					// logMessage={logMessage}
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
					parentUuid={parentUuid}
					pageCount={pageCount}
					currentPage={currentPage}
				/>
				<AddHypeTypeModal
					editPermission={editPermission}
					showModal={showHighTypeModal}
					closeModal={() => this.setState({showHighTypeModal: false})}
					dispatch={dispatch}
					originTags={originTags}
					activeTapKey={activeTapKey}
					activeTapKeyUuid={activeTapKeyUuid}
					anotherTabName={anotherTabName}
					activeProjectType={activeProjectType}
					activeProjectTypeUuid={activeProjectTypeUuid}
					projectHighTypeTemp={projectHighTypeTemp}
					isCheckOut={isCheckOut}
				/>
				<AddCardTypeModal
					editPermission={editPermission}
					showModal={showCardTypeModal}
					closeModal={() => this.setState({showCardTypeModal: false})}
					dispatch={dispatch}
					projectTypeTemp={projectTypeTemp}
					typeTreeSelectList={typeTreeSelectList}
					projectTypeBtnStatus={projectTypeBtnStatus}
					activeTapKeyUuid={activeTapKeyUuid}
					treeList={typeTree}
					originTags={originTags}
				/>
				<AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
					originTags={originTags}
					moduleInfo={moduleInfo}
					fromPage={'projectConfig'}
					cardList={cardList.filter(v => searchContent !== ''?v.get('name').indexOf(searchContent) > -1 || v.get('code').indexOf(searchContent) > -1: true)}
				/>
			</ContainerWrap>
		)
	}
}
