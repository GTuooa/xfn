import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as xjllbActions from 'app/redux/Report/Xjllb/xjllb.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Title, Export } from 'app/components'
import { Select, Modal, Button, Checkbox, message } from 'antd'
import { judgePermission } from 'app/utils'
import Table from './Table.jsx'
import { ROOT, ROOTJR } from 'app/constants/fetch.constant.js'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class Xjllb extends React.Component {

	componentDidMount() {
		this.props.dispatch(xjllbActions.getPeriodAndCachFlowFetch())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.xjllbState != nextprops.xjllbState || this.props.homeState != nextprops.homeState
	}

	render() {

        const { dispatch, allState, xjllbState, homeState } = this.props;
		//报表/现金流量表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','CASH_FLOW_REPORT','detailList'])

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const issues = isRunning ? xjllbState.get('issues') : allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const firstmonth = allState.getIn(['period', 'firstmonth'])
		const chooseEndDate = xjllbState.get('chooseEndDate')
		const issuedate = xjllbState.get('issuedate')
		const endissuedate = xjllbState.get('endissuedate')
		const cachFlowList = xjllbState.get('cachFlowList')

		const idx = issues.findIndex(v => v === issuedate)
		const xjllbYear = issuedate.substr(0, 4)
		const xjllbMonth = issuedate.substr(6, 2)
		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(xjllbYear) === 0)
		//会计年度起始帐期
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth']) ? allState.getIn(['period', 'periodStartMonth']) : '01'
		// 利润表的选择日期 第二个日期选择框的时间范围  当前年度+1 当前月份-1
		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(xjllbYear) === 0 || (v.indexOf(-(-xjllbYear-1)) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(xjllbMonth) < Number(periodStartMonth) ? v.indexOf(xjllbYear) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth) :  (v.indexOf(xjllbYear) === 0 || (v.indexOf(xjllbYear-1+2) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth))) )
		const lastMonth = periodStartMonth <= 10 ? `0${periodStartMonth- 1}` : `${periodStartMonth- 1}`
        //调整弹框 的messageYearEnd终止年份  messageMonthEnd终止月份
		const fiscalFirstYearEnd = firstmonth > periodStartMonth ? (periodStartMonth === '01' ? firstyear : (Number(firstyear)+1)) : firstyear
		const fiscalFirstMonthEnd = firstmonth > periodStartMonth ? (periodStartMonth === '01' ?  '12' : lastMonth) : lastMonth
		const adjustDisabled = (Number(xjllbYear) > Number(fiscalFirstYearEnd)  || ( Number(xjllbYear) === Number(fiscalFirstYearEnd) && Number(xjllbMonth) > Number(fiscalFirstMonthEnd))) ? true : false
	
		const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
		const glBegin = `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`
		const end = `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`
		const glEnd = `${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`
		// const isSelectFirstYear = firstyear != issuedate.substr(0,4) ? true : false //判断当前账期的年是否是firstyear
		const showInitXjllb = xjllbState.get('showInitXjllb')

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="report-one" className="xjllb">
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
							className="title-date"
							value={issuedate}
							onChange={(value) => dispatch(xjllbActions.getXjllbFetch(value, value))}
							>
							{issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
	                    </Select>
	                    <span className="title-checkboxtext" onClick={() => {
	                        if (chooseEndDate && endissuedate !== issuedate) {
								dispatch(xjllbActions.getXjllbFetch(issuedate, issuedate))
							}
							dispatch(xjllbActions.changeXjllbChooseMorePeriods())}}
							>
	                        <Checkbox className="title-checkbox" checked={chooseEndDate}></Checkbox>
	                        <span>至</span>
	                    </span>
	                    <Select
							className="title-date"
							disabled={!chooseEndDate}
							value={endissuedate === issuedate ? '' : endissuedate}
							onChange={(value) => dispatch(xjllbActions.getXjllbFetch(issuedate, value))}
						>
							{nextperiods.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
	                    </Select>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
	                        <Export
	                            isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
	                            exportDisable={!issuedate || isPlay}
	                            excelDownloadUrl={
									isRunning?
									`${ROOTJR}/jr/excel/export/cashFlow?${URL_POSTFIX}&network=wifi&source=desktop&begin=${begin.substr(0,4)}-${begin.substr(4,2)}&end=${end.substr(0,4)}-${end.substr(4,2)}`
									:
									`${ROOT}/excel/export/cashFlow?${URL_POSTFIX}&network=wifi&source=desktop&begin=${begin}&end=${end}`
								}
	                            // ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value,isRunning? 'excelJrcashFlow' : 'excelcashFlow', {begin: isRunning? glBegin: begin, end:isRunning? glEnd : end}))}
								ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value,isRunning? 'excelJrcashFlow' : 'excelcashFlow', {begin: isRunning? glBegin: begin, end:isRunning? glEnd : end}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}

	                            PDFDownloadUrl={
									isRunning?
									`${ROOTJR}/jr/pdf/export/cashFlow?${URL_POSTFIX}&network=wifi&source=desktop&begin=${begin.substr(0,4)}-${begin.substr(4,2)}&end=${end.substr(0,4)}-${end.substr(4,2)}`
									:
									`${ROOT}/pdf/exportCashFlow?${URL_POSTFIX}&network=wifi&source=desktop&begin=${begin}&end=${end}`
								}
	                            // ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value,isRunning? 'pdfJrCashFlow' : 'pdfCashFlow', {begin: isRunning? glBegin: begin, end:isRunning ? glEnd : end}))}
								ddPDFCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value,isRunning? 'pdfJrCashFlow' : 'pdfCashFlow', {begin: isRunning? glBegin: begin, end:isRunning ? glEnd : end}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}

								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '现金流量表',
									}))
								}}
	                        />
						</span>
						<Button
							// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
							disabled={judgePermission(detailList.get('ADJUST')).disabled}
							// style={{display: firstmonth === '01' || isSelectFirstYear ? 'none' : ''}}
							// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || adjustDisabled}
							// style={{display: firstmonth === '01' || isSelectFirstYear ? 'none' : ''}}
							style={{display: firstmonth === periodStartMonth || adjustDisabled ? 'none' : ''}}
							className="title-right refresh-btn"
							type="ghost"
							onClick={() => {
								dispatch(xjllbActions.getInitXjllbFetch(firstyear, firstmonth, periodStartMonth))
								dispatch(homeActions.addPageTabPane('ReportPanes', 'InitXjllb', 'InitXjllb', '现金流量调整'))
								dispatch(homeActions.addHomeTabpane('Report', 'InitXjllb', '现金流量调整'))
							}}
						>
							调整
						</Button>
	                    <Button
	                        className="title-right refresh-btn"
	                        type="ghost"
							onClick={() => {
								dispatch(xjllbActions.getPeriodAndCachFlowFetch(issuedate, endissuedate))
								dispatch(allActions.freshReportPage('现金流量表'))
							}}
	                        >
	                        刷新
	                    </Button>
	                </div>
				</FlexTitle>
                <Table  cachFlowList={cachFlowList}/>
			</ContainerWrap>
		)
	}
}
