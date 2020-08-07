import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS, Map }	from 'immutable'
import { Cascade, ButtonGroup, Button, Container, Row, ScrollView, Icon, Select, Amount, Single } from 'app/components'
import Jv from './Jv.jsx'
import thirdParty from 'app/thirdParty'
import { MutiPeriodMoreSelect } from 'app/containers/components'
import * as Limit from 'app/constants/Limit.js'
import './mxb.less'

import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'

@connect(state => state)
export default
class Kmmxb extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '科目明细表'})
		if (sessionStorage.getItem('previousPage') === 'kmyeb') {
			sessionStorage.removeItem('previousPage')
			// this.props.dispatch(acAllActions.getAcListandAsslistFetch())
		}
		if (sessionStorage.getItem('prevPage')==='cxpz') { // 查看凭证回来
			sessionStorage.removeItem('prevPage')
			const {dispatch,kmmxbState} = this.props
			// 要改
			dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
				issuedate: kmmxbState.get('issuedate'),
				endissuedate: kmmxbState.get('endissuedate'),
				acId: kmmxbState.getIn(['views','currentAcId']),
				assId: kmmxbState.getIn(['views','currentAssId']),
				assCategory: kmmxbState.getIn(['views','currentAssCategory'])
			}))
		}
	}
	render() {
		const {
			dispatch,
			kmmxbState,
			allState,
			history
		} = this.props

		const issues = allState.get('issues')
		const issuedate = kmmxbState.get('issuedate')
		const endissuedate = kmmxbState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const currentAcId = kmmxbState.getIn(['views','currentAcId'])
		const currentAssId = kmmxbState.getIn(['views','currentAssId'])
		const currentAssCategory = kmmxbState.getIn(['views','currentAssCategory'])

		const ledger = kmmxbState.get('ledger')
		const jvlist = ledger.get('detailList')
		const acinfo = [ledger.get('acId'), ledger.get('acFullName')].join('_')
		const acid = ledger.get('acId')
		const assid = ledger.get('assId')
		const assname = ledger.get('assName')
		const chooseValue = kmmxbState.getIn(['views','chooseValue'])

		const mxbAclist = kmmxbState.get('mxbAclist')

		// 所包含的一级及其子科目树
		const currentAcTree = mxbAclist.filter(v => v.get('acId') == currentAcId.substr(0, 4))
		// 可选的一级科目及其子科目
		let currentAcList = fromJS([]) // 平铺结构
		let sourceAclist = []
		const loop = data => data.forEach(v => {
			currentAcList = currentAcList.push(v)
			sourceAclist.push({
				key: v.get('acId') + " " + v.get('acName'),
				value: v.get('acId')
			})
			if (v.get('childList') && v.get('childList').size) {
				loop(v.get('childList'))
			}
		})
		loop(currentAcTree)

		const currentAc = currentAcList.find(v => v.get('acId') == currentAcId)
		const asslist = currentAc ? currentAc.get('assCategoryList') : fromJS([])
		const showAss = currentAssId ? `${currentAssCategory} ${currentAssId}` : '全部'
		let disableTime = ''

		const source = [{
			key: '全部',
			value: '全部',
		}]
		// 可选的辅助核算列表
		asslist.forEach(v => {
			v.get('assList').forEach(w => {
				source.push({
					key: v.get('assCategory') + '_' + w.get('assId') + '_' + w.get('assName'),
					// value: v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname')
					value: v.get('assCategory') + Limit.TREE_JOIN_STR + w.get('assId') + Limit.TREE_JOIN_STR + w.get('assName')
				})
				console.log(currentAssCategory, v.get('assCategory'), currentAssId, w.get('assId'));
				
				if (v.get('assCategory') === currentAssCategory && w.get('assId') === currentAssId) {
					disableTime = w.get('disableTime')
				}
			})
		})

		const begin = `${issuedate}`
		const end = endissuedate ? endissuedate : begin

		// export
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('mxbexcelsubone', {
			begin,
			end,
			acId: currentAcId,
			assId: currentAssId ? currentAssId : '',
			assCategory: currentAssCategory ? currentAssCategory : '',
			assName: assname ? assname : ''
		}))
		const ddExcelVcCallback = () => dispatch => dispatch(allActions.allExportDo('acdetailonevcexcel', {
			begin,
			end,
			acId: currentAcId,
			assId: currentAssId ? currentAssId : '',
			assCategory: currentAssCategory ? currentAssCategory : '',
			assName: assname ? assname : ''
		}))

		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfmxbexport', {begin: begin, end: end, acId: currentAcId ? currentAcId : '', assId: `${currentAssId ? currentAssId : ''}`, assCategory: currentAssCategory ? currentAssCategory : ''}))

		const allddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfExportLedger', {begin: begin, end: end}))

		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('mxbexcelsuball', {begin: begin, end: end}))

		const alllAcDdPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfAcSub', {begin: begin, end: end}))

		const pdfSecondAcSub = () => dispatch => dispatch(allActions.allExportDo('pdfSecondAcSub', {begin: begin, end: end}))

		const allPdfExportLedger2 = () => dispatch => dispatch(allActions.allExportDo('pdfExportLedger2', {begin: begin, end: end}))
		const excelExportLedger = () => dispatch => dispatch(allActions.allExportDo('excelExportLedger', {begin: begin, end: end}))

		dispatch(allActions.navigationSetMenu('mxb', ddPDFCallback, ddExcelCallback, allddPDFCallback, allddExcelCallback, '总账', ddExcelVcCallback, alllAcDdPDFCallback, pdfSecondAcSub, allPdfExportLedger2, excelExportLedger))

		return (
			<Container className="mxb">
				<MutiPeriodMoreSelect
					start={issuedate}
					end={endissuedate}
					issues={issues} //默认显示日期
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(kmmxbActions.getOnlyMxbAclistFetch(value, value))
						dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
							issuedate: value,
							endissuedate: value,
							acId: currentAcId,
							assId: currentAssId,
							assCategory: currentAssCategory
						}))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(kmmxbActions.getOnlyMxbAclistFetch(value1, value2))
						dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
							issuedate: value1,
							endissuedate: value2,
							acId: currentAcId,
							assId: currentAssId,
							assCategory: currentAssCategory
						}))
					}}
					changeChooseValue={(value)=>
						dispatch(kmmxbActions.changeAcMxbChooseValue(value))
					}
				/>
				<Row className="mxb-title">
					<div className="mxb-title-info-wrap mxb-title-ac-info">
						<span>科目选择:</span>
						<Single className="mxb-title-info-single-wrap" district={sourceAclist} onOk={(result) => {
							dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
								issuedate,
								endissuedate,
								acId: result.value,
								assId: currentAssId,
								assCategory: currentAssCategory
							}))
						}}>
							<span className="mxb-title-info-text">{acinfo}</span>
							<Icon type="triangle" />
						</Single>
					</div>
					<div className={`mxb-title-info-wrap mxb-title-ass-info ${disableTime ? 'mxb-ass-disabled' : ''}`}>
						<span>辅助核算:</span>
						{
							asslist.size ?
							<Single className="mxb-title-info-single-wrap" district={source} onOk={(result) => {
								if (result.key === '全部') {
									dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
										issuedate,
										endissuedate,
										acId: currentAcId,
										assId: '',
										assCategory: ''
									}))
								} else {
									const valueList = result.value.split(Limit.TREE_JOIN_STR)
									console.log('valueList' , valueList);
									
									dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
										issuedate,
										endissuedate,
										acId: currentAcId,
										assId: valueList[1],
										assCategory: valueList[0]
									}))
								}
							}}>
								<span>{showAss}</span>
								<Icon type="arrow-down" />
							</Single>
							: <span>&nbsp;无</span>
						}
					</div>
				</Row>
				<Row className="mxb-main-top">
					<span className="mxb-main-amount-odd">期初余额<span className="mxb-main-amount-odd-direction">{`(${ledger.get('direction') === 'debit' ? '借' : '贷'}方)`}</span></span>
					<Amount className="mxb-main-amount">{jvlist.size ? jvlist.getIn([0, 'balanceAmount']) : 0}</Amount>
				</Row>
				<ScrollView flex="1" uniqueKey="mxb-scroll" savePosition>
					<ul className="mxb-main-list">
						{jvlist.map((v, i) => {
							if (i === 0) {
								return null
							} else {
								return <Jv
									idx={i}
									key={i}
									jv={v}
									issuedate={issuedate}
									dispatch={dispatch}
									direction={ledger.get('direction')}
									history={history}
									jvlist={jvlist}
								/>
							}
						})}
						{jvlist.size ? '' : <div className="mxb-no-vc">暂无凭证</div>}
					</ul>
				</ScrollView>
				<Row className="mxb-main-top">
					<span className="mxb-main-amount-odd">期末余额<span className="mxb-main-amount-odd-direction">{`(${ledger.get('direction') === 'debit' ? '借' : '贷'}方)`}</span></span>
					<Amount className="mxb-main-amount">{ledger.get('allBalanceAmount')}</Amount>
				</Row>
			</Container>
		)
	}
}

