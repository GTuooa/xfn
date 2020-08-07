import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'

import { Map, toJS } from 'immutable'
import { Icon, Container, ScrollView, Row }	from 'app/components'
import thirdParty from 'app/thirdParty'

import ProfitLine from './ProfitLine.jsx'
import { TopMonthPicker } from 'app/containers/components'
import { createArray } from 'app/utils'

import './yjsfb.less'
import * as yjsfbActions from 'app/redux/Report/Yjsfb/yjsfb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

const blockList = {
	3: createArray(3, 23) //3代表一级分类的ID且下面有子分类20代表这个分类共有20条数据
}
@connect(state => state)
export default
class Yjsfb extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '应交税费表'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})
        this.props.dispatch(yjsfbActions.getPeriodAndIncomeStatementSfbFetch())
    }
    render() {
        const {
            yjsfbState,
            allState,
            dispatch,
            homeState
        } = this.props
		const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = sobInfo.get('newJr')
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const issues = isRunning ? yjsfbState.get('issues') : allState.get('issues')
        const showedProfitLineBlockIdxList = yjsfbState.get('showedProfitLineBlockIdxList')

		const initPeriodList = yjsfbState.get('initPeriodList')
        const issuedate = yjsfbState.get('issuedate')
		//必定显示的行数
		// let showedProfitLineIdxList = [1, 2, 3, 4, 5, 26]
		// //将打开的行块所包含的行数添加至数组
		// showedProfitLineBlockIdxList.forEach((v) => {
		// 	showedProfitLineIdxList = showedProfitLineIdxList.concat(blockList[v])
		// })
		// //过滤数据源中行数在数组内且金额为0的行
		// const handleIncomestatement = initPeriodList.map(v =>
		// 	v.set('visible', showedProfitLineIdxList.indexOf(v.get('lineIndex')) > -1 || v.get('amount'))
		// )
		const endissuedate = yjsfbState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const yjsfbYear = issuedate.substr(0, 4)
		const yjsfbMonth = issuedate.substr(5, 2)
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(yjsfbYear) === 0)
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth'])
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(yjsfbYear) === 0 || (v.get('value').indexOf(-(-yjsfbYear-1)) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(yjsfbMonth) < Number(periodStartMonth) ? v.get('value').indexOf(yjsfbYear) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth) :  (v.get('value').indexOf(yjsfbYear) === 0 || (v.get('value').indexOf(yjsfbYear-1+2) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth))) )

		// export
		const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin
		const glBegin = issuedate?`${issuedate.substr(0,4)}-${issuedate.substr(5,2)}`:''
		const glEnd = endissuedate?`${endissuedate.substr(0,4)}-${endissuedate.substr(5,2)}`:glBegin
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo(isRunning ? 'taxPayJrTableExcel' : 'taxPayTableExcel', {start:begin,begin: isRunning? glBegin: begin, end:isRunning ? glEnd : end}))
		// const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfTaxPayTable', {begin: begin, end: end}))
		const showChildList =  yjsfbState.get('showChildList')
		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

        return (
            <Container>
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(yjsfbActions.getYjsfbFetch(value, endissuedate))}
					onOk={(result) => dispatch(yjsfbActions.getYjsfbFetch(result.value, endissuedate))}
					showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						// dispatch(yjsfbActions.changeYjsfbBeginDate(result.value, false))
						dispatch(yjsfbActions.getYjsfbFetch(result.value, ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(yjsfbActions.getYjsfbFetch(issuedate, result.value))
					}}
					changeEndToBegin={()=>dispatch(yjsfbActions.getYjsfbFetch(issuedate, ''))}
				/>
				<Row className="sjb-line title" onClick={() => dispatch(yjsfbActions.toggleSfbProfitLineDisplay())}>
					<span className="linename">项目</span>
					<span className="sumAmount">本年累计</span>
					<span className="amount">本期金额</span>
				</Row>
				<ScrollView flex="1">
					<dl className="sjb-line-list">
						{initPeriodList.map((v, i) =>
							<ProfitLine
								lr={v}
								key={i}
								showedProfitLineBlockIdxList={showedProfitLineBlockIdxList}
								//style={{display: v.get('visible') ? '' : 'none'}}
								dispatch={dispatch}
								showChildList={showChildList}
							/>
						)}
					</dl>
				</ScrollView>
            </Container>
        )
    }
}
