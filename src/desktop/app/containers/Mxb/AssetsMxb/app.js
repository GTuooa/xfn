import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'

import * as AssetsMxbActions from 'app/redux/Mxb/AssetsMxb/assetsMxb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Button, Icon, Input, Select, Checkbox,message } from 'antd'
import TableMx from './TableMx'
import TreeContain from './TreeContain'
import { changeAssetsListDataToTree, changeLabelDataToTree, judgePermission} from 'app/utils'
import { TableWrap, Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.constant.js'
import AssetsCardOption from 'app/containers/Config/Assets/AssetsCard/AssetsCardOption.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style.less'

@connect(state => state)
export default
class AssetsMxb extends React.Component {

	componentDidMount() {
		const { dispatch, allState } = this.props
		dispatch(AssetsMxbActions.getAssetsListFetch())

		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch())
		}
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.assetsMxbState != nextprops.assetsMxbState || this.props.homeState != nextprops.homeState || this.props.assetsState != nextprops.assetsState
	}

    render() {

        const { assetsState, dispatch, allState, assetsMxbState, homeState } = this.props
		//资产余额表
		const controllerDetailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','ASSETS_BALANCE_STATEMENT','detailList'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		const mxMaindata = assetsMxbState.get('mxMaindata')
		const pageCount = assetsMxbState.get('pageCount')
		const currentPage = assetsMxbState.get('currentPage')
        const cardList = mxMaindata.get('cardList')
		const currentSelectedKeys = assetsMxbState.get('currentSelectedKeys')
		const currentSelectedTitle = assetsMxbState.get('currentSelectedTitle')
		const assetslist = assetsMxbState.get('assetslist')
		const labelTree = assetsState.get('labelTree')

		const issues = allState.get('issues')
		const issuedate = assetsMxbState.get('issuedate')
		const endissuedate = assetsMxbState.get('endissuedate')
		const chooseperiods = assetsMxbState.getIn(['flags', 'chooseperiods'])

		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const showAssetsCardOption = assetsState.getIn(['flags', 'showAssetsCardOption'])
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="mxb-two" className="assetsMxb">
				{/* <Title
                    issuedate={issuedate}
                    issues={issues}
                    onChange={value => {
						let year=value.slice(0,4)
						let month=value.slice(6,8)
						dispatch(AssetsMxbActions.getMxListFetch(value, currentSelectedKeys[0]))
					}}
                    onClick={() => {
						if(isNaN(currentSelectedKeys[0])){
							dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch(issuedate, '', currentSelectedKeys[0]))
							// dispatch(detailActions.getMxListByLabelFetch(issuedate, currentSelectedKeys[0]))
						}else{
							dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch(issuedate, currentSelectedKeys[0], ''))
							// dispatch(detailActions.getMxListFetch(issuedate, currentSelectedKeys[0]))
						}
					}}
                /> */}
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb','pageList']).indexOf('资产明细表') === -1) {
										sessionStorage.setItem('previousPage', 'home')
									}
									dispatch(homeActions.addPageTabPane('MxbPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<Select
							className="title-date"
							value={issuedate}
							onChange={(value) => dispatch(AssetsMxbActions.getMxListFetch(value, value, currentSelectedKeys.get(0)))}
							>
							{issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
						</Select>
						<span className="title-checkboxtext" onClick={() => {
							if (chooseperiods && chooseperiods !== issuedate) {
								dispatch(AssetsMxbActions.getMxListFetch(issuedate, issuedate, currentSelectedKeys.get(0)))
							}
							dispatch(AssetsMxbActions.changeAssetsMxbChooseMorePeriods())
						}}>
							<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
							<span>至</span>
						</span>
						<Select
							disabled={!chooseperiods}
							className="title-date"
							value={endissuedate === issuedate ? '' : endissuedate}
							onChange={(value) => dispatch(AssetsMxbActions.getMxListFetch(issuedate, value, currentSelectedKeys.get(0)))}
							>
							{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
						</Select>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								// exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								exportDisable={!issuedate || isPlay}
								// excelDownloadUrl={`${ROOT}/excel/export/AssertSubAll?network=wifi&source=desktop&begin=${issuedate ? issuedate.substr(0,4)+''+issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4)+''+endissuedate.substr(6,2) : ''}`}
								excelDownloadUrl={`${ROOT}/excel/export/AssertSubAll?${URL_POSTFIX}&begin=${issuedate ? issuedate.substr(0,4)+''+issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4)+''+endissuedate.substr(6,2) : ''}`}
								// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelAssertSub', {begin: issuedate.substr(0,4)+''+issuedate.substr(6,2), end: endissuedate.substr(0,4)+''+endissuedate.substr(6,2)}))}
								ddExcelCallback={(value) => {
									if(!judgePermission(controllerDetailList.get('EXPORT_STATEMENT_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'excelAssertSub', {begin: issuedate.substr(0,4)+''+issuedate.substr(6,2), end: endissuedate.substr(0,4)+''+endissuedate.substr(6,2)}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								
								// PDFDownloadUrl={`${ROOT}/pdf/export/assertSub?network=wifi&source=desktop&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}`}
								PDFDownloadUrl={`${ROOT}/pdf/export/assertSub?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}`}
								// ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfAssertSub', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))}
								ddPDFCallback={(value) => {
									if(!judgePermission(controllerDetailList.get('EXPORT_STATEMENT_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'pdfAssertSub', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '资产明细表',
									}))
								}}
								>
							</Export>
						</span>
						<Button
	                        className="title-right refresh-btn"
	                        type="ghost"
	                        onClick={() => {
								if(isNaN(currentSelectedKeys.get(0))){
									dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch(issuedate, endissuedate, '', currentSelectedKeys.get(0)))
								}else{
									dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch(issuedate, endissuedate, currentSelectedKeys.get(0), ''))
								}
								dispatch(allActions.freshMxbPage('资产明细表'))
							}}
	                        >
	                        刷新
	                    </Button>
					</div>
				</FlexTitle>

				<TableWrap className="table-flex-mxb table-tree-wrap" notPosition={true}>
					<TableMx
						cardList={cardList}
						mxMaindata={mxMaindata}
						dispatch={dispatch}
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => {
							if(isNaN(currentSelectedKeys.get(0))){
								dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch(issuedate, endissuedate, '', currentSelectedKeys.get(0),value))
							}else{
								dispatch(AssetsMxbActions.getPeriodAndMxbAssetsFetch(issuedate, endissuedate, currentSelectedKeys.get(0), '',value))
							}
						}}
					/>
					<TreeContain
						dispatch={dispatch}
						initAssetsList={assetslist}
						assetslist={changeAssetsListDataToTree(assetslist.toJS())}
						labelTreeList={changeLabelDataToTree(labelTree.toJS())}
						issuedate={issuedate}
						endissuedate={endissuedate}
						currentSelectedKeys={currentSelectedKeys}
						currentSelectedTitle={currentSelectedTitle}
					/>
				</TableWrap>
				{ showAssetsCardOption ? <AssetsCardOption/> : ''}
			</ContainerWrap>
		)
	}
}