// <TopMonthPicker
// 	issuedate={issuedate}
// 	source={issues} //默认显示日期
// 	callback={(value) => {
// 		dispatch(kmmxbActions.getOnlyMxbAclistFetch(value, endissuedate))
// 		dispatch(kmmxbActions.getSubsidiaryLedgerFetch(value, endissuedate, currentAcid))
// 	}}
// 	onOk={(result) => {
// 		dispatch(kmmxbActions.getOnlyMxbAclistFetch(result.value, endissuedate))
// 		dispatch(kmmxbActions.getSubsidiaryLedgerFetch(result.value, endissuedate,currentAcid))
// 	}}
// 	showSwitch={true}//是否有跨期的按钮
// 	endissuedate={endissuedate}
// 	nextperiods={nextperiods}
// 	onBeginOk={(result) => {//跨期选择完开始时间后
// 		// dispatch(kmmxbActions.changeMxbBeginDate(result.value, false))
// 		dispatch(kmmxbActions.getOnlyMxbAclistFetch(result.value, ''))
// 		dispatch(kmmxbActions.getSubsidiaryLedgerFetch(result.value, '', currentAcid))
// 	}}
// 	onEndOk={(result) => {//跨期选择完结束时间后
// 		dispatch(kmmxbActions.getOnlyMxbAclistFetch(issuedate, result.value))
// 		dispatch(kmmxbActions.getSubsidiaryLedgerFetch(issuedate, result.value, currentAcid))
// 	}}
// 	changeEndToBegin={()=>{//跨期变为单期之后 使endissuedate为空 重新获取数据
// 		dispatch(kmmxbActions.getOnlyMxbAclistFetch(issuedate, ''))
// 		dispatch(kmmxbActions.getSubsidiaryLedgerFetch(issuedate, '', currentAcid))
// 	}}

