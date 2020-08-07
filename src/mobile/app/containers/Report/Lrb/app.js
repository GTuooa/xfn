import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { Icon, Container, ScrollView, Row, SinglePicker }	from 'app/components'
import thirdParty from 'app/thirdParty'
import { Toast } from 'antd-mobile';
import * as allActions from 'app/redux/Home/All/other.action'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import * as measureActions from 'app/redux/Report/Measure/measure.action.js'
import ProfitLine from './ProfitLine.jsx'
import SelfListLine from "./SelfListLine"
import AttachInfo from './AttachInfo'
import ReferenceAccount from './ReferenceAccount'
import { TopMonthPicker } from 'app/containers/components'
import {Button} from "app/components"
import { createArray } from 'app/utils'
import '../sheet.less'
import './lrb.less'
import XfnIcon from 'app/components/Icon'
const blockList = {
	// 1: createArray(1, 20), //.apply(null, Array(20)).map((v, i) => i + 1),
	// 21: createArray(21, 9), //Array.apply(null, Array(9)).map((v, i) => i + 21),
	// 30: [30, 31],
	// 32: [32]
	1: createArray(1, 21), //.apply(null, Array(20)).map((v, i) => i + 1),
	23: createArray(23, 9), //Array.apply(null, Array(9)).map((v, i) => i + 21),
	32: [32, 33],
	34: [34]
}


@connect(state => state)
export default
class Lrb extends React.Component {
	// static propTypes = {
	// 	lrbState: PropTypes.instanceOf(Map),
	// 	allState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

    componentDidMount() {
        thirdParty.setTitle({title: '小番报表'})
		thirdParty.setIcon({
            showIcon: false
        })
		const issuedate = this.props.lrbState.get('issuedate')
		const endissuedate = this.props.lrbState.get('endissuedate')
		if (sessionStorage.getItem('prevPage') == 'home') {
            sessionStorage.removeItem('prevPage')
			this.props.dispatch(lrbActions.getInitList('',''))
			this.props.dispatch(lrbActions.changeDifferType('increaseDecreasePercent'))
		}else{
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(lrbActions.getInitList(issuedate,endissuedate?endissuedate:issuedate))
		}
    }
	componentWillReceiveProps(props){
		if(props.lrbState.get('ifSelfTypeList')===true){
			thirdParty.setTitle({title: '小番报表'})
		}else{
			thirdParty.setTitle({title: '小企业报表'})
		}
	}
    render() {
        const {
            lrbState,
            allState,
            dispatch,
			history,
			homeState
        } = this.props
        const userInfo = homeState.getIn(['data', 'userInfo'])
		const sobInfo = userInfo.get('sobInfo')
		const newJr = sobInfo.get('newJr')
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const issues = isRunning ? lrbState.get('issues') : allState.get('issues')
        const showedProfitLineBlockIdxList = lrbState.get('showedProfitLineBlockIdxList')
		const incomestatement = lrbState.get('incomestatement')
        const issuedate = lrbState.get('issuedate')
		const selectAssId = lrbState.get('selectAssId')
		const assSelectableList = lrbState.get('assSelectableList')
		const ifSelfTypeList = lrbState.get('ifSelfTypeList')
		//必定显示的行数
		// let showedProfitLineIdxList = [1, 2, 3, 11, 14, 18, 20, 21, 22, 24, 30, 31, 32]
		let showedProfitLineIdxList = [1, 2, 3, 11, 14, 18, 20, 21, 22, 23, 24, 26, 32, 33, 34]
		//将打开的行块所包含的行数添加至数组
		showedProfitLineBlockIdxList.forEach((v) => {
			showedProfitLineIdxList = showedProfitLineIdxList.concat(blockList[v])
		})
		//过滤数据源中行数在数组内且金额为0的行
		const handleIncomestatement = incomestatement.map(v =>
			v.set('visible', showedProfitLineIdxList.indexOf(v.get('lineindex')) > -1 || v.get('monthaccumulation') || v.get('yearaccumulation'))
		)
		//跨账期不准跨年
		const endissuedate = lrbState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const lrbYear = issuedate.substr(0, 4)
		const lrbMonth = issuedate.substr(5, 2)
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(lrbYear) === 0)
		//会计年度起始
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth'])
		// 利润表的选择日期 第二个日期选择框的时间范围  当前年度+1 当前月份-1
		// const nextperiods = issues.slice(0, idx).filter(v => v.get('value').indexOf(lrbYear) === 0 || (v.get('value').indexOf(-(-lrbYear-1)) === 0 && Number(v.get('key').substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(lrbMonth) < Number(periodStartMonth) ? v.get('value').indexOf(lrbYear) === 0 && Number(v.get('value').substr(5, 2)) < Number(periodStartMonth) :  (v.get('value').indexOf(lrbYear) === 0 || (v.get('value').indexOf(lrbYear-1+2) === 0 && Number(v.get('value').substr(5, 2)) < Number(periodStartMonth))) )
		const source = assSelectableList.map((v, i) => {return {value: `${i}_${v.get('assid')}_${v.get('asscategory')}`, key: v.get('assname')}})
		//辅助核算被禁用的时间
		const disableTime = assSelectableList.getIn([selectAssId, 'disableTime'])

