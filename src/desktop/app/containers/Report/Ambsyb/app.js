import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as ambsybActions from 'app/redux/Report/Ambsyb/ambsyb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import thirdParty from 'app/thirdParty'
import { formatMoney } from 'app/utils'
import { Select, Modal, Button, Checkbox, message } from 'antd'
import { judgePermission } from 'app/utils'
import AmbBody from './AmbBody'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import * as Limit from 'app/constants/Limit.js'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.constant.js'
import './style.less'

@connect(state => state)
export default
class Ambsyb extends React.Component {

	componentDidMount() {

		this.props.dispatch(ambsybActions.getAmbAssCategoryList())
		this.props.dispatch(ambsybActions.getPeriodAndAMBIncomeStatementFetch())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.ambsybState != nextprops.ambsybState || this.props.homeState != nextprops.homeState
	}

	render() {

        const {
            allState,
            dispatch,
            ambsybState,
			homeState
        } = this.props
		//报表/阿米巴表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','AMB_PROFIT_LOSS_REPORT','detailList'])

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		// 日期
		const issues = allState.get('issues')
		const issuedate = ambsybState.get('issuedate')
		const endissuedate = ambsybState.get('endissuedate')
		const idx = issues.findIndex(v => v === issuedate)
		const ambsybYear = issuedate.substr(0, 4)
		const ambsybMonth = issuedate.substr(6, 2)
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth']) ? allState.getIn(['period', 'periodStartMonth']) : '01'
		//会计年度其实帐期
		// 利润表的选择日期 第二个日期选择框的时间范围  当前年度+1 当前月份-1
		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(ambsybYear) === 0 || (v.indexOf(-(-ambsybYear-1)) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(ambsybMonth) < Number(periodStartMonth) ? v.indexOf(ambsybYear) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth) :  (v.indexOf(ambsybYear) === 0 || (v.indexOf(ambsybYear-1+2) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth))) )
		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(ambsybYear) === 0)
		// 是否多账期选择
		const chooseperiods = ambsybState.getIn(['view', 'chooseperiods'])

		// 辅助核算项目选择
		const assList = ambsybState.getIn(['assList', 0, 'asslist']) ? ambsybState.getIn(['assList', 0, 'asslist']) : fromJS([])
		let assListJS = assList.toJS()
		assListJS.unshift({assid: '', assname: '全部'})

		const assId = ambsybState.getIn(['view', 'assId'])
		const assName = assId ? assList.find(v => v.get('assid') === assId).get('assname')  : ''
		const assCategory = ambsybState.getIn(['view', 'assCategory'])

		// 饼图
		const gainAndLoss = ambsybState.get('gainAndLoss')
		const income = gainAndLoss.get('income')
		const pay = gainAndLoss.get('pay')
		const ginAndLoss = gainAndLoss.get('ginAndLoss')
		const incomeBigger = income >= pay

		// 柱形图
		const detailDrawing = ambsybState.get('detailDrawing')

		// 折线图
		const trendMap = ambsybState.get('trendMap')
		// 表格
		const ambDetailTable = ambsybState.get('ambDetailTable')
		// 是否得到数据
		const didMount = ambsybState.getIn(['view', 'didMount'])
		// 当前是全部时科目树的所指
		const currentAc = ambsybState.getIn(['view', 'currentAc'])
		// 可展示下级的科目
		const tableShowChild = ambsybState.getIn(['view', 'tableShowChild'])
		// 可选辅助核算类别
		const ambSourceList = ambsybState.get('ambSourceList').map(v => v.get('asscategory'))

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="report-one" className="ambsyb">
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
							onChange={(value) => dispatch(ambsybActions.getAMBIncomeStatementFetch(value, value, assId, assCategory))}
							>
							{issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
						</Select>
						<span className="title-checkboxtext" onClick={() => {
							if (chooseperiods && endissuedate !== issuedate) {
								dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, issuedate, assId, assCategory))
							}
							dispatch(ambsybActions.changeAmbsybChooseMorePeriods())
						}}>
							<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
							<span>至</span>
						</span>
						<Select
							disabled={!chooseperiods}
							className="title-date"
							value={endissuedate === issuedate ? '' : endissuedate}
							onChange={(value) => dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, value, assId, assCategory))}
							>
							{nextperiods.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
						</Select>
						<Select
							disabled={!issuedate}
							style={{width: 160}}
							className={["title-date", "lrb-title-date"].join(' ')}
							value={assCategory}
							onChange={value => dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, endissuedate, '', value))}
							>
							{fromJS(ambSourceList).map((v, i) => <Option key={i} value={v}>{v}</Option>)}
						</Select>
						<Select
							disabled={!issuedate}
							style={{width: 280}}
							className={["title-date", "lrb-title-date", assId && assList.find(v => v.get('assid') === assId).get('disableTime') ? 'fzhs-item-disable' : ''].join(' ')}
							value={assId ? assList.find(v => v.get('assid') === assId).get('assname') : '全部'}
							onChange={value => dispatch(ambsybActions.getAMBIncomeStatementFetch(issuedate, endissuedate, value.get('assid'), assCategory))}
							>
							{fromJS(assListJS).map((data, i) => <Select.Option key={i} value={data} className={data.get('disableTime') ? 'fzhs-item-disable' : ''}>{data.get('assname')}</Select.Option>)}
						</Select>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="first"
								exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={`${ROOT}/excel/export/AMBIncome?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}&assCategory=${assCategory}`}
								// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelAMBIncome', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`, assCategory: `${assCategory}`}))}
								ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'excelAMBIncome', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`, assCategory: `${assCategory}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}

								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '阿米巴',
									}))
								}}
							/>
						</span>
						<Button
							disabled={!issuedate}
							className="title-right refresh-btn"
							type="ghost"
							onClick={() => {
								dispatch(ambsybActions.getPeriodAndAMBIncomeStatementFetch(issuedate, endissuedate, assId, assCategory))
								dispatch(allActions.freshReportPage('阿米巴损益表'))
							}}
							>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<AmbBody
					assId={assId}
					gainAndLoss={gainAndLoss}
					income={income}
					pay={pay}
					incomeBigger={incomeBigger}
					detailDrawing={detailDrawing}
					trendMap={trendMap}
					issuedate={issuedate}
					endissuedate={endissuedate}
					ambDetailTable={ambDetailTable}
					dispatch={dispatch}
					didMount={didMount}
					currentAc={currentAc}
					assName={assName}
					tableShowChild={tableShowChild}
					assCategory={assCategory}
					isSpread={isSpread}
				/>
			</ContainerWrap>
		)
	}
}
