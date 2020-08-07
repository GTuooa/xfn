import React from 'react'
import { connect } from 'react-redux'

import * as assetsYebActions from 'app/redux/Yeb/AssetsYeb/assetsYeb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Button, Select, Checkbox, message } from 'antd'
import { Amount, Export } from 'app/components'
import { judgePermission } from 'app/utils'
import Table from './Table.jsx'
import { ROOT } from 'app/constants/fetch.constant.js'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style.less'

@connect(state => state)
export default
class AssetsYeb extends React.Component {

	componentDidMount() {
		this.props.dispatch(assetsYebActions.getPeriodAndDetailAssetsFetch())
		if (this.props.assetsYebState.getIn(['flags', 'chooseperiods'])) {
			this.props.dispatch(assetsYebActions.changeAssetsYebChooseMorePeriods())
		}
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.assetsYebState != nextprops.assetsYebState || this.props.homeState != nextprops.homeState
	}

    render() {

		const { assetsYebState, dispatch, allState, homeState } = this.props
		//资产余额表
		const controllerDetailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','ASSETS_BALANCE_STATEMENT','detailList'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        const issues = allState.get('issues')
        const issuedate = assetsYebState.get('issuedate')
		const AssetsMainData = assetsYebState.get('AssetsMainData')
		const detailList = AssetsMainData.get('detailList')
		const endissuedate = assetsYebState.get('endissuedate')
        const chooseperiods = assetsYebState.getIn(['flags', 'chooseperiods'])
        const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)

		// 点击三角下拉要显示下级的id数组
        const detailChildShow = assetsYebState.getIn(['flags', 'detailChildShow'])

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="yeb-one" className="assests-yeb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Yeb')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('YebPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<Select
							className="title-date"
							value={issuedate}
							onChange={(value) => dispatch(assetsYebActions.getDetailAssetsFetch(value, value))}
							>
							{issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
						</Select>
						<span className="title-checkboxtext" onClick={() => {
							if (chooseperiods && endissuedate !== issuedate) {
								dispatch(assetsYebActions.getDetailAssetsFetch(issuedate, issuedate))

							}
							dispatch(assetsYebActions.changeAssetsYebChooseMorePeriods())
						}}>
							<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
							<span>至</span>
						</span>
						<Select
							disabled={!chooseperiods}
							className="title-date"
							value={endissuedate === issuedate ? '' : endissuedate}
							onChange={(value) => dispatch(assetsYebActions.getDetailAssetsFetch(issuedate, value))}
							>
							{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
						</Select>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								exportDisable={!issuedate || isPlay}

								excelDownloadUrl={`${ROOT}/excel/export/AssetsBalance?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`  : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`: ''}`}
								// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelAssetsBalance', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))}
								ddExcelCallback={(value) => {
									if(!judgePermission(controllerDetailList.get('EXPORT_BALANCE_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'excelAssetsBalance', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								
								PDFDownloadUrl={`${ROOT}/pdf/export/assertsBa?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`  : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`: ''}`}
								// ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfAssetsBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))}
								ddPDFCallback={(value) => {
									if(!judgePermission(controllerDetailList.get('EXPORT_BALANCE_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'pdfAssetsBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '资产余额表',
									}))
								}}
								>
							</Export>
						</span>
						<Button
	                        className="title-right refresh-btn"
	                        type="ghost"
	                        onClick={() => {
								dispatch(assetsYebActions.getPeriodAndDetailAssetsFetch(issuedate, endissuedate))
								dispatch(allActions.freshYebPage('资产余额表'))
							}}
	                        >
	                        刷新
	                    </Button>
					</div>
				</FlexTitle>
                <Table
					detailList={detailList}
					AssetsMainData={AssetsMainData}
					dispatch={dispatch}
					detailChildShow={detailChildShow}
					AssetsConfigRowClick={(value) => {
						dispatch(assetsYebActions.changeDetailChildShow(value))
					}}
					issuedate={issuedate}
					endissuedate={endissuedate}
					chooseperiods={chooseperiods}
				/>
			</ContainerWrap>
		)
	}
}