		// export
		const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin
		const glBegin = issuedate?`${issuedate.substr(0,4)}-${issuedate.substr(5,2)}`:''
		const glEnd = endissuedate?`${endissuedate.substr(0,4)}-${endissuedate.substr(5,2)}`:glBegin
		const assid = assSelectableList.getIn([selectAssId, 'assid'])
		const referBegin = lrbState.get('referBegin')
		const referEnd = lrbState.get('referEnd')
		const referglBegin = referBegin?`${referBegin.substr(0,4)}-${referBegin.substr(4,2)}`:''
		const referglEnd = referEnd?`${referEnd.substr(0,4)}-${referEnd.substr(4,2)}`:referglBegin
		const ddExcelCallback = () => dispatch => {
			if (isRunning) {
				dispatch(allActions.allExportDo('excelJrProfit', {begin: glBegin, end:glEnd,referBegin:referglBegin,referEnd:referglEnd}))
			} else if (assSelectableList.size === 0) {
				dispatch(allActions.allExportDo('excelsend', {year: begin, month: begin, exportModel: 'incomestatement', action: 'REPORT-PROFIT_REPORT-EXPORT_EXCEL'}))
			} else {
				dispatch(allActions.allExportDo('lrbambexcelsend', {begin: begin, end: end, export: 'incomestatement'}))
			}
		}
		const ddPDFCallback = () => dispatch => {
			if (isRunning) {
				dispatch(allActions.allExportDo('pdfJrProfit', {begin: glBegin, end:glEnd,referBegin:referglBegin,referEnd:referglEnd}))
			} else if(!endissuedate){
				dispatch(allActions.allExportDo('pdflrbexport', {year: issuedate.substr(0,4), month: issuedate.substr(5,2), assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
			}else{
				dispatch(allActions.allExportDo('pdflrbincomepdfquarter', {begin: begin, end: end, assid: assid ? assid : '', asscategory: assid ? assSelectableList.getIn([selectAssId, 'asscategory']) : ''}))
			}

		}

		const ddXFnExcelCallback=()=>dispatch =>{
			// alert({
			// 	begin:begin,end:end,referBegin:referBegin?referBegin:'',referEnd:referEnd?referEnd:''
			// })
			isRunning?
			dispatch(allActions.allExportDo('excelXfnProfit', {begin: glBegin, end:glEnd,referBegin:referglBegin,referEnd:referglEnd}))
			:
			dispatch(allActions.allExportDo('excelXfn',{begin:begin,end:end,referBegin:referBegin?referBegin:'',referEnd:referEnd?referEnd:''}))
		}
		if(ifSelfTypeList){
			dispatch(allActions.navigationSetMenu('config','', ddXFnExcelCallback))
		}else{
			dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))
		}
		const selfListData = lrbState.get('selfListData')
		const showChildProfitList = lrbState.get('showChildProfitList')

		const referChooseValue = lrbState.get('referChooseValue')
		const extraMessage = lrbState.get('extraMessage')
		const proportionDifference = lrbState.get('proportionDifference')
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
        return (
            <Container className="lrb">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					showSwitch={true}//是否有跨期的按钮
					callback={(value) => {
						dispatch(lrbActions.changeReferChooseValue('YEAR_TOTAL'))
						//dispatch(lrbActions.changeDifferType('shareDifference'))

						if(ifSelfTypeList){
							dispatch(lrbActions.getInitList(value, value,'',''))
						}else{
							dispatch(lrbActions.getIncomeStatementFetch(value, endissuedate, selectAssId))
						}
					}}
					onOk={(result) => {
						dispatch(lrbActions.changeReferChooseValue('YEAR_TOTAL'))
						//dispatch(lrbActions.changeDifferType('shareDifference'))
						if(ifSelfTypeList){
							dispatch(lrbActions.getInitListFetch(result.value, endissuedate,'',''))
						}else{
							dispatch(lrbActions.getIncomeStatementFetch(result.value, endissuedate, selectAssId))
						}
					}}
					onBeginOk={(result) => {//跨期选择完开始时间后
						dispatch(lrbActions.changeReferChooseValue('YEAR_TOTAL'))
						//dispatch(lrbActions.changeDifferType('shareDifference'))
						if(ifSelfTypeList){
							dispatch(lrbActions.getInitListFetch(result.value, '',''))
						}else{
							dispatch(lrbActions.getIncomeStatementFetch(result.value, '', selectAssId))
						}
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(lrbActions.changeReferChooseValue('YEAR_TOTAL'))
						//dispatch(lrbActions.changeDifferType('shareDifference'))
						if(ifSelfTypeList){
							dispatch(lrbActions.getInitListFetch(issuedate, result.value,'',''))
						}else{
							dispatch(lrbActions.getIncomeStatementFetch(issuedate, result.value, selectAssId))
						}
					}}
					changeEndToBegin={()=>{
						dispatch(lrbActions.changeReferChooseValue('YEAR_TOTAL'))
						//dispatch(lrbActions.changeDifferType('shareDifference'))
						if(ifSelfTypeList){
							dispatch(lrbActions.getInitList(issuedate, issuedate,'',''))
						}else{
							dispatch(lrbActions.getIncomeStatementFetch(issuedate, '', selectAssId))
						}
					}}
				/>
				<div className="select-change-table-xf" onClick={()=>{
					dispatch(lrbActions.changeReferChooseValue('YEAR_TOTAL'))
					//dispatch(lrbActions.changeDifferType('shareDifference'))
					if(ifSelfTypeList){
						dispatch(lrbActions.getIncomeStatementFetch(issuedate, endissuedate,selectAssId))
						dispatch(lrbActions.changeListType(false))
					}else{
						dispatch(lrbActions.getInitListFetch(issuedate, endissuedate,'',''))
						dispatch(lrbActions.changeListType(true))
					}

				}}>
                    <span>报表</span>
                    <XfnIcon type='cutover' />
                </div>
				<SinglePicker
					className="lrbselect"
					style={{display: assSelectableList.size > 1 ? '' : 'none'}}
					district={source}
					onOk={(result) => dispatch(lrbActions.getSelectAssIncomeFetch(issuedate, endissuedate, result.value))}
				>
					<Row className="lrbselect"
						style={{display: assSelectableList.size > 1 ? '' : 'none'}}
					>
						<span className={["lrbselect-assmane", disableTime ? 'lrb-item-disable' : ''].join(' ')}>{assSelectableList.getIn([selectAssId, 'assname'])}</span>
						<Icon className="lrbselect-icon" type="triangle" size="11"></Icon>
					</Row>
				</SinglePicker>
				{/*<Row className="ac-config-title">
				    <div
						className={ifSelfTypeList?'select':''}
						// onClick={()=>{
						// 	if(!ifSelfTypeList){
						// 		this.props.dispatch(lrbActions.getInitListFetch(issuedate, endissuedate))
						// 		dispatch(lrbActions.changeListType())
						// 	}
						// }}
					>小番报表</div>
					 <div
					 	className={ifSelfTypeList?'':'select'}
						// onClick={()=>{
						// 	if(ifSelfTypeList){
						// 		dispatch(lrbActions.getIncomeStatementFetch(issuedate, endissuedate,selectAssId))
						// 		dispatch(lrbActions.changeListType())
						// 	}
						// }}
					>小企业报表</div>
				</Row>*/}
				{ifSelfTypeList?
					<Row
						className="sheet-line-xf xf-title"
						//onClick={() => dispatch(lrbActions.toggleProfitLineDisplay())}
					>
						<div className="issues-select">
							<div className='item-title border-bottom'>
								<ReferenceAccount
									issuedate={issuedate}
									issues={issues} //默认显示日期
									endissuedate={endissuedate}
									referBegin={referBegin}
									referEnd={referEnd}
									nextperiods={nextperiods}
									referChooseValue={referChooseValue}
									dispatch={dispatch}
									onChangeReferChooseValue={(value)=>{
										dispatch(lrbActions.changeReferChooseValue(value))
									}}
									onSelected={(referBegin, referEnd)=>{
										dispatch(lrbActions.getInitListFetch(issuedate, endissuedate,referBegin, referEnd))
									}}
								/>
							</div>
							<div className='item-title'>
								<span className='amount'>参考金额</span>
								<span className='precent'>营收占比</span>
							</div>
						</div>
						<div
							className="period-data"
							onClick={()=>{
								history.push("./measure")
							}}
						>
							<div className='item-title border-bottom'>
								本期数据
								<XfnIcon type="test" style={{color:'rgb(94,129,209)',marginLeft:'5px'}}/>
							</div>
							<div className='item-title'>
								<span className='amount'>本期金额</span>
								<span className='precent'>营收占比</span>
							</div>
						</div>
						<div className="differ">
							<div
								className="swap"
								onClick={()=>{
									let differenceType=''
									if(proportionDifference==='shareDifference'){
										differenceType = 'amountDifference'
									}else if(proportionDifference==='amountDifference'){
										differenceType = 'increaseDecreasePercent'
									} else if(proportionDifference ==='increaseDecreasePercent'){
										differenceType = 'shareDifference'
									}
									dispatch(lrbActions.changeDifferType(differenceType))
								}}
							>
								<XfnIcon type="swap" style={{ transform:'rotate(90deg)',color:'rgb(94,129,209)'}}/></div>
							<div className="amout">
								{label}
							</div>
						</div>
					</Row>
					:<Row className="sheet-line title" onClick={() => dispatch(lrbActions.toggleProfitLineDisplay())}>
						<span className="linename">项目</span>
						<span className="lineindex">行次</span>
						<span className="amount">本年累计</span>
						<span className="amount-right">本期金额</span>
					</Row>
				}
				<ScrollView flex="1">
					{ifSelfTypeList ?
						<div className="sheet-line-list">
							{selfListData.map((item,index)=>
								<SelfListLine
									key={index}
									index={index}
									data={item}
									dispatch={dispatch}
									showChildProfitList={showChildProfitList}
									proportionDifference={proportionDifference}
								/>
							)}
						</div>
						:
						<dl className="sheet-line-list">
							{handleIncomestatement.map((v, i) =>
								<ProfitLine
									lr={v}
									key={i}
									showedProfitLineBlockIdxList={showedProfitLineBlockIdxList}
									style={{display: v.get('visible') ? '' : 'none'}}
									dispatch={dispatch}
								/>
							)}
						</dl>
					}
				</ScrollView>
				{ifSelfTypeList &&
					<AttachInfo
						className="acctach-info"
						extraMessage={extraMessage}
						history={history}
					/>
				}

            </Container>
        )
    }
}
