import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'

import * as sfbActions from 'app/redux/Report/Yjsfb/yjsfb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Select, Button, Checkbox, message } from 'antd'
import { judgePermission } from 'app/utils'
import Table from './Table.jsx'
import Rulers from './Rulers'
import { ROOT, ROOTJR } from 'app/constants/fetch.constant.js'
import { Export } from 'app/components'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class Yjsfb extends React.Component {

	componentDidMount() {
		this.props.dispatch(sfbActions.getPeriodAndIncomeStatementSfbFetch())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.yjsfbState != nextprops.yjsfbState || this.props.homeState != nextprops.homeState
	}

	render() {
		const { yjsfbState, dispatch, allState, homeState } = this.props
		//报表/现金流量表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','TAX_PAYABLE_REPORT','detailList'])

		const initPeriodList = yjsfbState.get('initPeriodList')
		const issuedate = yjsfbState.get('issuedate')
		const sfbRuleModal = yjsfbState.get('sfbRuleModal')
		const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const issues = isRunning && newJr ? yjsfbState.get('issues') : allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const firstmonth = allState.getIn(['period', 'firstmonth'])

		const selectAssId = yjsfbState.get('selectAssId')

		const endissuedate = yjsfbState.get('endissuedate')
		const chooseperiods = yjsfbState.get('chooseperiods')

		const idx = issues.findIndex(v => v === issuedate)
		const yjsfbYear = issuedate.substr(0, 4)
		const yjsfbMonth = issuedate.substr(6, 2)

		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(sfbYear) === 0)
		//会计年度起始帐期
		// const periodStartMonth = '04'
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth']) ? allState.getIn(['period', 'periodStartMonth']) : '01'
		// 利润表的选择日期 第二个日期选择框的时间范围  当前年度+1 当前月份-1
		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(sfbYear) === 0 || (v.indexOf(-(-sfbYear-1)) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(yjsfbMonth) < Number(periodStartMonth) ? v.indexOf(yjsfbYear) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth) :  (v.indexOf(yjsfbYear) === 0 || (v.indexOf(yjsfbYear-1+2) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth))) )

		const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
		const end =  `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`
		const glBegin = `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`
		const glEnd =  `${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		const showChildList = yjsfbState.get('showChildList')

		return (
			<ContainerWrap type="report-one" className="yjsfb">
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
	                        onChange={(value) => dispatch(sfbActions.getIncomeStatementSfbFetch(value, value, selectAssId))}
	                        >
	                        {issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
	                    </Select>
	                    <span className="title-checkboxtext" onClick={() => {
	                        if (chooseperiods && endissuedate !== issuedate) {
								dispatch(sfbActions.getIncomeStatementSfbFetch(issuedate, issuedate, selectAssId))
							}
							dispatch(sfbActions.changeSjbChooseMorePeriods())
	                    }}>
	                        <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
	                        <span>至</span>
	                    </span>
	                    <Select
	                        disabled={!chooseperiods}
	                        className="title-date"
	                        value={endissuedate === issuedate ? '' : endissuedate}
	                        onChange={(value) => dispatch(sfbActions.getIncomeStatementSfbFetch(issuedate, value, selectAssId))}
	                        >
	                        {nextperiods.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
	                    </Select>
	                    {
	                    	!isRunning?
	                    	<span className='title-sfb-rule' onClick={() => dispatch(sfbActions.changeSfbRuleModal())}>
								应交税费表取值规则
							</span>:''
	                    }

						<Rulers
							sfbRuleModal={sfbRuleModal}
							onCancel={() => dispatch(sfbActions.changeSfbRuleModal())}
							onClick={() => dispatch(sfbActions.changeSfbRuleModal())}
						/>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
						   <Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="first"
								exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={
									isRunning?
									`${ROOTJR}/jr/excel/export/rate?${URL_POSTFIX}&begin=${glBegin}&end=${glEnd}`
									:
									`${ROOT}/excel/export/payTaxTable?${URL_POSTFIX}&start=${begin}&end=${end}`
								}
								// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, isRunning?'taxJrPayTableExcel':'taxPayTableExcel', {start: begin,begin: isRunning? glBegin: begin, end:isRunning? glEnd : end}))}
								ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value, isRunning?'taxJrPayTableExcel':'taxPayTableExcel', {start: begin,begin: isRunning? glBegin: begin, end:isRunning? glEnd : end}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}

								// PDFDownloadUrl={`${ROOT}/pdf/export/taxPayTable?${URL_POSTFIX}&begin=${begin}&end=${end}`}
								// ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfTaxPayTable', {begin: begin, end:end}))}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '应交税费表',
									}))
								}}
								>
							</Export>
						</span> 
						<Button
	                        className="title-right refresh-btn"
	                        type="ghost"
	                        onClick={() => {
								dispatch(sfbActions.getPeriodAndIncomeStatementSfbFetch(firstyear ? issuedate : 'NO_VALID_ISSUE_DATE', endissuedate, selectAssId))
								dispatch(allActions.freshReportPage('应交税费表'))
							}}
	                        >
	                        刷新
	                    </Button>
					</div>
				</FlexTitle>
				<Table initPeriodList={initPeriodList} showChildList={showChildList} dispatch={dispatch}/>
			</ContainerWrap>
		)
	}
}
