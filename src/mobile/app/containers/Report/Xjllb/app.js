import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'

import { Map, toJS, fromJS } from 'immutable'
import { Icon, Container, ScrollView, Row }	from 'app/components'
import { TopMonthPicker } from 'app/containers/components'
import { createArray } from 'app/utils'
import Line from './Line.jsx'
import * as thirdParty from 'app/thirdParty'
import './xjllb.less'

import * as allActions from 'app/redux/Home/All/other.action'
import * as xjllbActions from 'app/redux/Report/Xjllb/xjllb.action.js'

const blockList = {
	23: [0, 1, 2, 3, 4, 5, 6, 7],
	24: [8, 9, 10, 11, 12, 13],
	25: [14, 15, 16, 17, 18, 19],
	20: [20, 21],
	22: [22]
}

@connect(state => state)
export default
class Xjllb extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '现金流量表'})
		thirdParty.setIcon({
            showIcon: false
        })
		// thirdparty.setRight({show: false})
        this.props.dispatch(xjllbActions.getPeriodAndCachFlowFetch())
    }

    render() {
        const {
            xjllbState,
            allState,
            dispatch,
            homeState
        } = this.props
        const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = sobInfo.get('newJr')
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const issues = isRunning ? xjllbState.get('issues') : allState.get('issues')
        const issuedate = xjllbState.get('issuedate');
		const endissuedate = xjllbState.get('endissuedate');
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const xjllbYear = issuedate.substr(0, 4)
		const xjllbMonth = issuedate.substr(5, 2)
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(xjllbYear) === 0)
		//会计年度起始
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth'])
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(xjllbYear) === 0 || (v.get('value').indexOf(-(-xjllbYear-1)) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(xjllbMonth) < Number(periodStartMonth) ? v.get('value').indexOf(xjllbYear) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth) :  (v.get('value').indexOf(xjllbYear) === 0 || (v.get('value').indexOf(xjllbYear-1+2) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth))) )
	
        const cachFlowList = xjllbState.get('cachFlowList');
        const showedLineBlockIdxList = xjllbState.get('showedLineBlockIdxList')

        //必定显示的行数
		let showedLineIdxList = [7, 13, 19, 20, 21, 22, 23, 24, 25]

        //将打开的行块所包含的行数添加至数组
        showedLineBlockIdxList.forEach((v) => {
            showedLineIdxList = showedLineIdxList.concat(blockList[v])
        })

        //过滤数据源中行数在数组内且金额为0的行
		const handleCachFlow = cachFlowList.map(v =>
			v.set('visible', showedLineIdxList.indexOf(v.get('lineIndex')) > -1 || v.get('amount') || v.get('sumAmount'))
		)

		const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin
		const glBegin = issuedate?`${issuedate.substr(0,4)}-${issuedate.substr(5,2)}`:''
		const glEnd = endissuedate?`${endissuedate.substr(0,4)}-${endissuedate.substr(5,2)}`:glBegin
		// export
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo(isRunning ? 'excelJrcashFlow' : 'excelcashFlow', {begin: isRunning? glBegin: begin, end:isRunning ? glEnd : end}))
		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo(isRunning ? 'pdfJrCashFlow' : 'pdfCashFlow', {begin: isRunning? glBegin: begin, end:isRunning ? glEnd : end}))

		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))
        return (
            <Container>
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(xjllbActions.getXjllbFetch(value, endissuedate))}
					onOk={(result) => dispatch(xjllbActions.getXjllbFetch(result.value, endissuedate))}
					showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						// dispatch(xjllbActions.changeXjllbBeginDate(result.value, false))
						dispatch(xjllbActions.getXjllbFetch(result.value, ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(xjllbActions.getXjllbFetch(issuedate, result.value))
					}}
					changeEndToBegin={()=>dispatch(xjllbActions.getXjllbFetch(issuedate, ''))}

				/>
                <Row className="xjllb-line title" onClick={() => dispatch(xjllbActions.toggleCachFlowLineDisplay())} >
					<span className="linename">项目</span>
					<span className="lineindex">行次</span>
					<span className="amount">本年累计</span>
					<span className="amount-right">本期金额</span>
				</Row>
                <ScrollView flex="1">
					<dl className="xjllb-line-list">
                        {handleCachFlow.map((u,i) => {
                            return (
                                <Line
                                    lr={u}
                                    dispatch={dispatch}
                                    showedLineBlockIdxList={showedLineBlockIdxList}
                                    visible={u.get('visible')}
                                    style={{display: u.get('visible') ? '' : 'none'}}
                                />
                            )
                        })}
					</dl>
				</ScrollView>

            </Container>
        )
    }
}
