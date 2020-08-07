import React from 'react'
import { connect } from 'react-redux'

import * as zcfzbActions from 'app/redux/Report/Zcfzb/zcfzb.action.js'
import * as allActions from 'app/redux/Home/All/all.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Export } from 'app/components'
import { ROOT, ROOTJR } from 'app/constants/fetch.constant.js'
import { Button, Tabs, Spin, Select, message } from 'antd'
import { judgePermission } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import Table from './Table.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class Zcfzb extends React.Component {

	componentDidMount() {
		this.props.dispatch(zcfzbActions.getPeriodAndBalanceSheetFetch())
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.zcfzbState != nextprops.zcfzbState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { zcfzbState, allState, dispatch, homeState } = this.props
		//报表/资产负债表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','BALANCE_SHEET','detailList'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const userInfo = homeState.getIn(['data', 'userInfo'])
   		const sobInfo = userInfo.get('sobInfo')
		const newJr = sobInfo.get('newJr')
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    	// const isRunning = false
		const issuedate = zcfzbState.get('issuedate')
		const showInitZcfzb = zcfzbState.get('showInitZcfzb')
		const issues = isRunning ? zcfzbState.get('issues') : allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const firstmonth = allState.getIn(['period', 'firstmonth'])
		// const isSelect = firstyear != issuedate.substr(0,4) ? true : false

		const zcfzbYear = issuedate.substr(0,4)
		const zcfzbMonth = issuedate.substr(6,2)
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth']) ? allState.getIn(['period', 'periodStartMonth']) : '01'
		// const periodStartMonth = '04'
        //调整弹框 的messageYearEnd终止年份  messageMonthEnd终止月份  lastMonth 判断大于10的字符串拼接
		const lastMonth = periodStartMonth <= 10 ? `0${periodStartMonth- 1}` : `${periodStartMonth- 1}`
		const fiscalFirstYearEnd = firstmonth > periodStartMonth ? (periodStartMonth === '01' ? firstyear : (Number(firstyear)+1)) : firstyear
		const fiscalFirstMonthEnd = firstmonth > periodStartMonth ? (periodStartMonth === '01' ?  '12' : lastMonth) : lastMonth
		const adjustDisabled = (Number(zcfzbYear) > Number(fiscalFirstYearEnd)  || ( Number(zcfzbYear) === Number(fiscalFirstYearEnd) && Number(zcfzbMonth) > Number(fiscalFirstMonthEnd))) ? true : false
		
		// 判断是否小于等于10 是否要拼接字符串0 // 调整终止月份 //调整终止年份//调整起始月份//调整起始年份
		const lastMonthstr = firstmonth <= 10 ? `0${firstmonth- 1}` : `${firstmonth- 1}`
		const messageYearStart = Number(firstmonth) > Number(periodStartMonth) ? firstyear : firstyear - 1
		// const messageMonthStart = Number(periodStartMonth)
		const messageYearEnd = Number(firstmonth) > Number(periodStartMonth) ? firstyear : Number(firstmonth) === 1 ? firstyear-1 : firstyear
		const messageMonthEnd =  Number(firstmonth) > Number(periodStartMonth) ? lastMonthstr : Number(firstmonth) === 1 ? 12 : lastMonthstr

		let convertBalancesheet = zcfzbState.get('balancesheet').toJS()
		let balancesheet = []
		convertBalancesheet.splice(0, 0, {linename: '流动资产：'})
		convertBalancesheet.splice(16, 0, {linename: '非流动资产：'})
		convertBalancesheet.splice(32, 0, {linename: '流动负债：'})
		convertBalancesheet.splice(44, 0,{linename: '非流动负债：'})
		convertBalancesheet.splice(51, 0, {},{},{},{},{},{}, {linename: '所有者权益(或股东权益)：'})

		for (let i = 0; i < 32; ++i) {
			balancesheet.push({
				left: convertBalancesheet[i] || {},
				right: convertBalancesheet[i + 32] || {}
			})
		}

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="report-one" className="zcfzb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Report','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Report')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('ReportPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<Select
							className={"title-date"}
							value={issuedate}
							onChange={value => dispatch(zcfzbActions.getBalanceSheetFetch(value))}
							>
							{issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
						</Select>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								exportDisable={!issuedate || isPlay}

								excelDownloadUrl={
									isRunning?
									`${ROOTJR}/jr/excel/export/assets?${URL_POSTFIX}&export=balancesheet&begin=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}&end=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`
									:
									`${ROOT}/excel/export?${URL_POSTFIX}&export=balancesheet&year=${issuedate ? issuedate.substr(0,4) : ''}&month=${issuedate ? issuedate.substr(6,2) : ''}&action=REPORT-BALANCE_SHEET-EXPORT_EXCEL`
								}
								// ddExcelCallback={(value) =>{
								//  isRunning?
								//  dispatch(allActions.allExportReceiverlist(value, 'excelJrAssetsSend', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:  `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`}))
								//  :
								//  dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: issuedate.substr(0,4), month: issuedate.substr(6,2), exportModel: 'balancesheet', action: 'REPORT-BALANCE_SHEET-EXPORT_EXCEL'}))
								// }}
								ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_EXCEL')).disabled){
										isRunning?
										dispatch(allActions.allExportReceiverlist(value, 'excelJrAssetsSend', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:  `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`}))
										:
										dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: issuedate.substr(0,4), month: issuedate.substr(6,2), exportModel: 'balancesheet', action: 'REPORT-BALANCE_SHEET-EXPORT_EXCEL'}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								
								PDFDownloadUrl={
									isRunning?
									`${ROOTJR}/jr/pdf/export/assets?${URL_POSTFIX}&export=balancesheet&begin=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}&end=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`
									:
									`${ROOT}/pdf/exportbasheet?${URL_POSTFIX}&year=${issuedate ? issuedate.substr(0,4) : ''}&month=${issuedate ? issuedate.substr(6,2) : ''}`
								}
								// ddPDFCallback={(value) => {
								// 	isRunning?
								// 	dispatch(allActions.allExportReceiverlist(value, 'pdfJrAssetsSend', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:  `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`}))
								// 	:
								// 	dispatch(allActions.allExportReceiverlist(value, 'pdfzcfzexport', {year: issuedate.substr(0,4), month: issuedate.substr(6,2)}))
								// }}
								ddPDFCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_PDF')).disabled){
										isRunning?
										dispatch(allActions.allExportReceiverlist(value, 'pdfJrAssetsSend', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:  `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`}))
										:
										dispatch(allActions.allExportReceiverlist(value, 'pdfzcfzexport', {year: issuedate.substr(0,4), month: issuedate.substr(6,2)}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '资产负债表',
									}))
								}}
								>
							</Export>
						</span>
						<Button
							// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
							disabled={judgePermission(detailList.get('ADJUST')).disabled}
							// style={{display: firstmonth === '01' || isSelect ? 'none' : ''}}
							style={{display: firstmonth === periodStartMonth || adjustDisabled ? 'none' : ''}}
							className="title-right refresh-btn"
							type="ghost"
							onClick={() => {
								dispatch(zcfzbActions.getInitBaSheetValue())
								// thirdParty.Alert(`当前账套起始账期为${firstyear}-${firstmonth},请填写各科目年初余额正确数值以修正资产负债表年初余额`)
								thirdParty.Alert(`当前账套起始账期为${firstyear}-${firstmonth},请填写下列项目${messageYearStart}-${periodStartMonth}期至${messageYearEnd}-${messageMonthEnd}期的年初余额正确数值,以修正资产负债表年初余额(注：起始账期修改后,调整数据将会被清零)。`)
								// dispatch(zcfzbActions.showInitZcfzb(true))
								dispatch(homeActions.addPageTabPane('ReportPanes', 'InitZcfzb', 'InitZcfzb', '资产负债调整'))
								dispatch(homeActions.addHomeTabpane('Report', 'InitZcfzb', '资产负债调整'))
							}}
							>
							调整
						</Button>
						<Button
							className={"title-right refresh-btn"}
							type="ghost"
							onClick={() => {
								dispatch(zcfzbActions.getPeriodAndBalanceSheetFetch(issuedate))
								dispatch(allActions.freshReportPage('资产负债表'))
							}}
							>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<Table balancesheet={balancesheet} />
			</ContainerWrap>
		)
	}
}
