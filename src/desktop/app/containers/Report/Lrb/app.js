import React, { PropTypes, Fragment } from 'react'
import { fromJS, toJS } from 'immutable'
import { connect } from 'react-redux'

import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Export, Tab } from 'app/components'
import { Select, Modal, Button, Checkbox, message } from 'antd'
import { ROOT, ROOTJR } from 'app/constants/fetch.constant.js'
import Table from './Table.jsx'
import Rulers from './Rulers'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'
import XfnIcon from 'app/components/Icon'
import ExtraModal from './ExtraModal'
import CalCulResult from './CalCulResult.jsx'
import { debounce, judgePermission } from 'app/utils'

@connect(state => state)
export default
class Lrb extends React.Component {
	state = {
		extraModal:false
	}
	componentDidMount() {
		//this.props.dispatch(lrbActions.getPeriodAndIncomeStatementFetch())
		this.props.dispatch(lrbActions.getinitincomestatement())
    }

	shouldComponentUpdate(nextprops,nextstate) {
		return this.props.allState != nextprops.allState || this.props.lrbState != nextprops.lrbState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { lrbState, dispatch, allState, homeState } = this.props
		const { extraModal } = this.state
		//报表/利润表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','PROFIT_REPORT','detailList'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])

		const incomestatement = lrbState.get('incomestatement')
		const issuedate = lrbState.get('issuedate')
		const lrbRuleModal = lrbState.get('lrbRuleModal')
		const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const issues = isRunning ? lrbState.get('issues') : allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const firstmonth = allState.getIn(['period', 'firstmonth'])

		const selectAssId = lrbState.get('selectAssId')
		const assSelectableList = lrbState.get('assSelectableList')
		const assid = assSelectableList.size ? assSelectableList.getIn([selectAssId, 'assid']) : ''

		const endissuedate = lrbState.get('endissuedate')
		const chooseperiods = lrbState.get('chooseperiods')
		const idx = issues.findIndex(v => v === issuedate)
		const lrbYear = issuedate.substr(0, 4)
		const lrbMonth = issuedate.substr(6, 2)
		//会计年度起始
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth'])
		// 利润表的选择日期 第二个日期选择框的时间范围  当前年度+1 当前月份-1
		const nextperiods = issues.slice(0, idx).filter(v => Number(lrbMonth) < Number(periodStartMonth) ? v.indexOf(lrbYear) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth) :  (v.indexOf(lrbYear) === 0 || (v.indexOf(lrbYear-1+2) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth))) )
		// 判断是否小于等于10 是否要拼接字符串0
		const lastMonth = periodStartMonth <= 10 ? `0${periodStartMonth- 1}` : `${periodStartMonth- 1}`
        //第一个会计年度 的fiscalFirstYearEnd终止年份 fiscalFirstMonthEnd终止月份
		const fiscalFirstYearEnd = firstmonth > periodStartMonth ? (periodStartMonth === '01' ? firstyear : (Number(firstyear)+1)) : firstyear
		const fiscalFirstMonthEnd = firstmonth > periodStartMonth ? (periodStartMonth === '01' ?  '12' : lastMonth) : lastMonth
		//if(选择年份 > 可调整终止年份 || 选择年份 === 可调整终止年份 && 选择月份 >= 可调整终止月份){ 超出第一个会计年度  disable为true }
		// const adjustDisabled = (lrbYear > messageYearEnd  || ( lrbYear === messageYearEnd && lrbMonth >= fiscalFirstMonthEnd)) ? true : false;
		const adjustDisabled = (Number(lrbYear) > Number(fiscalFirstYearEnd)  || ( Number(lrbYear) === Number(fiscalFirstYearEnd) && Number(lrbMonth) > Number(fiscalFirstMonthEnd))) ? true : false

		const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
		const end =  `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`
		const glBegin = `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`
		const glEnd = endissuedate?`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`:glBegin
		// const isSelectFirstYear = firstyear != issuedate.substr(0,4) ? true : false //判断当前账期的年是否是firstyear
		const showInitLrb = lrbState.get('showInitLrb')

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const selfMadeProfitList = lrbState.get('selfMadeProfitList')
		const ifSelfMadeProfitList = lrbState.get('ifSelfMadeProfitList')
		const showChildProfitList = lrbState.get("showChildProfitList")
		const proportionDifference = lrbState.get('proportionDifference')
		const ifSelfTypeList = lrbState.get('ifSelfTypeList')

		const referBegin = lrbState.get('referBegin')
		const referEnd = lrbState.get('referEnd')
		const referglBegin = referglBegin?`${referBegin.substr(0,4)}-${referBegin.substr(4,2)}`:''
		const referglEnd = referEnd?`${referEnd.substr(0,4)}-${referEnd.substr(4,2)}`:referglBegin
		const extraMessageList = lrbState.get('extraMessageList')
		const calculatePage = lrbState.get('calculatePage')
		const measureIssuedate = lrbState.get('measureIssuedate')
		const showResult = lrbState.get('showResult')
		// const ddXFnExcelCallback=()=>dispatch =>{
		// 	dispatch(allActions.allExportDo('excelXfn',{begin:begin,end:end,referBegin:referBegin?referBegin:'',referEnd:referEnd?referEnd:''}))
		// }
		// const ddExcelCallback = () => dispatch => {
		// 	if (assSelectableList.size === 0) {
		// 		dispatch(allActions.allExportDo('excelsend', {year: begin, month: begin, exportModel: 'incomestatement'}))
		// 	} else {
		// 		dispatch(allActions.allExportDo('lrbambexcelsend', {begin: begin, end: end, export: 'incomestatement'}))
		// 	}
		// }
		// const ddPDFCallback = () => dispatch => {
		// 	if(!endissuedate){
		// 		dispatch(allActions.allExportDo('pdflrbexport', {year: issuedate.substr(0,4), month: issuedate.substr(5,2), assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
		// 	}else{
		// 		dispatch(allActions.allExportDo('pdflrbincomepdfquarter', {begin: begin, end: end, assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
		// 	}
		//
		// }
		// if(ifSelfTypeList){
		// 	dispatch(allActions.navigationSetMenu('config','', ddXFnExcelCallback))
		// }else{
		// 	dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))
		// }
		let label=''
		switch(proportionDifference){
			case 'shareDifference':
				label= '占比差值'
				break;
			case 'amountDifference'	:
				label= '金额差值'
				break;
			case 'increaseDecreasePercent':
				label= '涨跌幅'
				break;
		}
		let excelDownloadUrl
		if (ifSelfMadeProfitList) {
			excelDownloadUrl = isRunning?
			`${ROOTJR}/jr/excel/export/xfn/profit?${URL_POSTFIX}&begin=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}&end=${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}&referBegin=${referBegin?referBegin.substr(0,4)+'-'+referBegin.substr(4,2):''}&referEnd=${referEnd?referEnd.substr(0,4)+'-'+referEnd.substr(4,2):''}`
			:
			`${ROOT}/excel/export/customize/incomestatement?${URL_POSTFIX}&begin=${issuedate.substr(0,4)}${issuedate.substr(6,2)}&end=${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`

		} else {
			excelDownloadUrl = isRunning?
			`${ROOTJR}/jr/excel/export/profit?${URL_POSTFIX}&begin=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}&end=${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`
			:
			assSelectableList.size === 0 ?
					`${ROOT}/excel/export?${URL_POSTFIX}&export=incomestatement&year=${issuedate ? begin : ''}&month=${endissuedate ? end : ''}&action=REPORT-PROFIT_REPORT-EXPORT_EXCEL`
					:
					`${ROOT}/excel/export/AMB?${URL_POSTFIX}&export=incomestatement&begin=${issuedate ? begin : ''}&end=${endissuedate ? end : ''}`
		}
		return (
			showResult?
			<CalCulResult />
			:
			<ContainerWrap type="report-lrb" className="lrb">
				<FlexTitle>
					{
						calculatePage?
						<Fragment>
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
						</div>
						<div className="flex-title-right">
							<Button
								className="title-right refresh-btn"
								onClick={() => {
								dispatch(lrbActions.changeLrbString('calculatePage',false))
							}}>取消</Button>
						</div>
						</Fragment>
						:
						<Fragment>
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
		                        onChange={(value) => {
									if(ifSelfMadeProfitList){
										dispatch(lrbActions.getinitincomestatement(value, value))
									}else{
										dispatch(lrbActions.getIncomeStatementFetch(value, value, selectAssId))
									}

								}}
		                        >
		                        {issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
		                    </Select>
		                    <span className="title-checkboxtext" onClick={() => debounce(() => {
								if(ifSelfMadeProfitList){
									if(chooseperiods){
										dispatch(lrbActions.getinitincomestatement(issuedate, issuedate))
									}else{
										dispatch(lrbActions.getinitincomestatement(issuedate, endissuedate))
									}
								}else{
									if (chooseperiods && endissuedate !== issuedate) {
										dispatch(lrbActions.getIncomeStatementFetch(issuedate, issuedate, selectAssId))
									}
								}
								dispatch(lrbActions.changeLrbChooseMorePeriods())
		                    })()}>
		                        <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
		                        <span>至</span>
		                    </span>
		                    <Select
		                        disabled={!chooseperiods}
		                        className="title-date"
		                        value={endissuedate === issuedate ? '' : endissuedate}
		                        onChange={(value) => {
									if(ifSelfMadeProfitList){
										dispatch(lrbActions.getinitincomestatement(issuedate, value))
									}else{
										dispatch(lrbActions.getIncomeStatementFetch(issuedate, value, selectAssId,))
									}
								}}
		                        >
								{nextperiods.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
		                    </Select>
							<Select
								style={{display: assSelectableList.size ? '' : 'none'}}
								className={["title-date", "lrb-title-date", assSelectableList.getIn([selectAssId, 'disableTime']) ? 'fzhs-item-disable' : '' ].join(' ')}
								value={assSelectableList.getIn([selectAssId, 'assname'])}
								onChange={value => dispatch(lrbActions.getIncomeStatementFetch(issuedate, endissuedate, value.get('key'), value.get('assid'), value.get('asscategory'),ifSelfMadeProfitList))}
								>
								{assSelectableList.map((data, i) => <Select.Option key={i} value={data} className={data.get('disableTime') ? 'fzhs-item-disable' : ''}>{data.get('assname')}</Select.Option>)}
							</Select>
							<div className="list-type-btn-Container">
								<Tab
									radius
									tabList={[{key:1,value:'小番报表'},{key:0,value:'小企业报表'}]}
									activeKey={ifSelfMadeProfitList?1:0}
									tabFunc={(item) => {
										if (item.key) {
											this.props.dispatch(lrbActions.getinitincomestatement(issuedate, endissuedate,))
											this.props.dispatch(lrbActions.changeListType())
										} else {
											this.props.dispatch(lrbActions.getIncomeStatementFetch(issuedate, endissuedate,selectAssId))
											this.props.dispatch(lrbActions.changeListType())
										}
									}}
								/>
								{/* <div
									className= {`${ifSelfMadeProfitList?"list-type-btn-select":"list-type-btn"} border-left`}
									onClick={()=>{
										if(!ifSelfMadeProfitList){
											this.props.dispatch(lrbActions.getinitincomestatement(issuedate, endissuedate,))
											this.props.dispatch(lrbActions.changeListType())
										}
									}}
								>小番报表
								</div>
								<div
									className={`${ifSelfMadeProfitList?"list-type-btn":"list-type-btn-select"} border-right`}
									onClick={()=>{
										if(ifSelfMadeProfitList){
											this.props.dispatch(lrbActions.getIncomeStatementFetch(issuedate, endissuedate,selectAssId))
											this.props.dispatch(lrbActions.changeListType())
										}
									}}
								>小企业报表
								</div> */}
							</div>
							{!ifSelfMadeProfitList && !isRunning && <span className='title-lrb-rule' onClick={() => dispatch(lrbActions.changeLrbRuleModal())}>利润表取值规则</span>}
							<Rulers
								lrbRuleModal={lrbRuleModal}
								onCancel={() => dispatch(lrbActions.changeLrbRuleModal())}
								onClick={() => dispatch(lrbActions.changeLrbRuleModal())}
							/>
						</div>
						<div className="flex-title-right">
							{
								ifSelfMadeProfitList?
								<Button
									// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || ifSelfMadeProfitList}
									className="title-right refresh-btn"
									type="ghost"
									onClick={() => {
										dispatch(lrbActions.getExtraInformationList(() => this.setState({extraModal:true})))
									}}
									>
									设置
								</Button>:''
							}

							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type={ifSelfMadeProfitList?"first":""}
									exportDisable={ifSelfMadeProfitList ? (!issuedate || isPlay || !reportPermissionInfo.getIn(['exportExcel', 'permission'])) : (!issuedate || isPlay)} // 没有权限小番利润表就要灰掉
									excelDownloadUrl={excelDownloadUrl}
									//利润表权限Excel
									// ddExcelCallback={(value) => {
									// 	if(ifSelfMadeProfitList){
									// 		isRunning?
									// 			dispatch(allActions.allExportReceiverlist(value, 'excelXfnProfit', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`,referBegin:referglBegin,referEnd:referglEnd}))
									// 			:
									// 			dispatch(allActions.allExportReceiverlist(value, 'excelXiaoFanLrb', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
									// 	}else{
									// 		if (isRunning) {
									// 			dispatch(allActions.allExportReceiverlist(value, 'excelJrProfit', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`,referBegin:referglBegin,referEnd:referglEnd}))
									// 		} else if (assSelectableList.size === 0) {
									// 			dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: begin, month: end, exportModel: 'incomestatement', action: 'REPORT-PROFIT_REPORT-EXPORT_EXCEL'}))
									// 		} else {
									// 			dispatch(allActions.allExportReceiverlist(value, 'lrbambexcelsend', {begin: begin, end: end, export: 'incomestatement'}))
									// 		}
									// 	}
									// }}
									ddExcelCallback={(value) => {
										if(!judgePermission(detailList.get('EXPORT_EXCEL')).disabled){
											if(ifSelfMadeProfitList){
												isRunning?
													dispatch(allActions.allExportReceiverlist(value, 'excelXfnProfit', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`,referBegin:referglBegin,referEnd:referglEnd}))
													:
													dispatch(allActions.allExportReceiverlist(value, 'excelXiaoFanLrb', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`}))
											}else{
												if (isRunning) {
													dispatch(allActions.allExportReceiverlist(value, 'excelJrProfit', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`,referBegin:referglBegin,referEnd:referglEnd}))
												} else if (assSelectableList.size === 0) {
													dispatch(allActions.allExportReceiverlist(value, 'excelsend', {year: begin, month: end, exportModel: 'incomestatement', action: 'REPORT-PROFIT_REPORT-EXPORT_EXCEL'}))
												} else {
													dispatch(allActions.allExportReceiverlist(value, 'lrbambexcelsend', {begin: begin, end: end, export: 'incomestatement'}))
												}
											}
										}else{
											message.info('当前角色无该请求权限')
										}
									}}
									
									PDFDownloadUrl={(
										isRunning?
										`${ROOTJR}/jr/pdf/export/profit?${URL_POSTFIX}&begin=${issuedate.substr(0,4)}-${issuedate.substr(6,2)}&end=${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`
										:
										issuedate === endissuedate ?
											`${ROOT}/pdf/exportincome?${URL_POSTFIX}&year=${issuedate ? issuedate.substr(0,4) : ''}&month=${issuedate ? issuedate.substr(6,2) : ''}&assid=${assid ? assid : ''}&asscategory=${assid ? encodeURI(encodeURI(assSelectableList.getIn([selectAssId, 'asscategory']))) : encodeURI(encodeURI(''))}`
											:
											`${ROOT}/pdf/exportincomequarter?${URL_POSTFIX}&begin=${begin}&end=${end}&assid=${assid ? assid : ''}&asscategory=${assid ? encodeURI(encodeURI(assSelectableList.getIn([selectAssId, 'asscategory']))) : encodeURI(encodeURI(''))}`
									)}
									//利润表权限PDF
									// ddPDFCallback={(value) => {
									// 	if (isRunning) {
									// 		dispatch(allActions.allExportReceiverlist(value, 'pdfJrProfit', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`}))
									// 	} else if (issuedate === endissuedate) {
									// 		dispatch(allActions.allExportReceiverlist(value, 'pdflrbexport', {year: issuedate.substr(0,4), month: issuedate.substr(6,2), assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
									// 	} else {
									// 		dispatch(allActions.allExportReceiverlist(value, 'pdflrbincomepdfquarter', {begin: begin, end: end, assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
									// 	}
									// }}
									ddPDFCallback={(value) => {
										if(!judgePermission(detailList.get('EXPORT_PDF')).disabled){
											if (isRunning) {
												dispatch(allActions.allExportReceiverlist(value, 'pdfJrProfit', {begin: `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}`, end:`${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}`}))
											} else if (issuedate === endissuedate) {
												dispatch(allActions.allExportReceiverlist(value, 'pdflrbexport', {year: issuedate.substr(0,4), month: issuedate.substr(6,2), assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
											} else {
												dispatch(allActions.allExportReceiverlist(value, 'pdflrbincomepdfquarter', {begin: begin, end: end, assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
											}
										}else{
											message.info('当前角色无该请求权限')
										}
									}}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '利润表',
										}))
									}}
									>
									{assSelectableList.size ? 'PDF导出方式时，导出的内容为当前页面的显示阿米巴模式数据' : ''}
								</Export>
							</span>
							<Button
								// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
								//值是否修改
								disabled = {judgePermission(detailList.get('ADJUST')).disabled}
								// style={{display: firstmonth === '01' || isSelectFirstYear || ifSelfMadeProfitList ? 'none' : ''}}
								style={{display: firstmonth === periodStartMonth || adjustDisabled || ifSelfMadeProfitList ? 'none' : ''}}
								className="title-right refresh-btn"
								type="ghost"
								onClick={() => {
									// dispatch(lrbActions.getInitIncomeStatementFetch(firstyear, firstmonth, fiscalFirstYearEnd, fiscalFirstMonthEnd))
									dispatch(lrbActions.getInitIncomeStatementFetch(firstyear, firstmonth, periodStartMonth))
									dispatch(homeActions.addPageTabPane('ReportPanes', 'InitLrb', 'InitLrb', '利润表调整'))
									dispatch(homeActions.addHomeTabpane('Report', 'InitLrb', '利润表调整'))
								}}
								>
								调整
							</Button>
							<Button
		                        className="title-right refresh-btn"
		                        type="ghost"
		                        onClick={() => debounce(() => {
									if(ifSelfMadeProfitList){
										dispatch(lrbActions.getInitListFetch(issuedate, endissuedate,referBegin,referEnd))
										dispatch(allActions.freshReportPage('利润表'))
									}else{
										dispatch(lrbActions.getPeriodAndIncomeStatementFetch(issuedate, endissuedate, selectAssId))
										dispatch(allActions.freshReportPage('利润表'))
									}
								})()}
		                        >
		                        刷新
		                    </Button>
						</div>
						</Fragment>
					}
				</FlexTitle>
				<Table
					incomestatement={incomestatement}
					selfMadeProfitList={selfMadeProfitList}
					ifSelfMadeProfitList={ifSelfMadeProfitList}
					showChildProfitList={showChildProfitList}
					dispatch = {dispatch}
					proportionDifference={proportionDifference}
					lrbState={lrbState}
					issues={issues}
				/>
				{
					extraModal?
					<ExtraModal
						extraModal={extraModal}
						dispatch={dispatch}
						extraMessageList={extraMessageList}
						onCancel={() => this.setState({extraModal:false})}
						refreshFunc={() => {
							dispatch(lrbActions.getInitListFetch(issuedate, endissuedate,referBegin,referEnd))
						}}
					/>:''
				}
			</ContainerWrap>
		)
	}
}