// />

// <span
// 	onClick={() => {
// 		if(!asslist.size)
// 			return
// 		thirdParty.chosen({
// 			source : source,
// 			onSuccess: (result) => {
// 				if (result.key === '全部') {
// 					dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
// 						issuedate,
// 						endissuedate,
// 						acId: currentAcId,
// 						assId: '',
// 						assCategory: ''
// 					}))
// 				} else {
// 					const valueList = result.value.split(Limit.TREE_JOIN_STR)
// 					dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
// 						issuedate,
// 						endissuedate,
// 						acId: currentAcId,
// 						assId: valueList[1],
// 						assCategory: valueList[0]
// 					}))
// 				}
// 			}
// 		})
// 	}}
// >{asslist.size ? showAss : '无'}</span>
// {asslist.size ? <Icon type="arrow-down"/> : ''}
{/* <div className="mxb-title-acinfo">
						<span className="mxb-title-ac mxb-title-ac-tip">科目选择:</span>
						<span className="mxb-title-ac">{acinfo}</span>
						<div style={{'flex':1,textAlign:'right'}}>
							<SinglePicker district={sourceAclist} value='' onOk={(result) => {
                                dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
									issuedate,
									endissuedate,
									acId: result.value,
									assId: '',
									assCategory: ''
								}))
							}}>
								<Icon type="triangle" />
							</SinglePicker>
						</div>
					</div>
					<div className={["mxb-title-assinfo", disableTime ? 'lrb-item-disable' : ''].join(' ')}>
						<span>辅助核算:</span>
						{
							asslist.size ?
							<div style={{'flex':1}}><SinglePicker district={source} onOk={(result) => {

                                if (result.key === '全部') {
									dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
										issuedate,
										endissuedate,
										acId: currentAcId,
										assId: '',
										assCategory: ''
									}))
								} else {
									const valueList = result.value.split(Limit.TREE_JOIN_STR)
									dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
										issuedate,
										endissuedate,
										acId: currentAcId,
										assId: valueList[1],
										assCategory: valueList[0]
									}))
								}
							}}>
								{showAss}
								<Icon type="triangle" />
							</SinglePicker></div>
							: <span>无</span>
						}
					</div> */}